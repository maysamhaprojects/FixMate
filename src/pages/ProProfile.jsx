import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";

/*
  FixMate - Pro Profile (Editable)
  ROUTE: /pro/profile
  FILE:  src/pages/ProProfile.jsx
*/

/* Icons */
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconForward = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconStar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
const IconChevron = ({ up }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .25s" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* Data */
const SHEKEL = "\u20AA";

const INIT = {
  name: { en: "Amoona Hiouala", he: "\u05D0\u05DE\u05D5\u05E0\u05D4 \u05D7\u05D9\u05D5\u05D0\u05DC\u05D4" },
  role: { en: "Licensed Electrician", he: "\u05D7\u05E9\u05DE\u05DC\u05D0\u05D9 \u05DE\u05D5\u05E1\u05DE\u05DA" },
  avatar: { en: "AM", he: "\u05D0\u05D7" },
  rating: 4.84,
  reviewCount: 127,
  phone: "054-885-8793",
  email: "amore@gmail.com",
  bio: { en: "Experienced professional with 12 years of experience in the field.", he: "\u05D1\u05E2\u05DC \u05DE\u05E7\u05E6\u05D5\u05E2 \u05DE\u05E0\u05D5\u05E1\u05D4 \u05E2\u05DD 12 \u05E9\u05E0\u05D5\u05EA \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF" },
  minPrice: 150,
  maxPrice: 1000,
  areas: [
    { en: "Tel Aviv", he: "\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1" },
    { en: "Rishon LeZion", he: "\u05E8\u05D9\u05E9\u05D5\u05DF \u05DC\u05E6\u05D9\u05D5\u05DF" },
    { en: "Bat Yam", he: "\u05D1\u05EA \u05D9\u05DD" },
    { en: "Holon", he: "\u05D7\u05D5\u05DC\u05D5\u05DF" },
  ],
};

const ALL_AREAS = [
  { en: "Tel Aviv", he: "\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1" },
  { en: "Rishon LeZion", he: "\u05E8\u05D9\u05E9\u05D5\u05DF \u05DC\u05E6\u05D9\u05D5\u05DF" },
  { en: "Bat Yam", he: "\u05D1\u05EA \u05D9\u05DD" },
  { en: "Holon", he: "\u05D7\u05D5\u05DC\u05D5\u05DF" },
  { en: "Ramat Gan", he: "\u05E8\u05DE\u05EA \u05D2\u05DF" },
  { en: "Herzliya", he: "\u05D4\u05E8\u05E6\u05DC\u05D9\u05D4" },
  { en: "Petah Tikva", he: "\u05E4\u05EA\u05D7 \u05EA\u05E7\u05D5\u05D5\u05D4" },
  { en: "Netanya", he: "\u05E0\u05EA\u05E0\u05D9\u05D4" },
  { en: "Haifa", he: "\u05D7\u05D9\u05E4\u05D4" },
  { en: "Jerusalem", he: "\u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD" },
];

const REVIEWS = [
  { name: { en: "Sarah Cohen", he: "\u05E9\u05E8\u05D4 \u05DB\u05D4\u05DF" }, rating: 5, date: { en: "2 weeks ago", he: "\u05DC\u05E4\u05E0\u05D9 \u05E9\u05D1\u05D5\u05E2\u05D9\u05D9\u05DD" }, text: { en: "Punctual, professional, fixed our issue quickly. Highly recommend!", he: "\u05D3\u05D9\u05D9\u05E7\u05E0\u05D9, \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9, \u05EA\u05D9\u05E7\u05DF \u05DE\u05D4\u05E8. \u05DE\u05DE\u05DC\u05D9\u05E6\u05D4 \u05D1\u05D7\u05D5\u05DD!" } },
  { name: { en: "Amit Levy", he: "\u05E2\u05DE\u05D9\u05EA \u05DC\u05D5\u05D9" }, rating: 5, date: { en: "1 month ago", he: "\u05DC\u05E4\u05E0\u05D9 \u05D7\u05D5\u05D3\u05E9" }, text: { en: "Excellent ceiling fan install. Came prepared, finished early. Fair price.", he: "\u05D4\u05EA\u05E7\u05E0\u05EA \u05DE\u05D0\u05D5\u05D5\u05E8\u05E8 \u05DE\u05E6\u05D5\u05D9\u05E0\u05EA. \u05D4\u05D2\u05D9\u05E2 \u05DE\u05D5\u05DB\u05DF, \u05E1\u05D9\u05D9\u05DD \u05DC\u05E4\u05E0\u05D9 \u05D4\u05D6\u05DE\u05DF." } },
  { name: { en: "Rina Goldberg", he: "\u05E8\u05D9\u05E0\u05D4 \u05D2\u05D5\u05DC\u05D3\u05D1\u05E8\u05D2" }, rating: 4, date: { en: "2 months ago", he: "\u05DC\u05E4\u05E0\u05D9 \u05D7\u05D5\u05D3\u05E9\u05D9\u05D9\u05DD" }, text: { en: "Good panel inspection. Found and fixed the breaker issue.", he: "\u05D1\u05D3\u05D9\u05E7\u05EA \u05DC\u05D5\u05D7 \u05D8\u05D5\u05D1\u05D4. \u05DE\u05E6\u05D0 \u05D5\u05EA\u05D9\u05E7\u05DF \u05D0\u05EA \u05D4\u05EA\u05E7\u05DC\u05D4." } },
  { name: { en: "Noa Katz", he: "\u05E0\u05D5\u05E2\u05D4 \u05DB\u05E5" }, rating: 5, date: { en: "3 months ago", he: "\u05DC\u05E4\u05E0\u05D9 3 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD" }, text: { en: "Great wiring job, very clean work. Will call again for sure.", he: "\u05E2\u05D1\u05D5\u05D3\u05EA \u05D7\u05D9\u05D5\u05D5\u05D8 \u05DE\u05E2\u05D5\u05DC\u05D4, \u05E2\u05D1\u05D5\u05D3\u05D4 \u05E0\u05E7\u05D9\u05D4 \u05DE\u05D0\u05D5\u05D3. \u05D0\u05D6\u05DE\u05D9\u05DF \u05E9\u05D5\u05D1." } },
  { name: { en: "Moshe Peretz", he: "\u05DE\u05E9\u05D4 \u05E4\u05E8\u05E5" }, rating: 5, date: { en: "4 months ago", he: "\u05DC\u05E4\u05E0\u05D9 4 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD" }, text: { en: "Installed new outlets in our kitchen. Fast and reliable.", he: "\u05D4\u05EA\u05E7\u05D9\u05DF \u05E9\u05E7\u05E2\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD \u05D1\u05DE\u05D8\u05D1\u05D7. \u05DE\u05D4\u05D9\u05E8 \u05D5\u05D0\u05DE\u05D9\u05DF." } },
  { name: { en: "Maya Shapira", he: "\u05DE\u05D0\u05D9\u05D4 \u05E9\u05E4\u05D9\u05E8\u05D0" }, rating: 4, date: { en: "5 months ago", he: "\u05DC\u05E4\u05E0\u05D9 5 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD" }, text: { en: "Professional service. Explained everything clearly before starting.", he: "\u05E9\u05D9\u05E8\u05D5\u05EA \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9. \u05D4\u05E1\u05D1\u05D9\u05E8 \u05D4\u05DB\u05DC \u05DC\u05E4\u05E0\u05D9 \u05E9\u05D4\u05EA\u05D7\u05D9\u05DC." } },
];

export default function ProProfile() {
  const navigate = useNavigate();
  const dir = getDir();
  const lang = getLang();
  const isHe = lang === "he";
  const isRTL = dir === "rtl";
  const L = (obj) => (obj && typeof obj === "object" && obj[lang]) ? obj[lang] : (typeof obj === "string" ? obj : obj?.en || "");

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [fullName, setFullName] = useState(L(INIT.name));
  const [phone, setPhone] = useState(INIT.phone);
  const [email, setEmail] = useState(INIT.email);
  const [bio, setBio] = useState(L(INIT.bio));
  const [minPrice, setMinPrice] = useState(INIT.minPrice);
  const [maxPrice, setMaxPrice] = useState(INIT.maxPrice);
  const [areas, setAreas] = useState(INIT.areas);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const goBack = () => navigate("/pro/dashboard");

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const removeArea = (idx) => setAreas((prev) => prev.filter((_, i) => i !== idx));
  const addArea = (area) => {
    if (!areas.find((a) => a.en === area.en)) setAreas((prev) => [...prev, area]);
    setShowAreaPicker(false);
  };

  const font = isHe ? "'Heebo',sans-serif" : "'DM Sans',sans-serif";
  const titleFont = "'Outfit',sans-serif";

  const card = {
    background: "#FFF",
    borderRadius: 20,
    border: "1px solid #E8ECF4",
    padding: "28px 26px",
    boxShadow: "0 2px 16px rgba(0,0,0,.03)",
  };

  const fieldStyle = (active) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: active ? "2px solid #2563EB" : "1.5px solid #E8ECF4",
    background: active ? "#FFF" : "#FAFBFE",
    fontSize: 15,
    color: "#1A2B4A",
    fontFamily: font,
    outline: "none",
    direction: dir,
    textAlign: isRTL ? "right" : "left",
    transition: "border .2s, background .2s",
  });

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: "#8896AB",
    marginBottom: 7,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const visibleReviews = showAllReviews ? REVIEWS : REVIEWS.slice(0, 2);

  return (
    <div style={{ fontFamily: font, background: "#F5F7FB", minHeight: "100vh", direction: dir, textAlign: isRTL ? "right" : "left", opacity: mounted ? 1 : 0, transition: "opacity .35s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toast{from{opacity:0;transform:translate(-50%,-10px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes pop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
        .hb:hover:not(:disabled){filter:brightness(1.05);transform:translateY(-1px)}
        .area-chip:hover{box-shadow:0 2px 8px rgba(37,99,235,.12)}
        *{box-sizing:border-box;margin:0;padding:0}
        @media(max-width:768px){
          .pro-grid{grid-template-columns:1fr !important}
          .pro-wrap{padding:20px 16px 40px !important}
          .pro-nav-inner{padding:12px 16px !important}
          .pro-hero-flex{flex-direction:column;text-align:center}
          .pro-hero-avatar{margin:0 auto}
          .pro-hero-info{text-align:center}
          .pro-hero-info>div{justify-content:center}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid #E8ECF4" }}>
        <div className="pro-nav-inner" style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px" }}>
          <button onClick={goBack} style={{ width: 42, height: 42, borderRadius: 12, background: "#F0F4FF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer" }}>
            {isRTL ? <IconForward /> : <IconBack />}
          </button>
          <span style={{ fontFamily: titleFont, fontSize: 19, fontWeight: 700, color: "#1A2B4A" }}>
            {isHe ? "\u05D4\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC \u05E9\u05DC\u05D9" : "My Profile"}
          </span>
          {!editing ? (
            <button className="hb" onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, border: "none", background: "#2563EB", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(37,99,235,.2)" }}>
              <IconEdit /> {isHe ? "\u05E2\u05E8\u05D9\u05DB\u05D4" : "Edit"}
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="hb" onClick={() => setEditing(false)} style={{ padding: "10px 18px", borderRadius: 12, border: "2px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font }}>
                {isHe ? "\u05D1\u05D9\u05D8\u05D5\u05DC" : "Cancel"}
              </button>
              <button className="hb" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12, border: "none", background: "#059669", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(5,150,105,.2)" }}>
                <IconSave /> {isHe ? "\u05E9\u05DE\u05D5\u05E8" : "Save"}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── TOAST ── */}
      {saved && (
        <div style={{ position: "fixed", top: 76, left: "50%", transform: "translateX(-50%)", background: "#059669", color: "#FFF", padding: "13px 28px", borderRadius: 14, fontSize: 14, fontWeight: 700, zIndex: 200, boxShadow: "0 8px 28px rgba(5,150,105,.25)", animation: "toast .25s", fontFamily: font }}>
          {isHe ? "\u05D4\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC \u05E2\u05D5\u05D3\u05DB\u05DF \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4!" : "Profile saved!"}
        </div>
      )}

      <div className="pro-wrap" style={{ maxWidth: 960, margin: "0 auto", padding: "28px 28px 48px" }}>

        {/* ── HERO ── */}
        <div style={{ ...card, marginBottom: 24, animation: "fadeUp .35s" }}>
          <div className="pro-hero-flex" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div className="pro-hero-avatar" style={{ position: "relative" }}>
              <div style={{ width: 88, height: 88, borderRadius: 20, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26, fontFamily: titleFont, boxShadow: "0 6px 20px rgba(37,99,235,.22)" }}>
                {L(INIT.avatar)}
              </div>
              {editing && (
                <button style={{ position: "absolute", bottom: -3, right: -3, width: 30, height: 30, borderRadius: "50%", background: "#2563EB", border: "3px solid #FFF", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
                  <IconCamera />
                </button>
              )}
            </div>
            <div className="pro-hero-info" style={{ flex: 1, minWidth: 180 }}>
              <h1 style={{ fontFamily: titleFont, fontSize: 24, fontWeight: 800, color: "#1A2B4A", marginBottom: 3 }}>{fullName}</h1>
              <p style={{ fontSize: 14, color: "#2563EB", fontWeight: 600, marginBottom: 10 }}>{L(INIT.role)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconStar />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A" }}>{INIT.rating}</span>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>({INIT.reviewCount} {isHe ? "\u05D1\u05D9\u05E7\u05D5\u05E8\u05D5\u05EA" : "reviews"})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO COLUMNS ── */}
        <div className="pro-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

          {/* LEFT — Personal Details */}
          <div style={{ ...card, animation: "fadeUp .4s" }}>
            <h2 style={{ fontFamily: titleFont, fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}><IconUser /></span>
              {isHe ? "\u05E4\u05E8\u05D8\u05D9\u05DD \u05D0\u05D9\u05E9\u05D9\u05D9\u05DD" : "Personal Details"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div style={labelStyle}><IconUser /> {isHe ? "\u05E9\u05DD \u05DE\u05DC\u05D0" : "Full Name"}</div>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!editing} style={fieldStyle(editing)} />
              </div>
              <div>
                <div style={labelStyle}><IconPhone /> {isHe ? "\u05D8\u05DC\u05E4\u05D5\u05DF" : "Phone"}</div>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} style={{ ...fieldStyle(editing), direction: "ltr", textAlign: isRTL ? "right" : "left" }} />
              </div>
              <div>
                <div style={labelStyle}><IconMail /> {isHe ? "\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC" : "Email"}</div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} style={{ ...fieldStyle(editing), direction: "ltr", textAlign: isRTL ? "right" : "left" }} />
              </div>
              <div>
                <div style={labelStyle}><IconEdit /> {isHe ? "\u05EA\u05D9\u05D0\u05D5\u05E8" : "Description"}</div>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} disabled={!editing} rows={3} style={{ ...fieldStyle(editing), resize: "vertical", lineHeight: 1.7 }} />
              </div>
            </div>
          </div>

          {/* RIGHT — Pricing + Rating */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Price Range */}
            <div style={{ ...card, animation: "fadeUp .45s" }}>
              <h2 style={{ fontFamily: titleFont, fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{SHEKEL}</span>
                {isHe ? "\u05D8\u05D5\u05D5\u05D7 \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD" : "Price Range"}
              </h2>
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>{isHe ? "\u05DE\u05D7\u05D9\u05E8 \u05DE\u05D9\u05E0\u05D9\u05DE\u05DC\u05D9" : "Minimum"} ({SHEKEL})</div>
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} disabled={!editing} style={{ ...fieldStyle(editing), direction: "ltr", textAlign: "center" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>{isHe ? "\u05DE\u05D7\u05D9\u05E8 \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9" : "Maximum"} ({SHEKEL})</div>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} disabled={!editing} style={{ ...fieldStyle(editing), direction: "ltr", textAlign: "center" }} />
                </div>
              </div>
              <div style={{ background: "#F8FAFF", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #EEF1F8" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#7C8DB5" }}>{isHe ? "\u05D8\u05D5\u05D5\u05D7 \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD \u05E9\u05DC\u05DA" : "Your Price Range"}</span>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: titleFont, color: "#2563EB" }}>{SHEKEL}{minPrice} - {SHEKEL}{maxPrice}</span>
              </div>
            </div>

            {/* Rating + Reviews */}
            <div style={{ ...card, animation: "fadeUp .5s" }}>
              <h2 style={{ fontFamily: titleFont, fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&#11088;</span>
                {isHe ? "\u05D3\u05D9\u05E8\u05D5\u05D2 \u05DE\u05DE\u05D5\u05E6\u05E2" : "Average Rating"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 44, fontWeight: 800, fontFamily: titleFont, color: "#1A2B4A", lineHeight: 1 }}>{INIT.rating}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map((s) => <IconStar key={s} />)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1A2B4A", marginBottom: 4 }}>{INIT.reviewCount} {isHe ? "\u05D1\u05D9\u05E7\u05D5\u05E8\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D5\u05EA" : "Verified Reviews"}</p>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>{isHe ? "\u05DE\u05D1\u05D5\u05E1\u05E1 \u05E2\u05DC \u05DE\u05E9\u05D5\u05D1 \u05DC\u05E7\u05D5\u05D7\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D9\u05DD" : "Based on verified client feedback"}</p>
                </div>
              </div>

              {/* Reviews */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {visibleReviews.map((rev, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: "#FAFBFE", border: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `hsl(${i * 70 + 210},55%,92%)`, color: `hsl(${i * 70 + 210},55%,40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {L(rev.name).charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>{L(rev.name)}</span>
                          <span style={{ fontSize: 11, color: "#B0BCCF" }}>{L(rev.date)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= rev.rating ? "#FBBF24" : "none"} stroke={s <= rev.rating ? "#FBBF24" : "#D1D5DB"} strokeWidth="1.5">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#5A6B8A", lineHeight: 1.6 }}>{L(rev.text)}</p>
                  </div>
                ))}

                {/* Show More / Less */}
                <button
                  className="hb"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #E8ECF4", background: "#FAFBFE", color: "#2563EB", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}
                >
                  {showAllReviews
                    ? (isHe ? "\u05D4\u05E6\u05D2 \u05E4\u05D7\u05D5\u05EA" : "Show Less")
                    : (isHe ? "\u05D4\u05E6\u05D2 \u05E2\u05D5\u05D3 \u05D1\u05D9\u05E7\u05D5\u05E8\u05D5\u05EA" : "Show More Reviews")}
                  <IconChevron up={showAllReviews} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SERVICE AREAS ── */}
        <div style={{ ...card, animation: "fadeUp .55s" }}>
          <h2 style={{ fontFamily: titleFont, fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}><IconMapPin /></span>
            {isHe ? "\u05D0\u05D6\u05D5\u05E8\u05D9 \u05E9\u05D9\u05E8\u05D5\u05EA" : "Service Areas"}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {areas.map((area, i) => (
              <span key={i} className="area-chip" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 50, background: "#EEF2FF", border: "1.5px solid #C7D2FE", fontSize: 14, fontWeight: 600, color: "#2563EB", transition: "all .2s" }}>
                <IconMapPin /> {L(area)}
                {editing && (
                  <button onClick={() => removeArea(i)} style={{ width: 18, height: 18, borderRadius: "50%", background: "#DC2626", border: "none", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
                    <IconX />
                  </button>
                )}
              </span>
            ))}
            {editing && (
              <button onClick={() => setShowAreaPicker(!showAreaPicker)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "9px 16px", borderRadius: 50, background: "#FAFBFE", border: "2px dashed #C7D2FE", fontSize: 14, fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>
                <IconPlus /> {isHe ? "\u05D4\u05D5\u05E1\u05E3 \u05D0\u05D6\u05D5\u05E8" : "Add Area"}
              </button>
            )}
          </div>

          {showAreaPicker && (
            <div style={{ background: "#FFF", borderRadius: 14, border: "1px solid #E8ECF4", boxShadow: "0 6px 24px rgba(0,0,0,.08)", padding: 6, marginBottom: 20, maxWidth: 300, animation: "pop .2s" }}>
              {ALL_AREAS.filter((a) => !areas.find((x) => x.en === a.en)).map((area, i) => (
                <button key={i} onClick={() => addArea(area)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "none", background: "transparent", textAlign: isRTL ? "right" : "left", fontSize: 14, color: "#1A2B4A", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: font }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#F0F4FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <IconMapPin /> {L(area)}
                </button>
              ))}
              {ALL_AREAS.filter((a) => !areas.find((x) => x.en === a.en)).length === 0 && (
                <p style={{ padding: 12, fontSize: 13, color: "#94A3B8", textAlign: "center" }}>{isHe ? "\u05DB\u05DC \u05D4\u05D0\u05D6\u05D5\u05E8\u05D9\u05DD \u05E0\u05D1\u05D7\u05E8\u05D5" : "All areas selected"}</p>
              )}
            </div>
          )}

          {/* Map placeholder */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E8ECF4", background: "linear-gradient(180deg,#EEF2FF 0%,#F8FAFF 100%)", height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#5A6B8A" }}>{isHe ? "\u05DE\u05E4\u05D4" : "Map"}</p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>Google Maps</p>
          </div>
        </div>
      </div>
    </div>
  );
}