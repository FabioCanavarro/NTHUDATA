import { NextResponse } from 'next/server';
import { getPinyinAndEnglish, translateChineseText } from '@/utils/pinyin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || searchParams.get('q') || '';
  const category = searchParams.get('category') || 'ALL';

  try {
    const res = await fetch('https://api.nthusa.tw/libraries/lost_and_found', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }, // 5 min cache
    });

    let items: any[] = [];
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        items = data.map((item: any, idx: number) => {
          const id = item['序號'] || String(idx + 1);
          const date = item['拾獲時間'] || 'Recent';
          const location = item['拾獲地點'] || 'NTHU Library';
          const desc = item['描述'] || 'Lost Item';

          const locInfo = getPinyinAndEnglish(location);
          const descInfo = getPinyinAndEnglish(desc);

          // Auto translate into clear English
          const englishLocation = translateChineseText(location) || locInfo.english;
          const englishDesc = translateChineseText(desc) || descInfo.english;

          // Infer category
          let itemCategory = 'Other';
          if (desc.includes('耳機') || desc.includes('AirPods') || desc.includes('電腦') || desc.includes('手機') || desc.includes('充電')) {
            itemCategory = 'Electronics';
          } else if (desc.includes('卡') || desc.includes('證') || desc.includes('悠遊')) {
            itemCategory = 'ID Cards & Cards';
          } else if (desc.includes('鑰匙') || desc.includes('皮夾') || desc.includes('錢包')) {
            itemCategory = 'Keys & Wallets';
          } else if (desc.includes('筆') || desc.includes('書') || desc.includes('筆記')) {
            itemCategory = 'Stationery & Books';
          } else if (desc.includes('水壺') || desc.includes('傘') || desc.includes('外套') || desc.includes('包')) {
            itemCategory = 'Personal Items';
          }

          return {
            id,
            date,
            location,
            pinyinLocation: locInfo.pinyin,
            englishLocation: englishLocation,
            description: desc,
            pinyinDesc: descInfo.pinyin,
            englishDesc: englishDesc,
            category: itemCategory,
            custody: '清大圖書館一樓服務櫃檯 (Main Lib 1F Service Desk)',
          };
        });
      }
    }

    if (items.length === 0) {
      // Fallback sample data if upstream API is offline
      items = [
        {
          id: '1',
          date: '2026-09-15',
          location: '總圖 3F',
          pinyinLocation: 'Zǒngtú 3F',
          englishLocation: 'Main Library 3F',
          description: '藍牙耳機殼 白色 Apple AirPods 殼內無耳機',
          pinyinDesc: 'Lántá Ěrjī Ké Báisè Apple AirPods',
          englishDesc: 'White Apple AirPods Charging Case (Empty)',
          category: 'Electronics',
          custody: '清大圖書館一樓服務櫃檯 (Main Lib 1F Service Desk)',
        },
        {
          id: '2',
          date: '2026-09-14',
          location: '人社館 2F',
          pinyinLocation: 'Rén Shè Guǎn 2F',
          englishLocation: 'HSS Building 2F',
          description: '清華大學學生證 (Student ID Card)',
          pinyinDesc: 'Qīnghuá Dàxué Xuéshēng Zhèng',
          englishDesc: 'NTHU Student ID Card',
          category: 'ID Cards & Cards',
          custody: '人社分館櫃檯 (HSS Branch Desk)',
        },
      ];
    }

    // Filter search and category
    let filtered = items;

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.description.toLowerCase().includes(query) ||
          i.englishDesc.toLowerCase().includes(query) ||
          i.location.toLowerCase().includes(query) ||
          i.englishLocation.toLowerCase().includes(query)
      );
    }

    if (category !== 'ALL') {
      filtered = filtered.filter((i) => i.category === category);
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      timestamp: new Date().toISOString(),
      items: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
