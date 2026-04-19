/* ═══════════════════════════════════════════════
   FixMate - דשבורד לקוח (ClientDashboard)
   הדף הראשי של הלקוח - כאן הוא רואה הזמנות, התראות, פעולות
   ═══════════════════════════════════════════════ */

import { useState, useEffect } from "react";                           // useState = זיכרון | useEffect = מריץ קוד בזמן מסוים
import { useNavigate } from "react-router-dom";                         // הוק לניווט בין דפים
import { useLang, translate, getLang, getDir } from "../context/LanguageContext";  // כלים לשפה ותרגום
import "../styles/client.css";                                           // קובץ העיצוב של הדשבורד

/* ═══════════════════════════════════════════════
   אייקונים (SVG) - כל אחד מצייר אייקון אחר על המסך
   ═══════════════════════════════════════════════ */
const IconCamera = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;  // מצלמה - לכרטיס "צילום תקלה"
const IconSearch = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;                                                                                                 // זכוכית מגדלת - לכרטיס "חיפוש מקצוען"
const IconMindMap = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>;          // מפת מחשבה - לכרטיס "מפת רעיונות"
const IconUser = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;                                                                                                  // משתמש - לכפתור פרופיל
const IconLogout = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;                                                  // חץ יציאה - לכפתור התנתקות
const IconStar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;                                                                                                                   // כוכב צהוב - לדירוג
const IconClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;                                                                                                                  // שעון - לתאריך/שעה
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;  // טלפון - למספר המקצוען
const IconArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;                                                                                                     // חץ ימינה - לכפתורי ניווט
const IconWrench = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;                // מפתח ברגים - לוגו FixMate
const IconBell = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;                                                                                       // פעמון - להתראות
const IconSettings = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;  // גלגל שיניים - להגדרות
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;                                        // עיפרון - לעריכה
const IconHistory = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><polyline points="12 7 12 12 16 14"/></svg>;                                                             // חץ היסטוריה - להזמנות ישנות
const IconHeart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;                                  // לב - למועדפים

/* ═══════════════════════════════════════════════
   נתוני דמה (MOCK DATA) - הזמנות לדוגמה
   משמשות להצגה עד שהשרת מחזיר נתונים אמיתיים
   ═══════════════════════════════════════════════ */
var MOCK_ORDERS_DATA = {
  en: [   // הזמנות באנגלית
    { id: "ORD-1041", proName: "Ori Cohen", proRole: "Electrician", proAvatar: null, rating: 4.8, status: "confirmed", date: "Feb 20, 2026", time: "10:00 AM", phone: "+972 50-123-4567", description: "Fix kitchen light switch + install new outlet" },        // הזמנה אושרה
    { id: "ORD-1038", proName: "Yosi Ben-Tzur", proRole: "Plumber", proAvatar: null, rating: 4.6, status: "in_progress", date: "Feb 18, 2026", time: "2:00 PM", phone: "+972 52-987-6543", description: "Bathroom pipe leak — needs immediate repair" },            // הזמנה בתהליך
    { id: "ORD-1025", proName: "Dana Levy", proRole: "Painter", proAvatar: null, rating: 4.9, status: "pending", date: "Feb 22, 2026", time: "9:00 AM", phone: "+972 54-111-2222", description: "Paint living room walls — white to light grey" },                  // הזמנה ממתינה
    { id: "ORD-1020", proName: "Lior Azulay", proRole: "AC Technician", proAvatar: null, rating: 4.7, status: "completed", date: "Feb 15, 2026", time: "11:00 AM", phone: "+972 53-444-5555", description: "AC unit maintenance + filter replacement" },           // הזמנה הושלמה
  ],
  he: [   // אותן הזמנות בעברית
    { id: "ORD-1041", proName: "אורי כהן", proRole: "חשמלאי", proAvatar: null, rating: 4.8, status: "confirmed", date: "20/02/2026", time: "10:00", phone: "+972 50-123-4567", description: "תיקון מתג תאורה במטבח + התקנת שקע חדש" },
    { id: "ORD-1038", proName: "יוסי בן-צור", proRole: "שרברב", proAvatar: null, rating: 4.6, status: "in_progress", date: "18/02/2026", time: "14:00", phone: "+972 52-987-6543", description: "נזילת צינור באמבטיה — דרוש תיקון מיידי" },
    { id: "ORD-1025", proName: "דנה לוי", proRole: "צבעית", proAvatar: null, rating: 4.9, status: "pending", date: "22/02/2026", time: "09:00", phone: "+972 54-111-2222", description: "צביעת קירות הסלון — מלבן לאפור בהיר" },
    { id: "ORD-1020", proName: "ליאור אזולאי", proRole: "טכנאי מזגנים", proAvatar: null, rating: 4.7, status: "completed", date: "15/02/2026", time: "11:00", phone: "+972 53-444-5555", description: "תחזוקת מזגן + החלפת פילטר" },
  ],
};

