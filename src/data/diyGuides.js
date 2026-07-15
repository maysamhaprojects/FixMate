/**
 * ============================================================
 *  FixMate — מאגר מדריכי התיקון העצמי של מסך "צלם תקלה"
 *  לכל תקלה: אבחון, חומרה, האם ניתן לתקן לבד, שלבים, כלים, זמן ועלות.
 *  הועבר מ-SnapAnIssue.jsx ללא שינוי בתוכן.
 * ============================================================
 */

/* Simulated AI responses based on issue category */
export const AI_RESPONSES = {
  leaky_faucet: {
    diagnosis: { en: "Leaky Faucet / Dripping Tap", he: "ברז דולף / טפטוף" },
    severity: "low",
    canDIY: true,
    description: { en: "I can see a dripping faucet. This is usually caused by a worn-out washer or O-ring. Good news — this is a common DIY fix!", he: "אני רואה ברז מטפטף. בדרך כלל זה נגרם מאטם או O-ring בלוי. חדשות טובות — זה תיקון נפוץ שאפשר לעשות לבד!" },
    steps: [
      { en: "Turn off the water supply valves under the sink", he: "סגרו את ברזי אספקת המים מתחת לכיור" },
      { en: "Remove the faucet handle (usually a screw under the cap)", he: "פרקו את ידית הברז (בדרך כלל בורג מתחת למכסה)" },
      { en: "Pull out the old cartridge or stem", he: "שלפו את המחסנית או הגבעול הישן" },
      { en: "Replace the rubber washer or O-ring (take the old one to the hardware store to match size)", he: "החליפו את האטם או ה-O-ring (קחו את הישן לחנות כדי להתאים מידה)" },
      { en: "Reassemble in reverse order", he: "הרכיבו בסדר הפוך" },
      { en: "Turn water back on and test", he: "פתחו את המים ובדקו" },
    ],
    tools: [{ en: "Adjustable wrench", he: "מפתח שוודי" }, { en: "Screwdriver", he: "מברג" }, { en: "Replacement washer/O-ring", he: "אטם/O-ring חלופי" }],
    estimatedTime: { en: "20-30 minutes", he: "20-30 דקות" },
    estimatedCost: { en: "₪10-30 for parts", he: "₪10-30 לחלקים" },
  },
  clogged_drain: {
    diagnosis: { en: "Clogged / Slow Drain", he: "ניקוז סתום / איטי" },
    severity: "low",
    canDIY: true,
    description: { en: "Looks like a clogged drain. Before calling a plumber, try these simple steps that work in most cases.", he: "נראה כמו ניקוז סתום. לפני שקוראים לאינסטלטור, נסו את השלבים הפשוטים האלה שעובדים ברוב המקרים." },
    steps: [
      { en: "Remove the drain cover and clear any visible debris", he: "הסירו את מכסה הניקוז ונקו לכלוך גלוי" },
      { en: "Pour boiling water down the drain (carefully!)", he: "שפכו מים רותחים לניקוז (בזהירות!)" },
      { en: "If still slow: pour ½ cup baking soda, then ½ cup vinegar", he: "אם עדיין איטי: שפכו חצי כוס סודה לשתייה, ואז חצי כוס חומץ" },
      { en: "Wait 30 minutes, then flush with hot water", he: "המתינו 30 דקות, ואז שטפו במים חמים" },
      { en: "If still blocked: use a plunger with firm up-down motions", he: "אם עדיין חסום: השתמשו בפומפה בתנועות תקיפות" },
      { en: "For stubborn clogs: try a drain snake (available at hardware stores)", he: "לסתימות עקשניות: נסו נחש ניקוז (זמין בחנויות)" },
    ],
    tools: [{ en: "Plunger", he: "פומפה" }, { en: "Baking soda + vinegar", he: "סודה לשתייה + חומץ" }, { en: "Drain snake (optional)", he: "נחש ניקוז (אופציונלי)" }],
    estimatedTime: { en: "15-45 minutes", he: "15-45 דקות" },
    estimatedCost: { en: "₪0-40", he: "₪0-40" },
  },
  broken_socket: {
    diagnosis: { en: "Damaged Electrical Socket", he: "שקע חשמל פגום" },
    severity: "high",
    canDIY: false,
    description: { en: "I can see a damaged electrical socket. This involves electrical wiring and can be dangerous. I strongly recommend hiring a licensed electrician for this repair.", he: "אני רואה שקע חשמל פגום. זה כרוך בחיווט חשמלי ויכול להיות מסוכן. מומלץ מאוד להזמין חשמלאי מוסמך לתיקון." },
    safetyWarning: { en: "Working with electrical wiring without proper training can cause electrocution or fire. Please do not attempt this yourself.", he: "עבודה עם חיווט חשמלי ללא הכשרה מתאימה עלולה לגרום להתחשמלות או שריפה. אנא אל תנסו לעשות זאת בעצמכם." },
    category: "electricity",
  },
  wall_crack: {
    diagnosis: { en: "Wall Crack / Plaster Damage", he: "סדק בקיר / נזק לטיח" },
    severity: "medium",
    canDIY: true,
    description: { en: "I can see a crack in the wall/plaster. Small cracks (under 5mm) are usually cosmetic and easy to fix yourself. Larger cracks may indicate structural issues.", he: "אני רואה סדק בקיר או בטיח. סדקים קטנים (מתחת ל-5 מ״מ) בדרך כלל קוסמטיים וקלים לתיקון עצמי. סדקים גדולים עלולים להעיד על בעיה מבנית." },
    steps: [
      { en: "Clean the crack — remove loose plaster with a scraper", he: "נקו את הסדק — הסירו טיח רופף עם מגרד" },
      { en: "Widen the crack slightly to a V-shape for better adhesion", he: "הרחיבו מעט את הסדק לצורת V להדבקה טובה יותר" },
      { en: "Dampen the area with a spray bottle", he: "הרטיבו את האזור עם בקבוק ריסוס" },
      { en: "Apply filler/spackle with a putty knife, pressing firmly into the crack", he: "מרחו שפכטל עם סכין, לוחצים היטב לתוך הסדק" },
      { en: "Let dry completely (check product instructions, usually 2-4 hours)", he: "תנו לייבש לגמרי (לפי הוראות היצרן, בדרך כלל 2-4 שעות)" },
      { en: "Sand smooth with fine sandpaper (120-150 grit)", he: "שייפו לחלק עם נייר לטש דק (120-150)" },
      { en: "Prime and paint to match the wall", he: "צבעו בפריימר ובצבע תואם לקיר" },
    ],
    tools: [{ en: "Putty knife", he: "סכין שפכטל" }, { en: "Spackle/wall filler", he: "שפכטל / חומר מילוי" }, { en: "Sandpaper", he: "נייר לטש" }, { en: "Paint", he: "צבע" }],
    estimatedTime: { en: "1-2 hours (plus drying time)", he: "1-2 שעות (בתוספת זמן ייבוש)" },
    estimatedCost: { en: "₪20-50", he: "₪20-50" },
  },
  running_toilet: {
    diagnosis: { en: "Running / Leaking Toilet", he: "אסלה זורמת / דולפת" },
    severity: "low",
    canDIY: true,
    description: { en: "A running toilet usually means the flapper valve needs replacement. This is one of the easiest plumbing fixes!", he: "אסלה שזורמת בדרך כלל אומרת שצריך להחליף את מנגנון האטם (פלאפר). זה אחד התיקונים הקלים ביותר!" },
    steps: [
      { en: "Remove the toilet tank lid", he: "הסירו את מכסה מיכל ההדחה" },
      { en: "Check if the flapper (rubber seal at bottom) is worn or warped", he: "בדקו אם האטם (הגומי בתחתית) בלוי או מעוות" },
      { en: "Turn off water supply valve behind the toilet", he: "סגרו את ברז המים מאחורי האסלה" },
      { en: "Flush to empty the tank", he: "הדיחו כדי לרוקן את המיכל" },
      { en: "Unhook the old flapper and replace with a new one (universal fit)", he: "נתקו את האטם הישן והחליפו בחדש (מתאים אוניברסלי)" },
      { en: "Turn water back on and test", he: "פתחו את המים ובדקו" },
    ],
    tools: [{ en: "Replacement flapper valve", he: "אטם (פלאפר) חלופי" }, { en: "No tools needed!", he: "לא נדרשים כלים!" }],
    estimatedTime: { en: "10-15 minutes", he: "10-15 דקות" },
    estimatedCost: { en: "₪15-30", he: "₪15-30" },
  },
  ac_not_cooling: {
    diagnosis: { en: "AC Not Cooling Properly", he: "מזגן לא מקרר כמו שצריך" },
    severity: "medium",
    canDIY: true,
    description: { en: "Before calling a technician, there are a few things you can check yourself that solve most AC cooling issues.", he: "לפני שקוראים לטכנאי, יש כמה דברים שתוכלו לבדוק בעצמכם שפותרים את רוב בעיות הקירור." },
    steps: [
      { en: "Check that the AC is set to COOL mode (not FAN or DRY)", he: "ודאו שהמזגן במצב קירור (COOL) ולא מאוורר או ייבוש" },
      { en: "Lower the temperature setting to at least 3°C below room temperature", he: "הנמיכו את הטמפרטורה ל-3°C לפחות מתחת לטמפרטורת החדר" },
      { en: "Clean or replace the air filters — pull out the front filters and wash with water", he: "נקו או החליפו את הפילטרים — שלפו את הפילטרים הקדמיים ושטפו במים" },
      { en: "Check that the outdoor unit is not blocked by debris or plants", he: "ודאו שהיחידה החיצונית לא חסומה מלכלוך או צמחים" },
      { en: "Make sure all windows and doors are closed", he: "ודאו שכל החלונות והדלתות סגורים" },
      { en: "If still not cooling after cleaning filters, it may need a gas refill — call a technician", he: "אם עדיין לא מקרר אחרי ניקוי הפילטרים — ייתכן שצריך מילוי גז, קראו לטכנאי" },
    ],
    tools: [{ en: "Water and mild soap for filter cleaning", he: "מים וסבון עדין לניקוי הפילטרים" }],
    estimatedTime: { en: "15-20 minutes for filter cleaning", he: "15-20 דקות לניקוי פילטרים" },
    estimatedCost: { en: "₪0 (free if filters are the issue)", he: "₪0 (חינם אם הבעיה בפילטרים)" },
  },
};


/* התקלות הנפוצות שמוצגות ככפתורי בחירה מהירה */
export const ISSUE_CATEGORIES = [
  { id: "leaky_faucet", label: "Leaky Faucet", icon: "🚰" },
  { id: "clogged_drain", label: "Clogged Drain", icon: "🔧" },
  { id: "broken_socket", label: "Broken Socket", icon: "⚡" },
  { id: "wall_crack", label: "Wall Crack", icon: "🧱" },
  { id: "running_toilet", label: "Running Toilet", icon: "🚽" },
  { id: "ac_not_cooling", label: "AC Not Cooling", icon: "❄️" },
];

/* ממפה קטגוריה מהשרת (זיהוי עברית/אנגלית) לאבחון עשיר מקומי */
export const CATEGORY_TO_KEY = {
  plumbing: "leaky_faucet",
  electricity: "broken_socket",
  ac: "ac_not_cooling",
  painting: "wall_crack",
};

