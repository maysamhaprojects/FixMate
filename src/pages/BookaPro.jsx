import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang, LangToggle } from "../context/LanguageContext";

const IconBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const IconForward = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const IconStar = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const IconLocation = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconCalendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconClockLg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconCamera = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

const catIcons = { electricity:"⚡", plumbing:"🔧", painting:"🎨", ac:"❄️", locksmith:"🔑", renovation:"🏗️", carpentry:"🪚", cleaning:"🧹" };

const CAT_IDS = ["electricity","plumbing","painting","ac","locksmith","renovation","carpentry","cleaning"];
const CAT_LABEL_KEYS = { electricity:"bp_cat_electricity", plumbing:"bp_cat_plumbing", painting:"bp_cat_painting", ac:"bp_cat_ac", locksmith:"bp_cat_locksmith", renovation:"bp_cat_renovation", carpentry:"bp_cat_carpentry", cleaning:"bp_cat_cleaning" };

const ISSUE_IDS = {
  electricity: ["short_circuit","panel_replace","sockets","lighting","install_points","general_elec"],
  plumbing: ["clog","leak","faucet","boiler","pipes","general_plumb"],
  painting: ["full_apt","single_room","plaster","exterior"],
  ac: ["ac_fault","ac_clean","ac_install","ac_gas"],
  locksmith: ["door_open","lock_replace","lock_install","keys"],
  renovation: ["gypsum","tiling","cladding","demolition"],
  carpentry: ["furniture","closet","door_fix","custom"],
  cleaning: ["deep_clean","post_reno","windows","carpet"],
};

const DIAGNOSIS_MAP = [
  { cat: "plumbing", issue: "leak", keywords: ["water","leak","pipe","drip","wet","puddle","flood","damp","moisture"],
    en: { title: "Water Leak Detected", desc: "I can see signs of a water leak. This appears to be a plumbing issue — specifically a pipe or faucet leak. I recommend booking a plumber to inspect and fix this before it causes further damage." },
    he: { title: "זוהתה נזילת מים", desc: "אני מזהה סימנים לנזילת מים. זו נראית בעיה של אינסטלציה — כנראה נזילה בצנרת או ברז. מומלץ להזמין שרברב לפני שהנזק יחמיר." } },
  { cat: "plumbing", issue: "clog", keywords: ["clog","drain","blocked","sink","toilet","overflow","backup"],
    en: { title: "Clogged Drain Detected", desc: "This looks like a clogged drain issue. The blockage could be in the pipes or the drainage system. A professional plumber can clear this quickly." },
    he: { title: "ניקוז סתום זוהה", desc: "זה נראה כניקוז סתום. החסימה יכולה להיות בצנרת או במערכת הניקוז. שרברב מקצועי יכול לפתור את זה מהר." } },
  { cat: "electricity", issue: "short_circuit", keywords: ["spark","electric","wire","outlet","breaker","fuse","power","blackout","socket","switch"],
    en: { title: "Electrical Issue Detected", desc: "I can identify signs of an electrical problem — possibly a short circuit or faulty wiring. This requires a licensed electrician for safe repair. Do not attempt to fix this yourself." },
    he: { title: "תקלה חשמלית זוהתה", desc: "אני מזהה סימנים לתקלה חשמלית — כנראה קצר או תיקון חיווט. זה דורש חשמלאי מוסמך. אל תנסה לתקן לבד." } },
  { cat: "ac", issue: "ac_fault", keywords: ["ac","air condition","cold","cool","compressor","vent","filter","hvac","heat","warm"],
    en: { title: "AC Problem Detected", desc: "This appears to be an air conditioning issue. The unit may need servicing, gas refill, or component replacement. I recommend booking an AC technician." },
    he: { title: "תקלה במזגן זוהתה", desc: "זה נראה כתקלה במזגן. ייתכן שהמכשיר צריך טיפול, מילוי גז, או החלפת רכיב. מומלץ להזמין טכנאי מזגנים." } },
  { cat: "painting", issue: "plaster", keywords: ["paint","wall","crack","peel","stain","mold","damp","plaster","ceiling","patch"],
    en: { title: "Wall/Paint Damage Detected", desc: "I can see wall damage — this could be cracking, peeling paint, or plaster issues. A painter or plasterer can assess the damage and restore the surface." },
    he: { title: "נזק בקיר / צבע זוהה", desc: "אני רואה נזק בקיר — ייתכן שזה סדק, קילוף צבע, או בעיה בטיח. צבעי או טייח יכול להעריך ולשקם." } },
  { cat: "locksmith", issue: "lock_replace", keywords: ["lock","door","key","stuck","broken","handle","latch","deadbolt","entry"],
    en: { title: "Lock/Door Issue Detected", desc: "This looks like a lock or door mechanism problem. A locksmith can repair or replace the lock and ensure your home is secure." },
    he: { title: "תקלה במנעול / דלת זוהתה", desc: "זה נראה כתקלה במנעול או במנגנון הדלת. מנעולן יכול לתקן או להחליף את המנעול." } },
  { cat: "renovation", issue: "tiling", keywords: ["tile","floor","broken tile","grout","ceramic","marble","renovation"],
    en: { title: "Floor/Tile Damage Detected", desc: "I can see damaged flooring or tiles. This may require tile replacement or grouting work. A renovation professional can handle this repair." },
    he: { title: "נזק ברצפה / אריחים זוהה", desc: "אני רואה נזק ברצפה או באריחים. ייתכן שצריך החלפת אריחים או תיקון רובה. איש שיפוצים יכול לטפל בזה." } },
  { cat: "carpentry", issue: "furniture", keywords: ["wood","furniture","cabinet","shelf","drawer","closet","hinge","board"],
    en: { title: "Furniture/Carpentry Issue Detected", desc: "This appears to be a carpentry or furniture issue. Whether it's a broken cabinet, shelf, or door — a skilled carpenter can fix or build what you need." },
    he: { title: "תקלה ברהיט / נגרות זוהתה", desc: "זה נראה כתקלה בנגרות או רהיט. בין אם זה ארון שבור, מדף, או דלת — נגר מקצועי יכול לתקן או לבנות." } },
];

