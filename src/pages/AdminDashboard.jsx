/**
 * FixMate – Admin Dashboard
 * ROUTE: /admin
 * FILE:  src/pages/AdminDashboard.jsx
 *
 * 🚩 BACKEND:
 *  GET  /api/admin/stats
 *  GET  /api/admin/pending-pros
 *  PUT  /api/admin/pros/:id/approve
 *  PUT  /api/admin/pros/:id/reject
 *  GET  /api/admin/complaints
 *  PUT  /api/admin/complaints/:id/resolve
 *  GET  /api/admin/users
 *  PUT  /api/admin/users/:id/suspend
 *  GET  /api/admin/orders
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";

const useL = () => {
  const lang = getLang();
  const isHe = lang === "he";
  return { isHe, L: (en, he) => (isHe ? he : en), dir: getDir() };
};

/* ─── Icons ─── */
const Svg = ({ ch, s = 18, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round">
    {ch}
  </svg>
);
const IcoGrid   = () => <Svg ch={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>}/>;
const IcoUsers  = () => <Svg ch={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>;
const IcoShield = () => <Svg ch={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}/>;
const IcoAlert  = () => <Svg ch={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;
const IcoClip   = () => <Svg ch={<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>}/>;
const IcoDollar = () => <Svg ch={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>;
const IcoCheck  = () => <Svg s={14} ch={<polyline points="20 6 9 17 4 12"/>}/>;
const IcoX      = () => <Svg s={14} ch={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;
const IcoEye    = () => <Svg s={14} ch={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const IcoBan    = () => <Svg s={14} ch={<><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>}/>;
const IcoSearch = () => <Svg s={15} ch={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>;
const IcoTrend  = () => <Svg s={14} ch={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>}/>;
const IcoLogout = () => <Svg s={17} ch={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}/>;
const IcoWrench = () => <Svg s={18} ch={<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}/>;
const IcoChevR  = () => <Svg s={14} ch={<polyline points="9 18 15 12 9 6"/>}/>;
const IcoBack   = () => <Svg s={15} ch={<polyline points="15 18 9 12 15 6"/>}/>;
const IcoStar   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoMail   = () => <Svg s={13} ch={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}/>;
const IcoPhone  = () => <Svg s={13} ch={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>}/>;
const IcoRefresh= () => <Svg s={14} ch={<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>}/>;

/* Activity SVG icons */
const ActUser   = () => <Svg s={17} ch={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const ActWrench = () => <Svg s={17} ch={<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}/>;
const ActAlert  = () => <Svg s={17} ch={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;
const ActCheck  = () => <Svg s={17} w={2.5} ch={<polyline points="20 6 9 17 4 12"/>}/>;
const ActDollar = () => <Svg s={17} ch={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>;

/* ─── Mock Data ─── */
const STATS = {
  totalUsers: 1284, totalPros: 318, totalOrders: 4720,
  monthRevenue: 128400, openComplaints: 7, pendingApprovals: 4,
  ordersToday: 38, growth: 12,
};

const PENDING_PROS = [
  { id: "p1", name: "Yossi Azulay",  nameHe: "יוסי אזולאי",  trade: "Electrician",   tradeHe: "חשמלאי",        city: "Tel Aviv",   cityHe: "תל אביב",  phone: "+972-52-100-1111", email: "yossi@email.com", exp: "8 years",  expHe: "8 שנים",  joined: "Mar 10, 2026", docs: 3, avatar: "Y" },
  { id: "p2", name: "Kobi Mansour",  nameHe: "קובי מנסור",    trade: "Plumber",       tradeHe: "אינסטלטור",     city: "Haifa",      cityHe: "חיפה",      phone: "+972-54-200-2222", email: "kobi@email.com",  exp: "5 years",  expHe: "5 שנים",  joined: "Mar 11, 2026", docs: 2, avatar: "K" },
  { id: "p3", name: "Sami Barakat",  nameHe: "סאמי ברכאת",    trade: "AC Tech",       tradeHe: "מיזוג אוויר",   city: "Ramla",      cityHe: "רמלה",      phone: "+972-50-300-3333", email: "sami@email.com",  exp: "12 years", expHe: "12 שנים", joined: "Mar 12, 2026", docs: 4, avatar: "S" },
  { id: "p4", name: "Avi Cohen",     nameHe: "אבי כהן",        trade: "Handyman",      tradeHe: "כל-בו",         city: "Beer Sheva", cityHe: "באר שבע",   phone: "+972-53-400-4444", email: "avi@email.com",   exp: "3 years",  expHe: "3 שנים",  joined: "Mar 13, 2026", docs: 2, avatar: "A" },
];

const COMPLAINTS = [
  { id: "c1", from: "Sarah Cohen",   fromHe: "שרה כהן",      role: "Client", roleHe: "לקוח",      subject: "Pro didn't show up",          subjectHe: "בעל המקצוע לא הגיע",       status: "open",     priority: "high",   date: "Mar 12, 2026", orderId: "ORD-2050", assignedTo: null       },
  { id: "c2", from: "David Mizrahi", fromHe: "דוד מזרחי",    role: "Pro",    roleHe: "בעל מקצוע", subject: "Client cancelled last minute", subjectHe: "לקוח ביטל ברגע האחרון",    status: "open",     priority: "medium", date: "Mar 11, 2026", orderId: "ORD-2048", assignedTo: null       },
  { id: "c3", from: "Noa Katz",      fromHe: "נועה כץ",      role: "Client", roleHe: "לקוח",      subject: "Overcharged for service",      subjectHe: "חיוב יתר על השירות",        status: "open",     priority: "high",   date: "Mar 10, 2026", orderId: "ORD-2043", assignedTo: "Admin 1" },
  { id: "c4", from: "Moshe Peretz",  fromHe: "משה פרץ",      role: "Pro",    roleHe: "בעל מקצוע", subject: "Payment not received",         subjectHe: "תשלום לא התקבל",            status: "resolved", priority: "low",    date: "Mar 8, 2026",  orderId: "ORD-2041", assignedTo: "Admin 2" },
  { id: "c5", from: "Rina Goldberg", fromHe: "רינה גולדברג",  role: "Client", roleHe: "לקוח",      subject: "Poor quality of work",         subjectHe: "איכות עבודה ירודה",         status: "resolved", priority: "medium", date: "Mar 7, 2026",  orderId: "ORD-2039", assignedTo: "Admin 1" },
];

const USERS = [
  { id: "u1", name: "Sarah Cohen",   nameHe: "שרה כהן",     role: "client", roleHe: "לקוח",      email: "sarah@email.com", city: "Tel Aviv",  cityHe: "תל אביב", orders: 8,   joined: "Jan 5, 2026",  status: "active",    avatar: "S", rating: null },
  { id: "u2", name: "Moshe Peretz",  nameHe: "משה פרץ",     role: "client", roleHe: "לקוח",      email: "moshe@email.com", city: "Ramat Gan", cityHe: "רמת גן",  orders: 3,   joined: "Feb 1, 2026",  status: "active",    avatar: "M", rating: null },
  { id: "u3", name: "David Mizrahi", nameHe: "דוד מזרחי",   role: "pro",    roleHe: "בעל מקצוע", email: "david@email.com", city: "Tel Aviv",  cityHe: "תל אביב", orders: 142, joined: "Nov 3, 2025",  status: "active",    avatar: "D", rating: 4.8  },
  { id: "u4", name: "Noa Katz",      nameHe: "נועה כץ",     role: "client", roleHe: "לקוח",      email: "noa@email.com",   city: "Herzliya",  cityHe: "הרצליה",  orders: 5,   joined: "Dec 12, 2025", status: "suspended", avatar: "N", rating: null },
  { id: "u5", name: "Rina Goldberg", nameHe: "רינה גולדברג", role: "client", roleHe: "לקוח",      email: "rina@email.com",  city: "Tel Aviv",  cityHe: "תל אביב", orders: 11,  joined: "Oct 20, 2025", status: "active",    avatar: "R", rating: null },
  { id: "u6", name: "Amit Levy",     nameHe: "עמית לוי",    role: "pro",    roleHe: "בעל מקצוע", email: "amit@email.com",  city: "Haifa",     cityHe: "חיפה",    orders: 89,  joined: "Sep 14, 2025", status: "active",    avatar: "A", rating: 4.5  },
];

const RECENT_ORDERS = [
  { id: "ORD-2055", client: "Maya Shapira", clientHe: "מאיה שפירא", pro: "David Mizrahi", proHe: "דוד מזרחי",  service: "Electrical panel", serviceHe: "לוח חשמל",   price: 550, status: "in_progress", date: "Mar 13" },
  { id: "ORD-2054", client: "Ran Biton",    clientHe: "רן ביטון",    pro: "Amit Levy",     proHe: "עמית לוי",   service: "Ceiling fan",      serviceHe: "מאוורר תקרה", price: 480, status: "pending",     date: "Mar 13" },
  { id: "ORD-2053", client: "Hila Peretz",  clientHe: "הילה פרץ",   pro: "David Mizrahi", proHe: "דוד מזרחי",  service: "Fix outlet",       serviceHe: "תיקון שקע",   price: 320, status: "done",        date: "Mar 12" },
  { id: "ORD-2052", client: "Tamar Levi",   clientHe: "תמר לוי",    pro: "Sami Bar",      proHe: "סאמי בר",    service: "AC install",       serviceHe: "התקנת מזגן",   price: 890, status: "done",        date: "Mar 12" },
  { id: "ORD-2051", client: "Amit Levy",    clientHe: "עמית לוי",   pro: "Kobi Green",    proHe: "קובי גרין",  service: "Pipe fix",         serviceHe: "תיקון צינור",  price: 380, status: "cancelled",   date: "Mar 11" },
];

const ACTIVITY = [
  { id: 1, Icon: ActUser,    color: "#3B82F6", bg: "#EFF6FF", text: { en: "New client Sarah Cohen registered",          he: "לקוח חדש שרה כהן נרשמה"              }, time: { en: "2 min ago",  he: "לפני 2 דקות"  } },
  { id: 2, Icon: ActWrench,  color: "#F59E0B", bg: "#FFFBEB", text: { en: "Pro Yossi Azulay submitted approval request", he: "יוסי אזולאי הגיש בקשת אישור"         }, time: { en: "15 min ago", he: "לפני 15 דקות" } },
  { id: 3, Icon: ActAlert,   color: "#EF4444", bg: "#FEF2F2", text: { en: "New complaint from Noa Katz (ORD-2043)",      he: "תלונה חדשה מנועה כץ (ORD-2043)"      }, time: { en: "1 hour ago", he: "לפני שעה"     } },
  { id: 4, Icon: ActCheck,   color: "#10B981", bg: "#ECFDF5", text: { en: "Order ORD-2053 marked as completed",          he: "הזמנה ORD-2053 הושלמה"                }, time: { en: "2 hours ago",he: "לפני 2 שעות"  } },
  { id: 5, Icon: ActDollar,  color: "#8B5CF6", bg: "#F5F3FF", text: { en: "Revenue milestone: ₪128,000 this month",      he: "אבן דרך הכנסה: ₪128,000 החודש"       }, time: { en: "Today",      he: "היום"          } },
];

/* ─── status helpers ─── */
const ORDER_STATUS = {
  pending:     { bg: "#FEF3C7", color: "#92400E" },
  in_progress: { bg: "#EDE9FE", color: "#5B21B6" },
  done:        { bg: "#D1FAE5", color: "#065F46" },
  cancelled:   { bg: "#FEE2E2", color: "#991B1B" },
};
const COMP_PRI = {
  high:   { bg: "#FEE2E2", color: "#991B1B" },
  medium: { bg: "#FEF3C7", color: "#92400E" },
  low:    { bg: "#D1FAE5", color: "#065F46" },
};

/* ════════════════════════════════════
   Component
════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate         = useNavigate();
  const { isHe, L, dir } = useL();

  const [mounted,  setMounted ] = useState(false);
  const [section,  setSection ] = useState("overview");
  const [pros,     setPros    ] = useState(PENDING_PROS);
  const [comps,    setComps   ] = useState(COMPLAINTS);
  const [users,    setUsers   ] = useState(USERS);
  const [modal,    setModal   ] = useState(null);
  const [search,   setSearch  ] = useState("");
  const [filter,   setFilter  ] = useState("all");
  const [toast,    setToast   ] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  /* actions */
  const approvePro  = (id) => { setPros(p => p.filter(x => x.id !== id)); showToast(L("Pro approved ✓", "בעל מקצוע אושר ✓")); setModal(null); };
  const rejectPro   = (id) => { setPros(p => p.filter(x => x.id !== id)); showToast(L("Pro rejected", "בעל מקצוע נדחה"), "warning"); setModal(null); };
  const resolveComp = (id) => { setComps(p => p.map(x => x.id === id ? { ...x, status: "resolved" } : x)); showToast(L("Complaint resolved ✓", "תלונה טופלה ✓")); setModal(null); };
  const toggleUser  = (id) => { setUsers(p => p.map(x => x.id === id ? { ...x, status: x.status === "suspended" ? "active" : "suspended" } : x)); showToast(L("User updated", "משתמש עודכן"), "info"); setModal(null); };

  /* nav */
  const NAV = [
    { id: "overview",   label: L("Overview",   "סקירה"),       Icon: IcoGrid,  badge: null },
    { id: "approvals",  label: L("Approvals",  "אישורים"),     Icon: IcoShield,badge: pros.length || null },
    { id: "complaints", label: L("Complaints", "תלונות"),      Icon: IcoAlert, badge: comps.filter(c => c.status === "open").length || null },
    { id: "users",      label: L("Users",      "משתמשים"),     Icon: IcoUsers, badge: null },
    { id: "orders",     label: L("Orders",     "הזמנות"),      Icon: IcoClip,  badge: null },
  ];

  /* back button */
  const BackBtn = () => (
    <button
      onClick={() => setSection("overview")}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 22, border: "1.5px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all .16s" }}
    >
      <IcoBack /> {L("Back", "חזרה")}
    </button>
  );

  return (
    <div style={{ fontFamily: isHe ? "'Heebo',sans-serif" : "'DM Sans',sans-serif", background: "#F0F2F8", minHeight: "100vh", direction: dir, opacity: mounted ? 1 : 0, transition: "opacity .35s", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800;900&family=Heebo:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(.94)}       to{opacity:1;transform:scale(1)}      }
        @keyframes toastIn{ from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .nav-item { transition:all .15s; cursor:pointer; border-radius:12px; }
        .nav-item:hover { background:rgba(255,255,255,.08) !important; }
        .hb { transition:all .16s; cursor:pointer; }
        .hb:hover { filter:brightness(1.07); transform:translateY(-1px); }
        .hb:active { transform:scale(.97); }
        .trow { transition:background .12s; }
        .trow:hover { background:#F8FAFF !important; }
        .stat-card { transition:all .2s; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.09) !important; }
        * { box-sizing:border-box; margin:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
        @media(max-width:900px) {
          .sidebar { width:72px !important; }
          .sidebar .nav-label { display:none !important; }
          .sidebar .logo-text { display:none !important; }
        }
      `}</style>

      {/* ══ SIDEBAR ══ */}
      <aside className="sidebar" style={{ width: 240, background: "linear-gradient(180deg,#0F172A 0%,#1E293B 100%)", minHeight: "100vh", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 50 }}>

        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", flexShrink: 0 }}>
              <IcoWrench />
            </div>
            <div className="logo-text">
              <p style={{ fontFamily: "'Outfit'", fontSize: 17, fontWeight: 800, color: "#FFF", lineHeight: 1 }}>FixMate</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", marginTop: 2 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(item => (
            <div key={item.id} className="nav-item"
              onClick={() => setSection(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: section === item.id ? "rgba(37,99,235,.25)" : "transparent", borderRadius: 12, border: section === item.id ? "1px solid rgba(37,99,235,.35)" : "1px solid transparent", position: "relative" }}>
              <span style={{ color: section === item.id ? "#60A5FA" : "rgba(255,255,255,.5)", flexShrink: 0 }}><item.Icon /></span>
              <span className="nav-label" style={{ fontSize: 13, fontWeight: 600, color: section === item.id ? "#E0EAFF" : "rgba(255,255,255,.55)" }}>{item.label}</span>
              {item.badge && (
                <span style={{ marginInlineStart: "auto", minWidth: 20, height: 20, borderRadius: 10, background: "#EF4444", color: "#FFF", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{item.badge}</span>
              )}
              {section === item.id && (
                <span style={{ position: "absolute", insetInlineStart: 0, top: "25%", bottom: "25%", width: 3, borderRadius: "0 2px 2px 0", background: "#3B82F6" }} />
              )}
            </div>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding: "14px 12px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,.05)", marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#7C3AED,#5B21B6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>A</div>
            <div className="logo-text">
              <p style={{ fontSize: 12, fontWeight: 700, color: "#FFF" }}>Admin</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>admin@fixmate.com</p>
            </div>
          </div>
          <button onClick={() => navigate("/login")} className="hb"
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, background: "transparent", border: "none", color: "rgba(255,255,255,.35)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <IcoLogout /><span className="nav-label">{L("Sign Out", "יציאה")}</span>
          </button>
        </div>
      </aside>

      {/* ══ CONTENT ══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 60px", minWidth: 0 }}>

        {/* ─── OVERVIEW ─── */}
        {section === "overview" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("Platform Overview", "סקירת מערכת")}
              sub={new Date().toLocaleDateString(isHe ? "he-IL" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              action={
                <button onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 20, border: "1.5px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  <IcoRefresh /> {L("Refresh", "רענן")}
                </button>
              }
            />

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 26 }}>
              {[
                { Icon: IcoUsers,  n: STATS.totalUsers,    label: L("Total Users",        "משתמשים"),          sub: L("+24 this week", "+24 השבוע"),  color: "#2563EB", bg: "#EFF6FF" },
                { Icon: IcoWrench, n: STATS.totalPros,     label: L("Active Pros",        "בעלי מקצוע"),       sub: L("+6 this week",  "+6 השבוע"),   color: "#8B5CF6", bg: "#F5F3FF" },
                { Icon: IcoClip,   n: STATS.totalOrders,   label: L("Total Orders",       "הזמנות"),           sub: L("+38 today",     "+38 היום"),   color: "#10B981", bg: "#ECFDF5" },
                { Icon: IcoDollar, n: `₪${(STATS.monthRevenue / 1000).toFixed(0)}K`, label: L("Monthly Revenue", "הכנסה חודשית"), sub: `+${STATS.growth}%`, color: "#F59E0B", bg: "#FFFBEB" },
                { Icon: IcoAlert,  n: STATS.openComplaints,label: L("Open Complaints",    "תלונות פתוחות"),    sub: L("Needs attention","דורש טיפול"), color: "#EF4444", bg: "#FEF2F2" },
                { Icon: IcoShield, n: STATS.pendingApprovals,label: L("Pending Approvals","ממתינים לאישור"),   sub: L("Pros waiting",  "בעלי מקצוע"), color: "#F59E0B", bg: "#FFFBEB" },
              ].map((c, i) => (
                <div key={i} className="stat-card" style={{ background: "#FFF", borderRadius: 18, padding: "20px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.04)", animation: `fadeUp ${.35 + i * .04}s both` }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><c.Icon /></div>
                  <p style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 900, color: "#1A2B4A", lineHeight: 1, marginBottom: 4 }}>{c.n}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginBottom: 4 }}>{c.label}</p>
                  <p style={{ fontSize: 11, color: "#10B981" }}>{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

              {/* Recent Orders */}
              <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#1A2B4A" }}>{L("Recent Orders", "הזמנות אחרונות")}</h3>
                  <button onClick={() => setSection("orders")} className="hb" style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "inherit" }}>
                    {L("See all", "כל ההזמנות")} <IcoChevR />
                  </button>
                </div>
                {RECENT_ORDERS.slice(0, 4).map((o, i) => {
                  const st = ORDER_STATUS[o.status];
                  return (
                    <div key={o.id} className="trow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 22px", borderBottom: i < 3 ? "1px solid #F8FAFC" : "none", background: "#FFF" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", marginBottom: 2 }}>
                          {isHe ? o.clientHe : o.client} <span style={{ color: "#94A3B8", fontWeight: 400 }}>→ {isHe ? o.proHe : o.pro}</span>
                        </p>
                        <p style={{ fontSize: 11, color: "#94A3B8" }}>{isHe ? o.serviceHe : o.service} · {o.id}</p>
                      </div>
                      <div style={{ textAlign: "end" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color }}>{L(o.status.replace("_", " "), o.status)}</span>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>₪{o.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Feed */}
              <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9" }}>
                  <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#1A2B4A" }}>{L("Live Activity", "פעילות אחרונה")}</h3>
                </div>
                {ACTIVITY.map((a, i) => (
                  <div key={a.id} style={{ display: "flex", gap: 12, padding: "14px 22px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid #F8FAFC" : "none", alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: a.bg, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <a.Icon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, marginBottom: 2 }}>{isHe ? a.text.he : a.text.en}</p>
                      <p style={{ fontSize: 10, color: "#94A3B8" }}>{isHe ? a.time.he : a.time.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── APPROVALS ─── */}
        {section === "approvals" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("Pro Approvals", "אישור בעלי מקצוע")}
              sub={L(`${pros.length} pending`, `${pros.length} ממתינים לאישור`)}
              action={<BackBtn />}
            />

            {pros.length === 0 ? (
              <EmptyState emoji="✅" title={L("All caught up!", "הכל מאושר!")} sub={L("No pending pro approvals", "אין בקשות ממתינות")} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {pros.map((pro, i) => (
                  <div key={pro.id} style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)", animation: `fadeUp ${.3 + i * .06}s both` }}>
                    <div style={{ height: 4, background: "linear-gradient(90deg,#F59E0B,#FBBF24)" }} />
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit'", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                          {pro.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                            <p style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? pro.nameHe : pro.name}</p>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>{isHe ? pro.tradeHe : pro.trade}</span>
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>📍 {isHe ? pro.cityHe : pro.city}</span>
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748B", flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcoMail />{pro.email}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IcoPhone />{pro.phone}</span>
                            <span>🗂️ {pro.docs} {L("docs", "מסמכים")}</span>
                            <span>⚙️ {isHe ? pro.expHe : pro.exp}</span>
                            <span>📅 {pro.joined}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => setModal({ type: "view_pro", data: pro })} className="hb"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 20, border: "1.5px solid #E2E8F0", background: "#F8FAFF", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            <IcoEye />{L("View", "הצג")}
                          </button>
                          <button onClick={() => rejectPro(pro.id)} className="hb"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 20, border: "1.5px solid #FECACA", background: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            <IcoX />{L("Reject", "דחה")}
                          </button>
                          <button onClick={() => setModal({ type: "approve_pro", data: pro })} className="hb"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 20px", borderRadius: 20, border: "none", background: "#059669", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(5,150,105,.28)" }}>
                            <IcoCheck />{L("Approve", "אשר")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── COMPLAINTS ─── */}
        {section === "complaints" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("Complaints", "תלונות")}
              sub={L(`${comps.filter(c => c.status === "open").length} open`, `${comps.filter(c => c.status === "open").length} פתוחות`)}
              action={
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {["all", "open", "resolved"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className="hb"
                      style={{ padding: "7px 14px", borderRadius: 20, border: filter === f ? "none" : "1.5px solid #E2E8F0", background: filter === f ? "#1A2B4A" : "#FFF", color: filter === f ? "#FFF" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {f === "all" ? L("All", "הכל") : f === "open" ? L("Open", "פתוח") : L("Resolved", "טופל")}
                    </button>
                  ))}
                  <BackBtn />
                </div>
              }
            />

            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)" }}>
              {comps.filter(c => filter === "all" || c.status === filter).map((c, i, arr) => {
                const pri = COMP_PRI[c.priority];
                return (
                  <div key={c.id} className="trow" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none", background: "#FFF", flexWrap: "wrap" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.priority === "high" ? "#EF4444" : c.priority === "medium" ? "#F59E0B" : "#10B981", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>{isHe ? c.subjectHe : c.subject}</p>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: pri.bg, color: pri.color }}>{L(c.priority, c.priority)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#64748B" }}>
                        {L("From", "מ")} <strong>{isHe ? c.fromHe : c.from}</strong> ({isHe ? c.roleHe : c.role}) · {c.orderId} · {c.date}
                      </p>
                      {c.assignedTo && <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>👤 {L("Assigned to", "משוייך ל")} {c.assignedTo}</p>}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: c.status === "open" ? "#FEF3C7" : "#D1FAE5", color: c.status === "open" ? "#92400E" : "#065F46", flexShrink: 0 }}>
                      {c.status === "open" ? L("Open", "פתוח") : L("Resolved", "טופל")}
                    </span>
                    <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                      <button onClick={() => setModal({ type: "view_complaint", data: c })} className="hb"
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 18, border: "1.5px solid #E2E8F0", background: "#F8FAFF", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        <IcoEye />{L("View", "הצג")}
                      </button>
                      {c.status === "open" && (
                        <button onClick={() => resolveComp(c.id)} className="hb"
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 18, border: "none", background: "#059669", color: "#FFF", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 10px rgba(5,150,105,.25)" }}>
                          <IcoCheck />{L("Resolve", "סגור")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── USERS ─── */}
        {section === "users" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("User Management", "ניהול משתמשים")}
              sub={L(`${users.length} total users`, `${users.length} משתמשים`)}
              action={
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: 12, color: "#94A3B8", pointerEvents: "none" }}><IcoSearch /></span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder={L("Search...", "חיפוש...")}
                      style={{ padding: "9px 16px 9px 36px", borderRadius: 22, border: "1.5px solid #E2E8F0", background: "#FFF", fontSize: 13, color: "#1A2B4A", outline: "none", width: 220, fontFamily: "inherit" }} />
                  </div>
                  <BackBtn />
                </div>
              }
            />

            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)" }}>
              {users.filter(u => {
                const q = search.toLowerCase();
                return !q || (isHe ? u.nameHe : u.name).toLowerCase().includes(q) || u.email.includes(q);
              }).map((u, i, arr) => (
                <div key={u.id} className="trow" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none", background: "#FFF", flexWrap: "wrap" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: u.role === "pro" ? "linear-gradient(135deg,#EDE9FE,#DDD6FE)" : "linear-gradient(135deg,#DBEAFE,#BFDBFE)", color: u.role === "pro" ? "#5B21B6" : "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                    {u.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>{isHe ? u.nameHe : u.name}</p>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: u.role === "pro" ? "#EDE9FE" : "#DBEAFE", color: u.role === "pro" ? "#5B21B6" : "#1E40AF" }}>
                        {isHe ? u.roleHe : u.role}
                      </span>
                      {u.rating && <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, color: "#92400E" }}><IcoStar />{u.rating}</span>}
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>{u.email} · {isHe ? u.cityHe : u.city} · {u.orders} {L("orders", "הזמנות")} · {L("Since", "מ")} {u.joined}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: u.status === "active" ? "#D1FAE5" : "#FEE2E2", color: u.status === "active" ? "#065F46" : "#991B1B", flexShrink: 0 }}>
                    {u.status === "active" ? L("Active", "פעיל") : L("Suspended", "מושעה")}
                  </span>
                  <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                    <button onClick={() => setModal({ type: "view_user", data: u })} className="hb"
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 18, border: "1.5px solid #E2E8F0", background: "#F8FAFF", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      <IcoEye />{L("View", "הצג")}
                    </button>
                    <button onClick={() => toggleUser(u.id)} className="hb"
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", borderRadius: 18, border: `1.5px solid ${u.status === "active" ? "#FECACA" : "#A7F3D0"}`, background: u.status === "active" ? "#FEF2F2" : "#ECFDF5", color: u.status === "active" ? "#DC2626" : "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {u.status === "active" ? <><IcoBan />{L("Suspend", "השעה")}</> : <><IcoCheck />{L("Restore", "שחזר")}</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {section === "orders" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("All Orders", "כל ההזמנות")}
              sub={L(`${RECENT_ORDERS.length} orders shown`, `${RECENT_ORDERS.length} הזמנות`)}
              action={<BackBtn />}
            />
            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)" }}>
              {RECENT_ORDERS.map((o, i, arr) => {
                const st = ORDER_STATUS[o.status];
                return (
                  <div key={o.id} className="trow" style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none", background: "#FFF", flexWrap: "wrap" }}>
                    <div style={{ minWidth: 100 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 2 }}>{o.id}</p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>{o.date}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A", marginBottom: 2 }}>{isHe ? o.serviceHe : o.service}</p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>{isHe ? o.clientHe : o.client} → {isHe ? o.proHe : o.pro}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#059669", fontFamily: "'Outfit'" }}>₪{o.price}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>
                      {L(o.status.replace("_", " "), o.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ════ MODALS ════ */}

      {modal?.type === "approve_pro" && (
        <Overlay onClose={() => setModal(null)}>
          <div style={{ textAlign: "center", direction: dir }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>{L("Approve this professional?", "לאשר בעל מקצוע זה?")}</h3>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}><strong>{isHe ? modal.data.nameHe : modal.data.name}</strong></p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>{isHe ? modal.data.tradeHe : modal.data.trade} · {isHe ? modal.data.cityHe : modal.data.city}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Cancel", "ביטול")} onClick={() => setModal(null)} />
              <MBtn label={L("Yes, Approve ✓", "כן, אשר ✓")} onClick={() => approvePro(modal.data.id)} bg="#059669" glow="rgba(5,150,105,.28)" />
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_pro" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit'", fontWeight: 800, fontSize: 20 }}>
                {modal.data.avatar}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.nameHe : modal.data.name}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>{isHe ? modal.data.tradeHe : modal.data.trade} · {isHe ? modal.data.cityHe : modal.data.city}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
              {[
                { label: L("Email", "אימייל"),      val: modal.data.email },
                { label: L("Phone", "טלפון"),        val: modal.data.phone },
                { label: L("Experience", "ניסיון"),  val: isHe ? modal.data.expHe : modal.data.exp },
                { label: L("Documents", "מסמכים"),   val: `${modal.data.docs} ${L("files", "קבצים")}` },
                { label: L("Applied", "הגיש"),       val: modal.data.joined },
              ].map(r => (
                <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Reject", "דחה")} onClick={() => rejectPro(modal.data.id)} bg="#DC2626" glow="rgba(220,38,38,.25)" />
              <MBtn label={L("Approve ✓", "אשר ✓")} onClick={() => approvePro(modal.data.id)} bg="#059669" glow="rgba(5,150,105,.28)" />
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_complaint" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoAlert /></div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.subjectHe : modal.data.subject}</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8" }}>{modal.data.orderId} · {modal.data.date}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: L("From", "מ"),         val: `${isHe ? modal.data.fromHe : modal.data.from} (${isHe ? modal.data.roleHe : modal.data.role})` },
                  { label: L("Priority", "עדיפות"), val: modal.data.priority },
                  { label: L("Status", "סטטוס"),    val: modal.data.status === "open" ? L("Open", "פתוח") : L("Resolved", "טופל") },
                  { label: L("Assigned", "משוייך"),  val: modal.data.assignedTo || L("Unassigned", "לא משוייך") },
                ].map(r => (
                  <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Close", "סגור")} onClick={() => setModal(null)} />
              {modal.data.status === "open" && (
                <MBtn label={L("Mark Resolved ✓", "סמן כטופל ✓")} onClick={() => resolveComp(modal.data.id)} bg="#059669" glow="rgba(5,150,105,.28)" />
              )}
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_user" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: modal.data.role === "pro" ? "linear-gradient(135deg,#EDE9FE,#DDD6FE)" : "linear-gradient(135deg,#DBEAFE,#BFDBFE)", color: modal.data.role === "pro" ? "#5B21B6" : "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>
                {modal.data.avatar}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.nameHe : modal.data.name}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>{isHe ? modal.data.roleHe : modal.data.role} · {modal.data.email}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: L("City", "עיר"),       val: isHe ? modal.data.cityHe : modal.data.city },
                { label: L("Orders", "הזמנות"),  val: modal.data.orders },
                { label: L("Member since", "מ"), val: modal.data.joined },
                { label: L("Status", "סטטוס"),   val: modal.data.status === "active" ? L("Active", "פעיל") : L("Suspended", "מושעה") },
                ...(modal.data.rating ? [{ label: L("Rating", "דירוג"), val: `⭐ ${modal.data.rating}` }] : []),
              ].map(r => (
                <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Close", "סגור")} onClick={() => setModal(null)} />
              <MBtn
                label={modal.data.status === "active" ? L("Suspend User", "השעה") : L("Restore User", "שחזר")}
                onClick={() => toggleUser(modal.data.id)}
                bg={modal.data.status === "active" ? "#EF4444" : "#059669"}
                glow={modal.data.status === "active" ? "rgba(239,68,68,.28)" : "rgba(5,150,105,.28)"}
              />
            </div>
          </div>
        </Overlay>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 600, animation: "toastIn .25s", pointerEvents: "none" }}>
          <div style={{ padding: "12px 24px", borderRadius: 22, background: toast.type === "warning" ? "#FEF3C7" : toast.type === "info" ? "#EFF6FF" : "#0F172A", color: toast.type === "warning" ? "#92400E" : toast.type === "info" ? "#1D4ED8" : "#FFF", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.18)", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */
function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
      <div>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 23, fontWeight: 800, color: "#1A2B4A", marginBottom: 3 }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: "#94A3B8" }}>{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function EmptyState({ emoji, title, sub }) {
  return (
    <div style={{ background: "#FFF", borderRadius: 18, border: "1.5px dashed #D1D9E8", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>{emoji}</div>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 13, color: "#94A3B8" }}>{sub}</p>
    </div>
  );
}

function Overlay({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFF", borderRadius: 24, padding: "30px", maxWidth: wide ? 520 : 400, width: "100%", animation: "popIn .22s", boxShadow: "0 24px 60px rgba(0,0,0,.2)" }}>
        {children}
      </div>
    </div>
  );
}

function MBtn({ label, onClick, bg, glow }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, padding: "13px", borderRadius: 14, border: bg ? "none" : "1.5px solid #E2E8F0", background: bg || "#FFF", color: bg ? "#FFF" : "#64748B", fontSize: 14, fontWeight: bg ? 700 : 600, cursor: "pointer", fontFamily: "inherit", boxShadow: glow ? `0 6px 18px ${glow}` : "none", transition: "all .16s" }}>
      {label}
    </button>
  );
}