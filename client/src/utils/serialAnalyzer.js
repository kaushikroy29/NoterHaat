/**
 * Serial Number Analyzer for NoterHaat
 * Detects special patterns in Bangladeshi banknote serial numbers
 */

/**
 * Analyze a serial number and return all detected patterns
 * @param {string} serialNumber - The serial number to analyze
 * @returns {Object} Analysis result
 */
export function analyzeSerial(serialNumber) {
  // Extract only digits from serial (ignore prefix letters)
  const digits = serialNumber.replace(/[^0-9]/g, '');
  
  const patterns = [];
  const dateMatches = [];
  let collectibilityScore = 1;
  let suggestedPriceMin = 0;
  let suggestedPriceMax = 0;

  // 1. RADAR — reads same forwards & backwards
  if (digits === digits.split('').reverse().join('')) {
    patterns.push('radar');
    collectibilityScore += 3;
  }

  // 2. SOLID — all same digit
  if (digits.length > 0 && new Set(digits).size === 1) {
    patterns.push('solid');
    collectibilityScore += 4;
  }

  // 3. FANCY — ascending or descending sequence
  const isAscending = digits.split('').every((d, i, arr) => 
    i === 0 || parseInt(d) === parseInt(arr[i-1]) + 1
  );
  const isDescending = digits.split('').every((d, i, arr) => 
    i === 0 || parseInt(d) === parseInt(arr[i-1]) - 1
  );
  if (digits.length >= 4 && (isAscending || isDescending)) {
    patterns.push('fancy');
    collectibilityScore += 3;
  }

  // 4. LOW SERIAL — 00000001 to 00001000
  const numericValue = parseInt(digits, 10);
  if (numericValue >= 1 && numericValue <= 1000) {
    patterns.push('lowSerial');
    collectibilityScore += 3;
  }

  // 5. REPEATING — like 12121212, 123123
  if (digits.length >= 4) {
    for (let len = 1; len <= Math.floor(digits.length / 2); len++) {
      const pattern = digits.substring(0, len);
      const repeated = pattern.repeat(Math.ceil(digits.length / len)).substring(0, digits.length);
      if (repeated === digits) {
        patterns.push('repeating');
        collectibilityScore += 2;
        break;
      }
    }
  }

  // 6. DATE PATTERNS — find all possible date matches
  const foundDates = extractDatesFromSerial(digits);
  if (foundDates.length > 0) {
    patterns.push('dateMatch');
    collectibilityScore += 2;
    dateMatches.push(...foundDates);
  }

  // Calculate suggested price range based on rarity
  collectibilityScore = Math.min(collectibilityScore, 10);
  
  if (collectibilityScore >= 8) {
    suggestedPriceMin = 5000;
    suggestedPriceMax = 50000;
  } else if (collectibilityScore >= 6) {
    suggestedPriceMin = 2000;
    suggestedPriceMax = 10000;
  } else if (collectibilityScore >= 4) {
    suggestedPriceMin = 500;
    suggestedPriceMax = 3000;
  } else if (collectibilityScore >= 2) {
    suggestedPriceMin = 200;
    suggestedPriceMax = 1000;
  } else {
    suggestedPriceMin = 50;
    suggestedPriceMax = 200;
  }

  return {
    serialNumber,
    digits,
    patterns,
    dateMatches,
    collectibilityScore,
    suggestedPriceRange: { min: suggestedPriceMin, max: suggestedPriceMax },
    isRadar: patterns.includes('radar'),
    isSolid: patterns.includes('solid'),
    isFancy: patterns.includes('fancy'),
    isLowSerial: patterns.includes('lowSerial'),
    isRepeating: patterns.includes('repeating'),
    hasDateMatch: patterns.includes('dateMatch'),
    patternLabels: getPatternLabels(patterns),
  };
}

/**
 * Extract possible date matches from a serial number's digits
 */