const DEFAULT_DIAG = { cat: "plumbing", issue: "general_plumb",
  en: { title: "Issue Identified", desc: "Based on my analysis, this appears to be a home maintenance issue. I recommend booking a professional to inspect and provide a proper assessment." },
  he: { title: "תקלה זוהתה", desc: "על סמך הניתוח שלי, זו נראית תקלה בתחזוקת הבית. מומלץ להזמין בעל מקצוע לבדיקה והערכה." } };

function getDiagnosis() {
  const rnd = Math.random();
  if (rnd < 0.25) return DIAGNOSIS_MAP[0];
  if (rnd < 0.40) return DIAGNOSIS_MAP[2];
  if (rnd < 0.55) return DIAGNOSIS_MAP[3];
  if (rnd < 0.65) return DIAGNOSIS_MAP[1];
  if (rnd < 0.75) return DIAGNOSIS_MAP[4];
  if (rnd < 0.85) return DIAGNOSIS_MAP[5];
  if (rnd < 0.92) return DIAGNOSIS_MAP[6];
  return DIAGNOSIS_MAP[7];
}

function getDiagnosisFromText(text) {
  const lower = text.toLowerCase();
  for (const d of DIAGNOSIS_MAP) {
    if (d.keywords.some(k => lower.includes(k))) return d;
  }
  const heMap = [
    { idx: 0, words: ["נזילה","מים","דליפה","רטיבות","צנרת","ברז"] },
    { idx: 1, words: ["סתימה","סתום","ניקוז","אסלה","שירותים"] },
    { idx: 2, words: ["חשמל","שקע","קצר","חוט","מתג","נתיך"] },
    { idx: 3, words: ["מזגן","קריר","חם","מפוחה","מקרר"] },
    { idx: 4, words: ["צבע","קיר","סדק","קילוף","עובש","טיח"] },
    { idx: 5, words: ["מנעול","דלת","מפתח","תקוע"] },
    { idx: 6, words: ["רצפה","אריח","קרמיקה","שיפוץ"] },
    { idx: 7, words: ["עץ","רהיט","ארון","מדף","מגירה"] },
  ];
  for (const h of heMap) {
    if (h.words.some(w => lower.includes(w))) return DIAGNOSIS_MAP[h.idx];
  }
  return null;
}

