import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useLang } from "../context/LanguageContext";

var IconMail = function() { return <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>; };
var IconLock = function() { return <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>; };
var IconEye = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>; };
var IconEyeOff = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /></svg>; };
var IconWrench = function() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>; };
var IconHome = function() { return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1" /></svg>; };
var IconArrowLeft = function() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>; };
var IconSpinner = function() { return <svg className="auth-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10" /></svg>; };

/* ── Admin shield icon ── */
var IconShield = function() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
};

export default function SignIn() {
  var navigate  = useNavigate();
  var langCtx   = useLang();
  var lang      = langCtx.lang;
  var dir       = langCtx.dir;
  var isHe      = lang === "he";

  var _e  = useState(""); var email        = _e[0];  var setEmail        = _e[1];
  var _p  = useState(""); var password      = _p[0];  var setPassword      = _p[1];
  var _ro = useState("professional"); var role = _ro[0]; var setRole      = _ro[1];
  var _rm = useState(false); var rememberMe = _rm[0]; var setRememberMe   = _rm[1];
  var _sp = useState(false); var showPassword=_sp[0]; var setShowPassword = _sp[1];
  var _l  = useState(false); var isLoading  = _l[0];  var setIsLoading    = _l[1];
  var _m  = useState(false); var mounted    = _m[0];  var setMounted      = _m[1];
  var _er = useState({});    var errors     = _er[0]; var setErrors       = _er[1];
  var _sh = useState(false); var shakeError = _sh[0]; var setShakeError   = _sh[1];
  var _ff = useState(null);  var focusedField=_ff[0]; var setFocusedField = _ff[1];

  useEffect(function() {
    var tm = setTimeout(function() { setMounted(true); }, 50);
    return function() { clearTimeout(tm); };
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

  var handleSubmit = function() {
    if (!validateForm()) {
      setShakeError(true);
      setTimeout(function() { setShakeError(false); }, 600);
      return;
    }
    setIsLoading(true);
    setTimeout(function() {
      if      (role === "client")       { navigate("/client/dashboard"); }
      else if (role === "admin")        { navigate("/admin");            }
      else                              { navigate("/pro/dashboard");    }
      setIsLoading(false);
    }, 1500);
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
        <div className={"auth-card " + (shakeError ? "auth-card--shake" : "")}>

          <div className="auth-header">
            <h1 className="auth-logo">
              <span className="auth-logo-fix">Fix</span>
              <span className="auth-logo-mate">Mate</span>
            </h1>
            <p className="auth-subtitle">
              {isHe ? "ברוכים הבאים לפלטפורמת השירות" : "Welcome to the service platform"}
            </p>
          </div>

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
            <label className="auth-checkbox-label" onClick={function() { setRememberMe(!rememberMe); }}>
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
            <button className="auth-forgot-link" onClick={function() { navigate("/forgot-password"); }}>
              {isHe ? "שכחת סיסמה?" : "Forgot password?"}
            </button>
          </div>

          {/* Submit */}
          <button
            className={"auth-submit-btn " + (isLoading ? "auth-submit-btn--loading" : "")}
            onClick={handleSubmit}
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
            <button className="auth-switch-link" onClick={function() { navigate("/register"); }}>
              {isHe ? "צרו חשבון" : "Create an account"}
            </button>
          </p>
        </div>
        <div className="auth-decorative-pill" />
      </div>
    </div>
  );
}