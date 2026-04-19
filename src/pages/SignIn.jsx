/* ═══════════════════════════════════════════════
   FixMate - דף התחברות (SignIn)
   המשתמש מזין אימייל + סיסמה + בוחר תפקיד (לקוח/מקצוען/אדמין)
   ═══════════════════════════════════════════════ */

import { useState, useEffect } from "react";           // useState = זיכרון של הקומפוננטה | useEffect = מפעיל קוד בזמנים מסוימים
import { useNavigate } from "react-router-dom";         // הוק שמאפשר לעבור בין דפים באתר
import "../styles/auth.css";                             // קובץ העיצוב (צבעים, גדלים, אנימציות)
import { useLang } from "../context/LanguageContext";    // הוק לתמיכה בשתי שפות (עברית/אנגלית)

/* ═══════════════════════════════════════════════
   קומפוננטות אייקונים (SVG) - כל אחת מציירת אייקון אחר
   ═══════════════════════════════════════════════ */
var IconMail = function() { return <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>; };      // אייקון מעטפה - לשדה אימייל
var IconLock = function() { return <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>; };                                           // אייקון מנעול - לשדה סיסמה
var IconEye = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>; };                                                                        // אייקון עין פתוחה - להצגת סיסמה
var IconEyeOff = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /></svg>; }; // אייקון עין סגורה - להסתרת סיסמה
var IconWrench = function() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>; };                    // אייקון מפתח ברגים - לתפקיד "מקצוען"
var IconHome = function() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1" /></svg>; };          // אייקון בית - לתפקיד "לקוח"
var IconArrowLeft = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; };                                                                                          // אייקון חץ שמאלה - לכפתור חזרה
var IconSpinner = function() { return <svg className="auth-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10" /></svg>; };                                                                                                                              // אייקון ספינר - לטעינה

/* ── אייקון מגן - לתפקיד "אדמין" ── */
var IconShield = function() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════
   הקומפוננטה הראשית - דף ההתחברות
   ═══════════════════════════════════════════════ */