const ALL_CITIES = ["Acre (Akko)","Afula","Arad","Ariel","Ashdod","Ashkelon","Bat Yam","Beer Sheva","Beit She'an","Beit Shemesh","Bnei Brak","Caesarea","Carmiel","Daliyat al-Karmel","Dimona","Eilat","El'ad","Even Yehuda","Gan Yavne","Gedera","Givatayim","Hadera","Haifa","Herzliya","Hod HaSharon","Holon","Jerusalem","Karmiel","Kfar Saba","Kiryat Ata","Kiryat Bialik","Kiryat Gat","Kiryat Motzkin","Kiryat Ono","Kiryat Shmona","Kiryat Yam","Lod","Ma'ale Adumim","Ma'alot-Tarshiha","Migdal HaEmek","Modi'in","Modi'in Illit","Nahariya","Nazareth","Nazareth Illit (Nof HaGalil)","Nesher","Ness Ziona","Netanya","Netivot","Ofakim","Or Akiva","Or Yehuda","Petah Tikva","Ra'anana","Rahat","Ramat Gan","Ramat HaSharon","Ramla","Rehovot","Rishon LeZion","Rosh HaAyin","Safed (Tzfat)","Sakhnin","Sderot","Shoham","Tamra","Tel Aviv","Tiberias","Tirat Carmel","Tira","Umm al-Fahm","Yavne","Yehud-Monosson","Yokneam","Zichron Ya'akov"];

const TIME_OPTIONS = [
  { value:"08:00", label:"08:00 AM" },{ value:"08:30", label:"08:30 AM" },{ value:"09:00", label:"09:00 AM" },{ value:"09:30", label:"09:30 AM" },{ value:"10:00", label:"10:00 AM" },{ value:"10:30", label:"10:30 AM" },{ value:"11:00", label:"11:00 AM" },{ value:"11:30", label:"11:30 AM" },
  { value:"12:00", label:"12:00 PM" },{ value:"12:30", label:"12:30 PM" },{ value:"13:00", label:"1:00 PM" },{ value:"13:30", label:"1:30 PM" },{ value:"14:00", label:"2:00 PM" },{ value:"14:30", label:"2:30 PM" },{ value:"15:00", label:"3:00 PM" },{ value:"15:30", label:"3:30 PM" },
  { value:"16:00", label:"4:00 PM" },{ value:"16:30", label:"4:30 PM" },{ value:"17:00", label:"5:00 PM" },{ value:"17:30", label:"5:30 PM" },{ value:"18:00", label:"6:00 PM" },{ value:"18:30", label:"6:30 PM" },{ value:"19:00", label:"7:00 PM" },{ value:"19:30", label:"7:30 PM" },{ value:"20:00", label:"8:00 PM" },
];

const fN = ["Yossi","Avi","Mohammad","Daniel","Shimon","Omar","Ron","Alex","Nir","Fadi","Amit","Boris","Tal","Sami","Yigal","Maria","Nadia","Eran","Kobi","Ran","Dov","Faris","Meir","Victor","Ilan"];
const lN = ["Cohen","Levy","Hassan","Barak","Dahan","Said","Mizrachi","Petrov","Avraham","Nasser","Shalom","Kozlov","Regev","Halabi","Tzur","Ivanova","Kamal","Shapira","Azulay","Dror","Stern","Daher","Peretz","Rosen","Mor"];
const fN_he = ["יוסי","אבי","מוחמד","דניאל","שמעון","עומר","רון","אלכס","ניר","פאדי","עמית","בוריס","טל","סמי","יגאל","מריה","נאדיה","ערן","קובי","רן","דב","פארס","מאיר","ויקטור","אילן"];
const lN_he = ["כהן","לוי","חסן","ברק","דהן","סעיד","מזרחי","פטרוב","אברהם","נאסר","שלום","קוזלוב","רגב","חלבי","צור","איבנובה","כמאל","שפירא","אזולאי","דרור","שטרן","דאהר","פרץ","רוזן","מור"];

