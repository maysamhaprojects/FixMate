/**
 * =============================================
 *  FixMate – Professional Dashboard
 * =============================================
 *  ROUTE: /pro/dashboard
 *  FILE:  src/pages/ProDashboard.jsx
 *
 *  מה יש כאן:
 *  - Navbar עם לשוניות ניווט + התראות + יציאה
 *  - 4 כרטיסי סטטיסטיקה (הזמנות חדשות, היום, הכנסה שבועית, דירוג)
 *  - Alert Banner כשיש הזמנות ממתינות
 *  - עמודה שמאל: ביקורות אחרונות (במקום New Orders)
 *  - עמודה ימין: לוח זמנים היומי
 *
 *  🚩 BACKEND NOTE:
 *     - כרטיסי סטטיסטיקה ← GET /api/pro/stats
 *     - ביקורות אחרונות   ← GET /api/pro/reviews?limit=5
 *     - לוח זמנים         ← GET /api/pro/schedule?date=today
 *     - התראות            ← GET /api/pro/notifications
 * =============================================
 */

/* ═══════════════════════════════════════════════
   ייבואים - הכלים שצריך
   ═══════════════════════════════════════════════ */
import { useState, useEffect } from "react";                                 // useState=זיכרון | useEffect=הרצה בזמן
import { useNavigate } from "react-router-dom";                               // הוק לניווט
import { translate, getLang, getDir } from "../context/LanguageContext";      // כלים לשפה

/* ═══════════════════════════════════════════════
   אייקונים - SVG ידניים (ללא ספריות חיצוניות)
   ═══════════════════════════════════════════════ */
