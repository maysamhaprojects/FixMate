/**
 * ============================================================
 *  FixMate — קטלוג הקטגוריות ומנוע האבחון של מסך ההזמנה
 *  הקטגוריות, מילות המפתח להתאמה, האבחון לפי תמונה/טקסט, ושעות הפגישה.
 *  הועבר מ-BookaPro.jsx ללא שינוי בתוכן.
 * ============================================================
 */

/* סמל לכל קטגוריה */
export const catIcons = { electricity:"\u26a1", plumbing:"\ud83d\udd27", painting:"\ud83c\udfa8", ac:"\u2744\ufe0f", locksmith:"\ud83d\udd11", renovation:"\ud83c\udfd7\ufe0f", carpentry:"\ud83e\ude9a", cleaning:"\ud83e\uddf9" };

/* מילות מפתח להתאמת קטגוריה שנבחרה לתחום ההתמחות של בעל המקצוע (עברית + אנגלית) */
export const CAT_MATCH = {
  electricity: ["electric", "חשמל"],
  plumbing:    ["plumb", "אינסטלצ", "שרברב", "צנרת"],
  painting:    ["paint", "צבע"],
  ac:          ["ac", "hvac", "מזגן", "מיזוג"],
  locksmith:   ["lock", "מנעול"],
  renovation:  ["renov", "שיפוץ"],
  carpentry:   ["carpent", "נגר"],
  cleaning:    ["clean", "ניקיון"],
};
export const CAT_LABEL_KEYS = { electricity:"bp_cat_electricity", plumbing:"bp_cat_plumbing", painting:"bp_cat_painting", ac:"bp_cat_ac", locksmith:"bp_cat_locksmith", renovation:"bp_cat_renovation", carpentry:"bp_cat_carpentry", cleaning:"bp_cat_cleaning" };

