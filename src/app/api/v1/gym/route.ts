import { NextResponse } from 'next/server';

export interface SportsVenue {
  id: string;
  name: string;
  pinyin: string;
  english: string;
  category: 'Gym & Fitness' | 'Aquatic Pool' | 'Racket Sports' | 'Outdoor Courts';
  location: string;
  weekdayHours: string;
  weekendHours: string;
  hours: string;
  status: 'OPEN' | 'CLOSING_SOON' | 'ON_BREAK' | 'CLOSED';
  statusLabel: string;
  currentOccupancy?: number;
  maxCapacity?: number;
  totalCourts?: number;
  freeCourts?: number;
  feeInfo: string;
  membershipInfo: string;
  breakHours?: string;
  peClassHours?: string;
  bookingInfo: string;
}

function calculateVenueStatus(weekdayHours: string, weekendHours: string, breakHoursStr?: string): {
  status: 'OPEN' | 'CLOSING_SOON' | 'ON_BREAK' | 'CLOSED';
  statusLabel: string;
  isOpen: boolean;
  activeHoursText: string;
} {
  const now = new Date();
  const taipeiHours = (now.getUTCHours() + 8) % 24;
  const taipeiMinutes = now.getUTCMinutes();
  const currentMinutes = taipeiHours * 60 + taipeiMinutes;

  const day = now.getUTCDay(); // 0 = Sun, 6 = Sat
  const isWeekend = day === 0 || day === 6;

  const activeHoursText = isWeekend ? weekendHours : weekdayHours;

  const match = activeHoursText.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (!match) return { status: 'OPEN', statusLabel: 'Open • 營業中', isOpen: true, activeHoursText };

  const openMinutes = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  const closeMinutes = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);

  // Check if current time falls in midday break hours (e.g. 12:00 - 13:00)
  if (breakHoursStr) {
    const breakMatch = breakHoursStr.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    if (breakMatch) {
      const bOpen = parseInt(breakMatch[1], 10) * 60 + parseInt(breakMatch[2], 10);
      const bClose = parseInt(breakMatch[3], 10) * 60 + parseInt(breakMatch[4], 10);
      if (currentMinutes >= bOpen && currentMinutes < bClose) {
        return {
          status: 'ON_BREAK',
          statusLabel: 'Midday Break • 清潔中',
          isOpen: false,
          activeHoursText,
        };
      }
    }
  }

  if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
    return {
      status: 'CLOSED',
      statusLabel: 'Closed • 已閉館',
      isOpen: false,
      activeHoursText,
    };
  } else if (closeMinutes - currentMinutes <= 30) {
    return {
      status: 'CLOSING_SOON',
      statusLabel: 'Closing Soon • 即將關閉',
      isOpen: true,
      activeHoursText,
    };
  }

  return {
    status: 'OPEN',
    statusLabel: 'Open • 營業中',
    isOpen: true,
    activeHoursText,
  };
}

