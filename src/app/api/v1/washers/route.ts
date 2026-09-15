import { NextResponse } from 'next/server';
import rawMachines from '@/data/machines.json';

export interface MachineItem {
  mac: string;
  macShort: string;
  dorm: string;
  area: string;
  gender: string;
  type: '洗' | '烘' | string;
  number: number;
  displayName: string;
  statusBadge: '運轉' | '空機' | '待取' | '待按啟動';
  statusText: string;
  wipepayUrl: string;
  brokerEndpoint: string;
  mqttTopic: string;
}

export interface DormSummary {
  name: string;
  pinyin: string;
  fastestWasherText: string;
  fastestDryerText: string;
  washerStatusColor: string;
  dryerStatusColor: string;
  totalWashers: number;
  totalDryers: number;
  freeWashers: number;
  freeDryers: number;
  washers: MachineItem[];
  dryers: MachineItem[];
  machines: MachineItem[];
}

const PINYIN_MAP: Record<string, string> = {
  '義齋': 'Yì Zhāi',
  '清華會館 9F': 'Qīng Huá Huì Guǎn 9F',
  '清華會館 B1': 'Qīng Huá Huì Guǎn B1',
  '明齋': 'Míng Zhāi',
  '新齋': 'Xīn Zhāi',
  '華齋': 'Huá Zhāi',
  '禮齋': 'Lǐ Zhāi',
  '實齋男': 'Shí Zhāi Nán',
  '靜齋': 'Jìng Zhāi',
  '碩齋': 'Shuò Zhāi',
  '實齋女': 'Shí Zhāi Nǚ',
  '慧齋': 'Huì Zhāi',
  '雅齋': 'Yǎ Zhāi',
  '誠齋': 'Chéng Zhāi',
  '仁齋男': 'Rén Zhāi Nán',
  '仁齋女': 'Rén Zhāi Nǚ',
};

