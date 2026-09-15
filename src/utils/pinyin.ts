/**
 * Universal Pinyin & English dictionary helper for NTHU Campus entities
 */

interface TranslationMapping {
  pinyin: string;
  english: string;
}

export const DICTIONARY: Record<string, TranslationMapping> = {
  // Dormitories & Laundry Hubs
  '義齋': { pinyin: 'Yì Zhāi', english: 'Yi Dormitory (Yizhai)' },
  '新齋': { pinyin: 'Xīn Zhāi', english: 'Xin Dormitory (Xinzhai)' },
  '新齋(男)': { pinyin: 'Xīn Zhāi (Nán)', english: 'Xin Dorm Male' },
  '新齋(女)': { pinyin: 'Xīn Zhāi (Nǚ)', english: 'Xin Dorm Female' },
  '男一齋': { pinyin: 'Nán Yī Zhāi', english: 'Male Dorm 1' },
  '文齋': { pinyin: 'Wén Zhāi', english: 'Wen Dormitory (Female)' },
  '雅齋': { pinyin: 'Yǎ Zhāi', english: 'Ya Dormitory (Female)' },
  '平齋': { pinyin: 'Píng Zhāi', english: 'Ping Dormitory' },
  '信齋': { pinyin: 'Xìn Zhāi', english: 'Xin Dormitory B' },
  '華齋': { pinyin: 'Huá Zhāi', english: 'Hua Dormitory (Huazhai)' },
  '明齋': { pinyin: 'Míng Zhāi', english: 'Ming Dormitory (Mingzhai)' },
  '清華會館9F': { pinyin: 'Qīng Huá Huì Guǎn 9F', english: 'Tsinghua Hall 9F' },
  '清華會館B1': { pinyin: 'Qīng Huá Huì Guǎn B1', english: 'Tsinghua Association B1' },
  '禮齋': { pinyin: 'Lǐ Zhāi', english: 'Li Dormitory (Lizhai)' },
  '實齋男': { pinyin: 'Shí Zhāi (Nán)', english: 'Shisai Male Dorm' },
  '實齋女': { pinyin: 'Shí Zhāi (Nǚ)', english: 'Shisai Female Dorm' },
  '靜齋': { pinyin: 'Jìng Zhāi', english: 'Jing Dormitory (Jingzhai)' },
  '碩齋': { pinyin: 'Shuò Zhāi', english: 'Shuo Graduate Dorm (Shuozhai)' },
  '惠齋': { pinyin: 'Huì Zhāi', english: 'Hui Dormitory (Huizhai)' },
  '誠齋': { pinyin: 'Chéng Zhāi', english: 'Cheng Dormitory (Chengzhai)' },
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
  '奕園': { pinyin: 'Yì Yuán', english: 'Yi Garden (Go Board Monument)' },
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
  '空閒中': { pinyin: 'Kōng Xián Zhōng', english: 'Available / Idle' },
  '使用中': { pinyin: 'Shǐ Yòng Zhōng', english: 'In Use / Running' },
  '維修中': { pinyin: 'Wéi Xiū Zhōng', english: 'Under Maintenance' },
  '營業中': { pinyin: 'Yíng Yè Zhōng', english: 'Open Now' },
  '即將關門': { pinyin: 'Jí Jiāng Guān Mén', english: 'Closing Soon' },
  '即將開門': { pinyin: 'Jí Jiāng Kāi Mén', english: 'Opening Soon' },
  '已關閉': { pinyin: 'Yǐ Guān Bì', english: 'Closed Now' },
};

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

