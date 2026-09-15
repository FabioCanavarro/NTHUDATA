import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const building = searchParams.get('building');
  const search = searchParams.get('search');

  try {
    const res = await fetch('https://data.nthusa.tw/dining.json', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch dining data');
    const data = await res.json();

    let buildings = data;

    if (building) {
      buildings = buildings.filter((b: any) => b.building.includes(building));
    }

    if (search) {
      buildings = buildings.map((b: any) => ({
        ...b,
        restaurants: b.restaurants.filter((r: any) =>
          r.name?.includes(search) || r.note?.includes(search)
        ),
      })).filter((b: any) => b.restaurants.length > 0);
    }

    return NextResponse.json({
      success: true,
      count: buildings.length,
      buildings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
