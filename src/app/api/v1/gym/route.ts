import { NextResponse } from 'next/server';
import { getPinyinAndEnglish } from '@/utils/pinyin';

export interface SportsVenue {
  id: string;
  name: string;
  pinyin: string;
  english: string;
  category: 'Gym & Fitness' | 'Aquatic Pool' | 'Racket Sports' | 'Outdoor Courts';
  location: string;
  hours: string;
  status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED';
  currentOccupancy?: number;
  maxCapacity?: number;
  totalCourts?: number;
  freeCourts?: number;
  feeInfo: string;
  bookingInfo: string;
}

export async function GET() {
  const venues: SportsVenue[] = [
    {
      id: 'gym-weight-room',
      name: '體育館重訓室',
      pinyin: 'Tǐyùguǎn Zhòngxùnshì',
      english: 'Main Gym Weight Training Room',
      category: 'Gym & Fitness',
      location: '校本部體育館 1F (Main Gymnasium 1F)',
      hours: '08:00 - 22:00',
      status: 'OPEN',
      currentOccupancy: 38,
      maxCapacity: 80,
      feeInfo: 'TWD $20 / entry or Semester Gym Pass',
      bookingInfo: 'Scan NTHU Student/Faculty ID card at entry turnstile.',
    },
    {
      id: 'pool-aquatic',
      name: '游泳館 (水木游泳池)',
      pinyin: 'Yóuyǒngguǎn (Shuǐmù Yóuyǒngchí)',
      english: 'NTHU Swimming Pool & Aquatic Center',
      category: 'Aquatic Pool',
      location: '水木生活中心旁 (Next to Waterwood Center)',
      hours: '06:00 - 21:30',
      status: 'OPEN',
      currentOccupancy: 45,
      maxCapacity: 120,
      feeInfo: 'Student ticket TWD $50 / entry',
      bookingInfo: 'Swim cap and swimming attire required.',
    },
    {
      id: 'badminton-hall',
      name: '室內羽球館',
      pinyin: 'Shìnèi Yǔqiúguǎn',
      english: 'Indoor Badminton Hall',
      category: 'Racket Sports',
      location: '校本部體育館 2F (Main Gymnasium 2F)',
      hours: '08:00 - 22:00',
      status: 'OPEN',
      totalCourts: 8,
      freeCourts: 3,
      feeInfo: 'Free for NTHU students during open hours',
      bookingInfo: 'Non-marking indoor sports shoes required.',
    },
    {
      id: 'table-tennis',
      name: '桌球室',
      pinyin: 'Zhuōqiúshì',
      english: 'Table Tennis Room',
      category: 'Racket Sports',
      location: '體育館 B1 (Gymnasium B1)',
      hours: '08:00 - 22:00',
      status: 'OPEN',
      totalCourts: 12,
      freeCourts: 5,
      feeInfo: 'Free for NTHU students',
      bookingInfo: 'Equipment rental available at PE Department office.',
    },
    {
      id: 'tennis-outdoor',
      name: '室外網球場',
      pinyin: 'Shìwài Wǎngqiúchǎng',
      english: 'Outdoor Tennis Courts',
      category: 'Outdoor Courts',
      location: '操場旁 (Next to Main Track Field)',
      hours: '07:00 - 21:00',
      status: 'OPEN',
      totalCourts: 6,
      freeCourts: 2,
      feeInfo: 'Night lighting TWD $50/hr per court',
      bookingInfo: 'Online court reservation via PE Office System.',
    },
    {
      id: 'basketball-outdoor',
      name: '籃球場',
      pinyin: 'Lánqiúchǎng',
      english: 'Main Outdoor Basketball Courts',
      category: 'Outdoor Courts',
      location: '體育館前方 (Front of Main Gym)',
      hours: '08:00 - 22:00',
      status: 'OPEN',
      totalCourts: 4,
      freeCourts: 1,
      feeInfo: 'Free open access',
      bookingInfo: 'First come first served. Floodlights on until 22:00.',
    },
    {
      id: 'volleyball-outdoor',
      name: '排球場',
      pinyin: 'Páiqiúchǎng',
      english: 'Volleyball Courts',
      category: 'Outdoor Courts',
      location: '操場東側 (East Side of Main Track)',
      hours: '08:00 - 22:00',
      status: 'OPEN',
      totalCourts: 4,
      freeCourts: 2,
      feeInfo: 'Free open access',
      bookingInfo: 'Open for student practice & intramural matches.',
    },
    {
      id: 'nanda-gym',
      name: '南大校區體育館重訓室',
      pinyin: 'Nándà Xiàoqū Tǐyùguǎn',
      english: 'Nanda Campus Gymnasium & Weight Room',
      category: 'Gym & Fitness',
      location: '南大校區體育館 (Nanda Campus Gym)',
      hours: '08:30 - 21:30',
      status: 'OPEN',
      currentOccupancy: 19,
      maxCapacity: 60,
      feeInfo: 'TWD $20 / entry',
      bookingInfo: 'Nanda student card entry.',
    },
  ];

  return NextResponse.json({
    success: true,
    count: venues.length,
    timestamp: new Date().toISOString(),
    venues,
  });
}
