/* ═══════════════════════════════════════════════
   FixMate - דף הנחיתה (Landing Page)
   הדף הציבורי הראשי - מסביר על הפלטפורמה ומזמין להירשם
   ROUTE: /
   ═══════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";              // useState=זיכרון | useEffect=הרצה | useRef=הפניה
import { useNavigate } from "react-router-dom";                    // הוק לניווט
import "../styles/global.css";                                      // קובץ עיצוב כללי
import { useLang, LangToggle } from "../context/LanguageContext";   // כלי שפה + מתג החלפה

/* ═══════════════════════════════════════════════
   ציור ה-Hero - איור גדול של "איש המקצוע" ברקע ה-Hero
   SVG עם המון פרטים: עיגולים רקע, גוף, פנים, כלי עבודה
   ═══════════════════════════════════════════════ */
const HandymanIllustration = function() {
  return (
    <svg viewBox="0 0 500 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-illustration">
      <circle cx="250" cy="260" r="200" fill="url(#glowGrad)" opacity="0.3"/>
      <circle cx="250" cy="260" r="150" fill="url(#glowGrad)" opacity="0.15"/>
      <path d="M80 280L160 210L240 280" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
      <rect x="95" y="280" width="130" height="90" rx="4" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="1.5" opacity="0.25"/>
      <rect x="130" y="310" width="30" height="40" rx="2" fill="#3B82F6" opacity="0.15"/>
      <rect x="175" y="300" width="20" height="20" rx="2" fill="#3B82F6" opacity="0.12"/>
      <g transform="translate(70, 160)" opacity="0.5">
        <circle cx="25" cy="25" r="15" stroke="#60A5FA" strokeWidth="2" fill="none"/>
        <circle cx="25" cy="25" r="6" fill="#60A5FA" opacity="0.3"/>
        <rect x="22" y="2" width="6" height="10" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="22" y="38" width="6" height="10" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="2" y="22" width="10" height="6" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="38" y="22" width="10" height="6" rx="3" fill="#60A5FA" opacity="0.5"/>
      </g>
      <g transform="translate(380, 130) scale(0.7)" opacity="0.4">
        <circle cx="25" cy="25" r="15" stroke="#60A5FA" strokeWidth="2" fill="none"/>
        <circle cx="25" cy="25" r="6" fill="#60A5FA" opacity="0.3"/>
        <rect x="22" y="2" width="6" height="10" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="22" y="38" width="6" height="10" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="2" y="22" width="10" height="6" rx="3" fill="#60A5FA" opacity="0.5"/>
        <rect x="38" y="22" width="10" height="6" rx="3" fill="#60A5FA" opacity="0.5"/>
      </g>
      <path d="M410 200L395 230H410L390 265" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <path d="M55 320C55 320 40 345 40 355C40 363 47 370 55 370C63 370 70 363 70 355C70 345 55 320 55 320Z" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1.5" opacity="0.25"/>
      <rect x="225" y="380" width="22" height="70" rx="8" fill="#1B4B7A"/>
      <rect x="255" y="380" width="22" height="70" rx="8" fill="#16405F"/>
      <ellipse cx="236" cy="452" rx="18" ry="8" fill="#0F2D44"/>
      <ellipse cx="266" cy="452" rx="18" ry="8" fill="#0F2D44"/>
      <path d="M218 280C218 270 228 255 250 255C272 255 282 270 282 280V390H218V280Z" fill="#2563EB"/>
      <path d="M235 260L250 275L265 260" stroke="#1D4ED8" strokeWidth="2" fill="none"/>
      <rect x="218" y="355" width="64" height="10" rx="2" fill="#1E3A5F"/>
      <rect x="244" y="353" width="12" height="14" rx="3" fill="#FBBF24" opacity="0.8"/>
      <rect x="225" y="310" width="20" height="22" rx="3" stroke="#1D4ED8" strokeWidth="1.5" fill="none"/>
      <rect x="257" y="310" width="20" height="22" rx="3" stroke="#1D4ED8" strokeWidth="1.5" fill="none"/>
      <rect x="258" y="275" width="16" height="16" rx="4" fill="#FBBF24" opacity="0.7"/>
      <text x="262" y="287" fill="#1E3A5F" fontSize="8" fontWeight="800" fontFamily="sans-serif">FM</text>
      <path d="M218 275C205 285 190 310 185 335" stroke="#2563EB" strokeWidth="22" strokeLinecap="round"/>
      <circle cx="183" cy="340" r="12" fill="#F4A460"/>
      <g transform="translate(155, 290) rotate(-20)">
        <rect x="12" y="20" width="8" height="70" rx="4" fill="#94A3B8"/>
        <path d="M6 10C6 4 10 0 16 0C22 0 26 4 26 10C26 18 22 22 16 22C10 22 6 18 6 10Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5"/>
        <circle cx="16" cy="10" r="4" fill="#64748B"/>
      </g>
      <path d="M282 275C295 285 310 300 320 310" stroke="#2563EB" strokeWidth="22" strokeLinecap="round"/>
      <circle cx="324" cy="314" r="12" fill="#F4A460"/>
      <rect x="320" y="290" width="9" height="22" rx="4.5" fill="#F4A460"/>
      <circle cx="250" cy="230" r="32" fill="#F4A460"/>
      <path d="M215 225C215 205 232 190 250 190C268 190 285 205 285 225H215Z" fill="#FBBF24"/>
      <rect x="210" y="222" width="80" height="8" rx="4" fill="#F59E0B"/>
      <rect x="230" y="194" width="40" height="4" rx="2" fill="#FCD34D" opacity="0.5"/>
      <circle cx="240" cy="235" r="3" fill="#1E3A5F"/>
      <circle cx="260" cy="235" r="3" fill="#1E3A5F"/>
      <path d="M240 248C244 253 256 253 260 248" stroke="#C47A3F" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <g transform="translate(330, 390)">
        <rect x="0" y="15" width="70" height="45" rx="6" fill="#EF4444" opacity="0.85"/>
        <rect x="0" y="15" width="70" height="45" rx="6" stroke="#DC2626" strokeWidth="1.5" fill="none"/>
        <rect x="20" y="8" width="30" height="12" rx="3" fill="#DC2626"/>
        <rect x="30" y="2" width="10" height="10" rx="5" stroke="#B91C1C" strokeWidth="2" fill="none"/>
        <rect x="28" y="32" width="14" height="6" rx="2" fill="#FBBF24" opacity="0.8"/>
        <rect x="10" y="5" width="4" height="16" rx="2" fill="#94A3B8" opacity="0.7"/>
        <rect x="56" y="7" width="4" height="14" rx="2" fill="#94A3B8" opacity="0.7" transform="rotate(10, 58, 14)"/>
      </g>
      <circle cx="120" cy="200" r="3" fill="#60A5FA" opacity="0.4"/>
      <circle cx="370" cy="180" r="2.5" fill="#60A5FA" opacity="0.5"/>
      <circle cx="90" cy="350" r="2" fill="#FBBF24" opacity="0.4"/>
      <circle cx="420" cy="320" r="3" fill="#3B82F6" opacity="0.3"/>
      <circle cx="340" cy="170" r="2" fill="#FBBF24" opacity="0.5"/>
      <circle cx="160" cy="400" r="2.5" fill="#60A5FA" opacity="0.3"/>
      <g transform="translate(310, 165)" opacity="0.35">
        <path d="M8 20C12 16 20 16 24 20" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M3 15C10 8 22 8 29 15" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M-2 10C8 0 24 0 34 10" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="16" cy="24" r="3" fill="#60A5FA"/>
      </g>
      <g transform="translate(340, 260)" opacity="0.35">
        <rect x="0" y="0" width="28" height="45" rx="5" stroke="#60A5FA" strokeWidth="1.8" fill="#0F172A" fillOpacity="0.5"/>
        <circle cx="14" cy="38" r="3" stroke="#60A5FA" strokeWidth="1.2" fill="none"/>
        <rect x="4" y="8" width="20" height="20" rx="2" fill="#3B82F6" opacity="0.2"/>
        <path d="M10 16L13 19L20 12" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </g>
      <defs>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
};

/* ─── אייקונים (SVG) ─── */
var IconWrenchLogo = function() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>; };                                                                                                                                                                                                       // מפתח ברגים - לוגו
var IconCheck = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; };                                                                                                                                                                                                                                                                     // וי כחול - לבדג'ים
var IconArrowRight = function() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>; };                                                                                                                                                                                                                 // חץ ימינה - לכפתורי CTA
var IconCamera = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>; };                                                                                                                                                                    // מצלמה - לכפתור "צלם תקלה"
var IconShield = function() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>; };                                                                                                                                                                                                                                                // מגן - למקצוענים מאומתים
var IconClock = function() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; };                                                                                                                                                                                                                                 // שעון - להזמנה בזמן אמת
var IconMapPin = function() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>; };                                                                                                                                                                                                              // סיכת מיקום - להתאמה לפי מיקום
var IconMenu = function() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>; };                                                                                                                                                                                    // המבורגר - לתפריט נייד
var IconX = function() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; };                                                                                                                                                                                                                               // X - לסגירת תפריט נייד

