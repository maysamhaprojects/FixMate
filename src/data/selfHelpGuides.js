/**
 * ============================================================
 *  FixMate — מדריכי העזרה העצמית
 *  לכל נושא: אייקון, צבע, שלבים וטיפים — בעברית ובאנגלית.
 *  הועבר מ-MindMap.jsx ללא שינוי בתוכן.
 * ============================================================
 */

export const GUIDES_EN = [
  {
    id: "boiler", icon: "💧", title: "Hot Water / Boiler", color: "#F59E0B",
    desc: "No hot water or boiler issues",
    steps: [
      { label: "Check for Hot Water", tips: ["Turn on hot tap — wait 2 minutes", "No hot water at all → go to next step", "Short burst then cold → check the thermostat"] },
      { label: "Check Power Switch", tips: ["Electric boiler → make sure the breaker is ON", "Solar heater → cloudy day? use the electric backup", "Gas boiler → check the pilot light is lit"] },
      { label: "Check Thermostat", tips: ["Set temperature to 50-60°C minimum", "Make sure the timer/clock is set correctly", "Wait 30 minutes after adjusting before testing"] },
      { label: "Check Water Pressure", tips: ["Test water pressure at other taps", "Weak everywhere? The main valve may be partly closed", "Low pressure affects the boiler"] },
      { label: "Look for External Signs", tips: ["Leaks near the boiler → call a plumber", "Banging or whistling noises → pressure/air issue", "Rusty brown water → tank may be corroded"] },
    ],
  },
  {
    id: "ac", icon: "❄️", title: "Air Conditioner", color: "#0891B2",
    desc: "AC won't turn on or won't cool",
    steps: [
      { label: "Won't Turn On", tips: ["Check the power supply — is it plugged in?", "Replace the remote control batteries", "Check the breaker panel for the AC circuit"] },
      { label: "Not Cooling", tips: ["Set the mode to COOL (not FAN or DRY)", "Set the temperature at least 3°C below the room", "Close all windows and doors in the room"] },
      { label: "Clean the Filters", tips: ["Open the front panel and pull out the mesh filters", "Wash with water and mild soap", "Let them dry completely before reinstalling"] },
      { label: "Water Leaks", tips: ["Find and clear the clogged drain pipe", "Ice on the pipes? → likely needs a gas refill", "Check the indoor unit is tilted toward the drain"] },
      { label: "Strange Noises", tips: ["Rattling → check for loose screws or panels", "Musty smell → clean filters and coils", "Grinding/motor noise → needs a technician"] },
    ],
  },
  {
    id: "electrical", icon: "⚡", title: "Electrical / Short Circuit", color: "#DC2626",
    desc: "Power outage or a breaker keeps tripping",
    steps: [
      { label: "Identify the Area", tips: ["Is it the whole house or just one room?", "Find your electrical panel — which breaker tripped?", "Check if the neighbors have power too"] },
      { label: "Reset the Breaker", tips: ["Switch it firmly OFF, then back ON", "Keeps tripping immediately? → call an electrician", "Each breaker usually controls one room"] },
      { label: "Unplug Devices", tips: ["Unplug ALL devices in the affected area", "Plug them back one at a time and wait", "The device that trips it is the faulty one"] },
      { label: "Check the Outlets", tips: ["Burn marks on an outlet? → stop using it", "GFCI outlet (has buttons)? press RESET", "Burning smell? → don't use — call a pro"] },
      { label: "⚠️ Safety First", tips: ["Never touch exposed or damaged wires", "Never touch the panel with wet hands", "When in doubt → call a licensed electrician"] },
    ],
  },
  {
    id: "plumbing", icon: "🚰", title: "Plumbing", color: "#7C3AED",
    desc: "Clogged drain, leak, or dripping faucet",
    steps: [
      { label: "Clogged Drain", tips: ["Pour boiling water slowly down the drain", "Baking soda + vinegar → cover & wait 30 min", "Flush with hot water, then try a plunger", "Still blocked? → use a drain snake (₪20-40)"] },
      { label: "Dripping Faucet", tips: ["Turn off the water valves under the sink", "Remove the handle (screw usually under the cap)", "Replace the washer or O-ring", "Reassemble and turn the water back on"] },
      { label: "Running Toilet", tips: ["Remove the tank lid and flush — watch what happens", "Flapper not sealing? → replace it (₪15-25)", "Water overflows the tube? → lower the float"] },
      { label: "Pipe Leak", tips: ["Small drip at a connection → tighten gently", "Wrap threads with Teflon tape to seal", "Major leak → SHUT the main water valve now!", "Place towels/buckets and call a plumber"] },
    ],
  },
  {
    id: "lock", icon: "🔑", title: "Lock / Door", color: "#475569",
    desc: "Stuck lock, key won't turn, or door won't lock",
    steps: [
      { label: "Key Won't Turn / Enter", tips: ["Try a backup key — yours may be worn", "Add a little lubricant (WD-40 / graphite) to the keyhole", "Don't force it — a key that snaps inside is worse"] },
      { label: "Door Won't Lock", tips: ["Check the bolt slides in and out freely", "Check the lock is aligned with the door frame", "Loose screws in the cylinder? tighten them"] },
      { label: "Locked Out", tips: ["Check for an open window or back door", "Do a neighbor / family member have a spare key?", "Don't break the door — a locksmith is cheaper"] },
      { label: "⚠️ When to Call a Locksmith", tips: ["Key snapped inside the lock", "Cylinder spins freely without locking", "You want to replace or upgrade the lock"] },
    ],
  },
  {
    id: "paint", icon: "🎨", title: "Paint / Walls", color: "#EC4899",
    desc: "Stains, peeling paint, or mold on the wall",
    steps: [
      { label: "Wall Stains", tips: ["Grease stain → warm water + mild dish soap", "Pencil/marker → a melamine 'magic eraser'", "Don't scrub hard — it can remove the paint"] },
      { label: "Peeling Paint", tips: ["Scrape off the peeling paint with a putty knife", "Lightly sand and clean off the dust", "Apply a primer coat before the new paint"] },
      { label: "Mold (black spots)", tips: ["Ventilate — mold comes from moisture", "Clean with water + vinegar or diluted bleach (careful)", "Mold keeps coming back? → a damp problem in the wall"] },
      { label: "Prepping to Paint", tips: ["Fill cracks and holes with filler", "Sand smooth", "Mask frames and sockets with painter's tape"] },
    ],
  },
  {
    id: "carpentry", icon: "🔨", title: "Furniture / Carpentry", color: "#B45309",
    desc: "Squeaky door, loose hinge, or a sticking drawer",
    steps: [
      { label: "Squeaky Hinge", tips: ["Add oil / petroleum jelly to the hinge", "Swing the door back and forth to spread it", "Still squeaks? → remove and clean the hinge pin"] },
      { label: "Loose Hinge / Handle", tips: ["Tighten the screws with a screwdriver", "Screw spins freely? → add a wood toothpick + glue", "Use slightly longer screws if needed"] },
      { label: "Sticking Drawer", tips: ["Empty it and check nothing is stuck behind", "Rub dry soap or a candle on the slide rails", "Check the rails aren't bent or loose"] },
      { label: "Wobbly Furniture", tips: ["Find the short leg — add a pad underneath", "Tighten all the screw joints", "Wood glue in loose joints → clamp and let dry"] },
    ],
  },
  {
    id: "washer", icon: "🧺", title: "Washing Machine", color: "#0EA5E9",
    desc: "Won't drain, leaking, or won't start",
    steps: [
      { label: "Won't Start", tips: ["Make sure the door is fully closed (click)", "Check the power and the breaker", "Make sure the water tap is open"] },
      { label: "Won't Drain / Water Left", tips: ["Check the drain hose isn't kinked or blocked", "Clean the pump filter (bottom of the machine)", "Turn off, wait 10 min, try a spin program"] },
      { label: "Leaking Water", tips: ["Check the inlet/outlet hose connections", "Don't overload the machine", "Damaged door seal? → a common leak source"] },
      { label: "Noisy / Shaking", tips: ["Make sure the machine is level on the floor", "Spread the laundry evenly in the drum", "New machine? make sure transit bolts were removed"] },
    ],
  },
];


