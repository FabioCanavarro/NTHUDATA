import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '40', 10);

  try {
    const res = await fetch('https://data.nthusa.tw/announcements.json', { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('Failed to fetch announcements');
    const announcements = await res.json();

    let filtered = announcements;

    if (department) {
      filtered = filtered.filter((a: any) => a.department === department);
    }

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter((a: any) =>
        a.title?.toLowerCase().includes(lower) ||
        a.department?.toLowerCase().includes(lower)
      );
    }

    const departments = Array.from(new Set(announcements.map((a: any) => a.department)));

    return NextResponse.json({
      success: true,
      total: filtered.length,
      departments,
      announcements: filtered.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
