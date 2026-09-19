/**
 * Universal Pinyin & English dictionary helper for NTHU Campus entities,
 * Lost & Found auto-translation, and Laundry MQTT status translation.
 */

interface TranslationMapping {
  pinyin: string;
  english: string;
}

export const DICTIONARY: Record<string, TranslationMapping> = {
  // Dormitories & Laundry Hubs
  '義齋': { pinyin: 'Yì Zhāi', english: 'Yi Dormitory' },
  '新齋': { pinyin: 'Xīn Zhāi', english: 'Xin Dormitory' },
  '新齋(男)': { pinyin: 'Xīn Zhāi (Nán)', english: 'Xin Dorm Male' },
  '新齋(女)': { pinyin: 'Xīn Zhāi (Nǚ)', english: 'Xin Dorm Female' },
  '男一齋': { pinyin: 'Nán Yī Zhāi', english: 'Male Dorm 1' },
  '文齋': { pinyin: 'Wén Zhāi', english: 'Wen Female Dorm' },
  '雅齋': { pinyin: 'Yǎ Zhāi', english: 'Ya Female Dorm' },
  '平齋': { pinyin: 'Píng Zhāi', english: 'Ping Dormitory' },
  '信齋': { pinyin: 'Xìn Zhāi', english: 'Xin Dormitory B' },
  '華齋': { pinyin: 'Huá Zhāi', english: 'Hua Dormitory' },
  '明齋': { pinyin: 'Míng Zhāi', english: 'Ming Dormitory' },
  '清華會館9F': { pinyin: 'Qīng Huá Huì Guǎn 9F', english: 'Tsinghua Hall 9F' },
  '清華會館B1': { pinyin: 'Qīng Huá Huì Guǎn B1', english: 'Tsinghua Association B1' },
  '禮齋': { pinyin: 'Lǐ Zhāi', english: 'Li Dormitory' },
  '實齋男': { pinyin: 'Shí Zhāi (Nán)', english: 'Shisai Male Dorm' },
  '實齋女': { pinyin: 'Shí Zhāi (Nǚ)', english: 'Shisai Female Dorm' },
  '靜齋': { pinyin: 'Jìng Zhāi', english: 'Jing Dormitory' },
  '碩齋': { pinyin: 'Shuò Zhāi', english: 'Shuo Graduate Dorm' },
  '惠齋': { pinyin: 'Huì Zhāi', english: 'Hui Dormitory' },
  '誠齋': { pinyin: 'Chéng Zhāi', english: 'Cheng Dormitory' },
  '仁齋男': { pinyin: 'Rén Zhāi (Nán)', english: 'Ren Male Dorm' },
  '仁齋女': { pinyin: 'Rén Zhāi (Nǚ)', english: 'Ren Female Dorm' },

  // Landmarks, Buildings & Dining Hubs
  '小吃部': { pinyin: 'Xiǎo Chī Bù', english: 'Main Food Court / Snack Bar' },
  '水木生活中心': { pinyin: 'Shuǐ Mù Shēng Huó Zhōng Xīn', english: 'Waterwood Student Center' },
  '水木': { pinyin: 'Shuǐ Mù', english: 'Waterwood Center' },
  '風雲樓': { pinyin: 'Fēng Yún Lóu', english: 'Fengyun Student Activity Center' },
  '北校門': { pinyin: 'Běi Xiào Mén', english: 'Main North Gate' },
  '綜航站': { pinyin: 'Zōng Háng Zhàn', english: 'Zonghang Bus Terminal' },
  '台達館': { pinyin: 'Tái Dá Guǎn', english: 'Delta Hall (EECS Building)' },
  '台積館': { pinyin: 'Tái Jī Guǎn', english: 'TSMC Building (CTM School)' },
  '赤土崎': { pinyin: 'Chì Tǔ Qí', english: 'Chituqi Park & Underground Parking' },
  '南大校區': { pinyin: 'Nán Dà Xiào Qū', english: 'Nanda Campus' },
  '清大夜市': { pinyin: 'Qīng Dà Yè Shì', english: 'NTHU Night Market' },
  '奕園': { pinyin: 'Yì Yuán', english: 'Yi Garden' },
  '楓林小徑': { pinyin: 'Fēng Lín Xiǎo Jìng', english: 'Maple Path' },
  '旺宏館': { pinyin: 'Wàng Hóng Guǎn', english: 'Wang Hong Hall (Main Library)' },
  '人社院': { pinyin: 'Rén Shè Yuàn', english: 'Humanities & Social Sciences College' },
  '人社館': { pinyin: 'Rén Shè Guǎn', english: 'Humanities & Social Sciences Building' },
  '新源街': { pinyin: 'Xīn Yuán Jiē', english: 'Xinyuan Street' },
  '建功高中': { pinyin: 'Jiàn Gōng Gāo Zhōng', english: 'Jiangong High School' },
  '工程一館': { pinyin: 'Gōng Chéng Yī Guǎn', english: 'Engineering Building 1' },
  '物理館': { pinyin: 'Wù Lǐ Guǎn', english: 'Physics Building' },
  '化學館': { pinyin: 'Huà Xué Guǎn', english: 'Chemistry Building' },
  '生命科學館': { pinyin: 'Shēng Mìng Kē Xué Guǎn', english: 'Life Sciences Hall' },

  // Library Space Types & Floors
  '夜讀區': { pinyin: 'Yè Dú Qū', english: 'Night Study Zone' },
  '資訊島': { pinyin: 'Zī Xùn Dǎo', english: 'PC Workstation Island' },
  '討論室': { pinyin: 'Tǎolùn Shì', english: 'Group Discussion Room' },
  '研究小間': { pinyin: 'Yánjiū Xiǎojiān', english: 'Individual Study Carrel' },
  '聆賞席': { pinyin: 'Língshǎng Xí', english: 'Media & AV Listening Seat' },
  '電腦共學區': { pinyin: 'Diànnǎo Gòngxué Qū', english: 'Computer Commons' },
  '簡報練習室': { pinyin: 'Jiǎnbào Liànxí Shì', english: 'Presentation Practice Room' },
  '團體室': { pinyin: 'Tuántǐ Shì', english: 'Group Activity Room' },
  '享時小間': { pinyin: 'Xiǎngshí Xiǎojiān', english: 'Focus Relaxation Pod' },
  '總圖書館': { pinyin: 'Zǒng Tú Shū Guǎn', english: 'Main Library' },
  '人文社會圖書館': { pinyin: 'Rén Wén Shè Huì Tú Shū Guǎn', english: 'Humanities & Social Sciences Library' },
  '南大圖書館': { pinyin: 'Nán Dà Tú Shū Guǎn', english: 'Nanda Campus Library' },

  // Dining Stalls & Brands
  '麥當勞': { pinyin: 'Mài Dāng Láo', english: "McDonald's" },
  '7-ELEVEN': { pinyin: '7-ELEVEN', english: '7-Eleven Convenience Store' },
  '全家': { pinyin: 'Quán Jiā', english: 'FamilyMart' },
  '比司多早午餐': { pinyin: 'Bǐ Sī Duō Zǎo Wǔ Cān', english: 'Bistro Brunch' },
  '漢城異國美食': { pinyin: 'Hàn Chéng Yì Guó Měi Shí', english: 'Seoul International Cuisine' },
  '蘇記牛肉麵': { pinyin: 'Sū Jì Niú Ròu Miàn', english: 'Su Family Beef Noodles' },
  '小吃部冷飲部': { pinyin: 'Xiǎo Chī Bù Lěng Yǐn Bù', english: 'Snack Bar Cold Drinks' },
  '路易莎咖啡': { pinyin: 'Lù Yì Shā Kā Fēi', english: 'Louisa Coffee' },
  '星巴克': { pinyin: 'Xīng Bā Kè', english: 'Starbucks Coffee' },

  // Appliance types & status
  '洗衣機': { pinyin: 'Xǐ Yī Jī', english: 'Washing Machine' },
  '烘衣機': { pinyin: 'Hōng Yī Jī', english: 'Clothes Dryer' },
  '脫水機': { pinyin: 'Tuō Shuǐ Jī', english: 'Spin Dryer' },
  '空機': { pinyin: 'Kōng Jī', english: 'Available / Empty' },
  '空閒中': { pinyin: 'Kōng Xián Zhōng', english: 'Available / Idle' },
  '使用中': { pinyin: 'Shǐ Yòng Zhōng', english: 'In Use / Running' },
  '運轉': { pinyin: 'Yùn Zhuǎn', english: 'In Use' },
  '待取': { pinyin: 'Dài Qǔ', english: 'Ready for Pickup' },
  '請取衣': { pinyin: 'Qǐng Qǔ Yī', english: 'Please Pick Up Clothes' },
  '待按啟動': { pinyin: 'Dài Àn Qǐdòng', english: 'Press Start Button' },
  '維修中': { pinyin: 'Wéi Xiū Zhōng', english: 'Under Maintenance' },
  '故障': { pinyin: 'Gù Zhàng', english: 'Out of Order' },
  '未連線': { pinyin: 'Wèi Lián Xiàn', english: 'Offline' },
  '營業中': { pinyin: 'Yíng Yè Zhōng', english: 'Open Now' },
  '即將關門': { pinyin: 'Jí Jiāng Guān Mén', english: 'Closing Soon' },
  '即將開門': { pinyin: 'Jí Jiāng Kāi Mén', english: 'Opening Soon' },
  '已關閉': { pinyin: 'Yǐ Guān Bì', english: 'Closed Now' },
};