export default function SignIn() {
  var navigate  = useNavigate();     // כלי לניווט בין דפים
  var langCtx   = useLang();         // מקבל את הקונטקסט של השפה
  var lang      = langCtx.lang;      // השפה הנוכחית ("he" או "en")
  var dir       = langCtx.dir;       // כיוון הטקסט ("rtl" או "ltr")
  var isHe      = lang === "he";     // האם השפה עברית? (true/false)

  /* ─── משתני מצב (states) של הטופס ─── */
  var _e  = useState(""); var email        = _e[0];  var setEmail        = _e[1];   // אימייל המשתמש
  var _p  = useState(""); var password      = _p[0];  var setPassword      = _p[1];   // סיסמת המשתמש
  var _ro = useState("professional"); var role = _ro[0]; var setRole      = _ro[1];   // התפקיד הנבחר (ברירת מחדל: מקצוען)
  var _rm = useState(false); var rememberMe = _rm[0]; var setRememberMe   = _rm[1];   // "זכור אותי" מסומן?
  var _sp = useState(false); var showPassword=_sp[0]; var setShowPassword = _sp[1];   // האם להציג את הסיסמה? (אייקון עין)
  var _l  = useState(false); var isLoading  = _l[0];  var setIsLoading    = _l[1];   // האם מחכים לשרת? (מציג ספינר)
  var _m  = useState(false); var mounted    = _m[0];  var setMounted      = _m[1];   // האם הקומפוננטה נטענה? (אנימציית כניסה)
  var _er = useState({});    var errors     = _er[0]; var setErrors       = _er[1];   // אובייקט השגיאות של הטופס
  var _sh = useState(false); var shakeError = _sh[0]; var setShakeError   = _sh[1];   // האם לרעיד את הכרטיס? (כשיש שגיאה)
  var _ff = useState(null);  var focusedField=_ff[0]; var setFocusedField = _ff[1];   // איזה שדה המשתמש עומד עליו כרגע

  /* אנימציית כניסה - רץ פעם אחת כשהקומפוננטה נטענת */
  useEffect(function() {
    var tm = setTimeout(function() { setMounted(true); }, 50);  // אחרי 50ms מפעיל אנימציית הופעה
    return function() { clearTimeout(tm); };                      // ניקוי: מבטל את הטיימר אם עוזבים את הדף
  }, []);                                                          // [] = רץ פעם אחת בלבד

  /* ─── פונקציה לבדיקת תקינות הטופס לפני שליחה ─── */
  var validateForm = function() {
    var ne = {};                                      // אובייקט חדש לאיסוף שגיאות
    if (!email.trim()) {                              // אם האימייל ריק (trim מוריד רווחים)
      ne.email = isHe ? "אימייל נדרש" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {  // regex בודק פורמט אימייל תקין
      ne.email = isHe ? "אנא הזינו אימייל תקין" : "Please enter a valid email";
    }
    if (!password) {                                  // אם הסיסמה ריקה
      ne.password = isHe ? "סיסמה נדרשת" : "Password is required";
    } else if (password.length < 6) {                 // אם הסיסמה קצרה מ-6 תווים
      ne.password = isHe ? "סיסמה חייבת להכיל לפחות 6 תווים" : "Password must be at least 6 characters";
    }
    setErrors(ne);                                    // שמירת השגיאות במצב
    return Object.keys(ne).length === 0;              // מחזיר true אם אין שגיאות, false אם יש
  };
/* ═══════════════════════════════════════════════
   פונקציית התחברות - רצה כשלוחצים "התחברות"
   ═══════════════════════════════════════════════ */
var handleSubmit = async function() {
    if (!validateForm()) {                                         // אם הבדיקה נכשלה
      setShakeError(true);                                         // מרעיד את הכרטיס
      setTimeout(function() { setShakeError(false); }, 600);       // עוצר את הרעידה אחרי 0.6 שנייה
      return;                                                      // יוצא מהפונקציה - לא שולח לשרת
    }
    setIsLoading(true);                                            // מדליק ספינר טעינה

    try {
      // שליחת בקשת התחברות לבקאנד
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',                                             // סוג הבקשה - POST (שליחת נתונים)
        headers: { 'Content-Type': 'application/json' },            // אומר לשרת שאנחנו שולחים JSON
        body: JSON.stringify({ email: email, password: password })  // הופך את האובייקט למחרוזת JSON
      });

      const data = await response.json();                           // קורא את התשובה והופך אותה לאובייקט

      if (!response.ok) {                                           // אם הבקשה לא הצליחה (קוד 400+)
        setErrors({ general: data.error || 'התחברות נכשלה' });     // מציג הודעת שגיאה
        setShakeError(true);                                        // מרעיד את הכרטיס
        setTimeout(function() { setShakeError(false); }, 600);
        setIsLoading(false);                                        // מכבה ספינר
        return;                                                     // יוצא מהפונקציה
      }

     // בדיקה שהתפקיד שנבחר תואם לתפקיד האמיתי של המשתמש במערכת
const selectedRoleUpper = role.toUpperCase();                       // הופך את התפקיד לאותיות גדולות (CLIENT/PROFESSIONAL/ADMIN)
if (selectedRoleUpper !== data.role) {                              // אם התפקיד לא תואם למה שבשרת
  setErrors({ general: isHe ? 'תפקיד לא תקין' : 'Invalid role selected' });
  setShakeError(true);
  setTimeout(function() { setShakeError(false); }, 600);
  setIsLoading(false);
  return;
}

// שמירת הטוקן והפרטים בדפדפן (נשאר גם אחרי סגירת הדפדפן)
localStorage.setItem('token', data.token);                          // הטוקן משמש לזיהוי בבקשות עתידיות
localStorage.setItem('role', data.role);                            // התפקיד של המשתמש
localStorage.setItem('fullName', data.fullName);                    // השם של המשתמש (להצגה)

// ניווט לדשבורד המתאים לפי התפקיד
if (data.role === 'CLIENT') { navigate('/client/dashboard'); }      // לקוח → דשבורד לקוח
else if (data.role === 'ADMIN') { navigate('/admin'); }             // אדמין → דף ניהול
else { navigate('/pro/dashboard'); }                                // מקצוען → דשבורד מקצוען

    } catch (error) {                                               // אם יש שגיאה בחיבור לשרת
      setErrors({ general: 'שגיאה בחיבור לשרת' });                  // הודעת שגיאה כללית
      setIsLoading(false);                                          // מכבה ספינר
    }
  };

  /* ─── רשימת התפקידים הזמינים בתפריט הדרופדאון ─── */
  var ROLES = [
    { id: "professional", icon: <IconWrench />, label: isHe ? "בעל מקצוע" : "Professional", color: "#2563EB", bg: "#EFF6FF" },  // תפקיד: מקצוען (כחול)
    { id: "client",       icon: <IconHome />,   label: isHe ? "לקוח"       : "Client",       color: "#059669", bg: "#ECFDF5" },  // תפקיד: לקוח (ירוק)
    { id: "admin",        icon: <IconShield />, label: isHe ? "מנהל מערכת" : "Admin",        color: "#7C3AED", bg: "#F5F3FF" },  // תפקיד: אדמין (סגול)
  ];
  var _dd = useState(false); var ddOpen = _dd[0]; var setDdOpen = _dd[1];   // האם תפריט הדרופדאון פתוח?
  var selectedRole = ROLES.find(function(r) { return r.id === role; });      // מוצא את האובייקט של התפקיד הנבחר

  /* ═══════════════════════════════════════════════
     החלק שמחזיר את ה-HTML שמוצג על המסך
     ═══════════════════════════════════════════════ */
  return (
    <div className="auth-page" dir={dir}>                           {/* עטיפה ראשית של הדף, dir קובע כיוון (rtl/ltr) */}
      <div className="auth-gradient-header" />                       {/* פס גרדיאנט צבעוני למעלה */}
      <div className="auth-float-circle auth-float-circle--1" />     {/* עיגול דקורטיבי מרחף 1 */}
      <div className="auth-float-circle auth-float-circle--2" />     {/* עיגול דקורטיבי מרחף 2 */}
      <div className="auth-float-circle auth-float-circle--3" />     {/* עיגול דקורטיבי מרחף 3 */}

      {/* כפתור חזרה לדף הבית */}
      <button className="auth-back-btn" onClick={function() { navigate("/"); }}>
        <IconArrowLeft />
        {isHe ? "בית" : "Home"}
      </button>

      {/* עטיפת הכרטיס - אחראית על אנימציית כניסה */}
      <div className={"auth-card-wrapper " + (mounted ? "auth-card-wrapper--visible" : "")}>
        {/* הכרטיס עצמו - אחראי על אנימציית רעידה כשיש שגיאה */}
        <div className={"auth-card " + (shakeError ? "auth-card--shake" : "")}>

          {/* ─── ראש הדף: לוגו + תת־כותרת ─── */}
          <div className="auth-header">
            <h1 className="auth-logo">
              <span className="auth-logo-fix">Fix</span>              {/* "Fix" בצבע אחד */}
              <span className="auth-logo-mate">Mate</span>            {/* "Mate" בצבע אחר */}
            </h1>
            <p className="auth-subtitle">
              {isHe ? "ברוכים הבאים לפלטפורמת השירות" : "Welcome to the service platform"}
            </p>
          </div>

          {/* באנר שגיאה כללי - מוצג רק אם יש שגיאה כללית */}
          {errors.general && (
            <div className="auth-error-banner"><span>⚠️</span>{errors.general}</div>
          )}

          {/* ─── שדה אימייל ─── */}
          <div className="auth-field">
            <label className="auth-label">{isHe ? "אימייל" : "Email"}</label>
            <div className={"auth-input-container " + (errors.email ? "auth-input-container--error" : "") + " " + (focusedField === "email" ? "auth-input-container--focused" : "")}>
              {/* מחלקות דינמיות: --error אם יש שגיאה, --focused אם המשתמש עומד על השדה */}
              <IconMail />                                          {/* אייקון מעטפה משמאל */}
              <input
                type="email"                                        // סוג השדה - אימייל (מפעיל מקלדת מיוחדת בנייד)
                className="auth-input"
                placeholder="name@email.com"                         // טקסט רמז שמוצג כשהשדה ריק
                value={email}                                        // הערך הנוכחי של השדה (מקושר ל-state)
                onChange={function(e) {                              // רץ בכל הקלדה
                  setEmail(e.target.value);                          // מעדכן את ה-state עם הערך החדש
                  if (errors.email) setErrors(function(p) { return Object.assign({}, p, { email: null }); });  // מוחק שגיאה אם היתה
                }}
                onFocus={function() { setFocusedField("email"); }}   // מסמן שהמשתמש על שדה האימייל
                onBlur={function()  { setFocusedField(null);    }}   // מסמן שהמשתמש עזב את השדה
              />
            </div>
            {errors.email && <p className="auth-field-error">{errors.email}</p>}  {/* הודעת שגיאה אם יש */}
          </div>

          {/* ─── שדה סיסמה ─── */}
          <div className="auth-field">
            <label className="auth-label">{isHe ? "סיסמה" : "Password"}</label>
            <div className={"auth-input-container " + (errors.password ? "auth-input-container--error" : "") + " " + (focusedField === "password" ? "auth-input-container--focused" : "")}>
              <IconLock />                                          {/* אייקון מנעול */}
              <input
                type={showPassword ? "text" : "password"}           // אם showPassword=true מציג טקסט רגיל, אחרת נקודות
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={function(e) {
                  setPassword(e.target.value);                       // מעדכן סיסמה
                  if (errors.password) setErrors(function(p) { return Object.assign({}, p, { password: null }); });
                }}
                onFocus={function() { setFocusedField("password"); }}
                onBlur={function()  { setFocusedField(null);       }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSubmit(); }}  // לחיצה על Enter = שליחת טופס
              />
              {/* כפתור עין - להציג/להסתיר סיסמה */}
              <button type="button" className="auth-password-toggle"
                onClick={function() { setShowPassword(!showPassword); }}>
                {showPassword ? <IconEyeOff /> : <IconEye />}        {/* מחליף אייקון לפי המצב */}
              </button>
            </div>
            {errors.password && <p className="auth-field-error">{errors.password}</p>}
          </div>

          {/* Role selector — Dropdown */}
          <div className="auth-field" style={{ position: "relative" }}>
            <label className="auth-label">
              {isHe ? "התחבר בתור:" : "Sign in as:"}
            </label>
            <button
              type="button"
              onClick={function() { setDdOpen(!ddOpen); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                borderRadius: 14,
                border: ddOpen ? "1.5px solid " + selectedRole.color : "1.5px solid #E8ECF4",
                background: "#F8FAFF",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .18s",
                boxShadow: ddOpen ? "0 0 0 3px " + selectedRole.color + "22" : "none",
              }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: 10,
                background: selectedRole.bg,
                color: selectedRole.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {selectedRole.icon}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1A2B4A", textAlign: "start" }}>
                {selectedRole.label}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: ddOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {ddOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                background: "#FFF", borderRadius: 14, border: "1.5px solid #E8ECF4",
                boxShadow: "0 12px 32px rgba(0,0,0,.12)",
                overflow: "hidden",
                animation: "ddFade .15s ease",
              }}>
                <style>{".auth-dd-item:hover { background: #F8FAFF; } @keyframes ddFade { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }"}</style>
                {ROLES.map(function(r) {
                  var isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="auth-dd-item"
                      onClick={function() { setRole(r.id); setDdOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px",
                        border: "none", cursor: "pointer", fontFamily: "inherit",
                        background: isActive ? r.bg : "#FFF",
                        borderBottom: "1px solid #F1F5F9",
                        transition: "background .12s",
                      }}
                    >
                      <span style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: r.bg, color: r.color,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {r.icon}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? r.color : "#374151" }}>
                        {r.label}
                      </span>
                      {isActive && (
                        <svg style={{ marginInlineStart: "auto" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── שורת "זכור אותי" + "שכחת סיסמה" ─── */}
          <div className="auth-options-row">
            {/* תיבת סימון "זכור אותי" */}
            <label className="auth-checkbox-label" onClick={function() { setRememberMe(!rememberMe); }}>
              <div className={"auth-checkbox " + (rememberMe ? "auth-checkbox--checked" : "")}>
                {rememberMe && (                                    /* סימן ✓ מוצג רק אם מסומן */
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {isHe ? "זכור אותי" : "Remember me"}
            </label>
            {/* כפתור "שכחת סיסמה" - מעביר לדף שחזור סיסמה */}
            <button className="auth-forgot-link" onClick={function() { navigate("/forgot-password"); }}>
              {isHe ? "שכחת סיסמה?" : "Forgot password?"}
            </button>
          </div>

          {/* ─── כפתור ההתחברות הראשי ─── */}
          <button
            className={"auth-submit-btn " + (isLoading ? "auth-submit-btn--loading" : "")}
            onClick={handleSubmit}                                  /* לחיצה = הפעלת פונקציית ההתחברות */
            disabled={isLoading}                                    /* מנטרל את הכפתור בזמן טעינה */
            /* סגנון דינמי - צבע סגול לאדמין, כחול לאחרים */
            style={role === "admin" && !isLoading ? {
              background: "linear-gradient(135deg,#7C3AED,#5B21B6)",   /* גרדיאנט סגול לאדמין */
              boxShadow:  "0 4px 18px rgba(124,58,237,.35)",
            } : !isLoading ? {
              background: "linear-gradient(135deg,#2563EB,#1D4ED8)",   /* גרדיאנט כחול לרגיל */
              boxShadow:  "0 4px 18px rgba(37,99,235,.30)",
            } : {}}                                                    /* בזמן טעינה - ללא סגנון מיוחד */
          >
            {/* טקסט הכפתור - משתנה לפי מצב הטעינה */}
            {isLoading
              ? <><IconSpinner /> {isHe ? "מתחבר..." : "Signing in..."}</>      /* בטעינה: ספינר + "מתחבר..." */
              : isHe ? "התחברות" : "Sign In"                                   /* רגיל: "התחברות" */
            }
          </button>

          {/* ─── קישור למי שאין לו חשבון ─── */}
          <p className="auth-switch-text">
            {isHe ? "אין לכם חשבון? " : "Don't have an account? "}
            <button className="auth-switch-link" onClick={function() { navigate("/register"); }}>
              {isHe ? "צרו חשבון" : "Create an account"}
            </button>
          </p>
        </div>
        <div className="auth-decorative-pill" />                   {/* אלמנט דקורטיבי */}
      </div>
    </div>
  );
}