export async function GET() {
  const baseVenues = [
    {
      id: 'gym-weight-room',
      name: '體育館重訓室',
      pinyin: 'Tǐyùguǎn Zhòngxùnshì',
      english: 'Main Gym Weight Training Room',
      category: 'Gym & Fitness' as const,
      location: '校本部體育館 1F (Main Gymnasium 1F)',
      weekdayHours: '08:00 - 22:00',
      weekendHours: '10:00 - 18:00',
      breakHours: '12:00 - 13:00',
      peClassHours: '10:00-12:00, 14:00-16:00 (PE Class Priority)',
      currentOccupancy: 38,
      maxCapacity: 80,
      feeInfo: 'Per entry TWD $20 or Semester Gym Pass (TWD $800)',
      membershipInfo: 'NTHU Student Pass: TWD $800/semester for unlimited access. Bind ID card at PE Office.',
      bookingInfo: 'Scan NTHU Student/Faculty ID card at turnstile. Towel required.',
    },
    {
      id: 'pool-aquatic',
      name: '游泳館 (水木游泳池)',
      pinyin: 'Yóuyǒngguǎn (Shuǐmù Yóuyǒngchí)',
      english: 'NTHU Swimming Pool & Aquatic Center',
      category: 'Aquatic Pool' as const,
      location: '水木生活中心旁 (Next to Waterwood Center)',
      weekdayHours: '06:00 - 21:30',
      weekendHours: '08:00 - 18:00',
      breakHours: '12:00 - 13:30',
      currentOccupancy: 45,
      maxCapacity: 120,
      feeInfo: 'Student Ticket TWD $50 / entry',
      membershipInfo: 'Semester Swim Pass: TWD $1,200/semester available at PE Department.',
      bookingInfo: 'Swim cap and proper swim attire required. Coin return lockers on 1F.',
    },
    {
      id: 'badminton-hall',
      name: '室內羽球館',
      pinyin: 'Shìnèi Yǔqiúguǎn',
      english: 'Indoor Badminton Hall',
      category: 'Racket Sports' as const,
      location: '校本部體育館 2F (Main Gymnasium 2F)',
      weekdayHours: '08:00 - 22:00',
      weekendHours: '09:00 - 18:00',
      peClassHours: '08:00-12:00 (Varsity & PE Class Priority)',
      totalCourts: 8,
      freeCourts: 3,
      feeInfo: 'Free for NTHU students during open hours',
      membershipInfo: 'Court reservation available for student sports clubs via PE Office.',
      bookingInfo: 'Non-marking indoor court shoes strictly required.',
    },
    {
      id: 'table-tennis',
      name: '桌球室',
      pinyin: 'Zhuōqiúshì',
      english: 'Table Tennis Room',
      category: 'Racket Sports' as const,
      location: '體育館 B1 (Gymnasium B1)',
      weekdayHours: '08:00 - 22:00',
      weekendHours: '09:00 - 18:00',
      totalCourts: 12,
      freeCourts: 5,
      feeInfo: 'Free for NTHU students',
      membershipInfo: 'Racket and ball rental available at PE Department office B1.',
      bookingInfo: 'First come first served for student practice.',
    },
    {
      id: 'tennis-outdoor',
      name: '室外網球場',
      pinyin: 'Shìwài Wǎngqiúchǎng',
      english: 'Outdoor Tennis Courts',
      category: 'Outdoor Courts' as const,
      location: '操場旁 (Next to Main Track Field)',
      weekdayHours: '07:00 - 21:00',
      weekendHours: '08:00 - 18:00',
      totalCourts: 6,
      freeCourts: 2,
      feeInfo: 'Night lighting TWD $50/hr per court',
      membershipInfo: 'Online court reservation via PE Office System.',
      bookingInfo: 'Turn on floodlights by inserting prepaid court token.',
    },
    {
      id: 'basketball-outdoor',
      name: '籃球場',
      pinyin: 'Lánqiúchǎng',
      english: 'Main Outdoor Basketball Courts',
      category: 'Outdoor Courts' as const,
      location: '體育館前方 (Front of Main Gym)',
      weekdayHours: '08:00 - 22:00',
      weekendHours: '08:00 - 22:00',
      totalCourts: 4,
      freeCourts: 1,
      feeInfo: 'Free open access',
      membershipInfo: 'Open to all NTHU students and faculty.',
      bookingInfo: 'First come first served. Floodlights automatically turn off at 22:00.',
    },
    {
      id: 'volleyball-outdoor',
      name: '排球場',
      pinyin: 'Páiqiúchǎng',
      english: 'Volleyball Courts',
      category: 'Outdoor Courts' as const,
      location: '操場東側 (East Side of Main Track)',
      weekdayHours: '08:00 - 22:00',
      weekendHours: '08:00 - 22:00',
      totalCourts: 4,
      freeCourts: 2,
      feeInfo: 'Free open access',
      membershipInfo: 'Intramural team priority booking on weekday evenings.',
      bookingInfo: 'Open for student practice & intramural matches.',
    },
    {
      id: 'nanda-gym',
      name: '南大校區體育館重訓室',
      pinyin: 'Nándà Xiàoqū Tǐyùguǎn',
      english: 'Nanda Campus Gymnasium & Weight Room',
      category: 'Gym & Fitness' as const,
      location: '南大校區體育館 (Nanda Campus Gym)',
      weekdayHours: '08:30 - 21:30',
      weekendHours: '10:00 - 17:00',
      breakHours: '12:00 - 13:00',
      currentOccupancy: 19,
      maxCapacity: 60,
      feeInfo: 'TWD $20 / entry or Semester Gym Pass',
      membershipInfo: 'Nanda Campus gym pass valid at both Main Campus & Nanda Gyms.',
      bookingInfo: 'Nanda student card entry.',
    },
  ];

  const venues: SportsVenue[] = baseVenues.map((v) => {
    const { status, statusLabel, isOpen, activeHoursText } = calculateVenueStatus(
      v.weekdayHours,
      v.weekendHours,
      v.breakHours
    );

    return {
      ...v,
      hours: activeHoursText,
      status,
      statusLabel,
      currentOccupancy: isOpen ? v.currentOccupancy : 0,
      freeCourts: isOpen ? v.freeCourts : 0,
    };
  });

  return NextResponse.json({
    success: true,
    count: venues.length,
    timestamp: new Date().toISOString(),
    venues,
  });
}