// Automatic English phrase translation rules for Lost & Found items
const TRANSLATION_RULES: [RegExp, string][] = [
  [/清華大學學生證|學生證/g, 'NTHU Student ID Card'],
  [/藍芽耳機|藍牙耳機|無線耳機/g, 'Bluetooth Earphones'],
  [/耳機殼|AirPods 殼|耳機盒/g, 'AirPods / Earphone Charging Case'],
  [/AirPods/g, 'Apple AirPods'],
  [/悠遊卡|一卡通|icash|金融卡|信用卡/g, 'EasyCard / Payment Card'],
  [/鑰匙包|鑰匙圈|鑰匙/g, 'Keys / Keychain'],
  [/皮夾|錢包|短夾|長夾/g, 'Wallet / Purse'],
  [/水壺|水杯|保溫瓶|隨行杯/g, 'Water Bottle / Thermos'],
  [/雨傘|折傘|自動傘/g, 'Umbrella'],
  [/外套|風衣|帽T|衣服/g, 'Jacket / Clothing'],
  [/帽子|鴨舌帽|毛帽/g, 'Hat / Cap'],
  [/筆記本|課本|書籍|講義/g, 'Notebook / Textbook'],
  [/鉛筆盒|筆袋|文具/g, 'Pencil Case / Stationery'],
  [/隨身碟|USB|隨身硬碟/g, 'USB Flash Drive'],
  [/計算機/g, 'Calculator'],
  [/眼鏡|太陽眼鏡|眼鏡盒/g, 'Glasses / Sunglasses Case'],
  [/安全帽/g, 'Motorcycle Helmet'],
  [/後背包|背包|手提袋|帆布袋|包包/g, 'Backpack / Handbag'],
  [/充電器|充電線|豆腐頭|變壓器/g, 'Charger / Cable'],
  [/行郵行動電源|行動電源/g, 'Power Bank'],
  [/手錶|智慧手錶/g, 'Watch / Smartwatch'],
  [/戒指|項鍊|飾品/g, 'Jewelry / Ring'],
  [/停車證|車證/g, 'Parking Permit Card'],
  [/白色/g, 'White'],
  [/黑色/g, 'Black'],
  [/藍色/g, 'Blue'],
  [/紅色/g, 'Red'],
  [/粉紅色|粉色/g, 'Pink'],
  [/綠色/g, 'Green'],
  [/黃色/g, 'Yellow'],
  [/灰色/g, 'Gray'],
  [/棕色|咖啡色/g, 'Brown'],
  [/透明/g, 'Transparent / Clear'],
  [/無/g, 'None'],
  [/殼內無耳機/g, '(Case Only - No Earbuds Inside)'],
  [/總圖/g, 'Main Library'],
  [/人社分館|人社圖書館/g, 'HSS Library Branch'],
  [/南大分館/g, 'Nanda Library Branch'],
  [/服務櫃檯|櫃檯/g, 'Service Desk'],
];