/* AI diagnosis simulation - maps keywords in image "analysis" to category+issue */
export const DIAGNOSIS_MAP = [
  { cat: "plumbing", issue: "leak", keywords: ["water","leak","pipe","drip","wet","puddle","flood","damp","moisture"], en: { title: "Water Leak Detected", desc: "I can see signs of a water leak. This appears to be a plumbing issue — specifically a pipe or faucet leak. I recommend booking a plumber to inspect and fix this before it causes further damage." }, he: { title: "\u05d6\u05d5\u05d4\u05d4 \u05e0\u05d6\u05d9\u05dc\u05ea \u05de\u05d9\u05dd", desc: "\u05d0\u05e0\u05d9 \u05de\u05d6\u05d4\u05d4 \u05e1\u05d9\u05de\u05e0\u05d9\u05dd \u05dc\u05e0\u05d6\u05d9\u05dc\u05ea \u05de\u05d9\u05dd. \u05d6\u05d5 \u05e0\u05e8\u05d0\u05d9\u05ea \u05d1\u05e2\u05d9\u05d4 \u05e9\u05dc \u05d0\u05d9\u05e0\u05e1\u05d8\u05dc\u05e6\u05d9\u05d4 \u2014 \u05db\u05e0\u05e8\u05d0\u05d4 \u05e0\u05d6\u05d9\u05dc\u05d4 \u05d1\u05e6\u05e0\u05e8\u05ea \u05d0\u05d5 \u05d1\u05e8\u05d6. \u05de\u05d5\u05de\u05dc\u05e5 \u05dc\u05d4\u05d6\u05de\u05d9\u05df \u05e9\u05e8\u05d1\u05e8\u05d1 \u05dc\u05e4\u05e0\u05d9 \u05e9\u05d4\u05e0\u05d6\u05e7 \u05d9\u05d7\u05de\u05d9\u05e8." } },
  { cat: "plumbing", issue: "clog", keywords: ["clog","drain","blocked","sink","toilet","overflow","backup"], en: { title: "Clogged Drain Detected", desc: "This looks like a clogged drain issue. The blockage could be in the pipes or the drainage system. A professional plumber can clear this quickly." }, he: { title: "\u05e0\u05d9\u05e7\u05d5\u05d6 \u05e1\u05ea\u05d5\u05dd \u05d6\u05d5\u05d4\u05d4", desc: "\u05d6\u05d4 \u05e0\u05e8\u05d0\u05d4 \u05db\u05e0\u05d9\u05e7\u05d5\u05d6 \u05e1\u05ea\u05d5\u05dd. \u05d4\u05d7\u05e1\u05d9\u05de\u05d4 \u05d9\u05db\u05d5\u05dc\u05d4 \u05dc\u05d4\u05d9\u05d5\u05ea \u05d1\u05e6\u05e0\u05e8\u05ea \u05d0\u05d5 \u05d1\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e0\u05d9\u05e7\u05d5\u05d6. \u05e9\u05e8\u05d1\u05e8\u05d1 \u05de\u05e7\u05e6\u05d5\u05e2\u05d9 \u05d9\u05db\u05d5\u05dc \u05dc\u05e4\u05ea\u05d5\u05e8 \u05d0\u05ea \u05d6\u05d4 \u05de\u05d4\u05e8." } },
  { cat: "electricity", issue: "short_circuit", keywords: ["spark","electric","wire","outlet","breaker","fuse","power","blackout","socket","switch"], en: { title: "Electrical Issue Detected", desc: "I can identify signs of an electrical problem — possibly a short circuit or faulty wiring. This requires a licensed electrician for safe repair. Do not attempt to fix this yourself." }, he: { title: "\u05ea\u05e7\u05dc\u05d4 \u05d7\u05e9\u05de\u05dc\u05d9\u05ea \u05d6\u05d5\u05d4\u05ea\u05d4", desc: "\u05d0\u05e0\u05d9 \u05de\u05d6\u05d4\u05d4 \u05e1\u05d9\u05de\u05e0\u05d9\u05dd \u05dc\u05ea\u05e7\u05dc\u05d4 \u05d7\u05e9\u05de\u05dc\u05d9\u05ea \u2014 \u05db\u05e0\u05e8\u05d0\u05d4 \u05e7\u05e6\u05e8 \u05d0\u05d5 \u05ea\u05d9\u05e7\u05d5\u05df \u05d7\u05d9\u05d5\u05d5\u05d8. \u05d6\u05d4 \u05d3\u05d5\u05e8\u05e9 \u05d7\u05e9\u05de\u05dc\u05d0\u05d9 \u05de\u05d5\u05e1\u05de\u05da. \u05d0\u05dc \u05ea\u05e0\u05e1\u05d4 \u05dc\u05ea\u05e7\u05df \u05dc\u05d1\u05d3." } },
  { cat: "ac", issue: "ac_fault", keywords: ["ac","air condition","cold","cool","compressor","vent","filter","hvac","heat","warm"], en: { title: "AC Problem Detected", desc: "This appears to be an air conditioning issue. The unit may need servicing, gas refill, or component replacement. I recommend booking an AC technician." }, he: { title: "\u05ea\u05e7\u05dc\u05d4 \u05d1\u05de\u05d6\u05d2\u05df \u05d6\u05d5\u05d4\u05ea\u05d4", desc: "\u05d6\u05d4 \u05e0\u05e8\u05d0\u05d4 \u05db\u05ea\u05e7\u05dc\u05d4 \u05d1\u05de\u05d6\u05d2\u05df. \u05d9\u05d9\u05ea\u05db\u05df \u05e9\u05d4\u05de\u05db\u05e9\u05d9\u05e8 \u05e6\u05e8\u05d9\u05da \u05d8\u05d9\u05e4\u05d5\u05dc, \u05de\u05d9\u05dc\u05d5\u05d9 \u05d2\u05d6, \u05d0\u05d5 \u05d4\u05d7\u05dc\u05e4\u05ea \u05e8\u05db\u05d9\u05d1. \u05de\u05d5\u05de\u05dc\u05e5 \u05dc\u05d4\u05d6\u05de\u05d9\u05df \u05d8\u05db\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2\u05e0\u05d9\u05dd." } },
  { cat: "painting", issue: "plaster", keywords: ["paint","wall","crack","peel","stain","mold","damp","plaster","ceiling","patch"], en: { title: "Wall/Paint Damage Detected", desc: "I can see wall damage — this could be cracking, peeling paint, or plaster issues. A painter or plasterer can assess the damage and restore the surface." }, he: { title: "\u05e0\u05d6\u05e7 \u05d1\u05e7\u05d9\u05e8 / \u05e6\u05d1\u05e2 \u05d6\u05d5\u05d4\u05d4", desc: "\u05d0\u05e0\u05d9 \u05e8\u05d5\u05d0\u05d4 \u05e0\u05d6\u05e7 \u05d1\u05e7\u05d9\u05e8 \u2014 \u05d9\u05d9\u05ea\u05db\u05df \u05e9\u05d6\u05d4 \u05e1\u05d3\u05e7, \u05e7\u05d9\u05dc\u05d5\u05e3 \u05e6\u05d1\u05e2, \u05d0\u05d5 \u05d1\u05e2\u05d9\u05d4 \u05d1\u05d8\u05d9\u05d7. \u05e6\u05d1\u05e2\u05d9 \u05d0\u05d5 \u05d8\u05d9\u05d9\u05d7 \u05d9\u05db\u05d5\u05dc \u05dc\u05d4\u05e2\u05e8\u05d9\u05da \u05d5\u05dc\u05e9\u05e7\u05dd." } },
  { cat: "locksmith", issue: "lock_replace", keywords: ["lock","door","key","stuck","broken","handle","latch","deadbolt","entry"], en: { title: "Lock/Door Issue Detected", desc: "This looks like a lock or door mechanism problem. A locksmith can repair or replace the lock and ensure your home is secure." }, he: { title: "\u05ea\u05e7\u05dc\u05d4 \u05d1\u05de\u05e0\u05e2\u05d5\u05dc / \u05d3\u05dc\u05ea \u05d6\u05d5\u05d4\u05ea\u05d4", desc: "\u05d6\u05d4 \u05e0\u05e8\u05d0\u05d4 \u05db\u05ea\u05e7\u05dc\u05d4 \u05d1\u05de\u05e0\u05e2\u05d5\u05dc \u05d0\u05d5 \u05d1\u05de\u05e0\u05d2\u05e0\u05d5\u05df \u05d4\u05d3\u05dc\u05ea. \u05de\u05e0\u05e2\u05d5\u05dc\u05df \u05d9\u05db\u05d5\u05dc \u05dc\u05ea\u05e7\u05df \u05d0\u05d5 \u05dc\u05d4\u05d7\u05dc\u05d9\u05e3 \u05d0\u05ea \u05d4\u05de\u05e0\u05e2\u05d5\u05dc." } },
  { cat: "renovation", issue: "tiling", keywords: ["tile","floor","broken tile","grout","ceramic","marble","renovation"], en: { title: "Floor/Tile Damage Detected", desc: "I can see damaged flooring or tiles. This may require tile replacement or grouting work. A renovation professional can handle this repair." }, he: { title: "\u05e0\u05d6\u05e7 \u05d1\u05e8\u05e6\u05e4\u05d4 / \u05d0\u05e8\u05d9\u05d7\u05d9\u05dd \u05d6\u05d5\u05d4\u05d4", desc: "\u05d0\u05e0\u05d9 \u05e8\u05d5\u05d0\u05d4 \u05e0\u05d6\u05e7 \u05d1\u05e8\u05e6\u05e4\u05d4 \u05d0\u05d5 \u05d1\u05d0\u05e8\u05d9\u05d7\u05d9\u05dd. \u05d9\u05d9\u05ea\u05db\u05df \u05e9\u05e6\u05e8\u05d9\u05da \u05d4\u05d7\u05dc\u05e4\u05ea \u05d0\u05e8\u05d9\u05d7\u05d9\u05dd \u05d0\u05d5 \u05ea\u05d9\u05e7\u05d5\u05df \u05e8\u05d5\u05d1\u05d4. \u05d0\u05d9\u05e9 \u05e9\u05d9\u05e4\u05d5\u05e6\u05d9\u05dd \u05d9\u05db\u05d5\u05dc \u05dc\u05d8\u05e4\u05dc \u05d1\u05d6\u05d4." } },
  { cat: "carpentry", issue: "furniture", keywords: ["wood","furniture","cabinet","shelf","drawer","closet","hinge","board"], en: { title: "Furniture/Carpentry Issue Detected", desc: "This appears to be a carpentry or furniture issue. Whether it's a broken cabinet, shelf, or door — a skilled carpenter can fix or build what you need." }, he: { title: "\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e8\u05d4\u05d9\u05d8 / \u05e0\u05d2\u05e8\u05d5\u05ea \u05d6\u05d5\u05d4\u05ea\u05d4", desc: "\u05d6\u05d4 \u05e0\u05e8\u05d0\u05d4 \u05db\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e0\u05d2\u05e8\u05d5\u05ea \u05d0\u05d5 \u05e8\u05d4\u05d9\u05d8. \u05d1\u05d9\u05df \u05d0\u05dd \u05d6\u05d4 \u05d0\u05e8\u05d5\u05df \u05e9\u05d1\u05d5\u05e8, \u05de\u05d3\u05e3, \u05d0\u05d5 \u05d3\u05dc\u05ea \u2014 \u05e0\u05d2\u05e8 \u05de\u05e7\u05e6\u05d5\u05e2\u05d9 \u05d9\u05db\u05d5\u05dc \u05dc\u05ea\u05e7\u05df \u05d0\u05d5 \u05dc\u05d1\u05e0\u05d5\u05ea." } },
];

