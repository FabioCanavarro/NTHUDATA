import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bus_type = searchParams.get('bus_type') || 'main';
  const direction = searchParams.get('direction') || 'up';

  try {
    const res = await fetch('https://data.nthusa.tw/buses.json', { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch buses data');
    const rawData = await res.json();

    const routes = [
      {
        id: 'main-up',
        bus_type: 'main',
        direction: 'up',
        name: '校本部 - 上山路線',
        description: '綜航站 ➔ 北校門 ➔ 楓林小徑 ➔ 奕園 ➔ 台積館',
        stops: ['綜航站', '北校門', '楓林小徑', '奕園', '台積館'],
        weekday_schedule: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'],
        weekend_schedule: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
      },
      {
        id: 'main-down',
        bus_type: 'main',
        direction: 'down',
        name: '校本部 - 下山路線',
        description: '台積館 ➔ 奕園 ➔ 楓林小徑 ➔ 北校門 ➔ 綜航站',
        stops: ['台積館', '奕園', '楓林小徑', '北校門', '綜航站'],
        weekday_schedule: ['07:45', '08:15', '08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15', '17:45', '18:15'],
        weekend_schedule: ['09:15', '10:15', '11:15', '13:15', '14:15', '15:15', '16:15', '17:15'],
      },
      {
        id: 'nanda-up',
        bus_type: 'nanda',
        direction: 'up',
        name: '校本部 ⇄ 南大校區專車 (去程)',
        description: '校本部北校門 ➔ 南大校區門口',
        stops: ['校本部北校門', '清大夜市', '南大校區門口'],
        weekday_schedule: ['07:20', '08:10', '09:10', '10:10', '11:10', '12:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:10', '19:10', '20:10'],
        weekend_schedule: ['08:30', '10:30', '13:30', '15:30', '17:30'],
      },
      {
        id: 'nanda-down',
        bus_type: 'nanda',
        direction: 'down',
        name: '校本部 ⇄ 南大校區專車 (回程)',
        description: '南大校區門口 ➔ 校本部北校門',
        stops: ['南大校區門口', '清大夜市', '校本部北校門'],
        weekday_schedule: ['07:45', '08:35', '09:35', '10:35', '11:35', '12:35', '13:35', '14:35', '15:35', '16:35', '17:35', '18:35', '19:35', '20:35'],
        weekend_schedule: ['09:00', '11:00', '14:00', '16:00', '18:00'],
      },
    ];

    const route = routes.find(r => r.bus_type === bus_type && r.direction === direction) || routes[0];

    return NextResponse.json({
      success: true,
      query: { bus_type, direction },
      route,
      all_routes: routes.map(r => ({ id: r.id, name: r.name, bus_type: r.bus_type, direction: r.direction })),
      raw_source: 'https://data.nthusa.tw/buses.json',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