export function getPinyinAndEnglish(term: string): { original: string; pinyin: string; english: string; fullLabel: string } {
  if (!term) return { original: '', pinyin: '', english: '', fullLabel: '' };

  let clean = term.replace('YouBike2.0_', '');
  let pinyin = '';
  let english = '';

  // Direct match
  if (DICTIONARY[clean]) {
    pinyin = DICTIONARY[clean].pinyin;
    english = DICTIONARY[clean].english;
  } else {
    // Partial matches
    for (const [key, mapping] of Object.entries(DICTIONARY)) {
      if (clean.includes(key)) {
        pinyin = mapping.pinyin;
        english = mapping.english;
        break;
      }
    }
  }

  // Fallback heuristic if not in dictionary
  if (!pinyin && !english) {
    if (clean.includes('館') || clean.includes('樓')) {
      english = 'Building / Hall';
    } else if (clean.includes('室') || clean.includes('區')) {
      english = 'Room / Zone';
    } else if (clean.includes('門')) {
      english = 'Gate';
    } else if (clean.includes('麵') || clean.includes('飯') || clean.includes('餐')) {
      english = 'Eatery / Dining';
    } else {
      english = clean;
    }
    pinyin = clean;
  }

  return {
    original: clean,
    pinyin: pinyin || clean,
    english: english || clean,
    fullLabel: `${clean} (${pinyin || clean} • ${english || clean})`,
  };
}

