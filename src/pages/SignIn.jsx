import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";
import { useLang } from "../context/LanguageContext";
import { apiFetch } from "../services/api";
import { IconMail, IconLock, IconEye, IconEyeOff, IconWrench, IconHome, IconArrowLeft, IconSpinner, IconShield } from "../components/AuthIcons";


export default function SignIn() {
  var navigate  = useNavigate();
  var location  = useLocation();
  var langCtx   = useLang();
  var lang      = langCtx.lang;
  var dir       = langCtx.dir;
  var isHe      = lang === "he";

  // "זכור אותי" — טוענים את הפרטים שנשמרו בכניסה הקודמת
  var savedEmail = localStorage.getItem("rememberedEmail") || "";
  var savedPass  = localStorage.getItem("rememberedPassword") || "";
  var savedRole  = localStorage.getItem("rememberedRole")  || "professional";

  var _e  = useState(savedEmail); var email  = _e[0];  var setEmail        = _e[1];
  var _p  = useState(savedPass);  var password = _p[0]; var setPassword     = _p[1];
  var _ro = useState(savedRole); var role  = _ro[0]; var setRole      = _ro[1];
  // מסומן כברירת מחדל — אלא אם המשתמש ביטל את הסימון בכניסה קודמת
  var _rm = useState(localStorage.getItem("rememberOptOut") !== "1");
  var rememberMe = _rm[0]; var setRememberMe = _rm[1];
  var _sp = useState(false); var showPassword=_sp[0]; var setShowPassword = _sp[1];
  var _l  = useState(false); var isLoading  = _l[0];  var setIsLoading    = _l[1];
  var _m  = useState(false); var mounted    = _m[0];  var setMounted      = _m[1];
  var _er = useState({});    var errors     = _er[0]; var setErrors       = _er[1];
  var _sh = useState(false); var shakeError = _sh[0]; var setShakeError   = _sh[1];
  var _ff = useState(null);  var focusedField=_ff[0]; var setFocusedField = _ff[1];

  // הודעת מידע שהגיעה מעמוד ההרשמה (למשל: החשבון ממתין לאישור אדמין)
  var _nt = useState(location.state && location.state.notice ? location.state.notice : "");
  var notice = _nt[0]; var setNotice = _nt[1];

  useEffect(function() {
    var tm = setTimeout(function() { setMounted(true); }, 50);
    return function() { clearTimeout(tm); };
  }, []);

  // מנקים את ה-state מההיסטוריה כדי שההודעה לא תופיע שוב ברענון,
  // וההודעה נעלמת אוטומטית אחרי 5 שניות
  useEffect(function() {
    if (location.state && location.state.notice) {
      window.history.replaceState({}, document.title);
      var tm = setTimeout(function() { setNotice(""); }, 5000);
      return function() { clearTimeout(tm); };
    }
  }, []);

  var validateForm = function() {
    var ne = {};
    if (!email.trim()) {
      ne.email = isHe ? "אימייל נדרש" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ne.email = isHe ? "אנא הזינו אימייל תקין" : "Please enter a valid email";
    }
    if (!password) {
      ne.password = isHe ? "סיסמה נדרשת" : "Password is required";
    } else if (password.length < 6) {
      ne.password = isHe ? "סיסמה חייבת להכיל לפחות 6 תווים" : "Password must be at least 6 characters";
    }
    setErrors(ne);
    return Object.keys(ne).length === 0;
  };

  var handleSubmit = async function() {
    if (!validateForm()) {
      setShakeError(true);
      setTimeout(function() { setShakeError(false); }, 600);
      return;
    }
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password })
      });

      const data = await response.json();

      if (!response.ok) {
        // הודעה מותאמת לפי סוג השגיאה מהשרת
        let msg = isHe ? "אירעה שגיאה בהתחברות. אנא נסו שוב."
                       : "Sign-in failed. Please try again.";
        const err = data.error || "";
        // השרת לא מגלה בכוונה אם המייל או הסיסמה שגויים — הגנה מפני גילוי חשבונות רשומים
        if (err === "Invalid email or password") {
          msg = isHe ? "אימייל או סיסמה שגויים. שימו לב שהסיסמה רגישה לאותיות גדולות וקטנות."
                     : "Incorrect email or password. Note that passwords are case-sensitive.";
        } else if (err === "Your account is pending admin approval") {
          msg = "החשבון שלך ממתין לאישור אדמין. תוכל להתחבר לאחר שהאדמין יאשר.";
        } else if (err === "Your account has been suspended") {
          msg = "החשבון שלך הושעה על ידי מנהל המערכת. לפרטים פנה לתמיכה.";
        } else if (err.indexOf("Your application was rejected") === 0) {
          const reason = err.replace("Your application was rejected", "").replace(/^:\s*/, "").trim();
          msg = reason ? ("בקשתך להצטרף כבעל מקצוע נדחתה. סיבה: " + reason) : "בקשתך להצטרף כבעל מקצוע נדחתה.";
        }
        setErrors({ general: msg });
        setShakeError(true);
        setTimeout(function() { setShakeError(false); }, 600);
        setIsLoading(false);
        return;
      }

      // הגנה נוספת: גם אם השרת החזיר 200 אך החשבון עדיין ממתין לאישור — לא מכניסים
      if (data.approved === false || data.status === "PENDING") {
        setErrors({ general: "החשבון שלך ממתין לאישור אדמין. תוכל להתחבר לאחר שהאדמין יאשר." });
        setShakeError(true);
        setTimeout(function() { setShakeError(false); }, 600);
        setIsLoading(false);
        return;
      }

      // בדיקה שהתפקיד שנבחר תואם לתפקיד האמיתי של החשבון
      if (data.role !== role.toUpperCase()) {
        var realHe = data.role === "CLIENT" ? "לקוח" : data.role === "ADMIN" ? "מנהל מערכת" : "בעל מקצוע";
        setErrors({ general: isHe
          ? ("התפקיד שנבחר שגוי. חשבון זה רשום כ\"" + realHe + "\". בחרו את התפקיד הנכון ונסו שוב.")
          : ("Wrong role selected. This account is registered as " + data.role + ". Please select the correct role.") });
        setShakeError(true);
        setTimeout(function() { setShakeError(false); }, 600);
        setIsLoading(false);
        return;
      }

      // התחברות תקינה — שומרים פרטים ומנווטים לפי התפקיד
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('fullName', data.fullName);

      // "זכור אותי" — שומר מייל, סיסמה ותפקיד כדי למלא אותם אוטומטית בכניסה הבאה
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberedRole', role);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberedRole');
      }

      if (data.role === 'CLIENT') { navigate('/client/dashboard'); }
      else if (data.role === 'ADMIN') { navigate('/admin'); }
      else { navigate('/pro/dashboard'); }

    } catch (error) {
      setErrors({ general: 'שגיאה בחיבור לשרת' });
      setIsLoading(false);
    }
  };

  /* ── role dropdown ── */
  var ROLES = [
    { id: "professional", icon: <IconWrench />, label: isHe ? "בעל מקצוע" : "Professional", color: "#2563EB", bg: "#EFF6FF" },
    { id: "client",       icon: <IconHome />,   label: isHe ? "לקוח"       : "Client",       color: "#059669", bg: "#ECFDF5" },
    { id: "admin",        icon: <IconShield />, label: isHe ? "מנהל מערכת" : "Admin",        color: "#7C3AED", bg: "#F5F3FF" },
  ];
  var _dd = useState(false); var ddOpen = _dd[0]; var setDdOpen = _dd[1];
  var selectedRole = ROLES.find(function(r) { return r.id === role; });

  return (
    <div className="auth-page" dir={dir}>
      <div className="auth-gradient-header" />
      <div className="auth-float-circle auth-float-circle--1" />
      <div className="auth-float-circle auth-float-circle--2" />
      <div className="auth-float-circle auth-float-circle--3" />

      <button className="auth-back-btn" onClick={function() { navigate("/"); }}>
        <IconArrowLeft />
        {isHe ? "בית" : "Home"}
      </button>

      <div className={"auth-card-wrapper " + (mounted ? "auth-card-wrapper--visible" : "")}>
        {/* טופס אמיתי — כך הדפדפן מזהה מסך התחברות ומציע לשמור/למלא סיסמה */}
        <form
          className={"auth-card " + (shakeError ? "auth-card--shake" : "")}
          onSubmit={function(e) { e.preventDefault(); handleSubmit(); }}
        >

          <div className="auth-header">
            <h1 className="auth-logo">
              <span className="auth-logo-fix">Fix</span>
              <span className="auth-logo-mate">Mate</span>
            </h1>
            <p className="auth-subtitle">
              {isHe ? "ברוכים הבאים לפלטפורמת השירות" : "Welcome to the service platform"}
            </p>
          </div>

          {notice && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", marginBottom: 16, borderRadius: 12,
              background: "#ECFDF5", border: "1.5px solid #A7F3D0", color: "#047857",
              fontSize: 14, fontWeight: 600,
            }}>
              <span style={{ fontSize: 18 }}>✅</span>{notice}
            </div>
          )}

          {errors.general && (
            <div className="auth-error-banner"><span>⚠️</span>{errors.general}</div>
          )}

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">{isHe ? "אימייל" : "Email"}</label>
            <div className={"auth-input-container " + (errors.email ? "auth-input-container--error" : "") + " " + (focusedField === "email" ? "auth-input-container--focused" : "")}>
              <IconMail />
              <input
                type="email"
                name="email"
                autoComplete="username"
                className="auth-input"
                placeholder="name@email.com"
                value={email}
                onChange={function(e) {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(function(p) { return Object.assign({}, p, { email: null }); });
                }}
                onFocus={function() { setFocusedField("email"); }}
                onBlur={function()  { setFocusedField(null);    }}
              />
            </div>
            {errors.email && <p className="auth-field-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">{isHe ? "סיסמה" : "Password"}</label>
            <div className={"auth-input-container " + (errors.password ? "auth-input-container--error" : "") + " " + (focusedField === "password" ? "auth-input-container--focused" : "")}>
              <IconLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={function(e) {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(function(p) { return Object.assign({}, p, { password: null }); });
                }}
                onFocus={function() { setFocusedField("password"); }}
                onBlur={function()  { setFocusedField(null);       }}
                onKeyDown={function(e) { if (e.key === "Enter") handleSubmit(); }}
              />
              <button type="button" className="auth-password-toggle"
                onClick={function() { setShowPassword(!showPassword); }}>
                {showPassword ? <IconEyeOff /> : <IconEye />}
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

          {/* Remember me + Forgot */}
          <div className="auth-options-row">
            <label className="auth-checkbox-label" onClick={function() {
              var next = !rememberMe;
              setRememberMe(next);
              // הסרת הסימון מוחקת את הפרטים השמורים מיד, וזוכרת שהמשתמש לא רוצה שנזכור
              if (!next) {
                localStorage.setItem('rememberOptOut', '1');
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
                localStorage.removeItem('rememberedRole');
              } else {
                localStorage.removeItem('rememberOptOut');
              }
            }}>
              <div className={"auth-checkbox " + (rememberMe ? "auth-checkbox--checked" : "")}>
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {isHe ? "זכור אותי" : "Remember me"}
            </label>
            <button type="button" className="auth-forgot-link" onClick={function() { navigate("/forgot-password"); }}>
              {isHe ? "שכחת סיסמה?" : "Forgot password?"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={"auth-submit-btn " + (isLoading ? "auth-submit-btn--loading" : "")}
            disabled={isLoading}
            /* צבע סגול לאדמין */
            style={role === "admin" && !isLoading ? {
              background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
              boxShadow:  "0 4px 18px rgba(124,58,237,.35)",
            } : !isLoading ? {
              background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
              boxShadow:  "0 4px 18px rgba(37,99,235,.30)",
            } : {}}
          >
            {isLoading
              ? <><IconSpinner /> {isHe ? "מתחבר..." : "Signing in..."}</>
              : isHe ? "התחברות" : "Sign In"
            }
          </button>

          <p className="auth-switch-text">
            {isHe ? "אין לכם חשבון? " : "Don't have an account? "}
            <button type="button" className="auth-switch-link" onClick={function() { navigate("/register"); }}>
              {isHe ? "צרו חשבון" : "Create an account"}
            </button>
          </p>
        </form>
        <div className="auth-decorative-pill" />
      </div>
    </div>
  );
}