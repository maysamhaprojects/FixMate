/**
 * =============================================
 *  FixMate – Manage Orders v2
 * =============================================
 *  ROUTE: /pro/orders
 *  FILE:  src/pages/ManageOrders.jsx
 *
 *  עיצוב: כרטיסים צבעוניים לפי סטטוס, Light theme
 *  כל כרטיס מקבל צבע רקע + border עליון בולט לפי הסטטוס שלו
 *
 *  🚩 BACKEND NOTE:
 *     - טעינת הזמנות  ← GET  /api/pro/orders
 *     - אישור          ← PUT  /api/orders/:id/confirm
 *     - דחייה          ← PUT  /api/orders/:id/reject
 *     - התחלה          ← PUT  /api/orders/:id/start
 *     - סיום           ← PUT  /api/orders/:id/finish
 * =============================================
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { translate, getLang, getDir } from "../context/LanguageContext";

/* ── Icons ── */
const IconWrench = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconBack   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCal    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPin    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconPhone  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconPlay   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconFlag   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;

/* ── צבע כרטיס לפי סטטוס ──
   topBar   = הפס הצבעוני בראש הכרטיס
   cardBg   = רקע עדין של הכרטיס
   tagBg    = רקע תג הסטטוס
   tagColor = טקסט תג
── */
/* סמלי SVG לתגי סטטוס — נקיים ומקצועיים */
const IcoPending    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoConfirmed  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IcoInProgress = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoDone       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoCancelled  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

const STATUS_STYLE = {
  pending:     { topBar: "#F59E0B", cardBg: "#FFFBF0", tagBg: "#FEF3C7", tagColor: "#92400E", tagBorder: "#FDE68A", dot: "#F59E0B", Icon: IcoPending,    label: { en: "Pending",     he: "ממתין"  } },
  confirmed:   { topBar: "#3B82F6", cardBg: "#F0F6FF", tagBg: "#DBEAFE", tagColor: "#1E40AF", tagBorder: "#BFDBFE", dot: "#3B82F6", Icon: IcoConfirmed,  label: { en: "Confirmed",   he: "מאושר"  } },
  in_progress: { topBar: "#8B5CF6", cardBg: "#FAF5FF", tagBg: "#EDE9FE", tagColor: "#5B21B6", tagBorder: "#DDD6FE", dot: "#8B5CF6", Icon: IcoInProgress, label: { en: "In Progress", he: "בביצוע" } },
  done:        { topBar: "#10B981", cardBg: "#F0FDF8", tagBg: "#D1FAE5", tagColor: "#065F46", tagBorder: "#A7F3D0", dot: "#10B981", Icon: IcoDone,       label: { en: "Done",        he: "הושלם"  } },
  cancelled:   { topBar: "#EF4444", cardBg: "#FFF5F5", tagBg: "#FEE2E2", tagColor: "#991B1B", tagBorder: "#FECACA", dot: "#EF4444", Icon: IcoCancelled,  label: { en: "Cancelled",   he: "בוטל"   } },
};