/* ═══════════════════════════════════════════════
   הוק מותאם לאנימציית גלילה - מחזיר האם האלמנט נראה על המסך
   משמש להפעלת אנימציות כשגוללים אל האלמנט
   ═══════════════════════════════════════════════ */
function useInView() {
  var ref = useRef(null);                                    // הפניה לאלמנט
  var _s = useState(false);                                   // האם האלמנט נראה?
  var isInView = _s[0];
  var setIsInView = _s[1];
  useEffect(function() {
    // IntersectionObserver = API מובנה שמזהה האם אלמנט נמצא בתוך ה-viewport
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {                        // אם האלמנט ראה
        setIsInView(true);                                     // מסמן שהוא בתוך ה-view
        obs.unobserve(entries[0].target);                      // מפסיק להקשיב (זה קורה רק פעם אחת)
      }
    }, { threshold: 0.15 });                                   // מופעל כשמוצגים 15% מהאלמנט
    if (ref.current) obs.observe(ref.current);                 // מתחיל להקשיב לאלמנט
    return function() { obs.disconnect(); };                   // ניקוי
  }, []);
  return [ref, isInView];                                      // מחזיר ref + מצב
}

/* ─── קומפוננטת עטיפה שמפעילה אנימציה כשהיא נראית בגלילה ─── */
function AnimatedSection(props) {
  var result = useInView();                                    // קורא את ההוק
  var ref = result[0];
  var isInView = result[1];
  var delay = props.delay || 0;                                // עיכוב אופציונלי (בשניות)
  var className = props.className || "";
  return (
    // כשהאלמנט בגלילה - מוסיף את המחלקה "land-anim--vis" שמפעילה את האנימציה
    <div ref={ref} className={"land-anim " + (isInView ? "land-anim--vis" : "") + " " + className} style={{ transitionDelay: delay + "s" }}>
      {props.children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   הקומפוננטה הראשית - דף הנחיתה
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
  var navigate = useNavigate();                 // כלי ניווט
  var langCtx = useLang();                       // קונטקסט של שפה
  var t = langCtx.t;                              // פונקציית תרגום
  var lang = langCtx.lang;                        // השפה ("he"/"en")
  var dir = langCtx.dir;                          // כיוון ("rtl"/"ltr")
  var isHe = lang === "he";                       // האם עברית?

  /* ─── משתנה מצב: האם התפריט הנייד פתוח? ─── */
  var _menu = useState(false);
  var menuOpen = _menu[0];
  var setMenuOpen = _menu[1];

  /* ─── משתנה מצב: האם הדף גלל מעל 50 פיקסלים? (להחלפת סגנון Navbar) ─── */
  var _scroll = useState(false);
  var scrolled = _scroll[0];
  var setScrolled = _scroll[1];

  /* ─── מאזין לגלילה של הדף ─── */
  useEffect(function() {
    var h = function() { setScrolled(window.scrollY > 50); };   // מסמן true אם גללנו מעל 50px
    window.addEventListener("scroll", h);                        // מוסיף מאזין
    return function() { window.removeEventListener("scroll", h); };  // ניקוי
  }, []);

  /* ─── 4 שלבי תהליך השימוש באפליקציה ─── */
  var steps = [
    { num: "1", title: isHe ? "\u05e6\u05dc\u05de\u05d5 \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4" : "Snap the Problem", desc: isHe ? "\u05e6\u05dc\u05de\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4 \u05e9\u05dc \u05d4\u05ea\u05e7\u05dc\u05d4 \u05d5\u05d4\u05e2\u05dc\u05d5 \u05d0\u05d5\u05ea\u05d4. \u05d4-AI \u05e9\u05dc\u05e0\u05d5 \u05de\u05d6\u05d4\u05d4 \u05d0\u05d9\u05d6\u05d4 \u05e9\u05d9\u05e8\u05d5\u05ea \u05d0\u05ea\u05dd \u05e6\u05e8\u05d9\u05db\u05d9\u05dd." : "Take a photo of the issue and upload it. Our AI identifies what kind of service you need.", emoji: "\ud83d\udcf8", color: "rgba(59,130,246,0.1)" },   // שלב 1 - צלמו
    { num: "2", title: isHe ? "\u05d4\u05d1\u05d5\u05d8 \u05d4\u05d7\u05db\u05dd \u05de\u05e0\u05ea\u05d7" : "Smart Bot Analyzes", desc: isHe ? "\u05d4\u05e6\u05d0\u05d8\u05d1\u05d5\u05d8 \u05e9\u05dc\u05e0\u05d5 \u05d1\u05d5\u05d3\u05e7 \u05d0\u05ea \u05d4\u05ea\u05de\u05d5\u05e0\u05d4, \u05de\u05e6\u05d9\u05e2 \u05ea\u05d9\u05e7\u05d5\u05df \u05de\u05d4\u05d9\u05e8 \u05d0\u05d5 \u05de\u05de\u05dc\u05d9\u05e5 \u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2\u05df \u05de\u05ea\u05d0\u05d9\u05dd." : "Our chatbot reviews your photo, suggests a quick fix or recommends the right professional.", emoji: "\ud83e\udd16", color: "rgba(251,191,36,0.1)" },   // שלב 2 - ה-AI מנתח
    { num: "3", title: isHe ? "\u05d1\u05d7\u05e8\u05d5 \u05de\u05e7\u05e6\u05d5\u05e2\u05df" : "Pick a Professional", desc: isHe ? "\u05d3\u05e4\u05d3\u05e4\u05d5 \u05d1\u05d9\u05df \u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05de\u05d0\u05d5\u05de\u05ea\u05d9\u05dd \u05e2\u05dd \u05d3\u05d9\u05e8\u05d5\u05d2\u05d9\u05dd, \u05de\u05d7\u05d9\u05e8\u05d9\u05dd \u05d5\u05d6\u05de\u05d9\u05e0\u05d5\u05ea." : "Browse nearby verified pros with ratings, prices, and available time slots.", emoji: "\ud83d\udc77", color: "rgba(96,165,250,0.1)" },                                  // שלב 3 - בחרו מקצוען
    { num: "4", title: isHe ? "\u05d3\u05e8\u05d2\u05d5 \u05d5\u05d7\u05d5\u05d5" : "Rate & Review", desc: isHe ? "\u05d0\u05d7\u05e8\u05d9 \u05e9\u05d4\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d4\u05d5\u05e9\u05dc\u05de\u05d4, \u05d3\u05e8\u05d2\u05d5 \u05d0\u05ea \u05d4\u05d7\u05d5\u05d5\u05d9\u05d4 \u05d5\u05e2\u05d6\u05e8\u05d5 \u05dc\u05d0\u05d7\u05e8\u05d9\u05dd \u05dc\u05de\u05e6\u05d5\u05d0 \u05d0\u05ea \u05d4\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05d4\u05d8\u05d5\u05d1\u05d9\u05dd." : "After the job is done, rate your experience and help others find the best pros.", emoji: "\u2b50", color: "rgba(251,191,36,0.1)" },   // שלב 4 - דרגו
  ];

  /* ─── 4 תכונות עיקריות של הפלטפורמה (לסקשן "למה פיקסמייט") ─── */
  var features = [
    { icon: <IconShield />, title: isHe ? "\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05de\u05d0\u05d5\u05de\u05ea\u05d9\u05dd" : "Verified Professionals", desc: isHe ? "\u05db\u05dc \u05de\u05e7\u05e6\u05d5\u05e2\u05df \u05e2\u05d5\u05d1\u05e8 \u05d1\u05d3\u05d9\u05e7\u05ea \u05e8\u05e7\u05e2 \u05d5\u05de\u05d3\u05d5\u05e8\u05d2 \u05e2\u05dc \u05d9\u05d3\u05d9 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05d0\u05de\u05d9\u05ea\u05d9\u05d9\u05dd" : "Every pro is background-checked and rated by real customers" },
    { icon: <IconClock />, title: isHe ? "\u05d4\u05d6\u05de\u05e0\u05d4 \u05d1\u05d6\u05de\u05df \u05d0\u05de\u05ea" : "Real-Time Booking", desc: isHe ? "\u05e8\u05d0\u05d5 \u05d6\u05de\u05d9\u05e0\u05d5\u05ea \u05d7\u05d9\u05d4 \u05d5\u05d4\u05d6\u05de\u05d9\u05e0\u05d5 \u05de\u05d9\u05d3 \u2014 \u05d1\u05dc\u05d9 \u05e9\u05d9\u05d7\u05d5\u05ea \u05d8\u05dc\u05e4\u05d5\u05df" : "See live availability and book instantly \u2014 no phone calls" },
    { icon: <IconMapPin />, title: isHe ? "\u05d4\u05ea\u05d0\u05de\u05d4 \u05dc\u05e4\u05d9 \u05de\u05d9\u05e7\u05d5\u05dd" : "Location-Based Matching", desc: isHe ? "\u05de\u05e6\u05d0\u05d5 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05d0\u05ea \u05d4\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05d4\u05e7\u05e8\u05d5\u05d1\u05d9\u05dd \u05d0\u05dc\u05d9\u05db\u05dd" : "Automatically find the closest available pros near you" },
    { icon: <IconCamera />, title: isHe ? "\u05d0\u05d1\u05d7\u05d5\u05df \u05de\u05d1\u05d5\u05e1\u05e1 AI" : "AI-Powered Diagnosis", desc: isHe ? "\u05e6\u05dc\u05de\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4 \u05d5\u05e7\u05d1\u05dc\u05d5 \u05d6\u05d9\u05d4\u05d5\u05d9 \u05de\u05d9\u05d9\u05d3\u05d9 \u05d5\u05d4\u05e2\u05e8\u05db\u05ea \u05e2\u05dc\u05d5\u05ea" : "Snap a photo and get instant issue identification and cost estimate" },
  ];

  /* ─── 4 כרטיסים לסקשן "לבעלי מקצוע" (למה כדאי להצטרף) ─── */
  var proCards = [
    { emoji: "\ud83d\udcc5", title: isHe ? "\u05ea\u05d6\u05de\u05d5\u05df \u05d7\u05db\u05dd" : "Smart Scheduling", desc: isHe ? "\u05e0\u05d4\u05dc\u05d5 \u05d0\u05ea \u05d4\u05d6\u05de\u05d9\u05e0\u05d5\u05ea \u05e9\u05dc\u05db\u05dd \u05e2\u05dd \u05dc\u05d5\u05d7 \u05e9\u05e0\u05d4 \u05d0\u05d9\u05e0\u05d8\u05d5\u05d0\u05d9\u05d8\u05d9\u05d1\u05d9" : "Manage your availability with an intuitive calendar" },
    { emoji: "\ud83d\udccd", title: isHe ? "\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05de\u05e7\u05d5\u05de\u05d9\u05d9\u05dd" : "Local Clients", desc: isHe ? "\u05e7\u05d1\u05dc\u05d5 \u05d4\u05ea\u05d0\u05de\u05d4 \u05dc\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05d1\u05d0\u05d6\u05d5\u05e8 \u05d4\u05e9\u05d9\u05e8\u05d5\u05ea \u05e9\u05dc\u05db\u05dd" : "Get matched with clients in your service area" },
    { emoji: "\u2b50", title: isHe ? "\u05d1\u05e0\u05d5 \u05de\u05d5\u05e0\u05d9\u05d8\u05d9\u05df" : "Build Reputation", desc: isHe ? "\u05d0\u05e1\u05e4\u05d5 \u05d1\u05d9\u05e7\u05d5\u05e8\u05d5\u05ea \u05de\u05d0\u05d5\u05de\u05ea\u05d5\u05ea \u05e9\u05e2\u05d5\u05d6\u05e8\u05d5\u05ea \u05dc\u05db\u05dd \u05dc\u05d4\u05ea\u05d1\u05dc\u05d8" : "Collect verified reviews that help you stand out" },
    { emoji: "\ud83d\udcca", title: isHe ? "\u05e2\u05e7\u05d1\u05d5 \u05d0\u05d7\u05e8 \u05d4\u05db\u05dc" : "Track Everything", desc: isHe ? "\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3 \u05e2\u05dd \u05e1\u05d8\u05d8\u05d9\u05e1\u05d8\u05d9\u05e7\u05d5\u05ea, \u05d4\u05d6\u05de\u05e0\u05d5\u05ea \u05d5\u05d4\u05db\u05e0\u05e1\u05d5\u05ea" : "Dashboard with stats, bookings, and earnings" },
  ];

  return (
    <div className="land-page" dir={dir}>

      {/* ═══ תפריט ניווט עליון (דבוק - משנה צבע בגלילה) ═══ */}
      <nav className={"land-nav " + (scrolled ? "land-nav--solid" : "")}>
        <div className="land-nav-inner">
          {/* ─── לוגו (לחיצה חוזרת לראש העמוד) ─── */}
          <div className="land-logo" onClick={function() { window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div className="land-logo-icon"><IconWrenchLogo /></div>
            <span className="land-logo-text">Fix<span className="land-logo-blue">Mate</span></span>
          </div>
          {/* ─── קישורים פנימיים (לסקשנים בדף) ─── */}
          <div className="land-nav-links">
            <a href="#how" className="land-nav-link">{isHe ? "\u05d0\u05d9\u05da \u05d6\u05d4 \u05e2\u05d5\u05d1\u05d3" : "How It Works"}</a>         {/* קישור ל"איך זה עובד" */}
            <a href="#features" className="land-nav-link">{isHe ? "\u05ea\u05db\u05d5\u05e0\u05d5\u05ea" : "Features"}</a>                          {/* קישור ל"תכונות" */}
            <a href="#pros" className="land-nav-link">{isHe ? "\u05dc\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd" : "For Pros"}</a>              {/* קישור ל"לבעלי מקצוע" */}
          </div>
          {/* ─── כפתורי ניווט (שפה + התחברות + הרשמה) ─── */}
          <div className="land-nav-btns">
            <LangToggle />    {/* מתג החלפת שפה */}
            <button className="land-btn-ghost" onClick={function() { navigate("/login"); }}>{t("landing_signin")}</button>                                 {/* כפתור "התחבר" */}
            <button className="land-btn-blue" onClick={function() { navigate("/register"); }}>{isHe ? "\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5" : "Get Started"}</button>   {/* כפתור "התחילו" */}
          </div>
          {/* ─── כפתור תפריט נייד (המבורגר) - מוצג רק בטלפון ─── */}
          <button className="land-mobile-tog" onClick={function() { setMenuOpen(!menuOpen); }}>
            {menuOpen ? <IconX /> : <IconMenu />}    {/* מחליף X / המבורגר לפי המצב */}
          </button>
        </div>
      </nav>

      {/* ═══ תפריט נייד (מוצג רק אם menuOpen=true) ═══ */}
      {menuOpen && (
        <div className="land-mobile-menu">
          <a href="#how" className="land-mob-link" onClick={function() { setMenuOpen(false); }}>{isHe ? "\u05d0\u05d9\u05da \u05d6\u05d4 \u05e2\u05d5\u05d1\u05d3" : "How It Works"}</a>
          <a href="#features" className="land-mob-link" onClick={function() { setMenuOpen(false); }}>{isHe ? "\u05ea\u05db\u05d5\u05e0\u05d5\u05ea" : "Features"}</a>
          <a href="#pros" className="land-mob-link" onClick={function() { setMenuOpen(false); }}>{isHe ? "\u05dc\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd" : "For Pros"}</a>
          <LangToggle />
          <button className="land-btn-ghost land-btn-full" onClick={function() { navigate("/login"); setMenuOpen(false); }}>{t("landing_signin")}</button>
          <button className="land-btn-blue land-btn-full" onClick={function() { navigate("/register"); setMenuOpen(false); }}>{isHe ? "\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5" : "Get Started"}</button>
        </div>
      )}

      {/* ═══ Hero - הסקשן הראשון (הגדול) עם הכותרת והאיור ═══ */}
      <section className="land-hero">
        <div className="land-hero-grid">
          {/* ─── צד טקסט (כותרת + סאב + כפתורי CTA) ─── */}
          <div className="land-hero-text">
            {/* תג קטן מעל הכותרת - "פלטפורמת שירותי בית חכמה" */}
            <div className="land-hero-pill">
              <span className="land-pill-dot" />
              {isHe ? "\u05e4\u05dc\u05d8\u05e4\u05d5\u05e8\u05de\u05ea \u05e9\u05d9\u05e8\u05d5\u05ea\u05d9 \u05d1\u05d9\u05ea \u05d7\u05db\u05de\u05d4" : "Smart Home Services Platform"}
            </div>
            {/* ─── הכותרת הראשית (h1) ─── */}
            <h1 className="land-hero-title">
              {isHe ? (
                <><span className="land-title-hl">{"\u05de\u05e6\u05d0\u05d5 \u05de\u05e7\u05e6\u05d5\u05e2\u05df"}</span>{" \u05d0\u05de\u05d9\u05df \u05d1\u05e9\u05e0\u05d9\u05d5\u05ea"}</>
              ) : (
                <>Find a <span className="land-title-hl">Trusted Pro</span> in Seconds</>
              )}
            </h1>
            <p className="land-hero-sub">
              {isHe ? "\u05d7\u05e9\u05de\u05dc\u05d0\u05d9\u05dd, \u05e9\u05e8\u05d1\u05e8\u05d1\u05d9\u05dd, \u05d8\u05db\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2\u05e0\u05d9\u05dd \u2014 \u05db\u05d5\u05dc\u05dd \u05de\u05d0\u05d5\u05de\u05ea\u05d9\u05dd, \u05de\u05d3\u05d5\u05e8\u05d2\u05d9\u05dd \u05d5\u05d6\u05de\u05d9\u05e0\u05d9\u05dd. \u05d4\u05d6\u05de\u05d9\u05e0\u05d5 \u05de\u05d9\u05d3 \u05d0\u05d5 \u05e6\u05dc\u05de\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4 \u05dc\u05d0\u05d1\u05d7\u05d5\u05df \u05d7\u05db\u05dd." : "Electricians, plumbers, AC technicians \u2014 all verified, rated, and ready. Book instantly or snap a photo for smart diagnosis."}
            </p>
            {/* ─── 2 כפתורי CTA (Call To Action) ─── */}
            <div className="land-hero-ctas">
              {/* כפתור ראשי - "התחילו בחינם" */}
              <button className="land-btn-blue land-btn-lg" onClick={function() { navigate("/register"); }}>
                {isHe ? "\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05d1\u05d7\u05d9\u05e0\u05dd" : "Get Started Free"} <IconArrowRight />
              </button>
              {/* כפתור משני - "צלמו תקלה" */}
              <button className="land-btn-outline land-btn-lg" onClick={function() { navigate("/register"); }}>
                <IconCamera /> {isHe ? "\u05e6\u05dc\u05de\u05d5 \u05ea\u05e7\u05dc\u05d4" : "Snap Your Issue"}
              </button>
            </div>
            {/* ─── 3 תגיות אמינות עם אייקון וי ─── */}
            <div className="land-hero-badges">
              <div className="land-badge"><IconCheck /><span>{isHe ? "\u05d6\u05de\u05d9\u05e0\u05d5\u05ea \u05d1\u05d6\u05de\u05df \u05d0\u05de\u05ea" : "Real-Time Availability"}</span></div>
              <div className="land-badge"><IconCheck /><span>{isHe ? "\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd \u05de\u05d0\u05d5\u05de\u05ea\u05d9\u05dd" : "Verified Professionals"}</span></div>
              <div className="land-badge"><IconCheck /><span>{isHe ? "\u05de\u05d7\u05d9\u05e8\u05d9\u05dd \u05e9\u05e7\u05d5\u05e4\u05d9\u05dd" : "Transparent Pricing"}</span></div>
            </div>
          </div>
          {/* ─── צד איור - איור ה-"איש המקצוע" הגדול ─── */}
          <div className="land-hero-illust">
            <HandymanIllustration />
          </div>
        </div>
      </section>

      {/* ═══ סקשן "איך זה עובד" - 4 שלבים ═══ */}
      <section id="how" className="land-section">
        <AnimatedSection>
          <h2 className="land-sec-title">{isHe ? "\u05d0\u05d9\u05da \u05d6\u05d4 \u05e2\u05d5\u05d1\u05d3" : "How It Works"}</h2>
          <p className="land-sec-sub">{isHe ? "\u05d0\u05e8\u05d1\u05e2\u05d4 \u05e9\u05dc\u05d1\u05d9\u05dd \u05e4\u05e9\u05d5\u05d8\u05d9\u05dd \u05dc\u05ea\u05e7\u05df \u05d0\u05ea \u05d4\u05d1\u05e2\u05d9\u05d4 \u05d1\u05d1\u05d9\u05ea" : "Four simple steps to get your home issue fixed"}</p>
        </AnimatedSection>
        {/* ─── רשת של 4 כרטיסי שלבים (עם עיכוב בין אחד לשני) ─── */}
        <div className="land-steps">
          {steps.map(function(s, i) {
            return (
              <AnimatedSection key={s.num} delay={i * 0.15}>            {/* כל כרטיס עם עיכוב גובר (0, 0.15, 0.3, 0.45) */}
                <div className="land-step-card">
                  <div className="land-step-num">{s.num}</div>            {/* המספר (1/2/3/4) */}
                  <div className="land-step-icon" style={{ background: s.color }}>
                    <span className="land-step-emoji">{s.emoji}</span>    {/* האימוג'י */}
                  </div>
                  <h3 className="land-step-title">{s.title}</h3>          {/* כותרת השלב */}
                  <p className="land-step-desc">{s.desc}</p>              {/* תיאור השלב */}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ═══ סקשן "למה לבחור פיקסמייט" - 4 תכונות (רקע כהה) ═══ */}
      <section id="features" className="land-section land-section--dark2">
        <AnimatedSection>
          <h2 className="land-sec-title">{isHe ? "\u05dc\u05de\u05d4 \u05dc\u05d1\u05d7\u05d5\u05e8 \u05d1\u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8" : "Why Choose FixMate"}</h2>
          <p className="land-sec-sub">{isHe ? "\u05db\u05dc \u05de\u05d4 \u05e9\u05e6\u05e8\u05d9\u05da \u05dc\u05de\u05e6\u05d5\u05d0 \u05d0\u05ea \u05d4\u05de\u05e7\u05e6\u05d5\u05e2\u05df \u05d4\u05e0\u05db\u05d5\u05df" : "Everything you need to find the right professional"}</p>
        </AnimatedSection>
        {/* ─── רשת של 4 כרטיסי תכונות ─── */}
        <div className="land-features">
          {features.map(function(f, i) {
            return (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="land-feat-card">
                  <div className="land-feat-icon">{f.icon}</div>     {/* אייקון SVG */}
                  <h3 className="land-feat-title">{f.title}</h3>     {/* כותרת */}
                  <p className="land-feat-desc">{f.desc}</p>          {/* תיאור */}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* ═══ סקשן "לבעלי מקצוע" - 4 כרטיסי יתרונות + כפתור ═══ */}
      <section id="pros" className="land-section">
        <AnimatedSection>
          <h2 className="land-sec-title">{isHe ? "\u05d0\u05ea\u05dd \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2" : "Are You a Professional"}</h2>
          <p className="land-sec-sub">{isHe ? "\u05d4\u05e6\u05d8\u05e8\u05e4\u05d5 \u05dc\u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8 \u05d5\u05d4\u05d2\u05d3\u05d9\u05dc\u05d5 \u05d0\u05ea \u05d4\u05e2\u05e1\u05e7" : "Join FixMate and grow your business"}</p>
        </AnimatedSection>
        {/* ─── רשת של 4 כרטיסי יתרונות לבעלי מקצוע ─── */}
        <div className="land-pro-grid">
          {proCards.map(function(item, i) {
            return (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="land-pro-card">
                  <span className="land-pro-emoji">{item.emoji}</span>
                  <h3 className="land-pro-title">{item.title}</h3>
                  <p className="land-pro-desc">{item.desc}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
        {/* ─── כפתור CTA - "הצטרפו כמקצוענים" ─── */}
        <AnimatedSection delay={0.3}>
          <div className="land-center">
            <button className="land-btn-blue land-btn-lg" onClick={function() { navigate("/register"); }}>
              {isHe ? "\u05d4\u05e6\u05d8\u05e8\u05e4\u05d5 \u05db\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd" : "Join as a Professional"} <IconArrowRight />
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ Footer - כותרת תחתונה עם לוגו, לינקים, וחוקיות ═══ */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          {/* ─── עמודה 1: לוגו + תיאור קצר ─── */}
          <div>
            <div className="land-logo">
              <div className="land-logo-icon"><IconWrenchLogo /></div>
              <span className="land-logo-text land-logo-text--white">Fix<span className="land-logo-blue">Mate</span></span>
            </div>
            <p className="land-footer-desc">{isHe ? "\u05d4\u05d3\u05e8\u05da \u05d4\u05d7\u05db\u05de\u05d4 \u05dc\u05de\u05e6\u05d5\u05d0 \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05d0\u05de\u05d9\u05e0\u05d9\u05dd \u05dc\u05d1\u05d9\u05ea." : "The smart way to find trusted home service professionals."}</p>
          </div>
          {/* ─── 3 עמודות קישורים ─── */}
          <div className="land-footer-cols">
            {/* עמודת "פלטפורמה" - קישורים פנימיים */}
            <div className="land-footer-col">
              <h4>{isHe ? "\u05e4\u05dc\u05d8\u05e4\u05d5\u05e8\u05de\u05d4" : "Platform"}</h4>
              <a href="#how">{isHe ? "\u05d0\u05d9\u05da \u05d6\u05d4 \u05e2\u05d5\u05d1\u05d3" : "How It Works"}</a>
              <a href="#features">{isHe ? "\u05ea\u05db\u05d5\u05e0\u05d5\u05ea" : "Features"}</a>
              <a href="#pros">{isHe ? "\u05dc\u05de\u05e7\u05e6\u05d5\u05e2\u05e0\u05d9\u05dd" : "For Pros"}</a>
            </div>
            {/* עמודת "חשבון" - התחברות והרשמה */}
            <div className="land-footer-col">
              <h4>{isHe ? "\u05d7\u05e9\u05d1\u05d5\u05df" : "Account"}</h4>
              <a href="#" onClick={function() { navigate("/login"); }}>{t("landing_signin")}</a>
              <a href="#" onClick={function() { navigate("/register"); }}>{t("landing_signup")}</a>
            </div>
            {/* עמודת "משפטי" - מדיניות ותנאים */}
            <div className="land-footer-col">
              <h4>{isHe ? "\u05de\u05e9\u05e4\u05d8\u05d9" : "Legal"}</h4>
              <a href="#">{isHe ? "\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea" : "Privacy Policy"}</a>
              <a href="#">{isHe ? "\u05ea\u05e0\u05d0\u05d9 \u05e9\u05d9\u05de\u05d5\u05e9" : "Terms of Service"}</a>
            </div>
          </div>
        </div>
        {/* ─── זכויות יוצרים בתחתית ─── */}
        <div className="land-footer-bottom">{isHe ? "\u00a9 2026 \u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8. \u05db\u05dc \u05d4\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e9\u05de\u05d5\u05e8\u05d5\u05ea." : "\u00a9 2026 FixMate. All rights reserved."}</div>
      </footer>
    </div>
  );
}