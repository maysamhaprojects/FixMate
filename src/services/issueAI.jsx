/**
 * =============================================
 *  FixMate – Snap an Issue · AI Service Layer
 * =============================================
 *  FILE:  src/services/issueAI.jsx
 *
 *  🚩 BACKEND SWAP:
 *  כשמחברים בקאנד אמיתי — מחליפים רק את גוף הפונקציה:
 *    export async function analyzeIssue({ text, imageBase64 })
 *
 *  Real backend example:
 *  export async function analyzeIssue({ text, imageBase64 }) {
 *    const res = await fetch("/api/snap/analyze", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify({ text, imageBase64 }),
 *    });
 *    return res.json();
 *  }
 * =============================================
 */

/* ─── Mock database ─── */
const MOCK_RESPONSES = {
  leaky_faucet: {
    en: {
      diagnosis: "Leaky Faucet / Dripping Tap",
      severity: "low",
      canDIY: true,
      description: "A dripping faucet is usually caused by a worn-out washer or O-ring. Good news — this is a common DIY fix!",
      steps: [
        "Turn off the water supply valves under the sink",
        "Remove the faucet handle (usually a screw under the cap)",
        "Pull out the old cartridge or stem",
        "Replace the rubber washer or O-ring",
        "Reassemble in reverse order",
        "Turn water back on and test",
      ],
      tools: ["Adjustable wrench", "Screwdriver", "Replacement washer/O-ring"],
      estimatedTime: "20-30 minutes",
      estimatedCost: "10-30 ILS for parts",
    },
    he: {
      diagnosis: "ברז מטפטף",
      severity: "low",
      canDIY: true,
      description: "ברז מטפטף נגרם בדרך כלל מאטם שחוק. זה תיקון קל שאפשר לעשות לבד!",
      steps: [
        "סגור את ברז הכניסה מתחת לכיור",
        "הסר את ידית הברז (בדרך כלל בורג תחת הכיסוי)",
        "שלוף את הקרטריג הישן",
        "החלף את האטם הגומי (קח את הישן לחנות לצורך התאמה)",
        "הרכב בסדר הפוך",
        "פתח את הברז ובדוק",
      ],
      tools: ["מפתח ברגים", "מברג", "אטם חלופי"],
      estimatedTime: "20-30 דקות",
      estimatedCost: "10-30 שקל לחלקים",
    },
  },

  clogged_drain: {
    en: {
      diagnosis: "Clogged / Slow Drain",
      severity: "low",
      canDIY: true,
      description: "Looks like a clogged drain. Before calling a plumber, try these simple steps that work in most cases.",
      steps: [
        "Remove the drain cover and clear visible debris",
        "Pour boiling water down the drain (carefully!)",
        "Pour half cup baking soda, then half cup vinegar",
        "Wait 30 minutes, then flush with hot water",
        "If still blocked: use a plunger with firm up-down motions",
        "For stubborn clogs: try a drain snake",
      ],
      tools: ["Plunger", "Baking soda + vinegar", "Drain snake (optional)"],
      estimatedTime: "15-45 minutes",
      estimatedCost: "0-40 ILS",
    },
    he: {
      diagnosis: "סתימה בניקוז",
      severity: "low",
      canDIY: true,
      description: "נראה כמו סתימה בניקוז. לפני שקוראים לשרברב, נסה את השלבים הפשוטים האלה.",
      steps: [
        "הסר את מכסה הניקוז ונקה פסולת גלויה",
        "שפוך מים רותחים לניקוז (בזהירות!)",
        "שפוך חצי כוס סודה לשתייה ואז חצי כוס חומץ",
        "המתן 30 דקות ואז שטוף במים חמים",
        "אם עדיין סתום: השתמש במיכל שאיבה",
        "לסתימות עקשניות: נסה נחש ניקוז",
      ],
      tools: ["מיכל שאיבה", "סודה לשתייה + חומץ", "נחש ניקוז (אופציונלי)"],
      estimatedTime: "15-45 דקות",
      estimatedCost: "0-40 שקל",
    },
  },

  broken_socket: {
    en: {
      diagnosis: "Damaged Electrical Socket",
      severity: "high",
      canDIY: false,
      description: "I can see a damaged electrical socket. This involves electrical wiring and can be dangerous.",
      safetyWarning: "Working with electrical wiring without proper training can cause electrocution or fire. Please do not attempt this yourself.",
      category: "electricity",
    },
    he: {
      diagnosis: "שקע חשמל פגום",
      severity: "high",
      canDIY: false,
      description: "שקע חשמל פגום כרוך בחיווט חשמלי ועלול להיות מסוכן מאוד.",
      safetyWarning: "עבודה עם חיווט חשמלי ללא הכשרה מתאימה עלולה לגרום להתחשמלות או שריפה. אל תנסה לתקן זאת בעצמך!",
      category: "electricity",
    },
  },

  wall_crack: {
    en: {
      diagnosis: "Wall Crack / Plaster Damage",
      severity: "medium",
      canDIY: true,
      description: "A crack in the wall or plaster. Small cracks under 5mm are usually cosmetic and easy to fix yourself.",
      steps: [
        "Clean the crack and remove loose plaster with a scraper",
        "Widen slightly to a V-shape for better adhesion",
        "Dampen the area with a spray bottle",
        "Apply filler or spackle with a putty knife, pressing firmly",
        "Let dry completely (usually 2-4 hours)",
        "Sand smooth with fine sandpaper",
        "Prime and paint to match the wall",
      ],
      tools: ["Putty knife", "Spackle or wall filler", "Sandpaper", "Paint"],
      estimatedTime: "1-2 hours plus drying time",
      estimatedCost: "20-50 ILS",
    },
    he: {
      diagnosis: "סדק בקיר",
      severity: "medium",
      canDIY: true,
      description: "סדק בקיר או בטיח. סדקים קטנים מתחת ל-5 מ\"מ הם בדרך כלל קוסמטיים וניתן לתקן בקלות לבד.",
      steps: [
        "נקה את הסדק והסר טיח רופף עם מגרד",
        "הרחב מעט לצורת V להידבקות טובה יותר",
        "לחלח את האזור בבקבוק ספריי",
        "מרח מרק קירות עם סכין טיח",
        "תן להתייבש לגמרי (בדרך כלל 2-4 שעות)",
        "שייף בנייר זכוכית דק",
        "הסד וצבע להתאמה לקיר",
      ],
      tools: ["סכין טיח", "מרק קירות", "נייר זכוכית", "צבע"],
      estimatedTime: "1-2 שעות בתוספת זמן ייבוש",
      estimatedCost: "20-50 שקל",
    },
  },

  running_toilet: {
    en: {
      diagnosis: "Running / Leaking Toilet",
      severity: "low",
      canDIY: true,
      description: "A running toilet usually means the flapper valve needs replacement. This is one of the easiest plumbing fixes!",
      steps: [
        "Remove the toilet tank lid",
        "Check if the flapper (rubber seal at bottom) is worn or warped",
        "Turn off water supply valve behind the toilet",
        "Flush to empty the tank",
        "Unhook the old flapper and replace with a new one (universal fit)",
        "Turn water back on and test",
      ],
      tools: ["Replacement flapper valve", "No other tools needed!"],
      estimatedTime: "10-15 minutes",
      estimatedCost: "15-30 ILS",
    },
    he: {
      diagnosis: "אסלה זורמת",
      severity: "low",
      canDIY: true,
      description: "אסלה זורמת בדרך כלל אומרת שהשסתום צריך החלפה. זה אחד התיקונים הקלים ביותר!",
      steps: [
        "הסר את מכסה מיכל האסלה",
        "בדוק אם השסתום (אטם הגומי בתחתית) שחוק",
        "סגור את ברז הכניסה מאחורי האסלה",
        "הורד הדחה לרוקן את המיכל",
        "נתק את השסתום הישן והחלף בחדש (התאמה אוניברסלית)",
        "פתח את הברז ובדוק",
      ],
      tools: ["שסתום חלופי", "לא נדרשים כלים נוספים!"],
      estimatedTime: "10-15 דקות",
      estimatedCost: "15-30 שקל",
    },
  },

  ac_not_cooling: {
    en: {
      diagnosis: "AC Not Cooling Properly",
      severity: "medium",
      canDIY: true,
      description: "Before calling a technician, there are a few things you can check yourself that solve most AC cooling issues.",
      steps: [
        "Check that the AC is set to COOL mode (not FAN or DRY)",
        "Lower the temperature to at least 3 degrees below room temperature",
        "Clean the air filters: pull out the front filters and wash with water",
        "Check that the outdoor unit is not blocked by debris or plants",
        "Make sure all windows and doors are closed",
        "If still not cooling after cleaning filters it may need a gas refill, call a technician",
      ],
      tools: ["Water and mild soap for filter cleaning"],
      estimatedTime: "15-20 minutes",
      estimatedCost: "0 ILS (free if filters are the issue)",
    },
    he: {
      diagnosis: "מזגן לא מקרר",
      severity: "medium",
      canDIY: true,
      description: "לפני שקוראים לטכנאי, יש כמה דברים שאפשר לבדוק לבד שפותרים רוב הבעיות.",
      steps: [
        "בדוק שהמזגן מוגדר למצב COOL ולא FAN או DRY",
        "הנמך את הטמפרטורה ל-3 מעלות מתחת לטמפרטורת החדר",
        "נקה את הפילטרים: שלוף את הפילטרים הקדמיים ושטוף במים",
        "בדוק שהיחידה החיצונית לא חסומה על ידי פסולת או צמחים",
        "ודא שכל החלונות והדלתות סגורים",
        "אם עדיין לא מקרר לאחר ניקוי הפילטרים ייתכן שצריך טעינת גז, קרא לטכנאי",
      ],
      tools: ["מים וסבון עדין לניקוי פילטר"],
      estimatedTime: "15-20 דקות",
      estimatedCost: "חינם (אם הפילטר הבעיה)",
    },
  },
};