export function getDiagnosis() {
  const rnd = Math.random();
  if (rnd < 0.25) return DIAGNOSIS_MAP[0]; // leak
  if (rnd < 0.40) return DIAGNOSIS_MAP[2]; // electrical
  if (rnd < 0.55) return DIAGNOSIS_MAP[3]; // ac
  if (rnd < 0.65) return DIAGNOSIS_MAP[1]; // clog
  if (rnd < 0.75) return DIAGNOSIS_MAP[4]; // paint
  if (rnd < 0.85) return DIAGNOSIS_MAP[5]; // lock
  if (rnd < 0.92) return DIAGNOSIS_MAP[6]; // tile
  return DIAGNOSIS_MAP[7]; // carpentry
}

export function getDiagnosisFromText(text) {
  const lower = text.toLowerCase();
  for (const d of DIAGNOSIS_MAP) {
    if (d.keywords.some(k => lower.includes(k))) return d;
  }
  // Hebrew keywords
  const heMap = [
    { idx: 0, words: ["\u05e0\u05d6\u05d9\u05dc\u05d4","\u05de\u05d9\u05dd","\u05d3\u05dc\u05d9\u05e4\u05d4","\u05e8\u05d8\u05d9\u05d1\u05d5\u05ea","\u05e6\u05e0\u05e8\u05ea","\u05d1\u05e8\u05d6"] },
    { idx: 1, words: ["\u05e1\u05ea\u05d9\u05de\u05d4","\u05e1\u05ea\u05d5\u05dd","\u05e0\u05d9\u05e7\u05d5\u05d6","\u05d0\u05e1\u05dc\u05d4","\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9\u05dd"] },
    { idx: 2, words: ["\u05d7\u05e9\u05de\u05dc","\u05e9\u05e7\u05e2","\u05e7\u05e6\u05e8","\u05d7\u05d5\u05d8","\u05de\u05ea\u05d2","\u05e0\u05ea\u05d9\u05da"] },
    { idx: 3, words: ["\u05de\u05d6\u05d2\u05df","\u05e7\u05e8\u05d9\u05e8","\u05d7\u05dd","\u05de\u05e4\u05d5\u05d7\u05d4","\u05de\u05e7\u05e8\u05e8"] },
    { idx: 4, words: ["\u05e6\u05d1\u05e2","\u05e7\u05d9\u05e8","\u05e1\u05d3\u05e7","\u05e7\u05d9\u05dc\u05d5\u05e3","\u05e2\u05d5\u05d1\u05e9","\u05d8\u05d9\u05d7"] },
    { idx: 5, words: ["\u05de\u05e0\u05e2\u05d5\u05dc","\u05d3\u05dc\u05ea","\u05de\u05e4\u05ea\u05d7","\u05ea\u05e7\u05d5\u05e2"] },
    { idx: 6, words: ["\u05e8\u05e6\u05e4\u05d4","\u05d0\u05e8\u05d9\u05d7","\u05e7\u05e8\u05de\u05d9\u05e7\u05d4","\u05e9\u05d9\u05e4\u05d5\u05e5"] },
    { idx: 7, words: ["\u05e2\u05e5","\u05e8\u05d4\u05d9\u05d8","\u05d0\u05e8\u05d5\u05df","\u05de\u05d3\u05e3","\u05de\u05d2\u05d9\u05e8\u05d4"] },
  ];
  for (const h of heMap) {
    if (h.words.some(w => lower.includes(w))) return DIAGNOSIS_MAP[h.idx];
  }
  return null;
}

