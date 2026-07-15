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
import { apiFetch } from "../services/api";
import { IcoGrid, IcoUsers, IcoShield, IcoAlert, IcoClip, IcoDollar, IcoCheck, IcoX, IcoEye, IcoBan, IcoSearch, IcoTrend, IcoLogout, IcoWrench, IcoChevR, IcoBack, IcoStar, IcoStarNav, IcoMail, IcoPhone, IcoRefresh, ActUser, ActWrench, ActAlert, ActCheck, ActDollar } from "../components/AdminIcons";
import AdminModals from "../components/admin/AdminModals";

const useL = () => {
  const lang = getLang();
  const isHe = lang === "he";
  return { isHe, L: (en, he) => (isHe ? he : en), dir: getDir() };
};

/* אייקונים מיובאים מ-components/AdminIcons.jsx */

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
  const [pros,     setPros    ] = useState([]);
  const [proError, setProError] = useState("");
  const [comps,    setComps   ] = useState([]);
  const [ratings,  setRatings ] = useState([]);
  const [users,    setUsers   ] = useState([]);
  const [orders,   setOrders  ] = useState([]);
  const [stats,    setStats   ] = useState({ totalUsers: 0, totalPros: 0, totalOrders: 0, revenue: 0, openComplaints: 0, pendingApprovals: 0 });
  const [me,       setMe      ] = useState({ name: localStorage.getItem("fullName") || "Admin", email: "", profilePicture: localStorage.getItem("profilePicture") || "" });
  const [rejectReason, setRejectReason] = useState("");
  const [compResponse, setCompResponse] = useState("");
  const [modal,    setModal   ] = useState(null);
  const [search,   setSearch  ] = useState("");
  const [filter,   setFilter  ] = useState("all");
  const [toast,    setToast   ] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  /* רענון אוטומטי — כל 20 שניות + כשחוזרים ללשונית */
  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const bump = () => setRefreshTick((t) => t + 1);
    const iv = setInterval(bump, 20000);
    window.addEventListener("focus", bump);
    return () => { clearInterval(iv); window.removeEventListener("focus", bump); };
  }, []);

  /* ─── ממיר אובייקט ProProfile מהשרת למבנה שהתצוגה מצפה לו ─── */
  const normalizePro = (p) => {
    const u = p.user || {};                       // הפרטים האישיים מקוננים תחת user
    const name = u.fullName || u.name || u.email || "—";
    const trade = p.specialty || "בעל מקצוע";
    const city = p.location || "—";
    const exp = (p.yearsExperience != null ? p.yearsExperience + " שנים" : "—");
    let docFiles = [];
    try { docFiles = p.documents ? JSON.parse(p.documents) : []; } catch (e) { docFiles = []; }
    return {
      id: p.id,                                   // מזהה ה-ProProfile (משמש לאישור/דחייה)
      name, nameHe: name,
      trade, tradeHe: trade,
      city, cityHe: city,
      email: u.email || "—",
      phone: u.phone || "—",
      docFiles,                                   // מערך של {name, data}
      docs: docFiles.length,
      exp, expHe: exp,
      bio: p.bio || "",
      hourlyRate: p.hourlyRate,
      joined: u.createdAt ? String(u.createdAt).slice(0, 10) : "—",
      avatar: (name[0] || "?").toUpperCase(),
    };
  };

  /* ─── משיכת בעלי המקצוע הממתינים לאישור מהשרת ─── */
  const loadPendingPros = async () => {
    setProError("");
    try {
      const r = await apiFetch("/api/admin/pros/pending");
      const raw = await r.text();
      if (!r.ok) {
        setProError("סטטוס " + r.status + " — " + raw.slice(0, 300));
        return;
      }
      let data;
      try { data = JSON.parse(raw); } catch (e) {
        setProError("התשובה אינה JSON תקין: " + raw.slice(0, 300));
        return;
      }
      const list = Array.isArray(data) ? data : (data.pros || data.content || data.data || []);
      // רשימה ריקה = אין בעלי מקצוע ממתינים (תקין) — לא שגיאה
      setPros(list.map(normalizePro));
    } catch (e) {
      setProError("שגיאת חיבור לשרת: " + e.message + " (האם השרת רץ על localhost:8080?)");
    }
  };

  useEffect(() => { loadPendingPros(); }, [refreshTick]);

  /* ─── משיכת סטטיסטיקה, משתמשים והזמנות אמיתיים ─── */
  useEffect(() => {
    apiFetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => { if (u) { setMe({ name: u.fullName || "Admin", email: u.email || "", profilePicture: u.profilePicture || "" }); localStorage.setItem("profilePicture", u.profilePicture || ""); } })
      .catch(() => {});

    apiFetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => { if (s) setStats(s); })
      .catch(() => {});

    apiFetch("/api/admin/users")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setUsers(list.map((u) => {
          const name = u.fullName || u.email || "—";
          const role = u.role === "PROFESSIONAL" ? "pro" : u.role === "ADMIN" ? "admin" : "client";
          const roleHe = role === "pro" ? "בעל מקצוע" : role === "admin" ? "מנהל" : "לקוח";
          const roleEn = role === "pro" ? "Professional" : role === "admin" ? "Admin" : "Client";
          return {
            id: u.id, name, nameHe: name, role, roleHe, roleEnLabel: roleEn,
            email: u.email || "—", city: "—", cityHe: "—", orders: 0, rating: null,
            joined: u.joined || "—", status: u.suspended ? "suspended" : "active",
            avatar: (name[0] || "?").toUpperCase(),
          };
        }));
      })
      .catch(() => {});

    apiFetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        const mapSt = (s) => s === "COMPLETED" ? "done" : s === "IN_PROGRESS" ? "in_progress" : s === "CANCELLED" ? "cancelled" : "pending";
        setOrders(list.map((o) => ({
          id: "ORD-" + o.id,
          date: (o.date || "").slice(0, 10),
          service: o.serviceType || "", serviceHe: o.serviceType || "",
          client: o.client || "", clientHe: o.client || "",
          pro: o.pro || "", proHe: o.pro || "",
          price: o.price != null ? o.price : 0,
          status: mapSt(o.status),
        })));
      })
      .catch(() => {});

    /* תלונות אמיתיות מהשרת */
    apiFetch("/api/admin/complaints")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setComps(list.map((c) => {
          const roleEn = c.complainantRole === "PROFESSIONAL" ? "Professional" : c.complainantRole === "ADMIN" ? "Admin" : "Client";
          const roleHe = c.complainantRole === "PROFESSIONAL" ? "בעל מקצוע" : c.complainantRole === "ADMIN" ? "מנהל" : "לקוח";
          return {
            id: c.id,
            subject: c.subject || "—", subjectHe: c.subject || "—",
            description: c.description || "",
            priority: "medium",
            from: c.complainantName || "—", fromHe: c.complainantName || "—",
            email: c.complainantEmail || "",
            role: roleEn, roleHe,
            orderId: c.bookingId ? ("ORD-" + c.bookingId) : "—",
            date: (c.createdAt || "").slice(0, 10),
            adminResponse: c.adminResponse || "",
            assignedTo: null,
            status: c.status === "RESOLVED" ? "resolved" : "open",
          };
        }));
      })
      .catch(() => {});

    /* דירוגים אמיתיים מהשרת */
    apiFetch("/api/admin/ratings")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setRatings(list.map((r) => ({
          id: r.id,
          client: r.client || "—",
          pro: r.pro || "—",
          score: r.score || 0,
          comment: r.comment || "",
          service: r.service || "",
          orderId: r.bookingId ? ("ORD-" + r.bookingId) : "—",
          date: (r.date || "").slice(0, 10),
        })));
      })
      .catch(() => {});
  }, [refreshTick]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  /* actions */
  const approvePro  = (id) => {
    apiFetch("/api/admin/pros/" + id + "/approve", {
      method: "PUT",
    })
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        setPros(p => p.filter(x => x.id !== id));
        showToast(L("Pro approved ✓", "בעל מקצוע אושר ✓"));
      })
      .catch(() => showToast(L("Approval failed", "האישור נכשל"), "warning"))
      .finally(() => setModal(null));
  };
  const rejectPro = (id, reason) => {
    const q = reason && reason.trim() ? "?reason=" + encodeURIComponent(reason.trim()) : "";
    apiFetch("/api/admin/pros/" + id + "/reject" + q, {
      method: "PUT",
    })
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        setPros(p => p.filter(x => x.id !== id));
        showToast(L("Pro rejected", "בעל מקצוע נדחה"), "warning");
      })
      .catch(() => showToast(L("Reject failed", "הדחייה נכשלה"), "warning"))
      .finally(() => { setModal(null); setRejectReason(""); });
  };
  const resolveComp = (id, response) => {
    apiFetch("/api/admin/complaints/" + id + "/status", {
      method: "PUT",
      body: JSON.stringify({ status: "RESOLVED", response: response || "" }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        setComps(p => p.map(x => x.id === id ? { ...x, status: "resolved", adminResponse: response || x.adminResponse } : x));
        showToast(L("Complaint resolved ✓", "תלונה טופלה ✓"));
      })
      .catch(() => showToast(L("Update failed", "העדכון נכשל"), "warning"))
      .finally(() => { setModal(null); setCompResponse(""); });
  };
  const toggleUser = (id) => {
    apiFetch("/api/admin/users/" + id + "/toggle-suspend", {
      method: "PUT",
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { showToast(L("Update failed", "העדכון נכשל"), "warning"); return; }
        setUsers(p => p.map(x => x.id === id ? { ...x, status: data.suspended ? "suspended" : "active" } : x));
        showToast(data.suspended ? L("User suspended", "המשתמש הושעה") : L("User restored", "המשתמש שוחזר"), "info");
      })
      .catch(() => showToast(L("Update failed", "העדכון נכשל"), "warning"))
      .finally(() => setModal(null));
  };

  /* העלאת תמונת פרופיל לאדמין — מכווץ ל-256px ושומר מיד */
  const uploadAdminPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 256;
        let w = img.width, h = img.height;
        if (w > h) { if (w > max) { h = Math.round(h * max / w); w = max; } }
        else { if (h > max) { w = Math.round(w * max / h); h = max; } }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        apiFetch("/api/user/me", {
          method: "PUT",
          body: JSON.stringify({ fullName: me.name, profilePicture: dataUrl }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((u) => {
            if (u) { setMe((m) => ({ ...m, profilePicture: u.profilePicture || "" })); localStorage.setItem("profilePicture", u.profilePicture || ""); showToast(L("Photo updated ✓", "התמונה עודכנה ✓")); }
            else showToast(L("Update failed", "העדכון נכשל"), "warning");
          })
          .catch(() => showToast(L("Update failed", "העדכון נכשל"), "warning"));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  /* nav */
  const NAV = [
    { id: "overview",   label: L("Overview",   "סקירה"),       Icon: IcoGrid,  badge: null },
    { id: "approvals",  label: L("Approvals",  "אישורים"),     Icon: IcoShield,badge: pros.length || null },
    { id: "complaints", label: L("Complaints", "תלונות"),      Icon: IcoAlert, badge: comps.filter(c => c.status === "open").length || null },
    { id: "ratings",    label: L("Ratings",    "דירוגים"),     Icon: IcoStarNav, badge: null },
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
            <label htmlFor="admin-pfp-input" title={L("Change photo", "החלף תמונה")} style={{ width: 32, height: 32, borderRadius: 9, overflow: "hidden", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 13, fontWeight: 800, flexShrink: 0, cursor: "pointer" }}>
              {me.profilePicture ? <img src={me.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (me.name || "A").charAt(0).toUpperCase()}
            </label>
            <input id="admin-pfp-input" type="file" accept="image/*" onChange={uploadAdminPhoto} style={{ display: "none" }} />
            <div className="logo-text">
              <p style={{ fontSize: 12, fontWeight: 700, color: "#FFF" }}>{me.name}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{me.email}</p>
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

            {/* Hero welcome banner */}
            <div style={{ background: "linear-gradient(135deg,#4F6AFF 0%,#7C3AED 100%)", borderRadius: 22, padding: "28px 32px", marginBottom: 24, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18, boxShadow: "0 12px 32px rgba(79,106,255,.25)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, insetInlineEnd: -20, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontSize: 13, opacity: .8, marginBottom: 6, fontWeight: 500 }}>{L("Admin Panel", "פאנל ניהול")} · FixMate</p>
                <h2 style={{ fontFamily: "'Outfit'", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
                  {L("Welcome back", "ברוך שובך")}, {localStorage.getItem("fullName") || (isHe ? "מנהל" : "Admin")}
                </h2>
                <p style={{ fontSize: 14, opacity: .9 }}>
                  {stats.pendingApprovals > 0
                    ? L(`${stats.pendingApprovals} professionals are waiting for your approval`, `${stats.pendingApprovals} בעלי מקצוע ממתינים לאישורך`)
                    : L("Everything is up to date — no pending actions", "הכל מעודכן — אין פעולות ממתינות")}
                </p>
              </div>
              {stats.pendingApprovals > 0 && (
                <button onClick={() => setSection("approvals")} className="hb" style={{ position: "relative", padding: "13px 26px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.18)", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(4px)" }}>
                  {L("Review approvals", "לאישורים")} →
                </button>
              )}
            </div>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16, marginBottom: 26 }}>
              {[
                { Icon: IcoUsers,  n: stats.totalUsers,     label: L("Total Users",     "סה״כ משתמשים"),   sub: L(`${stats.totalClients || 0} clients · ${stats.totalPros || 0} pros`, `${stats.totalClients || 0} לקוחות · ${stats.totalPros || 0} בעלי מקצוע`), color: "#2563EB", bg: "#EFF6FF" },
                { Icon: IcoWrench, n: stats.totalPros,      label: L("Professionals",   "בעלי מקצוע"),     sub: L("registered on platform", "רשומים בפלטפורמה"),  color: "#8B5CF6", bg: "#F5F3FF" },
                { Icon: IcoClip,   n: stats.totalOrders,    label: L("Total Orders",    "סה״כ הזמנות"),    sub: L("across all pros", "מכל בעלי המקצוע"),   color: "#10B981", bg: "#ECFDF5" },
                { Icon: IcoDollar, n: `₪${(Number(stats.revenue) / 1000).toFixed(1)}K`, label: L("Revenue", "הכנסה"), sub: L("from completed jobs", "מעבודות שהושלמו"), color: "#F59E0B", bg: "#FFFBEB" },
                { Icon: IcoShield, n: stats.pendingApprovals, label: L("Pending Approvals","ממתינים לאישור"), sub: stats.pendingApprovals > 0 ? L("needs your attention", "דורש טיפול") : L("all clear", "הכל מטופל"), color: "#F97316", bg: "#FFF7ED" },
              ].map((c, i) => (
                <div key={i} className="stat-card" style={{ background: "#FFF", borderRadius: 18, padding: "22px", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(0,0,0,.04)", animation: `fadeUp ${.35 + i * .04}s both`, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}><c.Icon /></div>
                  </div>
                  <p style={{ fontFamily: "'Outfit'", fontSize: 32, fontWeight: 900, color: "#1A2B4A", lineHeight: 1, marginBottom: 6 }}>{c.n}</p>
                  <p style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 700, marginBottom: 3 }}>{c.label}</p>
                  <p style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 500 }}>{c.sub}</p>
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
                {orders.length === 0 && (
                  <div style={{ padding: "22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>{L("No orders yet", "אין הזמנות עדיין")}</div>
                )}
                {orders.slice(0, 4).map((o, i) => {
                  const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
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
                {(() => {
                  const activity = [
                    ...pros.slice(0, 3).map((p) => ({
                      id: "act-p-" + p.id, Icon: IcoWrench, color: "#F59E0B", bg: "#FFFBEB",
                      text: { en: p.name + " is awaiting approval", he: p.nameHe + " ממתין לאישור" },
                      time: { en: "pending", he: "ממתין" },
                    })),
                    ...orders.slice(0, 4).map((o) => ({
                      id: "act-o-" + o.id, Icon: IcoClip, color: "#10B981", bg: "#ECFDF5",
                      text: { en: "Order " + o.id + ": " + o.client + " → " + o.pro, he: "הזמנה " + o.id + ": " + o.clientHe + " → " + o.proHe },
                      time: { en: o.date, he: o.date },
                    })),
                  ];
                  if (activity.length === 0) return <div style={{ padding: "22px", textAlign: "center", color: "#94A3B8", fontSize: 12 }}>{L("No recent activity", "אין פעילות אחרונה")}</div>;
                  return activity.map((a, i) => (
                    <div key={a.id} style={{ display: "flex", gap: 12, padding: "14px 22px", borderBottom: i < activity.length - 1 ? "1px solid #F8FAFC" : "none", alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: a.bg, color: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <a.Icon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, marginBottom: 2 }}>{isHe ? a.text.he : a.text.en}</p>
                        <p style={{ fontSize: 10, color: "#94A3B8" }}>{isHe ? a.time.he : a.time.en}</p>
                      </div>
                    </div>
                  ));
                })()}
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

            {proError && (
              <div style={{ direction: "rtl", background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#991B1B", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, lineHeight: 1.6, wordBreak: "break-word" }}>
                <strong>⚠️ בעיה במשיכת הרשימה מהשרת:</strong>
                <div style={{ marginTop: 6, fontFamily: "monospace", direction: "ltr", textAlign: "left" }}>{proError}</div>
                <button onClick={loadPendingPros} style={{ marginTop: 10, padding: "6px 14px", borderRadius: 8, border: "1px solid #FCA5A5", background: "#FFF", color: "#991B1B", fontWeight: 700, cursor: "pointer" }}>נסה שוב</button>
              </div>
            )}

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
                            {pro.hourlyRate != null && <span>₪{pro.hourlyRate} / {isHe ? "שעה" : "hr"}</span>}
                            <span>{isHe ? "הגיש: " : "Applied: "}{pro.joined}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => setModal({ type: "view_pro", data: pro })} className="hb"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 20, border: "1.5px solid #E2E8F0", background: "#F8FAFF", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            <IcoEye />{L("View", "הצג")}
                          </button>
                          <button onClick={() => { setModal({ type: "reject_pro", data: pro }); setRejectReason(""); }} className="hb"
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
                      <button onClick={() => { setCompResponse(c.adminResponse || ""); setModal({ type: "view_complaint", data: c }); }} className="hb"
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

        {/* ─── RATINGS ─── */}
        {section === "ratings" && (
          <div style={{ animation: "fadeUp .35s" }}>
            <SectionHeader
              title={L("Ratings & Reviews", "דירוגים וביקורות")}
              sub={L(`${ratings.length} reviews`, `${ratings.length} ביקורות`)}
              action={<BackBtn />}
            />
            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)" }}>
              {ratings.length === 0 && (
                <div style={{ padding: "22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>{L("No reviews yet", "אין ביקורות עדיין")}</div>
              )}
              {ratings.map((r, i, arr) => (
                <div key={r.id} className="trow" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none", background: "#FFF", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>{r.pro}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= r.score ? "#FBBF24" : "#E2E8F0"} stroke={n <= r.score ? "#FBBF24" : "#E2E8F0"} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>{r.score}/5</span>
                    </div>
                    {r.comment && <p style={{ fontSize: 13, color: "#475569", marginBottom: 4, lineHeight: 1.5 }}>“{r.comment}”</p>}
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                      {L("By", "מאת")} <strong>{r.client}</strong> · {r.service} · {r.orderId} · {r.date}
                    </p>
                  </div>
                </div>
              ))}
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
              {users.length === 0 && (
                <div style={{ padding: "22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>{L("No users yet", "אין משתמשים עדיין")}</div>
              )}
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
                        {isHe ? u.roleHe : (u.roleEnLabel || u.role)}
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
              sub={L(`${orders.length} orders shown`, `${orders.length} הזמנות`)}
              action={<BackBtn />}
            />
            <div style={{ background: "#FFF", borderRadius: 18, border: "1px solid #E8ECF4", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,.04)" }}>
              {orders.length === 0 && (
                <div style={{ padding: "22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>{L("No orders yet", "אין הזמנות עדיין")}</div>
              )}
              {orders.map((o, i, arr) => {
                const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
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

      {/* מודלים + Toast — חולצו ל-components/admin/AdminModals.jsx */}
      <AdminModals
        modal={modal} setModal={setModal} L={L} isHe={isHe} dir={dir}
        rejectReason={rejectReason} setRejectReason={setRejectReason}
        compResponse={compResponse} setCompResponse={setCompResponse}
        approvePro={approvePro} rejectPro={rejectPro} resolveComp={resolveComp} toggleUser={toggleUser}
        toast={toast} />
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

/* Overlay ו-MBtn עברו ל-components/admin/AdminModals.jsx */