const IconBell     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;                            // פעמון - להתראות
const IconLogout   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;    // חץ יציאה - לכפתור יציאה
const IconWrench   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;    // מפתח ברגים - ללוגו
const IconStar     = ({ filled }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;                     // כוכב (מלא/חלול) - לדירוגים
const IconPhone    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;   // טלפון - לכפתור חיוג
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;  // לוח שנה - לכרטיס הזמנות היום
const IconDollar   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;                                                   // דולר - לכרטיס הכנסות
const IconInbox    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;   // תיבת דואר - לכרטיס הזמנות חדשות
const IconMapPin   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;                                                              // סיכת מיקום - לכתובת
const IconQuote    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>;     // גרשיים - לדקורציה על ביקורות

/* ═══════════════════════════════════════════════
   פרטי המקצוען - נטענים מ-localStorage אחרי התחברות
   ═══════════════════════════════════════════════ */
const PRO_INFO = {
  name:   localStorage.getItem('fullName') || "Professional",     // שם מלא מ-localStorage (או "Professional" ברירת מחדל)
  avatar: (localStorage.getItem('fullName') || "P").charAt(0),     // אות ראשונה לאווטאר
  rating: 0,                                                        // דירוג התחלתי
};

/* ─── סטטיסטיקות לדוגמה (בעתיד מהשרת) ─── */
const STATS_MOCK = {
  newOrders:    3,            // 3 הזמנות חדשות שמחכות
  todayOrders:  3,            // 3 הזמנות היום
  weeklyIncome: 5600,          // 5,600₪ הכנסה שבועית
  rating:       4.8,           // דירוג ממוצע
};

/* 🚩 BACKEND: GET /api/pro/reviews?limit=5 - ביקורות אחרונות */
const REVIEWS_MOCK = [
  {
    id: 1,
    clientName:  { en: "Sarah Cohen",  he: "שרה כהן"   },
    service:     { en: "Fix electrical outlet", he: "תיקון שקע חשמל" },
    rating:      5,
    comment:     { en: "David was super professional, arrived on time and fixed everything perfectly. Highly recommend!", he: "דוד היה מקצועי מאוד, הגיע בזמן ותיקן הכל בצורה מושלמת. ממליץ בחום!" },
    date:        { en: "Feb 20, 2026", he: "20 בפבר 2026" },
    orderId:     "ORD-2045",
  },
  {
    id: 2,
    clientName:  { en: "Moshe Peretz", he: "משה פרץ" },
    service:     { en: "Install outlet", he: "התקנת שקע" },
    rating:      5,
    comment:     { en: "Quick, clean work. Very friendly and explained everything he did. Will definitely call again.", he: "עבודה מהירה ונקייה. נחמד מאוד והסביר כל מה שעשה. בהחלט אקרא שוב." },
    date:        { en: "Feb 18, 2026", he: "18 בפבר 2026" },
    orderId:     "ORD-2041",
  },
  {
    id: 3,
    clientName:  { en: "Noa Katz",    he: "נועה כץ"  },
    service:     { en: "Wiring repair", he: "תיקון חיווט" },
    rating:      4,
    comment:     { en: "Good service overall, minor delay but work quality was excellent. Would recommend.", he: "שירות טוב בסך הכל, איחור קל אבל איכות העבודה הייתה מעולה. אמליץ." },
    date:        { en: "Feb 15, 2026", he: "15 בפבר 2026" },
    orderId:     "ORD-2038",
  },
  {
    id: 4,
    clientName:  { en: "Rina Goldberg", he: "רינה גולדברג" },
    service:     { en: "Fix light switch", he: "תיקון מתג אור" },
    rating:      5,
    comment:     { en: "Excellent! Came within the hour, very tidy and professional. My go-to electrician from now on.", he: "מעולה! הגיע תוך שעה, מסודר ומקצועי מאוד. החשמלאי שלי מעכשיו." },
    date:        { en: "Feb 10, 2026", he: "10 בפבר 2026" },
    orderId:     "ORD-2030",
  },
];

/* 🚩 BACKEND: GET /api/pro/schedule?date=today - לוח זמנים של היום */
const TODAY_SCHEDULE = [
  { time: "9:00",  client: { en: "Rina Goldberg", he: "רינה גולדברג" }, service: { en: "Fix light switch", he: "תיקון מתג אור"   }, location: { en: "Tel Aviv",  he: "תל אביב"  }, status: "completed", phone: "+972 50-777-8888" },
  { time: "11:30", client: { en: "Moshe Peretz",  he: "משה פרץ"      }, service: { en: "Install outlet",   he: "התקנת שקע"      }, location: { en: "Ramat Gan", he: "רמת גן"    }, status: "in_progress", phone: "+972 52-999-0000" },
  { time: "14:00", client: { en: "Noa Katz",      he: "נועה כץ"       }, service: { en: "Wiring repair",    he: "תיקון חיווט"    }, location: { en: "Herzliya",  he: "הרצליה"   }, status: "upcoming",    phone: "+972 54-111-3333" },
];

/* 🚩 BACKEND: GET /api/pro/notifications - רשימת התראות */
const NOTIFS_MOCK = [
  { id: 1, icon: "📋", color: "#2563EB", bg: "#EEF2FF", text: { en: "New order from Sarah Cohen — Fix electrical outlet", he: "הזמנה חדשה משרה כהן — תיקון שקע חשמל" }, time: { en: "5 min ago",  he: "לפני 5 דקות" }, read: false },
  { id: 2, icon: "📋", color: "#2563EB", bg: "#EEF2FF", text: { en: "New order from Amit Levy — Install ceiling fan",    he: "הזמנה חדשה מעמית לוי — התקנת מאוורר תקרה" }, time: { en: "20 min ago", he: "לפני 20 דקות" }, read: false },
  { id: 3, icon: "⭐", color: "#F59E0B", bg: "#FFF7ED", text: { en: "Rina Goldberg rated you 5 stars!",                  he: "רינה גולדברג דירגה אותך 5 כוכבים!"          }, time: { en: "1 hour ago", he: "לפני שעה"     }, read: false },
  { id: 4, icon: "✓",  color: "#059669", bg: "#ECFDF5", text: { en: "Job ORD-2045 marked as completed",                  he: "עבודה ORD-2045 סומנה כהושלמה"               }, time: { en: "3 hours ago", he: "לפני 3 שעות" }, read: true  },
  { id: 5, icon: "💬", color: "#8B5CF6", bg: "#F5F3FF", text: { en: "Moshe Peretz sent you a message",                   he: "משה פרץ שלח לך הודעה"                        }, time: { en: "Yesterday",  he: "אתמול"        }, read: true  },
];

/* ═══════════════════════════════════════════════
   הקומפוננטה הראשית - דשבורד בעל מקצוע
   ═══════════════════════════════════════════════ */
export default function ProDashboard() {
  const navigate = useNavigate();                   // כלי ניווט

  /* ─── כלים לדו-לשוניות ─── */
  const t    = translate;                            // פונקציית תרגום (קיצור)
  const dir  = getDir();                              // כיוון טקסט ("rtl"/"ltr")
  const lang = getLang();                             // שפה ("he"/"en")
  const isHe = lang === "he";                         // האם עברית?

  /* ─── פונקציית עזר - מחזירה טקסט בשפה הנכונה ─── */
  const L = (obj) =>
    obj && typeof obj === "object" && obj[lang]       // אם אובייקט דו-שפתי עם השפה הנוכחית
      ? obj[lang]
      : typeof obj === "string"                       // אם מחרוזת רגילה
      ? obj
      : obj?.en ?? "";                                 // ברירת מחדל - אנגלית

  /* ─── משתני מצב ─── */
  const [mounted, setMounted] = useState(false);     // האם הקומפוננטה נטענה? (אנימציה)
  const [orders, setOrders] = useState([]);           // רשימת הזמנות מהשרת

  /* ─── טעינת הזמנות מהשרת (רץ פעם אחת) ─── */
  useEffect(() => {
    const token = localStorage.getItem('token');              // מוציא טוקן מ-localStorage
    fetch('http://localhost:8080/api/pro/orders', {           // שולח בקשה לשרת
      headers: { 'Authorization': 'Bearer ' + token }         // עם הטוקן לזיהוי
    })
    .then(res => res.json())                                   // מפענח JSON
    .then(data => {
      if (Array.isArray(data)) setOrders(data);               // שומר אם זה מערך
    })
    .catch(err => console.log('Error:', err));                // טיפול בשגיאה
  }, []);   /* כשבעל המקצוע נכנס ללוח ← שליחת בקשה לבקאנד ← מקבל את ההזמנות האמיתיות */

  /* ─── משתני UI נוספים ─── */
  const [activeTab,   setActiveTab  ] = useState("dashboard");   // הלשונית הפעילה
  const [showNotif,   setShowNotif  ] = useState(false);          // האם תפריט התראות פתוח?
  const [notifications, setNotifications] = useState(NOTIFS_MOCK); // רשימת התראות
  const [expandedReview, setExpandedReview] = useState(null);      // איזו ביקורת מורחבת (null = אין)

  /* ─── אנימציית כניסה ─── */
  useEffect(() => {
    const tm = setTimeout(() => setMounted(true), 50);   // אחרי 50ms - מפעיל אנימציה
    return () => clearTimeout(tm);                        // ניקוי
  }, []);

  /* ─── חישוב כמות התראות שלא נקראו ─── */
  const unreadCount = notifications.filter(n => !n.read).length;

  /* ─── סימון כל ההתראות כנקראו ─── */
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  /* ─── גלילה חלקה לסקשן מסוים ─── */
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ─── רשימת לשוניות הניווט ─── */
  const TABS = [
    { id: "dashboard",    label: t("pro_tab_dashboard")    },                         // דשבורד (נוכחי)
    { id: "orders",       label: t("pro_tab_orders")       },                         // הזמנות → /pro/orders
    { id: "availability", label: isHe ? "ניהול זמינות" : "Availability" },            // זמינות → /pro/availability
    { id: "profile",      label: t("pro_tab_profile")      },                         // פרופיל → /pro/profile
  ];

  /* ─── צבעי סטטוס ללוח הזמנים ─── */
  const statusColors = {
    completed:   { label: t("pro_completed"),   color: "#6B7280", bg: "#F3F4F6" },    // הושלם - אפור
    in_progress: { label: t("pro_in_progress"), color: "#10B981", bg: "#ECFDF5" },    // בביצוע - ירוק
    upcoming:    { label: t("pro_upcoming"),     color: "#3B82F6", bg: "#EFF6FF" },   // קרוב - כחול
  };

  /* ─── רכיב שמציג 5 כוכבים (מלא/חלול לפי הדירוג) ─── */
  const StarRating = ({ rating }) => (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <IconStar key={i} filled={i <= rating} />        // מלא אם i ≤ rating
      ))}
    </div>
  );

  return (
    <div style={{
      fontFamily:  isHe ? "'Heebo','DM Sans','Inter',sans-serif" : "'DM Sans','Inter',sans-serif",
      background:  "#F5F7FB",
      minHeight:   "100vh",
      direction:   dir,
      textAlign:   dir === "rtl" ? "right" : "left",
      opacity:     mounted ? 1 : 0,
      transition:  "opacity .4s",
    }}>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* כרטיסי סטטיסטיקה */
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08) !important; }

        /* כרטיסי ביקורת */
        .review-card { transition: all .25s ease; }
        .review-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08) !important; }

        /* לשוניות */
        .tab-btn:hover { background: rgba(37,99,235,.06) !important; }

        /* שורות לוח זמנים */
        .sch-row:hover { background: #F8FAFF !important; }

        /* כפתורים */
        .hb:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }

        * { box-sizing: border-box; margin: 0; }

        /* Responsive */
        @media (max-width: 768px) {
          .dash-nav-inner { flex-wrap: wrap; gap: 10px; padding: 10px 16px !important; }
          .dash-nav-inner > div:nth-child(2) { order: 3; width: 100%; justify-content: center; }
          .dash-main  { padding: 20px 16px 40px !important; }
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
          .dash-cols  { grid-template-columns: 1fr !important; }
          .dash-alert { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr !important; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
      `}</style>

      {/* ═══════════════════════════════════════════════
          תפריט ניווט עליון (דבוק למעלה)
          מכיל: לוגו + 4 לשוניות + פעמון + אווטאר + יציאה
          ═══════════════════════════════════════════════ */}
      <nav style={{
        background:    "#FFF",
        borderBottom:  "1px solid #E5E7EB",
        boxShadow:     "0 1px 8px rgba(0,0,0,.04)",
        position:      "sticky",
        top:           0,
        zIndex:        100,
      }}>
        <div className="dash-nav-inner" style={{
          maxWidth:       1200,
          margin:         "0 auto",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "12px 24px",
          direction:      "ltr", /* הניווט תמיד LTR */
        }}>

          {/* ─── לוגו FixMate Pro ─── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* ריבוע עם אייקון מפתח ברגים */}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
              <IconWrench />
            </div>
            {/* טקסט הלוגו */}
            <span style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#1A2B4A" }}>
              Fix<span style={{ color: "#2563EB" }}>Mate</span>{" "}
              <span style={{ fontSize: 13, fontWeight: 500, color: "#94A3B8" }}>Pro</span>
            </span>
          </div>

          {/* ─── לשוניות ניווט (4 כפתורים) ─── */}
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className="tab-btn"
                onClick={() => {
                  // ניתוב לדף המתאים לפי הלשונית
                  if      (tab.id === "profile")      navigate("/pro/profile");
                  else if (tab.id === "orders")       navigate("/pro/orders");
                  else if (tab.id === "availability") navigate("/pro/availability");
                  else setActiveTab(tab.id);     // dashboard = נשאר באותו דף
                }}
                style={{
                  padding:     "10px 18px",
                  borderRadius: 10,
                  border:      "none",
                  background:  activeTab === tab.id ? "#2563EB" : "transparent",
                  color:       activeTab === tab.id ? "#FFF"    : "#64748B",
                  fontSize:    14,
                  fontWeight:  600,
                  cursor:      "pointer",
                  transition:  "all .2s",
                  fontFamily:  "'DM Sans'",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── צד ימין: פעמון + אווטאר + יציאה ─── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, direction: "ltr" }}>

            {/* ═══ פעמון התראות עם dropdown ═══ */}
            <div style={{ position: "relative" }}>
              {/* כפתור הפעמון */}
              <button
                onClick={() => setShowNotif(!showNotif)}
                style={{ position: "relative", width: 40, height: 40, borderRadius: 10, border: "1px solid #E5E7EB", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
              >
                <IconBell />
                {/* נקודה אדומה עם מספר - מוצגת רק אם יש התראות לא-נקראות */}
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, background: "#EF4444", color: "#FFF", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* התפריט הנפתח של ההתראות */}
              {showNotif && (
                <>
                  {/* רקע שקוף - לחיצה עליו סוגרת את התפריט */}
                  <div onClick={() => setShowNotif(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
                  <div style={{ position: "absolute", top: 48, right: 0, width: 360, background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", boxShadow: "0 12px 40px rgba(0,0,0,.12)", zIndex: 200, overflow: "hidden", animation: "slideDown .2s", direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: "#1A2B4A", fontFamily: "'Outfit'" }}>{t("pro_notifications")}</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ border: "none", background: "none", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          {t("pro_mark_all")}
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: 360, overflowY: "auto" }}>
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC", background: n.read ? "#FFF" : "#F0F4FF", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "background .2s" }}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.5, marginBottom: 4, fontWeight: n.read ? 400 : 600 }}>{L(n.text)}</p>
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>{L(n.time)}</span>
                          </div>
                          {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 6 }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ═══ אווטאר המקצוען (אות ראשונה) ═══ */}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
              {PRO_INFO.avatar}
            </div>

            {/* ═══ כפתור יציאה - חוזר למסך התחברות ═══ */}
            <button onClick={() => navigate("/login")} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #E5E7EB", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}>
              <IconLogout />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          תוכן ראשי
          ═══════════════════════════════════════════════ */}
      <main className="dash-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* ─── כותרת: "שלום [שם] 👋" ─── */}
        <div style={{ marginBottom: 28, animation: "fadeUp .4s" }}>
          <h1 style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 800, color: "#1A2B4A", marginBottom: 4 }}>
            {t("pro_greeting")} {PRO_INFO.name} 👋
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8" }}>{t("pro_overview")}</p>
        </div>

        {/* ═══ 4 כרטיסי סטטיסטיקה ═══ */}
        <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>

          {/* ─── כרטיס 1: הזמנות חדשות (לחיצה → דף הזמנות) ─── */}
          <div className="stat-card" onClick={() => navigate("/pro/orders")} style={{ background: "#FFF", borderRadius: 18, padding: "24px 20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.03)", transition: "all .3s", animation: "fadeUp .4s", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}><IconInbox /></div>     {/* אייקון תיבת דואר */}
              <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", background: "#ECFDF5", padding: "4px 10px", borderRadius: 20 }}>{isHe ? "+2 חדשות" : "+2 new"}</span>                          {/* תג "חדשות" */}
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: "#1A2B4A", marginBottom: 4 }}>{STATS_MOCK.newOrders}</p>    {/* המספר */}
            <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{t("pro_new_orders")}</p>                                               {/* התווית */}
          </div>

          {/* ─── כרטיס 2: הזמנות היום (לחיצה → גלילה ללוח הזמנים) ─── */}
          <div className="stat-card" onClick={() => scrollTo("today-schedule")} style={{ background: "#FFF", borderRadius: 18, padding: "24px 20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.03)", transition: "all .3s", animation: "fadeUp .45s", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}><IconCalendar /></div>   {/* אייקון לוח שנה */}
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: "#1A2B4A", marginBottom: 4 }}>{STATS_MOCK.todayOrders}</p>
            <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{t("pro_today_orders")}</p>
          </div>

          {/* ─── כרטיס 3: הכנסה שבועית (בש"ח + % שינוי) ─── */}
          <div className="stat-card" style={{ background: "#FFF", borderRadius: 18, padding: "24px 20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.03)", transition: "all .3s", animation: "fadeUp .5s", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B" }}><IconDollar /></div>       {/* אייקון דולר */}
              <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", background: "#ECFDF5", padding: "4px 10px", borderRadius: 20 }}>+12%</span>                                                      {/* תג גדילה */}
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: "#1A2B4A", marginBottom: 4 }}>₪{STATS_MOCK.weeklyIncome.toLocaleString()}</p>    {/* סכום עם פסיקים */}
            <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{t("pro_weekly_income")}</p>
          </div>

          {/* ─── כרטיס 4: דירוג ממוצע (לחיצה → גלילה לביקורות) ─── */}
          <div className="stat-card" onClick={() => scrollTo("latest-reviews")} style={{ background: "#FFF", borderRadius: 18, padding: "24px 20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.03)", transition: "all .3s", animation: "fadeUp .55s", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconStar filled={true} />     {/* כוכב צהוב */}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <p style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Outfit'", color: "#1A2B4A" }}>{STATS_MOCK.rating}</p>
              <span style={{ fontSize: 14, color: "#94A3B8" }}>/ 5.0</span>    {/* מתוך 5 */}
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{t("pro_avg_rating")}</p>
          </div>
        </div>

        {/* ═══ באנר התראה כחול - "יש לך X הזמנות ממתינות" ═══ */}
        <div className="dash-alert" style={{ background: "linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%)", borderRadius: 18, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, animation: "fadeUp .5s", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#FFF", marginBottom: 4 }}>🔔 {STATS_MOCK.newOrders} {t("pro_alert_title")}</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>{t("pro_alert_sub")}</p>
          </div>
          {/* 🚩 BACKEND: כפתור זה מנווט למסך ניהול הזמנות /pro/orders — ודאי שה-route מוגדר ב-App.jsx */}
          <button className="hb" onClick={() => navigate("/pro/orders")} style={{ padding: "12px 24px", borderRadius: 12, border: "2px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.15)", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(4px)", transition: "all .2s" }}>
            {t("pro_view_orders")}
          </button>
        </div>

        {/* ═══ 2 טורים: ביקורות + לוח זמנים ═══ */}
        <div className="dash-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, animation: "fadeUp .55s" }}>

          {/* ═══════════════════════════════════════════════
              טור שמאל: ביקורות אחרונות
              🚩 BACKEND: GET /api/pro/reviews?limit=5
              ═══════════════════════════════════════════════ */}
          <div id="latest-reviews">

            {/* ─── כותרת הסקשן + תג דירוג ─── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A", display: "flex", alignItems: "center", gap: 8 }}>
                ⭐ {isHe ? "ביקורות אחרונות" : "Latest Reviews"}
              </h2>
              {/* תג: כוכב + ציון + מספר ביקורות */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: 20, padding: "6px 14px" }}>
                <IconStar filled={true} />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#92400E" }}>{STATS_MOCK.rating}</span>
                <span style={{ fontSize: 12, color: "#B45309" }}>({REVIEWS_MOCK.length} {isHe ? "ביקורות" : "reviews"})</span>
              </div>
            </div>

            {/* ─── רשימת כרטיסי הביקורות ─── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {REVIEWS_MOCK.map((review) => {
                const isExpanded = expandedReview === review.id;                                       // האם הביקורת הזו מורחבת?
                const comment    = L(review.comment);                                                   // טקסט הביקורת
                const shortComment = comment.length > 100 ? comment.slice(0, 100) + "..." : comment;   // חיתוך ל-100 תווים

                return (
                  <div
                    key={review.id}
                    className="review-card"
                    style={{ background: "#FFF", borderRadius: 18, padding: "20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.03)" }}
                  >
                    {/* ─── שורה עליונה: פרטי לקוח + דירוג ─── */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* אווטאר - אות ראשונה של הלקוח */}
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#EEF2FF,#DBEAFE)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {L(review.clientName).charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 2 }}>{L(review.clientName)}</p>    {/* שם הלקוח */}
                          <p style={{ fontSize: 12, color: "#94A3B8" }}>{L(review.service)}</p>                                         {/* סוג השירות */}
                        </div>
                      </div>
                      {/* בצד השני: כוכבים + תאריך */}
                      <div style={{ textAlign: dir === "rtl" ? "left" : "right" }}>
                        <StarRating rating={review.rating} />     {/* 5 כוכבים (מלא/חלול לפי דירוג) */}
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{L(review.date)}</p>
                      </div>
                    </div>

                    {/* אייקון גרשיים דקורטיבי */}
                    <div style={{ color: "#DBEAFE", marginBottom: 6 }}>
                      <IconQuote />
                    </div>

                    {/* טקסט הביקורת (קצר או מלא לפי הרחבה) */}
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
                      {isExpanded ? comment : shortComment}
                    </p>

                    {/* כפתור "קרא עוד / הצג פחות" (מוצג רק אם הטקסט ארוך מ-100 תווים) */}
                    {comment.length > 100 && (
                      <button
                        onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                        style={{ border: "none", background: "none", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 10 }}
                      >
                        {isExpanded
                          ? (isHe ? "הצג פחות ↑" : "Show less ↑")
                          : (isHe ? "קרא עוד ↓"  : "Read more ↓")}
                      </button>
                    )}

                    {/* מזהה הזמנה */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 11, color: "#CBD5E1", background: "#F8FAFC", border: "1px solid #E8ECF4", borderRadius: 8, padding: "3px 10px" }}>
                        {review.orderId}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              טור ימין: לוח זמנים היומי
              🚩 BACKEND: GET /api/pro/schedule?date=today
              ═══════════════════════════════════════════════ */}
          <div id="today-schedule">

            {/* ─── כותרת + תאריך היום ─── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A" }}>
                {t("pro_today_schedule")}
              </h2>
              {/* תאריך היום בשפה הנבחרת */}
              <span style={{ fontSize: 13, color: "#94A3B8" }}>
                {new Date().toLocaleDateString(isHe ? "he-IL" : "en-US", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>

            {/* ─── רשימת שורות של הזמנות היום ─── */}
            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.03)" }}>
              {TODAY_SCHEDULE.map((item, i) => {
                const st = statusColors[item.status];    // שולף צבעים לסטטוס
                return (
                  <div
                    key={i}
                    className="sch-row"
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderBottom: i < TODAY_SCHEDULE.length - 1 ? "1px solid #F1F5F9" : "none", transition: "background .2s" }}
                  >
                    {/* עמודה 1: שעה */}
                    <div style={{ minWidth: 56, textAlign: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Outfit'", color: "#1A2B4A" }}>{item.time}</span>
                    </div>

                    {/* עמודה 2: קו צבעוני דק (לפי סטטוס) */}
                    <div style={{ width: 3, height: 48, borderRadius: 2, background: st.color, opacity: 0.5 }} />

                    {/* עמודה 3: פרטי ההזמנה */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A" }}>{L(item.client)}</p>                                                                          {/* שם הלקוח */}
                        <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "3px 10px", borderRadius: 20 }}>{st.label}</span>                {/* תגית סטטוס */}
                      </div>
                      <p style={{ fontSize: 13, color: "#7C8DB5" }}>{L(item.service)}</p>                                                                                             {/* סוג השירות */}
                      <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 12, color: "#94A3B8" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><IconMapPin /> {L(item.location)}</span>                                                      {/* מיקום */}
                      </div>
                    </div>

                    {/* עמודה 4: כפתור חיוג ללקוח */}
                    <button
                      onClick={() => window.open(`tel:${item.phone}`)}    // פותח חייגן
                      style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E5E7EB", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2563EB", flexShrink: 0 }}
                    >
                      <IconPhone />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ─── קופסת סיכום: 3 עמודות (הושלם / בביצוע / קרוב) ─── */}
            <div style={{ marginTop: 16, background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", padding: "20px", display: "flex", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,.03)" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit'", color: "#059669" }}>
                  {TODAY_SCHEDULE.filter(s => s.status === "completed").length}
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>{t("pro_completed")}</p>
              </div>
              <div style={{ width: 1, background: "#E8ECF4" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit'", color: "#F59E0B" }}>
                  {TODAY_SCHEDULE.filter(s => s.status === "in_progress").length}
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>{t("pro_in_progress")}</p>
              </div>
              <div style={{ width: 1, background: "#E8ECF4" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Outfit'", color: "#3B82F6" }}>
                  {TODAY_SCHEDULE.filter(s => s.status === "upcoming").length}
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>{t("pro_upcoming")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}