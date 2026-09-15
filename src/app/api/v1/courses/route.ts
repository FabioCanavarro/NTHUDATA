import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || searchParams.get('query') || '';
  const teacher = searchParams.get('teacher') || '';
  const code = searchParams.get('code') || searchParams.get('id') || '';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  try {
    const res = await fetch('https://data.nthusa.tw/courses.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses data');
    const courses = await res.json();

    let filtered = courses;

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((c: any) =>
        (c['課程中文名稱'] && c['課程中文名稱'].toLowerCase().includes(lower)) ||
        (c['課程英文名稱'] && c['課程英文名稱'].toLowerCase().includes(lower)) ||
        (c['科號'] && c['科號'].toLowerCase().includes(lower))
      );
    }

    if (teacher) {
      filtered = filtered.filter((c: any) =>
        c['授課教師'] && c['授課教師'].includes(teacher)
      );
    }

    if (code) {
      filtered = filtered.filter((c: any) =>
        c['科號'] && c['科號'].toLowerCase().includes(code.toLowerCase())
      );
    }

    const totalMatches = filtered.length;
    const sliced = filtered.slice(0, limit);

    return NextResponse.json({
      success: true,
      totalMatches,
      limit,
      courses: sliced.map((c: any) => ({
        id: c['科號'],
        titleZh: c['課程中文名稱'],
        titleEn: c['課程英文名稱'],
        teacher: c['授課教師'],
        credits: c['學分數'],
        timeAndRoom: c['教室與上課時間'],
        capacity: c['人限'],
        geType: c['通識類別'],
        language: c['授課語言'],
        notes: c['備註'],
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