export const GUIDES_HE = [
  {
    id: "boiler", icon: "💧", title: "מים חמים / בוילר", color: "#F59E0B",
    desc: "אין מים חמים או תקלות בוילר",
    steps: [
      { label: "בדקו מים חמים", tips: ["פתחו ברז חם — חכו 2 דקות", "אין מים חמים בכלל → עברו לשלב הבא", "התפרצות קצרה ואז קר → בדקו את התרמוסטט"] },
      { label: "בדקו את המפסק", tips: ["בוילר חשמלי → ודאו שהמפסק דלוק", "דוד שמש → יום מעונן? הפעילו גיבוי חשמלי", "בוילר גז → בדקו שהלהבה דולקת"] },
      { label: "בדקו תרמוסטט", tips: ["כוונו טמפרטורה ל-50-60 מעלות לפחות", "ודאו שהטיימר מכוון נכון", "חכו 30 דקות אחרי כיוונון לפני בדיקה"] },
      { label: "בדקו לחץ מים", tips: ["בדקו לחץ מים בברזים אחרים", "חלש בכל מקום? השסתום הראשי אולי סגור חלקית", "לחץ נמוך משפיע על הבוילר"] },
      { label: "חפשו סימנים חיצוניים", tips: ["נזילות ליד הבוילר → הזמינו שרברב", "רעשים או צפירות → בעיית לחץ/אוויר", "מים חומים חלודים → המכל אולי חלוד"] },
    ],
  },
  {
    id: "ac", icon: "❄️", title: "מזגן", color: "#0891B2",
    desc: "המזגן לא נדלק או לא מקרר",
    steps: [
      { label: "לא נדלק", tips: ["בדקו חיבור לחשמל — מחובר לשקע?", "החליפו סוללות בשלט", "בדקו את מפסק החשמל של המזגן"] },
      { label: "לא מקרר", tips: ["כוונו למצב COOL (לא FAN או DRY)", "כוונו טמפרטורה 3 מעלות מתחת לחדר", "סגרו חלונות ודלתות בחדר"] },
      { label: "נקו את הפילטרים", tips: ["פתחו את המכסה והוציאו את הפילטרים", "שטפו במים וסבון עדין", "ייבשו לגמרי לפני החזרה"] },
      { label: "נזילת מים", tips: ["אתרו ונקו את צינור הניקוז הסתום", "קרח על הצינורות? → כנראה צריך מילוי גז", "בדקו שהיחידה מוטה לכיוון הניקוז"] },
      { label: "רעשים מוזרים", tips: ["רעש → בדקו ברגים או פאנלים רופפים", "ריח עובש → נקו פילטרים וסלילים", "רעש מנוע → צריך טכנאי"] },
    ],
  },
  {
    id: "electrical", icon: "⚡", title: "חשמל / קצר", color: "#DC2626",
    desc: "הפסקת חשמל או מפסק שנופל שוב ושוב",
    steps: [
      { label: "אתרו את האזור", tips: ["כל הבית או רק חדר אחד?", "מצאו את לוח החשמל — איזה מפסק נפל?", "בדקו אם גם לשכנים אין חשמל"] },
      { label: "אפסו את המפסק", tips: ["כבו לגמרי ואז הדליקו מחדש", "נופל שוב מיד? → הזמינו חשמלאי", "כל מפסק שולט בדרך כלל על חדר אחד"] },
      { label: "נתקו מכשירים", tips: ["נתקו את כל המכשירים באזור", "חברו חזרה אחד-אחד וחכו", "המכשיר שגורם לנפילה הוא התקול"] },
      { label: "בדקו את השקעים", tips: ["סימני שריפה על שקע? → הפסיקו שימוש", "שקע עם כפתורים? לחצו RESET", "ריח שריפה? → אל תשתמשו — הזמינו מקצוען"] },
      { label: "⚠️ בטיחות קודם", tips: ["לעולם אל תיגעו בחוטים חשופים", "לעולם אל תיגעו בלוח עם ידיים רטובות", "בספק? → הזמינו חשמלאי מוסמך"] },
    ],
  },
  {
    id: "plumbing", icon: "🚰", title: "אינסטלציה", color: "#7C3AED",
    desc: "ניקוז סתום, נזילה או ברז מטפטף",
    steps: [
      { label: "ניקוז סתום", tips: ["שפכו מים רותחים לאט לניקוז", "סודה לשתייה + חומץ → כסו וחכו 30 דקות", "שטפו במים חמים, נסו פומפה", "עדיין סתום? → השתמשו בספירלה (₪20-40)"] },
      { label: "ברז מטפטף", tips: ["סגרו את ברזי אספקת המים מתחת לכיור", "הסירו את הידית (בורג מתחת לכיסוי)", "החליפו את האטם או ה-O-ring", "הרכיבו ופתחו את המים לבדיקה"] },
      { label: "אסלה דולפת", tips: ["הסירו את המכסה והורידו מים — צפו מה קורה", "השסתום לא אוטם? → החליפו (₪15-25)", "מים עולים מהצינור? → הורידו את המצוף"] },
      { label: "נזילת צינור", tips: ["טפטוף בחיבור → הדקו בעדינות עם מפתח", "עטפו את החוטים בטפלון לאיטום", "נזילה גדולה → סגרו את הברז הראשי מיד!", "שימו מגבות ודליים והזמינו שרברב"] },
    ],
  },
  {
    id: "lock", icon: "🔑", title: "מנעול / דלת", color: "#475569",
    desc: "מנעול תקוע, מפתח לא מסתובב או דלת שלא ננעלת",
    steps: [
      { label: "המפתח לא מסתובב / נכנס", tips: ["נסו מפתח גיבוי — אולי המפתח שלכם שחוק", "טפטפו מעט חומר סיכה (WD-40 / גרפיט) לחור המנעול", "אל תפעילו כוח — מפתח שנשבר בפנים רק מסבך"] },
      { label: "הדלת לא ננעלת", tips: ["בדקו שהבריח יוצא ונכנס בחופשיות", "בדקו שהמנעול מיושר מול המשקוף", "ברגים רופפים בצילינדר? הדקו אותם"] },
      { label: "ננעלתם בחוץ", tips: ["בדקו אם יש חלון או דלת אחורית פתוחים", "יש עותק מפתח אצל שכן / בן משפחה?", "אל תשברו את הדלת — מנעולן זול יותר"] },
      { label: "⚠️ מתי להזמין מנעולן", tips: ["מפתח נשבר בתוך המנעול", "הצילינדר מסתובב חופשי בלי לנעול", "רוצים להחליף או לשדרג מנעול"] },
    ],
  },
  {
    id: "paint", icon: "🎨", title: "צביעה / קירות", color: "#EC4899",
    desc: "כתמים, צבע מתקלף או עובש על הקיר",
    steps: [
      { label: "כתמים על הקיר", tips: ["כתם שומן → מים חמימים + סבון כלים עדין", "כתם עיפרון / טוש → מחק קסם (מלמין)", "אל תשפשפו חזק — עלול להוריד את הצבע"] },
      { label: "צבע מתקלף", tips: ["גרדו את הצבע המתקלף עם מרית", "שייפו קלות ונקו את האבק", "מרחו שכבת יסוד (פריימר) לפני צבע חדש"] },
      { label: "עובש (כתמים שחורים)", tips: ["אווררו — עובש נובע מלחות", "נקו עם מים + חומץ או אקונומיקה מדוללת (בזהירות)", "העובש חוזר? → יש בעיית רטיבות בקיר"] },
      { label: "הכנה לצביעה", tips: ["מלאו סדקים וחורים במרק", "שייפו והחליקו את השטח", "הדביקו נייר דבק על מסגרות ושקעים"] },
    ],
  },
  {
    id: "carpentry", icon: "🔨", title: "רהיטים / נגרות", color: "#B45309",
    desc: "דלת חורקת, ציר רופף או מגירה שנתקעת",
    steps: [
      { label: "ציר חורק", tips: ["טפטפו שמן / וזלין על הציר", "הזיזו את הדלת קדימה-אחורה לפיזור", "עדיין חורק? → פרקו את פין הציר ונקו"] },
      { label: "ציר / ידית רופפים", tips: ["הדקו את הברגים עם מברג", "בורג מסתובב סרק? → הכניסו קיסם עץ + דבק", "החליפו לברגים ארוכים יותר אם צריך"] },
      { label: "מגירה נתקעת", tips: ["רוקנו ובדקו שאין חפץ שנתקע מאחור", "שפשפו סבון יבש או נר על מסילות ההחלקה", "בדקו שהמסילות לא עקומות או רופפות"] },
      { label: "רהיט מתנדנד", tips: ["מצאו את הרגל הקצרה — הוסיפו פד מתחת", "הדקו את כל חיבורי הברגים", "דבק עץ בחיבורים רופפים → הידקו והמתינו לייבוש"] },
    ],
  },
  {
    id: "washer", icon: "🧺", title: "מכונת כביסה", color: "#0EA5E9",
    desc: "לא מתנקזת, דולפת או לא מתחילה",
    steps: [
      { label: "לא מתחילה", tips: ["ודאו שהדלת סגורה היטב (קליק)", "בדקו חיבור לחשמל ואת המפסק", "ודאו שברז המים פתוח"] },
      { label: "לא מתנקזת / נשארים מים", tips: ["בדקו שצינור הניקוז לא מקופל או חסום", "נקו את פילטר המשאבה (בתחתית המכונה)", "כבו, המתינו 10 דקות ונסו תוכנית סחיטה"] },
      { label: "דולפת מים", tips: ["בדקו את חיבורי צינור הכניסה/יציאה", "אל תעמיסו יתר על המידה", "אטם דלת פגום? → מקור נפוץ לנזילה"] },
      { label: "רועשת / רועדת", tips: ["ודאו שהמכונה מאוזנת על הרצפה", "פזרו את הכביסה שווה בתוף", "מכונה חדשה? ודאו שהוסרו בורגי ההובלה"] },
    ],
  },
];

