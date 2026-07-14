/**
 * FixMate — Client Profile (עמוד פרופיל לקוח, עיצוב מקצועי)
 * ROUTE: /client/profile
 * API: GET /api/user/me · PUT /api/user/me
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { apiFetch } from "../services/api";

/* ─── Icons ─── */
const IconUser = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconMail = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>);
const IconPhone = (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
const IconLock = (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const IconBack = (p) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconCheck = (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>);

export default function ClientProfile() {
  const navigate = useNavigate();
  const { lang, dir } = useLang();
  const isHe = lang === "he";

  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }
  const [showSuccess, setShowSuccess] = useState(false);

  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNeedsLogin(true);
      setMessage({ type: "error", text: isHe ? "לא נמצאה התחברות. אנא התחברי מחדש." : "Not signed in. Please log in again." });
      setLoading(false);
      return;
    }
    apiFetch("/api/user/me")
      .then(async (r) => {
        if (!r.ok) {
          let body = "";
          try { body = await r.text(); } catch (e) { /* ignore */ }
          throw new Error(r.status + (body ? " · " + body : ""));
        }
        return r.json();
      })
      .then((data) => {
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setRole(data.role || "");
        setProfilePicture(data.profilePicture || "");
      })
      .catch((err) => {
        const code = err.message;
        if (code.startsWith("401") || code.startsWith("403")) {
          setNeedsLogin(true);
          setMessage({ type: "error", text: isHe ? "ההרשאה פגה. אנא התחברי מחדש." : "Session expired. Please log in again." });
        } else {
          setMessage({ type: "error", text: (isHe ? "שגיאה: " : "Error: ") + code });
        }
      })
      .finally(() => setLoading(false));
  }, [isHe]);

  /* בחירת תמונה — מכווץ ל-256px ושומר כ-base64 קטן */
  const onPickImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: isHe ? "הקובץ חייב להיות תמונה" : "File must be an image" });
      return;
    }
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
        setProfilePicture(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!fullName.trim()) { setMessage({ type: "error", text: isHe ? "שם מלא נדרש" : "Full name is required" }); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage({ type: "error", text: isHe ? "אנא הזינו אימייל תקין" : "Please enter a valid email" }); return;
    }
    setSaving(true); setMessage(null);
    try {
      const r = await apiFetch("/api/user/me", {
        method: "PUT",
        body: JSON.stringify({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim(), profilePicture: profilePicture || "" }),
      });
      if (!r.ok) {
        let body = ""; try { body = await r.text(); } catch (e) { /* ignore */ }
        if (body.includes("Email already in use")) {
          throw new Error(isHe ? "האימייל כבר בשימוש על ידי משתמש אחר" : "Email is already in use by another account");
        }
        throw new Error(isHe ? "שמירת הפרטים נכשלה" : "Failed to save profile");
      }
      const data = await r.json();
      localStorage.setItem("fullName", data.fullName || fullName.trim());
      localStorage.setItem("profilePicture", data.profilePicture || ""); // לתצוגה מיידית בדשבורד
      if (data.token) localStorage.setItem("token", data.token); // טוקן חדש אם האימייל השתנה
      setShowSuccess(true);
      // חלונית הצלחה למשך 2.2 שניות ואז חזרה לדשבורד
      setTimeout(() => navigate("/client/dashboard"), 2200);
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally { setSaving(false); }
  };

  const roleLabel = role === "CLIENT" ? (isHe ? "לקוח" : "Client")
    : role === "PROFESSIONAL" ? (isHe ? "בעל מקצוע" : "Professional")
    : role === "ADMIN" ? (isHe ? "מנהל מערכת" : "Admin") : (role || "—");
  const initial = (fullName || "?").charAt(0).toUpperCase();

  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 8 };
  const boxStyle = (locked) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "0 14px", height: 50,
    borderRadius: 12, border: "1.5px solid #E8ECF4", background: locked ? "#F1F5F9" : "#F8FAFF",
    transition: "border-color .15s",
  });
  const inputStyle = (locked) => ({
    flex: 1, border: "none", outline: "none", background: "transparent",
    fontSize: 15, fontFamily: "inherit", color: locked ? "#94A3B8" : "#1A2B4A", cursor: locked ? "not-allowed" : "text",
  });

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top nav */}
      <nav style={{ background: "#FFF", borderBottom: "1px solid #EAEEF5", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/client/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", cursor: "pointer", color: "#2563EB", fontSize: 15, fontWeight: 600, fontFamily: "inherit" }}>
          <IconBack /> {isHe ? "לדשבורד" : "Dashboard"}
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: "#1A2B4A" }}>Fix</span><span style={{ color: "#4F6AFF" }}>Mate</span>
        </h1>
        <div style={{ width: 90 }} />
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Profile header card */}
        <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #EAEEF5", boxShadow: "0 2px 16px rgba(15,23,42,.04)", padding: "28px 28px", display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <label htmlFor="pfp-input" style={{ cursor: "pointer", display: "block" }} title={isHe ? "החלף תמונה" : "Change photo"}>
              <div style={{ width: 78, height: 78, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#4F6AFF,#7C3AED)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", fontSize: 34, fontWeight: 800, boxShadow: "0 6px 18px rgba(79,106,255,.35)" }}>
                {profilePicture ? <img src={profilePicture} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
              </div>
              <span style={{ position: "absolute", bottom: 0, insetInlineEnd: 0, width: 26, height: 26, borderRadius: "50%", background: "#2563EB", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFF" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </span>
            </label>
            <input id="pfp-input" type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>{fullName || (isHe ? "אורח" : "Guest")}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#EEF2FF", color: "#2563EB" }}>{roleLabel}</span>
              {email && <span style={{ fontSize: 13, color: "#94A3B8" }}>{email}</span>}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 14 }}>
              <label htmlFor="pfp-input" style={{ fontSize: 12.5, fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>{isHe ? "העלה תמונה" : "Upload photo"}</label>
              {profilePicture && <button onClick={() => setProfilePicture("")} style={{ fontSize: 12.5, fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{isHe ? "הסר" : "Remove"}</button>}
            </div>
          </div>
        </div>

        {/* Personal info card */}
        <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #EAEEF5", boxShadow: "0 2px 16px rgba(15,23,42,.04)", padding: "26px 28px" }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: "#1A2B4A", marginBottom: 20 }}>
            {isHe ? "פרטים אישיים" : "Personal Information"}
          </h3>

          {message && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", marginBottom: 20, borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: message.type === "success" ? "#ECFDF5" : "#FEF2F2",
              border: "1.5px solid " + (message.type === "success" ? "#A7F3D0" : "#FECACA"),
              color: message.type === "success" ? "#047857" : "#991B1B",
            }}>
              <span>{message.type === "success" ? "✅" : "⚠️"}</span>{message.text}
            </div>
          )}

          {needsLogin && (
            <button onClick={() => navigate("/login")}
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "#FFF", background: "linear-gradient(135deg,#4F6AFF,#3B4FE0)", marginBottom: 8 }}>
              {isHe ? "התחברות מחדש" : "Log in again"}
            </button>
          )}

          {loading ? (
            <p style={{ textAlign: "center", color: "#94A3B8", padding: "24px 0" }}>{isHe ? "טוען פרטים..." : "Loading..."}</p>
          ) : (
            <>
              {/* Full Name */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>{isHe ? "שם מלא" : "Full Name"}</label>
                <div style={boxStyle(false)}>
                  <span style={{ color: "#94A3B8", display: "flex" }}><IconUser /></span>
                  <input style={inputStyle(false)} type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isHe ? "השם המלא שלך" : "Your full name"} />
                </div>
              </div>

              {/* Email (editable) */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>{isHe ? "אימייל" : "Email"}</label>
                <div style={boxStyle(false)}>
                  <span style={{ color: "#94A3B8", display: "flex" }}><IconMail /></span>
                  <input style={inputStyle(false)} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 26 }}>
                <label style={labelStyle}>{isHe ? "מספר טלפון" : "Phone Number"}</label>
                <div style={boxStyle(false)}>
                  <span style={{ color: "#94A3B8", display: "flex" }}><IconPhone /></span>
                  <input style={inputStyle(false)} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={isHe ? "מספר טלפון" : "Phone number"} />
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                style={{ width: "100%", height: 52, borderRadius: 14, border: "none", cursor: saving ? "default" : "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg,#4F6AFF,#3B4FE0)", boxShadow: "0 6px 18px rgba(79,106,255,.3)", opacity: saving ? 0.7 : 1 }}>
                {saving ? (isHe ? "שומר..." : "Saving...") : (<><IconCheck /> {isHe ? "שמור שינויים" : "Save Changes"}</>)}
              </button>
            </>
          )}
        </div>
      </div>

      {/* חלונית הצלחה — מופיעה לכמה שניות ואז חוזרים לדשבורד */}
      {showSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFF", borderRadius: 20, padding: "34px 40px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.3)", maxWidth: 360, animation: "popIn .25s ease" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11.5 14.5 16 9.5" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>
              {isHe ? "עודכן בהצלחה!" : "Updated successfully!"}
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>
              {isHe ? "הפרטים שלך נשמרו. מעבירים אותך לדשבורד..." : "Your details were saved. Redirecting to dashboard..."}
            </p>
          </div>
          <style>{"@keyframes popIn { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }"}</style>
        </div>
      )}
    </div>
  );
}