/**
 * Automatically translates Chinese description/location into clear English.
 */
export function translateChineseText(text: string): string {
  if (!text) return '';
  let translated = text;

  // Apply replacement rules
  for (const [rule, replacement] of TRANSLATION_RULES) {
    translated = translated.replace(rule, replacement);
  }

  // Clean up punctuation spacing
  translated = translated
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();

  return translated;
}

/**
 * Helper to translate laundry machine status into English
 */
export function translateLaundryStatus(
  statusBadge: string,
  statusText: string
): { englishBadge: string; englishText: string; color: string } {
  let englishBadge = 'Available';
  let englishText = 'Available / Empty';
  let color = 'text-emerald-400';

  if (statusBadge === '空機' || statusText.includes('空機')) {
    englishBadge = 'Available';
    englishText = 'Available / Empty';
    color = 'text-emerald-400';
  } else if (statusBadge === '待取' || statusText.includes('待取') || statusText.includes('請取衣')) {
    englishBadge = 'Pickup Ready';
    englishText = 'Done - Ready for Pickup';
    color = 'text-cyan-400';
  } else if (statusBadge === '待按啟動' || statusText.includes('待按啟動')) {
    englishBadge = 'Press Start';
    englishText = 'Press Start Button';
    color = 'text-rose-400';
  } else if (statusBadge === '運轉' || statusText.includes('運轉') || statusText.includes('分')) {
    englishBadge = 'In Use';
    color = 'text-amber-400';

    // Parse remaining minutes/seconds if present
    const minMatch = statusText.match(/(\d+)\s*分/);
    const secMatch = statusText.match(/(\d+)\s*秒/);
    if (minMatch) {
      const mins = minMatch[1];
      const secs = secMatch ? secMatch[1] : '00';
      englishText = `${mins}m ${secs}s remaining`;
    } else {
      englishText = 'In Use / Running';
    }
  } else if (statusText.includes('故障')) {
    englishBadge = 'Fault';
    englishText = 'Out of Order';
    color = 'text-rose-500';
  } else if (statusText.includes('維修')) {
    englishBadge = 'Maintenance';
    englishText = 'Under Maintenance';
    color = 'text-amber-500';
  }

  return { englishBadge, englishText, color };
}
