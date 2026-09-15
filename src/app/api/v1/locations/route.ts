import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const res = await fetch('https://data.nthusa.tw/maps.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });
    
    let locations: any[] = [];
    if (res.ok) {
      const maps = await res.json();
      const mainZH = Array.isArray(maps?.MainZH) ? maps.MainZH : [];
      const nandaZH = Array.isArray(maps?.NandaZH) ? maps.NandaZH : [];
      locations = [...mainZH, ...nandaZH];
    }

    if (q && locations.length > 0) {
      const lower = q.toLowerCase();
      locations = locations.filter((l: any) =>
        (l.name && String(l.name).toLowerCase().includes(lower)) ||
        (l.code && String(l.code).toLowerCase().includes(lower)) ||
        (l.description && String(l.description).toLowerCase().includes(lower))
      );
    }

    return NextResponse.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