/* שעות אפשריות לפגישה */
export const TIME_OPTIONS = [
  { value:"08:00", label:"08:00 AM" },{ value:"08:30", label:"08:30 AM" },{ value:"09:00", label:"09:00 AM" },{ value:"09:30", label:"09:30 AM" },{ value:"10:00", label:"10:00 AM" },{ value:"10:30", label:"10:30 AM" },{ value:"11:00", label:"11:00 AM" },{ value:"11:30", label:"11:30 AM" },
  { value:"12:00", label:"12:00 PM" },{ value:"12:30", label:"12:30 PM" },{ value:"13:00", label:"1:00 PM" },{ value:"13:30", label:"1:30 PM" },{ value:"14:00", label:"2:00 PM" },{ value:"14:30", label:"2:30 PM" },{ value:"15:00", label:"3:00 PM" },{ value:"15:30", label:"3:30 PM" },
  { value:"16:00", label:"4:00 PM" },{ value:"16:30", label:"4:30 PM" },{ value:"17:00", label:"5:00 PM" },{ value:"17:30", label:"5:30 PM" },{ value:"18:00", label:"6:00 PM" },{ value:"18:30", label:"6:30 PM" },{ value:"19:00", label:"7:00 PM" },{ value:"19:30", label:"7:30 PM" },{ value:"20:00", label:"8:00 PM" },
];