/* 🚩 BACKEND: GET /api/pro/orders */
const MOCK_ORDERS = [
  { id: "ORD-2050", clientName: { en: "Sarah Cohen",   he: "שרה כהן"     }, service: { en: "Fix electrical outlet",  he: "תיקון שקע חשמל"    }, description: { en: "Broken outlet in living room, sparking when plugging devices", he: "שקע תקול בסלון, מנצנץ בעת חיבור מכשירים" }, date: { en: "Feb 22, 2026", he: "22 בפבר 2026" }, time: "10:00", location: { en: "Tel Aviv, Dizengoff 45",  he: "תל אביב, דיזנגוף 45"  }, phone: "+972 50-111-2222", price: 320, status: "pending"     },
  { id: "ORD-2051", clientName: { en: "Amit Levy",     he: "עמית לוי"    }, service: { en: "Install ceiling fan",    he: "התקנת מאוורר תקרה" }, description: { en: "New ceiling fan installation in bedroom, wiring needed",     he: "התקנת מאוורר חדש בחדר שינה, נדרש חיווט"  }, date: { en: "Feb 22, 2026", he: "22 בפבר 2026" }, time: "14:00", location: { en: "Haifa, Herzl 12",         he: "חיפה, הרצל 12"        }, phone: "+972 52-333-4444", price: 480, status: "pending"     },
  { id: "ORD-2049", clientName: { en: "Maya Shapira",  he: "מאיה שפירא"  }, service: { en: "Electrical panel check", he: "בדיקת לוח חשמל"    }, description: { en: "Breaker keeps tripping, need full panel inspection",         he: "מפסק נופל כל הזמן, נדרשת בדיקה מלאה"     }, date: { en: "Feb 21, 2026", he: "21 בפבר 2026" }, time: "9:00",  location: { en: "Ramat Gan, Bialik 8",     he: "רמת גן, ביאליק 8"     }, phone: "+972 54-555-6666", price: 550, status: "confirmed"   },
  { id: "ORD-2048", clientName: { en: "Moshe Peretz",  he: "משה פרץ"     }, service: { en: "Install outlet",         he: "התקנת שקע"         }, description: { en: "Install new outlet in home office",                          he: "התקנת שקע חדש בחדר עבודה"                 }, date: { en: "Feb 21, 2026", he: "21 בפבר 2026" }, time: "11:30", location: { en: "Ramat Gan, Weizmann 3",   he: "רמת גן, ויצמן 3"      }, phone: "+972 52-999-0000", price: 290, status: "in_progress" },
  { id: "ORD-2045", clientName: { en: "Rina Goldberg", he: "רינה גולדברג" }, service: { en: "Fix light switch",       he: "תיקון מתג אור"     }, description: { en: "Light switch stopped working in hallway",                    he: "מתג האור במסדרון הפסיק לעבוד"             }, date: { en: "Feb 18, 2026", he: "18 בפבר 2026" }, time: "9:00",  location: { en: "Tel Aviv, Ben Yehuda 20", he: "תל אביב, בן יהודה 20" }, phone: "+972 50-777-8888", price: 180, status: "done"        },
  { id: "ORD-2043", clientName: { en: "Noa Katz",      he: "נועה כץ"     }, service: { en: "Wiring repair",          he: "תיקון חיווט"       }, description: { en: "Faulty wiring causing flickering lights",                    he: "חיווט לקוי גורם לרצד של אורות"            }, date: { en: "Feb 17, 2026", he: "17 בפבר 2026" }, time: "14:00", location: { en: "Herzliya, Ha-Taasiya 5",  he: "הרצליה, התעשייה 5"    }, phone: "+972 54-111-3333", price: 420, status: "cancelled"   },
];

/* ── כפתורי פעולה לפי סטטוס ── */
const getActions = (status) => {
  if (status === "pending")     return [
    { id: "accept", label: { en: "Accept",    he: "אשר"        }, icon: <IconCheck />, bg: "#059669", color: "#FFF",    glow: "rgba(5,150,105,.25)"   },
    { id: "reject", label: { en: "Decline",   he: "דחה"        }, icon: <IconX />,     bg: "#FFF",    color: "#DC2626", border: "1.5px solid #FECACA" },
  ];
  if (status === "confirmed")   return [
    { id: "start",  label: { en: "Start Job", he: "התחל עבודה" }, icon: <IconPlay />,  bg: "#8B5CF6", color: "#FFF",    glow: "rgba(139,92,246,.25)"  },
    { id: "reject", label: { en: "Cancel",    he: "בטל"        }, icon: <IconX />,     bg: "#FFF",    color: "#DC2626", border: "1.5px solid #FECACA" },
  ];
  if (status === "in_progress") return [
    { id: "finish", label: { en: "Finish Job",he: "סיים עבודה" }, icon: <IconFlag />,  bg: "#10B981", color: "#FFF",    glow: "rgba(16,185,129,.25)"  },
  ];
  return [];
};