/* ─── Keyword map ─── */
const KEYWORD_MAP = [
  { key: "leaky_faucet",   words: ["faucet", "drip", "tap",      "ברז", "טפטוף", "נוזל"]     },
  { key: "clogged_drain",  words: ["drain", "clog", "block",     "ניקוז", "סתימה", "חסום"]   },
  { key: "broken_socket",  words: ["socket", "electric", "outlet","שקע", "חשמל", "כבל"]      },
  { key: "wall_crack",     words: ["crack", "wall", "plaster",   "סדק", "קיר", "טיח"]        },
  { key: "running_toilet", words: ["toilet", "running", "flush", "אסלה", "שירותים", "שטיפה"] },
  { key: "ac_not_cooling", words: ["ac", "cool", "air",          "מזגן", "קירור", "אוויר"]   },
];

/* ─── Helpers ─── */
function matchByKeywords(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const { key, words } of KEYWORD_MAP) {
    if (words.some(w => lower.includes(w))) return key;
  }
  return null;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ══════════════════════════════════════════
   PUBLIC API — החלף רק את הפונקציה הזו
   כשמחברים בקאנד אמיתי
══════════════════════════════════════════ */
export async function analyzeIssue({ text, imageBase64 }) {
  const response = await fetch('http://localhost:8080/api/snap/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, imageBase64 }),
  });

  const data = await response.json();
  return data;
}

/* ─── Quick-select category list ─── */
export const ISSUE_CATEGORIES = [
  { id: "leaky_faucet",   label: "Leaky Faucet",   labelHe: "ברז מטפטף",    icon: "🚰" },
  { id: "clogged_drain",  label: "Clogged Drain",  labelHe: "סתימה בניקוז", icon: "🔧" },
  { id: "broken_socket",  label: "Broken Socket",  labelHe: "שקע פגום",      icon: "⚡" },
  { id: "wall_crack",     label: "Wall Crack",      labelHe: "סדק בקיר",      icon: "🧱" },
  { id: "running_toilet", label: "Running Toilet", labelHe: "אסלה זורמת",    icon: "🚽" },
  { id: "ac_not_cooling", label: "AC Not Cooling", labelHe: "מזגן לא מקרר", icon: "❄️" },
];