function genPros(city, catId) {
  var curLang = "en"; try { curLang = localStorage.getItem("fixmate_lang") || "en"; } catch(e) {}
  var first = curLang === "he" ? fN_he : fN;
  var last  = curLang === "he" ? lN_he : lN;
  const s = (city + catId).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: (s % 4) + 1 }, (_, i) => {
    const fi = (s + i * 7) % first.length, li = (s + i * 13) % last.length;
    return { id: s * 100 + i, name: first[fi] + " " + last[li], rating: (4.4 + (((s + i) % 6) * 0.1)).toFixed(1), reviews: 30 + ((s + i * 17) % 250), city, price: `${100 + ((s + i) % 15) * 20}-${200 + ((s + i) % 15) * 30}`, avatar: first[fi][0] + last[li][0], expYears: 3 + ((s + i) % 18), available: "confirmed" };
  });
}

const fld = (ok) => ({ width: "100%", padding: "13px 16px", borderRadius: 14, border: ok ? "2px solid #2563EB" : "2px solid #EEF1F8", background: "#F8FAFF", fontSize: 15, color: ok ? "#1A2B4A" : "#94A3B8", fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "all 0.25s", appearance: "none", WebkitAppearance: "none", cursor: "pointer", boxSizing: "border-box" });

export default function BookaPro() {
  const navigate = useNavigate();
  const { t, dir, lang } = useLang();
  const isRTL = dir === "rtl";
  const isHe  = lang === "he";

  const [step, setStep] = useState(1);
  const [cat,  setCat ] = useState(null);
  const [issue,setIssue] = useState(null);

  const [msgs,         setMsgs        ] = useState([]);
  const [chatInput,    setChatInput   ] = useState("");
  const [analyzing,    setAnalyzing   ] = useState(false);
  const [diagnosis,    setDiagnosis   ] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef    = useRef(null);
  const chatEndRef = useRef(null);

  const [cityQ,   setCityQ  ] = useState("");
  const [city,    setCity   ] = useState(null);
  const [dd,      setDd     ] = useState(false);
  const [date,    setDate   ] = useState("");
  const [time,    setTime   ] = useState("");
  const [results, setResults] = useState(false);
  const [modal,   setModal  ] = useState(null);
  const [ok,      setOk     ] = useState(false);
  const [desc,    setDesc   ] = useState("");
  const iRef = useRef(null);
  const dRef = useRef(null);

  const filtered = cityQ ? ALL_CITIES.filter(c => c.toLowerCase().includes(cityQ.toLowerCase())) : ALL_CITIES;
  const ready = city && date && time;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, analyzing]);

  useEffect(() => {
    const h = (e) => { if (dRef.current && !dRef.current.contains(e.target) && iRef.current && !iRef.current.contains(e.target)) setDd(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const greeting = isHe
      ? "שלום! 👋 אני העוזר החכם של FixMate. צלם את התקלה או תאר אותה — ואני אזהה את סוג הבעיה ואמצא לך בעל מקצוע."
      : "Hi there! 👋 I'm FixMate's smart assistant. Snap a photo of the issue or describe it — and I'll identify the problem and find you the right professional.";
    setMsgs([{ role: "bot", text: greeting }]);
  }, [isHe]);

  const catLabel  = cat   ? t(CAT_LABEL_KEYS[cat]) : "";
  const issueLabel= issue ? t(`bp_iss_${issue}`)   : "";
  const timeLabel = TIME_OPTIONS.find(ti => ti.value === time)?.label || "";
  const pros = city && cat ? genPros(city, cat) : [];
  const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString(isHe ? "he-IL" : "en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

  const goBack = () => {
    if (step === 2 && results) setResults(false);
    else if (step === 2) setStep(1);
    else navigate("/client/dashboard");
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setImagePreview(url);
      setMsgs(prev => [...prev, { role: "user", image: url }]);
      runAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSend = () => {
    const txt = chatInput.trim();
    if (!txt) return;
    setMsgs(prev => [...prev, { role: "user", text: txt }]);
    setChatInput("");
    const textDiag = getDiagnosisFromText(txt);
    runAnalysis(textDiag, txt);
  };

  /* ✅ תיקון: currentIsHe נשמר לפני setTimeout */
  const runAnalysis = (textDiag, inputText) => {
    setAnalyzing(true);
    // זיהוי שפה: לפי הטקסט שהוקלד, או לפי שפת האפליקציה
    const textHasHebrew = inputText ? /[א-ת]/.test(inputText) : false;
    const currentIsHe = textHasHebrew || lang === "he";
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const diag = textDiag || getDiagnosis();
      setDiagnosis(diag);
      setCat(diag.cat);
      setIssue(diag.issue);
      const langData = currentIsHe ? diag.he : diag.en;
      const botMsg = `**${langData.title}** ${catIcons[diag.cat]}\n\n${langData.desc}`;
      setMsgs(prev => [...prev, { role: "bot", text: botMsg }]);
      setAnalyzing(false);
    }, delay);
  };

  const confirmDiagnosis = () => { setStep(2); setCity(null); setCityQ(""); setDate(""); setTime(""); setResults(false); };

  const BackIcon = isRTL ? IconForward : IconBack;

  const renderBotText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i} style={{ color: "#2563EB" }}>{p.slice(2, -2)}</strong>
        : p.includes("\n\n") ? <span key={i}>{p.split("\n\n").map((s, j) => <span key={j}>{j > 0 && <><br /><br /></>}{s}</span>)}</span> : p
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", minHeight: "100vh", direction: dir, textAlign: isRTL ? "right" : "left" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes checkPop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .hc:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(37,99,235,.1);border-color:#93B4F5!important}
        .hp:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.08)}
        .hb:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-1px)}
        .hdd:hover{background:#EEF2FF!important}
        *{box-sizing:border-box;margin:0}
        input::placeholder,textarea::placeholder{color:#94A3B8}
        select:focus,input:focus{border-color:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,.08)}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 12px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          <button onClick={goBack} style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F4FF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer" }}><BackIcon /></button>
          <span style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A" }}>{t("bp_title")}</span>
          <LangToggle />
        </div>
      </nav>

      {/* STEPPER */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, background: step >= s || (s === 3 && results) ? "#2563EB" : "#E2E8F0", color: step >= s || (s === 3 && results) ? "#FFF" : "#94A3B8", transition: "all .4s cubic-bezier(.4,0,.2,1)", boxShadow: (step === s || (s === 3 && results && step === 2)) ? "0 0 0 4px rgba(37,99,235,.15)" : "none" }}>
                {(step > s || (s <= 2 && results)) ? <IconCheck /> : s === 1 ? "📷" : s === 2 ? "📍" : "👷"}
              </div>
              {i < 2 && <div style={{ width: 80, height: 3, background: step > s || (s === 1 && step >= 2) || (s === 2 && results) ? "#2563EB" : "#E2E8F0", transition: "all .4s", borderRadius: 2, margin: "0 8px" }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 88, marginTop: 10 }}>
          {[isHe ? "צלם תקלה" : "Snap Issue", isHe ? "מיקום וזמן" : "When & Where", isHe ? "בחר מקצוען" : "Choose Pro"].map((l, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: step >= i + 1 ? 600 : 400, color: step >= i + 1 ? "#2563EB" : "#94A3B8", textAlign: "center", width: 80 }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 40px" }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", boxShadow: "0 4px 24px rgba(0,0,0,.03)", animation: "fadeUp .4s", overflow: "hidden", display: "flex", flexDirection: "column", height: "min(65vh, 540px)" }}>
            {/* Chat header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8ECF4", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18 }}>🤖</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", fontFamily: isHe ? "'Heebo'" : "'Outfit'" }}>{isHe ? "עוזר חכם" : "Smart Assistant"}</div>
                <div style={{ fontSize: 12, color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
                  {isHe ? "מוכן לניתוח" : "Ready to analyze"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s" }}>
                  <div style={{ maxWidth: "80%", padding: m.image ? "6px" : "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#F0F4FF", color: m.role === "user" ? "#FFF" : "#1A2B4A", fontSize: 14, lineHeight: 1.6, fontFamily: isHe ? "'Heebo','DM Sans'" : "'DM Sans'" }}>
                    {m.image ? <img src={m.image} alt="Issue" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 14, display: "block" }} /> : renderBotText(m.text)}
                  </div>
                </div>
              ))}

              {analyzing && (
                <div style={{ display: "flex", justifyContent: "flex-start", animation: "fadeUp .3s" }}>
                  <div style={{ padding: "14px 22px", borderRadius: "18px 18px 18px 4px", background: "#F0F4FF", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 1, 2].map(d => (
                      <span key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                    ))}
                    <span style={{ fontSize: 13, color: "#7C8DB5", marginInlineStart: 8 }}>{isHe ? "מנתח..." : "Analyzing..."}</span>
                  </div>
                </div>
              )}

              {diagnosis && !analyzing && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8, animation: "fadeUp .4s" }}>
                  <button className="hb" onClick={confirmDiagnosis} style={{ padding: "14px 36px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#059669,#10B981)", color: "#FFF", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: isHe ? "'Heebo'" : "'Outfit'", boxShadow: "0 6px 24px rgba(5,150,105,.3)", display: "flex", alignItems: "center", gap: 8, transition: "all .3s" }}>
                    <IconCheck />
                    {isHe ? `אשר! תמצא לי ${t(CAT_LABEL_KEYS[diagnosis.cat])}` : `Got it! Find me a ${t(CAT_LABEL_KEYS[diagnosis.cat])}`}
                  </button>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #E8ECF4", background: "#FAFBFE" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <button onClick={() => fileRef.current?.click()} style={{ width: 42, height: 42, borderRadius: 12, border: "2px solid #E2E8F0", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2563EB", flexShrink: 0 }}>
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#FFF", borderRadius: 14, border: "2px solid #EEF1F8", padding: "10px 14px" }}>
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleTextSend()} placeholder={isHe ? "תאר את התקלה או צלם..." : "Describe the issue or snap a photo..."} disabled={analyzing} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontFamily: isHe ? "'Heebo','DM Sans'" : "'DM Sans'", color: "#1A2B4A", direction: dir, textAlign: isRTL ? "right" : "left" }} />
                </div>
                <button onClick={handleTextSend} disabled={!chatInput.trim() || analyzing} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: chatInput.trim() && !analyzing ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: chatInput.trim() && !analyzing ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", cursor: chatInput.trim() && !analyzing ? "pointer" : "not-allowed", flexShrink: 0 }}>
                  <IconSend />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ animation: "fadeUp .4s" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#EEF2FF", color: "#3B5BDB", fontSize: 13, fontWeight: 600 }}>{catIcons[cat]} {catLabel}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#EEF2FF", color: "#3B5BDB", fontSize: 13, fontWeight: 600 }}>🔧 {issueLabel}</span>
              {city && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#F0FDF4", color: "#059669", fontSize: 13, fontWeight: 600 }}>📍 {city}</span>}
              {date && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#FFF7ED", color: "#C2410C", fontSize: 13, fontWeight: 600 }}>📅 {fmtDate(date)}</span>}
              {time && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#F5F3FF", color: "#7C3AED", fontSize: 13, fontWeight: 600 }}>🕐 {timeLabel}</span>}
            </div>

            {results === false && (
              <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", padding: "28px 24px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
                <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{t("bp_when_where")}</h2>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginBottom: 28 }}>{t("bp_when_where_sub")}</p>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}><IconPin /></span>{t("bp_location")}
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFF", borderRadius: 14, border: dd ? "2px solid #2563EB" : "2px solid #EEF1F8", padding: "13px 16px", transition: "all .25s" }}>
                      <span style={{ color: dd ? "#2563EB" : "#94A3B8", flexShrink: 0, display: "flex" }}><IconSearch /></span>
                      <input ref={iRef} type="text" placeholder={t("bp_search_city")} value={cityQ} onChange={e => { setCityQ(e.target.value); setDd(true); if (city) setCity(null); }} onFocus={() => setDd(true)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: "'DM Sans'", color: "#1A2B4A", direction: "ltr", textAlign: isRTL ? "right" : "left" }} />
                      {cityQ && <button onClick={() => { setCity(null); setCityQ(""); iRef.current?.focus(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 2 }}><IconX /></button>}
                    </div>
                    {dd && (
                      <div ref={dRef} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#FFF", borderRadius: 16, border: "1px solid #E8ECF4", boxShadow: "0 12px 40px rgba(0,0,0,.10)", maxHeight: 220, overflowY: "auto", zIndex: 50, animation: "fadeUp .2s" }}>
                        {filtered.length > 0 ? filtered.map(c => {
                          const mi = c.toLowerCase().indexOf(cityQ.toLowerCase());
                          return (
                            <div key={c} className="hdd" onClick={() => { setCity(c); setCityQ(c); setDd(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", cursor: "pointer", borderBottom: "1px solid #F5F7FA", background: city === c ? "#EEF2FF" : "transparent" }}>
                              <span style={{ color: "#2563EB", flexShrink: 0, display: "flex" }}><IconPin /></span>
                              <span style={{ fontSize: 14, color: "#1A2B4A" }}>{cityQ && mi >= 0 ? <>{c.slice(0, mi)}<strong style={{ color: "#2563EB" }}>{c.slice(mi, mi + cityQ.length)}</strong>{c.slice(mi + cityQ.length)}</> : c}</span>
                            </div>
                          );
                        }) : <div style={{ padding: "20px 18px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>{t("bp_no_cities")}</div>}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2410C" }}><IconCalendar /></span>{t("bp_date")}
                    </label>
                    <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} style={fld(!!date)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED" }}><IconClockLg /></span>{t("bp_time")}
                    </label>
                    <select value={time} onChange={e => setTime(e.target.value)} style={{ ...fld(!!time), backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: isRTL ? "left 16px center" : "right 16px center", [isRTL ? "paddingLeft" : "paddingRight"]: 40 }}>
                      <option value="" disabled>{t("bp_select_time")}</option>
                      <optgroup label={t("bp_morning")}>{TIME_OPTIONS.filter(ti => parseInt(ti.value) < 12).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}</optgroup>
                      <optgroup label={t("bp_afternoon")}>{TIME_OPTIONS.filter(ti => parseInt(ti.value) >= 12 && parseInt(ti.value) < 16).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}</optgroup>
                      <optgroup label={t("bp_evening")}>{TIME_OPTIONS.filter(ti => parseInt(ti.value) >= 16).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}</optgroup>
                    </select>
                  </div>
                </div>

                <button className="hb" disabled={!ready} onClick={() => setResults(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: ready ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: ready ? "#FFF" : "#94A3B8", fontSize: 17, fontWeight: 700, fontFamily: "'Outfit'", cursor: ready ? "pointer" : "not-allowed", boxShadow: ready ? "0 8px 30px rgba(37,99,235,.3)" : "none", transition: "all .3s" }}>
                  {t("bp_search_btn")}
                </button>
              </div>
            )}

            {results === true && city && (
              <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,.03)", animation: "fadeUp .4s" }}>
                <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{t("bp_available_in")} {city} 🏆</h2>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginBottom: 20 }}>{t("bp_found")} <strong style={{ color: "#2563EB" }}>{pros.length}</strong> {pros.length > 1 ? t("bp_professionals") : t("bp_professional")} {t("bp_for")} <strong>{fmtDate(date)}</strong> {t("bp_at")} <strong>{timeLabel}</strong></p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
                  {pros.map(p => (
                    <div key={p.id} className="hp" style={{ background: "#FFF", borderRadius: 18, border: "1px solid #EEF1F8", padding: "22px 20px", transition: "all .3s", cursor: "pointer" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{p.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A2B4A" }}>{p.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}><IconStar /><span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{p.rating}</span><span style={{ fontSize: 12, color: "#94A3B8" }}>({p.reviews} {t("bp_reviews")})</span></div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: "#7C8DB5", display: "flex", alignItems: "center", gap: 5 }}><IconLocation />{p.city}<span style={{ margin: "0 6px", color: "#D1D5DB" }}>|</span><IconClock />{p.expYears} {t("bp_yrs_exp")}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>₪{p.price}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#059669", background: "#ECFDF5", padding: "4px 10px", borderRadius: 20 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />📅 {fmtDate(date)}</span>
                        </div>
                      </div>
                      <button className="hb" onClick={() => setModal(p)} style={{ width: "100%", padding: "11px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>{t("bp_book_now")}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .25s" }}>
          <div onClick={() => setModal(null)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(6px)" }} />
          <div style={{ background: "#FFF", borderRadius: 24, width: "100%", maxWidth: 480, padding: "32px 28px", boxShadow: "0 24px 80px rgba(0,0,0,.18)", animation: "slideUp .35s cubic-bezier(.4,0,.2,1)", maxHeight: "85vh", overflowY: "auto", position: "relative", zIndex: 1001, direction: dir, textAlign: isRTL ? "right" : "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A" }}>{t("bp_confirm_title")}</h3>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginTop: 4 }}>{modal.name} — {catLabel}</p>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}><IconX /></button>
            </div>
            <div style={{ background: "#F8FAFF", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
              {[{ icon: <IconPin />, color: "#2563EB", text: city }, { icon: <IconCalendar />, color: "#C2410C", text: fmtDate(date) }, { icon: <IconClockLg />, color: "#7C3AED", text: timeLabel }, { icon: <span style={{ fontSize: 16 }}>{catIcons[cat]}</span>, color: null, text: `${catLabel} — ${issueLabel}` }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, padding: "6px 0" }}>
                  <span style={{ color: r.color, display: "flex" }}>{r.icon}</span>
                  <span style={{ color: "#4A5568" }}><strong>{r.text}</strong></span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 6, display: "block" }}>{t("bp_notes")}</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t("bp_notes_placeholder")} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#1A2B4A", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontFamily: "inherit", direction: dir }} />
            </div>
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>{t("bp_cancel_policy")}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✅</span>
                  <span style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.5 }}>{isHe ? <>ביטול <strong style={{ color: "#059669" }}>{t("bp_cancel_free")}</strong> {t("bp_cancel_before")} — <strong style={{ color: "#059669" }}>{t("bp_cancel_free_label")}</strong></> : <>Cancel <strong style={{ color: "#059669" }}>{t("bp_cancel_free")}</strong> {t("bp_cancel_before")} — <strong style={{ color: "#059669" }}>{t("bp_cancel_free_label")}</strong></>}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>💰</span>
                  <span style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.5 }}>{isHe ? <>ביטול <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid")}</strong> {t("bp_cancel_before")} — <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid_label")}</strong></> : <>Cancel <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid")}</strong> {t("bp_cancel_before")} — <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid_label")}</strong></>}</span>
                </div>
              </div>
            </div>
            <button onClick={() => { setModal(null); setOk(true); setTimeout(() => { setOk(false); navigate("/client/dashboard"); }, 3000); }} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit'", boxShadow: "0 6px 24px rgba(37,99,235,.3)", display: "block" }}>{t("bp_confirm_btn")}</button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {ok && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20, animation: "fadeIn .25s" }}>
          <div style={{ background: "#FFF", borderRadius: 24, padding: "48px 36px", textAlign: "center", maxWidth: 400, width: "100%", animation: "slideUp .35s cubic-bezier(.4,0,.2,1)", boxShadow: "0 24px 80px rgba(0,0,0,.18)", direction: dir }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "checkPop .5s" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, color: "#1A2B4A", marginBottom: 8 }}>{t("bp_success")}</h3>
            <p style={{ fontSize: 15, color: "#7C8DB5", lineHeight: 1.6 }}>{t("bp_success_sub")}<br />{t("bp_redirect")}</p>
          </div>
        </div>
      )}
    </div>
  );
}