/* תמונות כותרת (אמיתיות) + תקצירים לכל נושא */
export const COVER = {
  boiler:     { img: "https://loremflickr.com/460/280/water,heater" },
  ac:         { img: "https://loremflickr.com/460/280/air,conditioner" },
  electrical: { img: "https://loremflickr.com/460/280/electrician,wiring" },
  plumbing:   { img: "https://loremflickr.com/460/280/plumber,pipe" },
  lock:       { img: "https://loremflickr.com/460/280/door,lock" },
  paint:      { img: "https://loremflickr.com/460/280/wall,paint" },
  carpentry:  { img: "https://loremflickr.com/460/280/furniture,wood" },
  washer:     { img: "https://loremflickr.com/460/280/washing,machine" },
};
export const EXCERPT = {
  he: {
    boiler: "אין מים חמים בבית? לפני שמזמינים בעל מקצוע — כמה בדיקות פשוטות שאפשר לעשות לבד ולחסוך כסף.",
    ac: "המזגן לא מקרר או לא נדלק? עקבו אחר המדריך — ברוב המקרים מדובר בפילטר סתום או הגדרה פשוטה.",
    electrical: "נפל לכם החשמל או המפסק קופץ שוב ושוב? כך תאתרו את הבעיה בבטחה, צעד אחר צעד.",
    plumbing: "ניקוז סתום, ברז מטפטף או נזילה? מדריך פרקטי לפתרונות ביתיים לפני שמזמינים שרברב.",
    lock: "המנעול תקוע, המפתח לא מסתובב או ננעלתם בחוץ? כמה טריקים פשוטים לפני שקוראים למנעולן.",
    paint: "כתמים, קילופים או עובש על הקיר? כך תנקו ותכינו את הקיר לצביעה — בעצמכם.",
    carpentry: "דלת חורקת, ציר רופף או מגירה תקועה? תיקונים קטנים לבית שכל אחד יכול לעשות.",
    washer: "מכונת הכביסה לא מתחילה, דולפת או לא מתנקזת? בדיקות פשוטות שיחסכו קריאת טכנאי.",
  },
  en: {
    boiler: "No hot water at home? Before booking a pro — a few simple checks you can do yourself and save money.",
    ac: "AC not cooling or won't turn on? Follow the guide — usually it's a clogged filter or a simple setting.",
    electrical: "Lost power or a breaker keeps tripping? Here's how to safely find the problem, step by step.",
    plumbing: "Clogged drain, dripping faucet or a leak? A practical guide to home fixes before calling a plumber.",
    lock: "Stuck lock, key won't turn or locked out? A few simple tricks before you call a locksmith.",
    paint: "Stains, peeling or mold on the wall? How to clean and prep the wall for painting — yourself.",
    carpentry: "Squeaky door, loose hinge or a stuck drawer? Small home fixes anyone can do.",
    washer: "Washing machine won't start, leaks or won't drain? Simple checks that save a technician visit.",
  },
};
