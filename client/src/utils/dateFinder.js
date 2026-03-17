/**
 * Date Finder Utility for NoterHaat
 * Generates all possible serial number patterns from a date
 */

/**
 * Generate all possible serial patterns from a given date
 * @param {string} dateStr - Date in DD/MM/YYYY format
 * @returns {Object} Search patterns and queries
 */
export function findDateInSerial(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return { patterns: [], searchQueries: [] };

  const dd = parts[0].padStart(2, '0');
  const mm = parts[1].padStart(2, '0');
  const yyyy = parts[2];
  const yy = yyyy.slice(-2);

  const patterns = [
    { type: 'DDMM', pattern: `${dd}${mm}`, label: `${dd}${mm}`, description: 'দিন + মাস' },
    { type: 'MMDD', pattern: `${mm}${dd}`, label: `${mm}${dd}`, description: 'মাস + দিন' },
    { type: 'DDMMYY', pattern: `${dd}${mm}${yy}`, label: `${dd}${mm}${yy}`, description: 'দিন + মাস + বছর (ছোট)' },
    { type: 'YYMMDD', pattern: `${yy}${mm}${dd}`, label: `${yy}${mm}${dd}`, description: 'বছর (ছোট) + মাস + দিন' },
    { type: 'DDMMYYYY', pattern: `${dd}${mm}${yyyy}`, label: `${dd}${mm}${yyyy}`, description: 'সম্পূর্ণ তারিখ' },
    { type: 'YYYYMMDD', pattern: `${yyyy}${mm}${dd}`, label: `${yyyy}${mm}${dd}`, description: 'বছর + মাস + দিন (ISO)' },
    { type: 'YYYY', pattern: `${yyyy}`, label: `${yyyy}`, description: 'শুধু বছর' },
    { type: 'MMYYYY', pattern: `${mm}${yyyy}`, label: `${mm}${yyyy}`, description: 'মাস + বছর' },
    { type: 'DDYYYY', pattern: `${dd}${yyyy}`, label: `${dd}${yyyy}`, description: 'দিন + বছর' },
  ];

  // Generate MongoDB search queries
  const searchQueries = patterns.map(p => ({
    ...p,
    // Regex to find pattern anywhere in serial number
    regex: new RegExp(p.pattern),
    mongoQuery: {
      serialNumber: { $regex: p.pattern }
    },
  }));

  return {
    date: { dd, mm, yyyy, yy },
    patterns,
    searchQueries,
  };
}

/**
 * Format a date object to Bengali display string
 */
export function formatDateBengali(date) {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (num) => String(num).replace(/[0-9]/g, d => bengaliDigits[parseInt(d)]);
  
  if (typeof date === 'string') {
    const parts = date.split('/');
    if (parts.length === 3) {
      return `${toBn(parseInt(parts[0]))} ${months[parseInt(parts[1]) - 1]} ${toBn(parts[2])}`;
    }
  }
  
  if (date instanceof Date) {
    return `${toBn(date.getDate())} ${months[date.getMonth()]} ${toBn(date.getFullYear())}`;
  }
  
  return date;
}

/**
 * Get Bengali occasion label
 */
export function getOccasionLabel(occasion) {
  const labels = {
    birthday: { emoji: '🎂', bn: 'জন্মদিন' },
    anniversary: { emoji: '💍', bn: 'বিবাহবার্ষিকী' },
    graduation: { emoji: '🎓', bn: 'স্নাতক' },
    firstMeeting: { emoji: '💫', bn: 'প্রথম দেখা' },
    other: { emoji: '✨', bn: 'অন্যান্য' },
  };
  return labels[occasion] || labels.other;
}
