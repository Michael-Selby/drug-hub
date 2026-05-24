const CATEGORIES = [
  'antibiotic', 'analgesic', 'antiviral', 'antifungal', 'antihistamine',
  'antacid', 'cardiovascular', 'diabetes', 'vitamins', 'respiratory',
  'dermatological', 'neurological', 'supplements', 'other',
];

const UNIT_MAP = {
  tablet: 'tablets', tablets: 'tablets',
  capsule: 'capsules', capsules: 'capsules',
  bottle: 'bottles', bottles: 'bottles',
  vial: 'vials', vials: 'vials',
  sachet: 'sachets', sachets: 'sachets',
  piece: 'pcs', pieces: 'pcs', pcs: 'pcs',
  ml: 'ml', milliliter: 'ml', milliliters: 'ml',
  mg: 'mg', milligram: 'mg', milligrams: 'mg',
  g: 'g', gram: 'g', grams: 'g',
};

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december',
];

export const parseSpeech = (rawTranscript) => {
  const text = rawTranscript.toLowerCase().trim();
  const result = {};

  // ── Category ──────────────────────────────────────────────────────────────
  for (const cat of CATEGORIES) {
    if (text.includes(cat)) {
      result.category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }
  if (!result.category && text.includes('vitamin')) result.category = 'Vitamins & Supplements';
  if (!result.category && text.includes('supplement')) result.category = 'Vitamins & Supplements';

  // ── Quantity + Unit ───────────────────────────────────────────────────────
  const qtyMatch = text.match(
    /(\d+)\s*(tablets?|capsules?|bottles?|vials?|sachets?|pieces?|pcs?|ml|g\b|mg|milligrams?|milliliters?|grams?)/i
  );
  if (qtyMatch) {
    result.quantity = parseInt(qtyMatch[1]);
    result.unit = UNIT_MAP[qtyMatch[2].toLowerCase()] || qtyMatch[2].toLowerCase();
  } else {
    const numMatch = text.match(/(\d+)\s*(?:units?|items?)?/);
    if (numMatch) result.quantity = parseInt(numMatch[1]);
  }

  // ── Price ─────────────────────────────────────────────────────────────────
  const pricePatterns = [
    /price\s+(?:is\s+)?(?:\$\s*)?(\d+(?:[.,]\d{1,2})?)/i,
    /(?:costs?\s+)?(?:\$\s*)(\d+(?:[.,]\d{1,2})?)\s*(?:dollars?|usd)?/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:dollars?|usd)/i,
  ];
  for (const pat of pricePatterns) {
    const m = text.match(pat);
    if (m) { result.price = parseFloat(m[1].replace(',', '.')); break; }
  }

  // ── Expiry Date ───────────────────────────────────────────────────────────
  for (let i = 0; i < MONTHS.length; i++) {
    const re = new RegExp(`${MONTHS[i]}\\s+(\\d{4})`, 'i');
    const m = text.match(re);
    if (m) {
      const d = new Date(parseInt(m[1]), i, 1);
      result.expiryDate = d.toISOString().split('T')[0];
      break;
    }
  }
  if (!result.expiryDate) {
    const reShort = /expires?\s+(\d{1,2})[\/\-](\d{4})/i;
    const ms = text.match(reShort);
    if (ms) {
      const d = new Date(parseInt(ms[2]), parseInt(ms[1]) - 1, 1);
      result.expiryDate = d.toISOString().split('T')[0];
    }
  }

  // ── Drug Name ─────────────────────────────────────────────────────────────
  let cleaned = rawTranscript
    .replace(/price\s+(?:is\s+)?\$?[\d.,]+\s*(?:dollars?|usd)?/gi, '')
    .replace(/\$[\d.,]+/gi, '')
    .replace(/[\d.,]+\s*(?:dollars?|usd)/gi, '')
    .replace(/expires?\s+\w+\s*\d{4}/gi, '')
    .replace(/expires?\s+\d{1,2}[\/\-]\d{4}/gi, '')
    .replace(/\d+\s*(tablets?|capsules?|bottles?|vials?|sachets?|pieces?|pcs?|ml|mg|grams?)/gi, '')
    .replace(/category\s+\w+/gi, '')
    .replace(/quantity\s+\d+/gi, '')
    .replace(/\b(add|drug|medicine|medication|the|a|an|is|for|and)\b/gi, '')
    .replace(/[,;.]/g, ' ')
    .trim();

  for (const cat of [...CATEGORIES, 'vitamin', 'supplement']) {
    cleaned = cleaned.replace(new RegExp(`\\b${cat}\\b`, 'gi'), '').trim();
  }

  const nameParts = cleaned.split(/\s+/).filter(Boolean).slice(0, 4).join(' ');
  if (nameParts.length > 1) result.name = nameParts;

  return result;
};