function extractDatesFromSerial(digits) {
  const matches = [];
  
  // Try all positions in the serial for date patterns
  for (let i = 0; i <= digits.length - 4; i++) {
    // DDMM — 4 digits
    const ddmm = digits.substring(i, i + 4);
    const dd1 = parseInt(ddmm.substring(0, 2));
    const mm1 = parseInt(ddmm.substring(2, 4));
    if (dd1 >= 1 && dd1 <= 31 && mm1 >= 1 && mm1 <= 12) {
      matches.push({
        date: `${ddmm.substring(0,2)}/${ddmm.substring(2,4)}`,
        type: 'DDMM',
        pattern: ddmm,
        position: i,
      });
    }

    // MMDD — 4 digits  
    const mmdd = digits.substring(i, i + 4);
    const mm2 = parseInt(mmdd.substring(0, 2));
    const dd2 = parseInt(mmdd.substring(2, 4));
    if (mm2 >= 1 && mm2 <= 12 && dd2 >= 1 && dd2 <= 31) {
      matches.push({
        date: `${mmdd.substring(2,4)}/${mmdd.substring(0,2)}`,
        type: 'MMDD',
        pattern: mmdd,
        position: i,
      });
    }
  }

  // DDMMYY — 6 digits
  for (let i = 0; i <= digits.length - 6; i++) {
    const ddmmyy = digits.substring(i, i + 6);
    const dd = parseInt(ddmmyy.substring(0, 2));
    const mm = parseInt(ddmmyy.substring(2, 4));
    const yy = parseInt(ddmmyy.substring(4, 6));
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 0 && yy <= 99) {
      const year = yy > 50 ? 1900 + yy : 2000 + yy;
      matches.push({
        date: `${ddmmyy.substring(0,2)}/${ddmmyy.substring(2,4)}/${year}`,
        type: 'DDMMYY',
        pattern: ddmmyy,
        position: i,
      });
    }
  }

  // DDMMYYYY — 8 digits
  for (let i = 0; i <= digits.length - 8; i++) {
    const ddmmyyyy = digits.substring(i, i + 8);
    const dd = parseInt(ddmmyyyy.substring(0, 2));
    const mm = parseInt(ddmmyyyy.substring(2, 4));
    const yyyy = parseInt(ddmmyyyy.substring(4, 8));
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yyyy >= 1900 && yyyy <= 2030) {
      matches.push({
        date: `${ddmmyyyy.substring(0,2)}/${ddmmyyyy.substring(2,4)}/${yyyy}`,
        type: 'DDMMYYYY',
        pattern: ddmmyyyy,
        position: i,
      });
    }
  }

  // YYYY — 4 digits (year alone)
  for (let i = 0; i <= digits.length - 4; i++) {
    const yyyy = digits.substring(i, i + 4);
    const year = parseInt(yyyy);
    if (year >= 1950 && year <= 2030) {
      matches.push({
        date: `${year}`,
        type: 'YYYY',
        pattern: yyyy,
        position: i,
      });
    }
  }

  // Remove duplicate patterns
  const seen = new Set();
  return matches.filter(m => {
    const key = `${m.type}-${m.pattern}-${m.position}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get Bengali labels for detected patterns
 */
function getPatternLabels(patterns) {
  const labelMap = {
    radar: { bn: 'রাডার নম্বর', en: 'Radar', color: 'purple' },
    solid: { bn: 'সলিড নম্বর', en: 'Solid', color: 'blue' },
    fancy: { bn: 'ফ্যান্সি নম্বর', en: 'Fancy', color: 'gold' },
    lowSerial: { bn: 'লো সিরিয়াল', en: 'Low Serial', color: 'green' },
    repeating: { bn: 'রিপিটিং', en: 'Repeating', color: 'pink' },
    dateMatch: { bn: 'তারিখ মিল', en: 'Date Match', color: 'pink' },
  };
  
  return patterns.map(p => labelMap[p]).filter(Boolean);
}

/**
 * Convert English numerals to Bengali
 */
export function toBengaliNumeral(num) {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => bengaliDigits[parseInt(d)]);
}

/**
 * Format price in BDT
 */
export function formatBDT(amount) {
  return `৳${amount.toLocaleString('en-IN')}`;
}