/* ═══════════════════════════════════════════════
   הקומפוננטה הראשית - דשבורד הלקוח
   ═══════════════════════════════════════════════ */
export default function ClientDashboard() {
  const navigate = useNavigate();                                         // כלי לניווט בין דפים
  var t = translate;                                                       // פונקציית תרגום (קיצור)
  var dir = getDir();                                                      // כיוון הטקסט (rtl/ltr)
  var lang = getLang();                                                    // השפה הנוכחית (he/en)
  var MOCK_ORDERS = MOCK_ORDERS_DATA[lang] || MOCK_ORDERS_DATA.en;          // בוחר את ההזמנות בשפה הנכונה
  const [mounted, setMounted] = useState(false);                           // האם הקומפוננטה נטענה? (אנימציה)
  const [userName] = useState(localStorage.getItem('fullName') || "Guest"); // שם המשתמש מ-localStorage (אחרי התחברות)
 const [orders, setOrders] = useState([]);                                 // רשימת הזמנות (מתמלאת מהשרת)

/* ─── טעינת הזמנות מהשרת - רץ פעם אחת כשהדף נטען ─── */
useEffect(() => {
  const token = localStorage.getItem('token');                             // מוציא את טוקן ההזדהות מ-localStorage
  fetch('http://localhost:8080/api/client/bookings', {                     // שולח בקשה לשרת לקבלת ההזמנות
    headers: { 'Authorization': 'Bearer ' + token }                        // שולח את הטוקן לזיהוי
  })
  .then(res => res.json())                                                 // מפענח את התשובה לאובייקט JSON
  .then(data => {
    if (Array.isArray(data)) {                                             // בודק שהתשובה היא מערך
      const mapped = data.map(o => ({                                      // ממיר כל הזמנה לפורמט של הדף
        id: `ORD-${o.id}`,                                                  // מוסיף "ORD-" לפני המזהה
        proName: o.pro?.fullName || "Professional",                         // שם המקצוען (או ברירת מחדל)
        proRole: o.serviceType || "Service",                                // סוג השירות
        proAvatar: null,
        rating: 0,
        status: o.status?.toLowerCase() === "completed" ? "completed" :    // ממיר את הסטטוס לאותיות קטנות
                o.status?.toLowerCase() === "confirmed" ? "confirmed" :
                o.status?.toLowerCase() === "in_progress" ? "in_progress" :
                o.status?.toLowerCase() === "cancelled" ? "cancelled" : "pending",  // ברירת מחדל: ממתין
        date: o.scheduledAt || "",                                          // תאריך ההזמנה
        time: "",
        phone: o.pro?.phone || "",                                          // טלפון המקצוען
        description: o.notes || ""                                          // תיאור העבודה
      }));
      setOrders(mapped);                                                    // שומר את ההזמנות במצב
    }
  })
  .catch(err => console.log('Error:', err));                               // טיפול בשגיאה (הדפסה לקונסול)
}, []);                                                                     // [] = רץ פעם אחת בלבד

/* ─── אנימציית כניסה של הדף ─── */
useEffect(() => {
  const tm = setTimeout(() => setMounted(true), 50);                       // אחרי 50ms מפעיל אנימציה
  return () => clearTimeout(tm);                                            // ניקוי אם עוזבים את הדף
}, []);
  /* ─── משתני UI - שולטים על תפריטים ומודלים ─── */
  const [showNotif, setShowNotif] = useState(false);       // האם תפריט ההתראות פתוח?
  const [showProfile, setShowProfile] = useState(false);    // האם תפריט הפרופיל פתוח?

  /* ─── רשימת התראות (בדוגמה - בעתיד מהשרת) ─── */
  const [notifications, setNotifications] = useState(lang === "he" ? [
    { id: "n1", type: "confirmed", text: "ההזמנה שלך עם אורי כהן אושרה", time: "לפני שעתיים", read: false },       // התראה חדשה
    { id: "n2", type: "in_progress", text: "יוסי בן-צור בדרך אליכם", time: "לפני 30 דקות", read: false },           // התראה חדשה
    { id: "n3", type: "completed", text: "העבודה עם ליאור אזולאי הושלמה. דרגו עכשיו!", time: "אתמול", read: true },  // התראה שנקראה
    { id: "n4", type: "cancelled", text: "ההזמנה ORD-1015 בוטלה", time: "לפני יומיים", read: true },                 // התראה שנקראה
  ] : [
    { id: "n1", type: "confirmed", text: "Your order with Ori Cohen has been confirmed", time: "2 hours ago", read: false },
    { id: "n2", type: "in_progress", text: "Yosi Ben-Tzur is on the way to your location", time: "30 min ago", read: false },
    { id: "n3", type: "completed", text: "Job with Lior Azulay has been completed. Rate now!", time: "Yesterday", read: true },
    { id: "n4", type: "cancelled", text: "Your order ORD-1015 has been cancelled", time: "2 days ago", read: true },
  ]);

  /* ─── משתני מודלים (חלונות קופצים) ─── */
  const [editOrder, setEditOrder] = useState(null);         // איזו הזמנה עורכים? (null = אין)
  const [trackOrder, setTrackOrder] = useState(null);       // איזו הזמנה עוקבים אחריה?
  const [cancelConfirm, setCancelConfirm] = useState(null); // איזו הזמנה לבטל?
  const [editDate, setEditDate] = useState("");             // תאריך חדש (לעריכה)
  const [editTime, setEditTime] = useState("");             // שעה חדשה (לעריכה)
  const [editDesc, setEditDesc] = useState("");             // תיאור חדש (לעריכה)

  /* ─── אנימציית כניסה (שוב - גיבוי) ─── */
  useEffect(() => { const tm = setTimeout(() => setMounted(true), 50); return () => clearTimeout(tm); }, []);

  const activeOrders = orders;    // קיצור לרשימת ההזמנות הפעילות

  /* ═══════════════════════════════════════════════
     מפת הסטטוסים - צבע וטקסט לכל סטטוס הזמנה
     ═══════════════════════════════════════════════ */
  const STATUS_MAP = {
    pending:     { label: t("cd_pending"),     color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },   // כתום - ממתין
    confirmed:   { label: t("cd_confirmed"),   color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },   // כחול - אושר
    in_progress: { label: t("cd_in_progress"), color: "#10B981", bg: "rgba(16,185,129,0.1)"  },   // ירוק - בתהליך
    completed:   { label: t("cd_completed"),   color: "#6B7280", bg: "rgba(107,114,128,0.1)" },   // אפור - הושלם
    cancelled:   { label: lang === "he" ? "בוטל" : "Cancelled", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },  // אדום - בוטל
  };

  /* ─── פונקציות עריכת הזמנה ─── */
  const openEdit = (order) => { setEditOrder(order); setEditDate(order.date); setEditTime(order.time); setEditDesc(order.description); };      // פותח מודל עריכה עם ערכי ההזמנה
  const saveEdit = () => { setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, date: editDate, time: editTime, description: editDesc } : o)); setEditOrder(null); };  // שומר שינויים

  /* ─── פונקציות ביטול הזמנה ─── */
  const CANCEL_FEE = 50;                                                                                                                        // דמי ביטול בש"ח (אם פחות מ-48 שעות)
  const getHoursUntilOrder = (order) => { const d = new Date(`${order.date} ${order.time}`); return Math.max(0, Math.round((d - new Date()) / 36e5)); };   // מחשב שעות עד ההזמנה
  const isWithin48Hours = (order) => getHoursUntilOrder(order) < 48;                                                                             // האם נשארו פחות מ-48 שעות?
  const confirmCancel = () => { setOrders(prev => prev.filter(o => o.id !== cancelConfirm.id)); setCancelConfirm(null); };                      // מבצע את הביטול (מסיר מהרשימה)

  /* ─── פונקציות התראות ─── */
  const unreadCount = notifications.filter(n => !n.read).length;                                      // מספר התראות שלא נקראו
  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));  // מסמן התראה אחת כנקראה
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));          // מסמן את כל ההתראות כנקראו
  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));          // מוחק התראה אחת

  /* ─── מפת אייקונים להתראות - לפי סוג ─── */
  const NOTIF_ICONS = {
    confirmed:   { icon: "✓", color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },   // כחול - אושר
    in_progress: { icon: "→", color: "#10B981", bg: "rgba(16,185,129,0.1)"  },   // ירוק - בתהליך
    completed:   { icon: "★", color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },   // צהוב - הושלם
    cancelled:   { icon: "✕", color: "#EF4444", bg: "rgba(239,68,68,0.1)"   },   // אדום - בוטל
  };

  /* ─── שלבי ההתקדמות של הזמנה (למודל המעקב) ─── */
  const getProgressSteps = (order) => [
    { label: t("cd_order_placed"), done: true,                              time: "Feb 17, 10:30 AM" },  // שלב 1: הזמנה נשלחה (תמיד הושלם)
    { label: t("cd_pro_assigned"), done: true,                              time: "Feb 17, 11:00 AM" },  // שלב 2: מקצוען הוקצה (תמיד הושלם)
    { label: t("cd_pro_on_way"),   done: order.status === "in_progress",    time: order.status === "in_progress" ? "Feb 18, 1:45 PM" : "" },  // שלב 3: בדרך (רק אם in_progress)
    { label: t("cd_work_started"), done: false,                             time: "" },                   // שלב 4: העבודה החלה
    { label: t("cd_job_completed"),done: false,                             time: "" },                   // שלב 5: העבודה הושלמה
  ];

  /* ═══════════════════════════════════════════════
     החלק שמחזיר את ה-HTML שמוצג על המסך
     ═══════════════════════════════════════════════ */
  return (
    <div className={`cd-page ${mounted ? "cd-page--vis" : ""}`} style={{ direction: dir }}>  {/* עטיפת הדף - מחלקה דינמית לאנימציה, וכיוון לפי שפה */}

      {/* ═══ תפריט ניווט עליון ═══ */}
      <nav className="cd-nav">
        <div className="cd-nav-inner">
          {/* לוגו FixMate */}
          <div className="cd-logo">
            <div className="cd-logo-icon"><IconWrench /></div>                                      {/* אייקון מפתח ברגים */}
            <span className="cd-logo-text">Fix<span className="cd-logo-blue">Mate</span></span>      {/* Fix באחד צבע, Mate בצבע אחר */}
          </div>
          {/* צד ימין/שמאל של הניווט - התראות, פרופיל, יציאה */}
          <div className="cd-nav-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* ═══ פעמון התראות ═══ */}
            <div className="cd-notif-wrap">
              {/* כפתור הפעמון - לחיצה פותחת את התפריט */}
              <button className="cd-nav-icon-btn" title={t("cd_notifications")} onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
                <IconBell />
                {unreadCount > 0 && <span className="cd-notif-dot">{unreadCount}</span>}   {/* נקודה אדומה עם מספר אם יש התראות לא-נקראות */}
              </button>
              {/* התפריט הנפתח - מוצג רק אם showNotif=true */}
              {showNotif && (
                <>
                  <div className="cd-notif-backdrop" onClick={() => setShowNotif(false)} />    {/* רקע שקוף - לחיצה עליו סוגרת את התפריט */}
                  <div className="cd-notif-dropdown">
                    {/* כותרת התפריט */}
                    <div className="cd-notif-header">
                      <h4 className="cd-notif-title">{t("cd_notifications")}</h4>
                      {unreadCount > 0 && <button className="cd-notif-mark-all" onClick={markAllRead}>{t("cd_mark_all")}</button>}   {/* כפתור "סמן הכל כנקרא" */}
                    </div>
                    {/* אם אין התראות - הודעה ריקה, אחרת רשימה */}
                    {notifications.length === 0 ? (
                      <div className="cd-notif-empty"><IconBell /><p>{t("cd_no_notif")}</p></div>
                    ) : (
                      <div className="cd-notif-list">
                        {notifications.map((n) => {                                    // מעבר על כל התראה
                          const icon = NOTIF_ICONS[n.type] || NOTIF_ICONS.confirmed;    // בוחר אייקון לפי סוג
                          return (
                            <div className={`cd-notif-item ${!n.read ? "cd-notif-item--unread" : ""}`} key={n.id} onClick={() => markAsRead(n.id)}>   {/* מחלקה --unread אם לא נקראה */}
                              <div className="cd-notif-icon" style={{ color: icon.color, background: icon.bg }}>{icon.icon}</div>
                              <div className="cd-notif-content">
                                <p className="cd-notif-text">{n.text}</p>
                                <span className="cd-notif-time">{n.time}</span>
                              </div>
                              <button className="cd-notif-dismiss" onClick={(e) => { e.stopPropagation(); clearNotification(n.id); }} title="Dismiss">✕</button>   {/* כפתור X למחיקת התראה */}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ═══ תפריט פרופיל ═══ */}
            <div className="cd-profile-wrap">
              {/* כפתור הפרופיל */}
              <button className="cd-nav-icon-btn" title="Profile" onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
                <IconUser />
              </button>
              {/* התפריט הנפתח של הפרופיל */}
              {showProfile && (
                <>
                  <div className="cd-notif-backdrop" onClick={() => setShowProfile(false)} />   {/* רקע שקוף לסגירה */}
                  <div className="cd-profile-dropdown">
                    {/* כותרת - שם ומייל המשתמש */}
                    <div className="cd-profile-header">
                      <div className="cd-profile-avatar">M</div>                              {/* אות ראשונה */}
                      <div className="cd-profile-info">
                        <h4 className="cd-profile-name">{userName}</h4>
                        <p className="cd-profile-email">michael@email.com</p>
                      </div>
                    </div>
                    {/* תפריט הפעולות */}
                    <div className="cd-profile-menu">
                      <button className="cd-profile-menu-item" onClick={() => { setShowProfile(false); navigate("/client/profile"); }}><IconEdit /><span>{t("cd_edit_profile")}</span></button>   {/* עריכת פרופיל */}
                      <button className="cd-profile-menu-item" onClick={() => setShowProfile(false)}><IconHistory /><span>{t("cd_order_history")}</span></button>                                   {/* היסטוריית הזמנות */}
                      <button className="cd-profile-menu-item" onClick={() => setShowProfile(false)}><IconHeart /><span>{t("cd_saved_pros")}</span></button>                                        {/* מקצוענים שמורים */}
                      <button className="cd-profile-menu-item" onClick={() => setShowProfile(false)}><IconSettings /><span>{t("cd_settings")}</span></button>                                       {/* הגדרות */}
                    </div>
                    {/* כפתור יציאה בתחתית */}
                    <div className="cd-profile-footer">
                      <button className="cd-profile-logout" onClick={() => navigate("/login")}><IconLogout /><span>{t("cd_logout")}</span></button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* כפתור יציאה מהיר (מחוץ לתפריט) */}
            <button className="cd-nav-icon-btn cd-logout-btn" title={t("cd_logout")} onClick={() => navigate("/login")}><IconLogout /></button>
          </div>
        </div>
      </nav>

      {/* ═══ התוכן הראשי ═══ */}
      <main className="cd-main">

        {/* ═══ ברכה אישית למשתמש ═══ */}
        <section className="cd-greeting">
          <h1 className="cd-greeting-title">{t("cd_hello")} <span className="cd-greeting-name">{userName}</span> 👋</h1>   {/* "שלום, [שם] 👋" */}
          <p className="cd-greeting-sub">{t("cd_sub")}</p>                                                                  {/* תת-כותרת: "מה נעשה היום?" */}
        </section>

        {/* ═══ 3 כרטיסי פעולה מהירים ═══ */}
        <section className="cd-actions">
          {/* כרטיס 1: צילום תקלה (Snap) */}
          <div className="cd-action-card cd-action-card--snap" onClick={() => navigate("/client/snap")}>
            <div className="cd-action-icon-wrap cd-action-icon--orange"><IconCamera /></div>   {/* אייקון מצלמה בכתום */}
            <h3 className="cd-action-title">{t("cd_snap_title")}</h3>                           {/* כותרת: "צלם תקלה" */}
            <p className="cd-action-desc">{t("cd_snap_desc")}</p>                               {/* תיאור */}
            <div className="cd-action-arrow"><IconArrowRight /></div>                           {/* חץ בצד */}
          </div>
          {/* כרטיס 2: חיפוש מקצוען (Book) */}
          <div className="cd-action-card cd-action-card--book" onClick={() => navigate("/client/search")}>
            <div className="cd-action-icon-wrap cd-action-icon--blue"><IconSearch /></div>      {/* אייקון חיפוש בכחול */}
            <h3 className="cd-action-title">{t("cd_book_title")}</h3>
            <p className="cd-action-desc">{t("cd_book_desc")}</p>
            <div className="cd-action-arrow"><IconArrowRight /></div>
          </div>

          {/* כרטיס 3: מפת רעיונות (Idea Map) */}
          <div className="cd-action-card cd-action-card--map" onClick={() => navigate("/client/ideamap")}>
            <div className="cd-action-icon-wrap cd-action-icon--purple"><IconMindMap /></div>   {/* אייקון מפה בסגול */}
            <h3 className="cd-action-title">
              {lang === "he" ? "מפת רעיונות" : "Idea Map"}
            </h3>
            <p className="cd-action-desc">
              {lang === "he"
                ? "כל הבעיות והטיפולים שלך במפה ויזואלית"
                : "All your issues & fixes in a visual map"}
            </p>
            <div className="cd-action-arrow"><IconArrowRight /></div>
          </div>
        </section>

        {/* ═══ רשימת הזמנות פעילות ═══ */}
        <section className="cd-orders-section">
          {/* כותרת עם מספר ההזמנות */}
          <div className="cd-orders-header">
            <h2 className="cd-orders-title">{t("cd_active_orders")} <span className="cd-orders-count">{activeOrders.length}</span></h2>   {/* "הזמנות פעילות (4)" */}
          </div>

          {/* אם אין הזמנות - הודעה ריקה, אחרת רשימה */}
          {activeOrders.length === 0 ? (
            <div className="cd-orders-empty"><p>{t("cd_no_orders")}</p><p>{t("cd_book_to_start")}</p></div>
          ) : (
            <div className="cd-orders-list">
              {activeOrders.map((order) => {                                  // מעבר על כל הזמנה
                const status = STATUS_MAP[order.status];                      // שולף את המידע לסטטוס (צבע, טקסט)
                return (
                  <div className="cd-order-card" key={order.id}>
                    {/* ─── חלק עליון: תמונה, שם, סטטוס ─── */}
                    <div className="cd-order-top">
                      <div className="cd-order-avatar">{order.proName.charAt(0)}</div>    {/* האות הראשונה של שם המקצוען */}
                      <div className="cd-order-info">
                        <h4 className="cd-order-name">{order.proName}</h4>                 {/* שם המקצוען */}
                        <p className="cd-order-role">{order.proRole}</p>                    {/* המקצוע */}
                      </div>
                      <div className="cd-order-right">
                        <span className="cd-order-id">{order.id}</span>                    {/* מספר ההזמנה */}
                        <span className="cd-order-status" style={{ color: status.color, background: status.bg }}>{status.label}</span>   {/* תווית סטטוס צבעונית */}
                      </div>
                    </div>
                    {/* תיאור העבודה */}
                    <p className="cd-order-desc">{order.description}</p>
                    {/* שורת מידע: דירוג, תאריך, טלפון */}
                    <div className="cd-order-meta">
                      <span className="cd-order-meta-item"><IconStar />{order.rating}</span>               {/* ⭐ דירוג */}
                      <span className="cd-order-meta-item"><IconClock />{order.date}, {order.time}</span>  {/* 🕐 תאריך ושעה */}
                      <span className="cd-order-meta-item"><IconPhone />{order.phone}</span>                {/* 📞 טלפון */}
                    </div>
                    {/* ─── כפתורי פעולה - שונים לפי סטטוס ─── */}
                    <div className="cd-order-actions">
                      {/* סטטוס "ממתין" - אפשר לבטל/לערוך */}
                      {order.status === "pending" && (
                        <>
                          <button className="cd-order-btn cd-order-btn--cancel" onClick={() => setCancelConfirm(order)}>{t("cd_cancel")}</button>
                          <button className="cd-order-btn cd-order-btn--edit" onClick={() => openEdit(order)}>{t("cd_edit")}</button>
                        </>
                      )}
                      {/* סטטוס "אושר" - אפשר ליצור קשר/לבטל */}
                      {order.status === "confirmed" && (
                        <>
                          <button className="cd-order-btn cd-order-btn--contact" onClick={() => window.open(`tel:${order.phone}`)}><IconPhone /> {t("cd_contact_pro")}</button>   {/* פתיחת חייגן */}
                          <button className="cd-order-btn cd-order-btn--cancel" onClick={() => setCancelConfirm(order)}>{t("cd_cancel")}</button>
                        </>
                      )}
                      {/* סטטוס "בתהליך" - אפשר לעקוב */}
                      {order.status === "in_progress" && (
                        <button className="cd-order-btn cd-order-btn--track" onClick={() => setTrackOrder(order)}><IconArrowRight /> {t("cd_track")}</button>
                      )}
                      {/* סטטוס "הושלם" - אפשר לדרג */}
                      {order.status === "completed" && (
                        <button className="cd-order-btn cd-order-btn--track" onClick={() => navigate(`/client/rate?pro=${encodeURIComponent(order.proName)}&service=${encodeURIComponent(order.proRole)}`)}>⭐ {t("cd_rate")}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ═══ מודל עריכת הזמנה - מוצג רק כאשר editOrder לא null ═══ */}
      {editOrder && (
        <div className="cd-modal-overlay" onClick={() => setEditOrder(null)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
            <div className="cd-modal-header">
              <h3 className="cd-modal-title">{t("cd_edit_order")}</h3>
              <button className="cd-modal-close" onClick={() => setEditOrder(null)}>✕</button>
            </div>
            <div className="cd-modal-body">
              <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_order_id")}</label><p className="cd-modal-value">{editOrder.id}</p></div>
              <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_professional")}</label><p className="cd-modal-value">{editOrder.proName} — {editOrder.proRole}</p></div>
              <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_date")}</label><input type="text" className="cd-modal-input" value={editDate} onChange={(e) => setEditDate(e.target.value)} /></div>
              <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_time")}</label><input type="text" className="cd-modal-input" value={editTime} onChange={(e) => setEditTime(e.target.value)} /></div>
              <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_description")}</label><textarea className="cd-modal-textarea" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} /></div>
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cd-modal-btn--secondary" onClick={() => setEditOrder(null)}>{t("cancel")}</button>
              <button className="cd-modal-btn cd-modal-btn--primary" onClick={saveEdit}>{t("cd_save_changes")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ מודל מעקב אחר הזמנה - מציג ציר זמן של 5 שלבים ═══ */}
      {trackOrder && (
        <div className="cd-modal-overlay" onClick={() => setTrackOrder(null)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
            <div className="cd-modal-header">
              <h3 className="cd-modal-title">{t("cd_track_progress")}</h3>
              <button className="cd-modal-close" onClick={() => setTrackOrder(null)}>✕</button>
            </div>
            <div className="cd-modal-body">
              <div className="cd-track-summary">
                <div className="cd-order-avatar" style={{ width: 38, height: 38, fontSize: 15 }}>{trackOrder.proName.charAt(0)}</div>
                <div><h4 className="cd-order-name">{trackOrder.proName}</h4><p className="cd-order-role">{trackOrder.proRole} · {trackOrder.id}</p></div>
              </div>
              <div className="cd-timeline">
                {getProgressSteps(trackOrder).map((step, i) => (
                  <div className={`cd-timeline-step ${step.done ? "cd-timeline-step--done" : ""}`} key={i}>
                    <div className="cd-timeline-dot">{step.done ? "✓" : (i + 1)}</div>
                    <div className="cd-timeline-content"><p className="cd-timeline-label">{step.label}</p>{step.time && <p className="cd-timeline-time">{step.time}</p>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cd-modal-footer"><button className="cd-modal-btn cd-modal-btn--primary" onClick={() => setTrackOrder(null)}>{t("cd_close")}</button></div>
          </div>
        </div>
      )}

      {/* ═══ מודל ביטול הזמנה - מוצג כאשר המשתמש לחץ "בטל" ═══ */}
      {cancelConfirm && (
        <div className="cd-modal-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="cd-modal cd-modal--small" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
            <div className="cd-modal-header">
              <h3 className="cd-modal-title">{t("cd_cancel_order")}</h3>
              <button className="cd-modal-close" onClick={() => setCancelConfirm(null)}>✕</button>
            </div>
            <div className="cd-modal-body">
              <p className="cd-cancel-text">{t("cd_cancel_confirm")} <strong>{cancelConfirm.proName}</strong> ({cancelConfirm.id})?</p>
              {isWithin48Hours(cancelConfirm) ? (
                <div className="cd-cancel-fee-box cd-cancel-fee-box--paid">
                  <div className="cd-cancel-fee-icon">💰</div>
                  <div><p className="cd-cancel-fee-title">{t("cd_cancel_fee_title")} ₪{CANCEL_FEE}</p><p className="cd-cancel-fee-desc">{t("cd_cancel_fee_desc")}</p></div>
                </div>
              ) : (
                <div className="cd-cancel-fee-box cd-cancel-fee-box--free">
                  <div className="cd-cancel-fee-icon">✓</div>
                  <div><p className="cd-cancel-fee-title">{t("cd_free_cancel_title")}</p><p className="cd-cancel-fee-desc">{t("cd_free_cancel_desc")}</p></div>
                </div>
              )}
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cd-modal-btn--secondary" onClick={() => setCancelConfirm(null)}>{t("cd_go_back")}</button>
              <button className="cd-modal-btn cd-modal-btn--danger" onClick={confirmCancel}>
                {t("cd_cancel")} {isWithin48Hours(cancelConfirm) ? `(₪${CANCEL_FEE})` : (lang === "he" ? "— חינם" : "— Free")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}