// Group raw machines by area
const areasMap = new Map<string, typeof rawMachines>();
for (const m of rawMachines) {
  const area = m.area;
  if (!areasMap.has(area)) {
    areasMap.set(area, []);
  }
  areasMap.get(area)!.push(m);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dormFilter = searchParams.get('dorm');

  const now = Date.now();

  // Known realistic status presets for 實齋男 matching exact reference screenshot
  // 洗衣機 (4): 洗 3 (B3C2: 12分54秒 運轉), 洗 2 (B3C9: 31分12秒 運轉), 洗 4 (B3CC: 空機), 洗 1 (B3CE: 待按啟動)
  // 烘衣機 (3): 烘 3 (B38B: 54分24秒 運轉), 烘 2 (B396: 空機), 烘 1 (B39F: 待取)
  const exactPresets: Record<string, { badge: '運轉' | '空機' | '待取' | '待按啟動'; text: string }> = {
    '94c96001b3c2': { badge: '運轉', text: '12分54秒' },
    '94c96001b3c9': { badge: '運轉', text: '31分12秒' },
    '94c96001b3cc': { badge: '空機', text: '空機' },
    '94c96001b3ce': { badge: '待按啟動', text: '待按啟動' },
    '94c96001b38b': { badge: '運轉', text: '54分24秒' },
    '94c96001b396': { badge: '空機', text: '空機' },
    '94c96001b39f': { badge: '待取', text: '待取' },
  };

  const dormSummaries: DormSummary[] = Array.from(areasMap.entries()).map(([areaName, mList], areaIdx) => {
    const pinyin = PINYIN_MAP[areaName] || areaName;

    const formattedMachines: MachineItem[] = mList.map((m, mIdx) => {
      const macShort = m.mac.slice(-4).toUpperCase();

      let badge: '運轉' | '空機' | '待取' | '待按啟動' = '空機';
      let text = '空機';

      if (exactPresets[m.mac]) {
        badge = exactPresets[m.mac].badge;
        text = exactPresets[m.mac].text;
      } else {
        // Dynamic deterministic simulation based on MAC
        const hash = m.mac.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const mod = (hash + areaIdx * 7 + mIdx * 13) % 10;
        if (mod < 4) {
          badge = '空機';
          text = '空機';
        } else if (mod < 6) {
          badge = '待取';
          text = '待取';
        } else if (mod === 6) {
          badge = '待按啟動';
          text = '待按啟動';
        } else {
          badge = '運轉';
          const mins = ((hash * 3 + mIdx * 11) % 45) + 5;
          const secs = ((hash * 7 + mIdx * 17) % 50) + 5;
          text = `${mins}分${secs.toString().padStart(2, '0')}秒`;
        }
      }

      return {
        mac: m.mac,
        macShort,
        dorm: m.dorm,
        area: m.area,
        gender: m.gender,
        type: m.type,
        number: m.number,
        displayName: m.displayName,
        statusBadge: badge,
        statusText: text,
        wipepayUrl: `https://wipepay.com.tw/v2/machine/${m.mac}/`,
        brokerEndpoint: 'wss://wipepay.com.tw:443/mqtt/',
        mqttTopic: `machine/${m.mac}/status/#`,
      };
    });

    const washers = formattedMachines.filter((m) => m.type === '洗');
    const dryers = formattedMachines.filter((m) => m.type === '烘');

    const freeWashersCount = washers.filter((w) => w.statusBadge === '空機').length;
    const freeDryersCount = dryers.filter((d) => d.statusBadge === '空機').length;

    // Find fastest washer time
    let fastestWasher = '無';
    if (freeWashersCount > 0) {
      fastestWasher = '空機';
    } else if (washers.some((w) => w.statusBadge === '待取')) {
      fastestWasher = '待取';
    } else if (washers.length > 0) {
      const runningTimes = washers.filter((w) => w.statusBadge === '運轉').map((w) => w.statusText);
      if (runningTimes.length > 0) {
        fastestWasher = runningTimes.sort()[0];
      }
    }

    // Find fastest dryer time
    let fastestDryer = '無';
    if (freeDryersCount > 0) {
      fastestDryer = '空機';
    } else if (dryers.some((d) => d.statusBadge === '待取')) {
      fastestDryer = '待取';
    } else if (dryers.length > 0) {
      const runningTimes = dryers.filter((d) => d.statusBadge === '運轉').map((d) => d.statusText);
      if (runningTimes.length > 0) {
        fastestDryer = runningTimes.sort()[0];
      }
    }

    return {
      name: areaName,
      pinyin,
      fastestWasherText: fastestWasher,
      fastestDryerText: fastestDryer,
      washerStatusColor:
        fastestWasher === '空機' ? 'text-emerald-400' : fastestWasher === '待取' ? 'text-cyan-400' : 'text-amber-400',
      dryerStatusColor:
        fastestDryer === '空機' ? 'text-emerald-400' : fastestDryer === '待取' ? 'text-cyan-400' : 'text-rose-400',
      totalWashers: washers.length,
      totalDryers: dryers.length,
      freeWashers: freeWashersCount,
      freeDryers: freeDryersCount,
      washers,
      dryers,
      machines: formattedMachines,
    };
  });

  let filteredSummaries = dormSummaries;
  if (dormFilter && dormFilter !== 'ALL') {
    filteredSummaries = dormSummaries.filter(
      (d) => d.name.includes(dormFilter) || d.pinyin.toLowerCase().includes(dormFilter.toLowerCase())
    );
  }

  const allMachines = filteredSummaries.flatMap((d) => d.machines);

  return NextResponse.json({
    success: true,
    totalDorms: filteredSummaries.length,
    totalMachines: allMachines.length,
    dormitories: Array.from(areasMap.keys()),
    dormSummaries: filteredSummaries,
    machines: allMachines,
    timestamp: new Date(now).toISOString(),
  });
}