/* ── Modal config ── */
const MODAL_CFG = {
  accept: { emoji: "✅", title: { en: "Accept this order?",  he: "לאשר את ההזמנה?"  }, btnBg: "#059669", glow: "rgba(5,150,105,.3)",  btn: { en: "Yes, Accept",  he: "כן, אשר"  } },
  reject: { emoji: "🚫", title: { en: "Decline this order?",he: "לדחות את ההזמנה?" }, btnBg: "#DC2626", glow: "rgba(220,38,38,.3)",  btn: { en: "Yes, Decline", he: "כן, דחה"  } },
  start:  { emoji: "🔧", title: { en: "Start the job?",     he: "להתחיל בעבודה?"   }, btnBg: "#8B5CF6", glow: "rgba(139,92,246,.3)", btn: { en: "Yes, Start",   he: "כן, התחל" } },
  finish: { emoji: "🏁", title: { en: "Mark as finished?",  he: "לסמן כהושלם?"     }, btnBg: "#10B981", glow: "rgba(16,185,129,.3)", btn: { en: "Yes, Finish",  he: "כן, סיים" } },
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function ManageOrders() {
  const navigate = useNavigate();
  const lang = getLang();
  const dir  = getDir();
  const isHe = lang === "he";
  const L = (obj) => obj && typeof obj === "object" ? (obj[lang] ?? obj.en ?? "") : (obj ?? "");

  const [mounted,      setMounted     ] = useState(false);
  const [orders,       setOrders      ] = useState(MOCK_ORDERS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search,       setSearch      ] = useState("");
  const [modal,        setModal       ] = useState(null);

  useEffect(() => { const tm = setTimeout(() => setMounted(true), 50); return () => clearTimeout(tm); }, []);

  const FILTERS = [
    { id: "all",         label: { en: "All",         he: "הכל"    } },
    { id: "pending",     label: { en: "Pending",     he: "ממתין"  } },
    { id: "confirmed",   label: { en: "Confirmed",   he: "מאושר"  } },
    { id: "in_progress", label: { en: "In Progress", he: "בביצוע" } },
    { id: "done",        label: { en: "Done",        he: "הושלם"  } },
    { id: "cancelled",   label: { en: "Cancelled",   he: "בוטל"   } },
  ];

  const count = (id) => id === "all" ? orders.length : orders.filter(o => o.status === id).length;

  const filtered = orders.filter(o => {
    const okStatus = activeFilter === "all" || o.status === activeFilter;
    const q = search.toLowerCase();
    const okSearch = !q || L(o.clientName).toLowerCase().includes(q) || L(o.service).toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return okStatus && okSearch;
  });

  /* 🚩 BACKEND: PUT /api/orders/:id/:action */
  const doAction = (orderId, actionId) => {
    const next = { accept: "confirmed", start: "in_progress", finish: "done", reject: "cancelled" }[actionId];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: next } : o));
    setModal(null);
  };

  return (
    <div style={{ fontFamily: isHe ? "'Heebo','DM Sans',sans-serif" : "'DM Sans',sans-serif", background: "#F5F7FB", minHeight: "100vh", direction: dir, opacity: mounted ? 1 : 0, transition: "opacity .4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&family=Heebo:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn  { from { opacity:0; transform:scale(.93)       } to { opacity:1; transform:scale(1)      } }
        .order-card { transition: transform .22s ease, box-shadow .22s ease; }
        .order-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.11) !important; }
        .flt-btn { transition: all .18s; }
        .flt-btn:hover { opacity: .82; }
        .act-btn { transition: all .18s; }
        .act-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
        * { box-sizing: border-box; margin: 0; }
        @media(max-width:640px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .top-row { flex-direction: column !important; align-items: flex-start !important; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{ background: "#FFF", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 10px rgba(0,0,0,.04)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", direction: "ltr" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}><IconWrench /></div>
            <span style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A" }}>Fix<span style={{ color: "#2563EB" }}>Mate</span> <span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}>Pro</span></span>
          </div>
          <button onClick={() => navigate("/pro/dashboard")} className="flt-btn"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 22, border: "1.5px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <IconBack /> {isHe ? "חזרה לדשבורד" : "Back to Dashboard"}
          </button>
        </div>
      </nav>

      {/* ══ MAIN ══ */}
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "30px 28px 60px" }}>

        {/* כותרת + חיפוש */}
        <div className="top-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 14, animation: "fadeUp .35s" }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit'", fontSize: 27, fontWeight: 800, color: "#1A2B4A", marginBottom: 3 }}>
              {isHe ? "ניהול הזמנות" : "Manage Orders"}
            </h1>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>{filtered.length} {isHe ? "הזמנות" : "orders"}</p>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [dir === "rtl" ? "right" : "left"]: 13, color: "#94A3B8", pointerEvents: "none" }}><IconSearch /></span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isHe ? "חיפוש..." : "Search..."}
              style={{ padding: dir === "rtl" ? "10px 38px 10px 16px" : "10px 16px 10px 38px", borderRadius: 22, border: "1.5px solid #E2E8F0", background: "#FFF", fontSize: 13, color: "#1A2B4A", outline: "none", width: 230, fontFamily: "inherit" }} />
          </div>
        </div>

        {/* ── פילטרים ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", animation: "fadeUp .4s" }}>
          {FILTERS.map(f => {
            const active = activeFilter === f.id;
            const st = f.id !== "all" ? STATUS_STYLE[f.id] : null;
            const n  = count(f.id);
            return (
              <button key={f.id} onClick={() => setActiveFilter(f.id)} className="flt-btn"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 22, border: active ? "none" : "1.5px solid #E2E8F0", background: active ? (st ? st.topBar : "#1A2B4A") : "#FFF", color: active ? "#FFF" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: active ? `0 4px 14px ${st ? st.topBar + "55" : "rgba(26,43,74,.3)"}` : "none" }}>
                {st && <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "rgba(255,255,255,.8)" : st.dot }} />}
                {L(f.label)}
                {n > 0 && <span style={{ fontSize: 11, fontWeight: 700, background: active ? "rgba(255,255,255,.2)" : "#F1F5F9", color: active ? "#FFF" : "#64748B", borderRadius: 10, padding: "1px 7px" }}>{n}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Grid כרטיסים ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", background: "#FFF", borderRadius: 22, border: "1px solid #E8ECF4", animation: "fadeUp .4s" }}>
            <div style={{ fontSize: 50, marginBottom: 14 }}>📭</div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{isHe ? "אין הזמנות" : "No orders found"}</p>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>{isHe ? "נסי פילטר אחר" : "Try a different filter"}</p>
          </div>
        ) : (
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {filtered.map((order, idx) => {
              const st      = STATUS_STYLE[order.status];
              const actions = getActions(order.status);
              return (
                <div key={order.id} className="order-card"
                  style={{ background: st.cardBg, borderRadius: 20, overflow: "hidden", border: "1px solid #E8ECF4", boxShadow: "0 2px 16px rgba(0,0,0,.04)", animation: `fadeUp ${.35 + idx * .05}s` }}>

                  {/* פס צבעוני עליון לפי סטטוס */}
                  <div style={{ height: 5, background: st.topBar }} />

                  <div style={{ padding: "20px 20px 18px" }}>

                    {/* שורה עליונה: אווטאר + שם + תג סטטוס */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        {/* ראשית שם */}
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#FFF", border: `2px solid ${st.topBar}33`, color: st.topBar, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit'", fontWeight: 800, fontSize: 17, flexShrink: 0, boxShadow: `0 2px 8px ${st.topBar}22` }}>
                          {L(order.clientName).charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 2 }}>{L(order.clientName)}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{order.id}</p>
                        </div>
                      </div>

                      {/* תג סטטוס */}
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: st.tagColor, background: st.tagBg, border: `1px solid ${st.tagBorder}`, borderRadius: 20, padding: "5px 12px", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
                        <st.Icon /> {L(st.label)}
                      </span>
                    </div>

                    {/* שירות + תיאור */}
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 5 }}>{L(order.service)}</p>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65, marginBottom: 14 }}>{L(order.description)}</p>

                    {/* מטא-דאטה */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#94A3B8", marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #E2E8F0" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconCal /> {L(order.date)}, {order.time}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconPin /> {L(order.location)}</span>
                      <span style={{ fontWeight: 700, color: "#059669", fontSize: 13 }}>₪{order.price}</span>
                    </div>

                    {/* שורה תחתונה: חיוג + כפתורי פעולה */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      {/* כפתור חיוג */}
                      <button onClick={() => window.open(`tel:${order.phone}`)}
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20, border: "1.5px solid #E2E8F0", background: "#FFF", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        <IconPhone /> {order.phone}
                      </button>

                      {/* כפתורי פעולה קומפקטיים */}
                      <div style={{ display: "flex", gap: 7 }}>
                        {actions.length > 0 ? actions.map(a => (
                          <button key={a.id} className="act-btn"
                            onClick={() => setModal({ order, actionId: a.id })}
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 20, border: a.border ?? "none", background: a.bg, color: a.color, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: a.glow ? `0 4px 12px ${a.glow}` : "none", transition: "all .18s", fontFamily: "inherit" }}>
                            {a.icon} {L(a.label)}
                          </button>
                        )) : (
                          <span style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic", alignSelf: "center" }}>
                            {order.status === "done"      && (isHe ? "✅ הושלם" : "✅ Completed")}
                            {order.status === "cancelled" && (isHe ? "❌ בוטל"  : "❌ Cancelled")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══ MODAL אישור פעולה ══ */}
      {modal && (() => {
        const cfg = MODAL_CFG[modal.actionId];
        return (
          <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background: "#FFF", borderRadius: 26, padding: "38px 32px 32px", maxWidth: 400, width: "100%", textAlign: "center", animation: "popIn .22s", direction: dir, boxShadow: "0 24px 60px rgba(0,0,0,.18)" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>{cfg.emoji}</div>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#1A2B4A", marginBottom: 8 }}>{L(cfg.title)}</h3>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}><strong>{L(modal.order.clientName)}</strong> — {L(modal.order.service)}</p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 28 }}>{L(modal.order.date)}, {modal.order.time}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(null)}
                  style={{ flex: 1, padding: "13px", borderRadius: 14, border: "1.5px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {isHe ? "ביטול" : "Cancel"}
                </button>
                <button onClick={() => doAction(modal.order.id, modal.actionId)}
                  style={{ flex: 1, padding: "13px", borderRadius: 14, border: "none", background: cfg.btnBg, color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${cfg.glow}`, fontFamily: "inherit" }}>
                  {L(cfg.btn)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}