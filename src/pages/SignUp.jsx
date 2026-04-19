/**
 * =============================================
 *  FixMate – Sign Up Page (Screen 3)
 * =============================================
 *
 * PURPOSE: Registration screen where new users create an account.
 *          Step 1: Choose role (Client or Professional)
 *          Step 2: Fill in personal details
 *          Step 3: Professional-only extra fields (categories, service area, price)
 *
 * FILE LOCATION: src/pages/SignUp.jsx
 * STYLES: src/styles/auth.css
 * ROUTE: /register
 *
 * CONNECTIONS:
 *  - "Create Account" button → POST /api/auth/register
 *    → On success: redirect to /login (Screen 2 - SignIn.jsx)
 *  - "Already have an account?" → /login (Screen 2 - SignIn.jsx)
 *  - Back arrow → / (Landing Page - log.jsx)
 *
 * API ENDPOINT:
 *  POST /api/auth/register
 *  Body (Client):
 *    { fullName, email, password, phone, address, role: "client" }
 *  Body (Professional):
 *    { fullName, email, password, phone, address, role: "professional",
 *      categories, serviceArea, priceRange, bio }
 *  Response: { message: "Registration successful", userId }
 *
 * 🚩 [PAYMENT-FLAG] In the future, professionals may need to
 *    choose a subscription plan during registration.
 * =============================================
 */

/* ═══════════════════════════════════════════════
   ייבוא הכלים שצריך מ-React וממקומות אחרים
   ═══════════════════════════════════════════════ */
import { useState, useEffect } from "react";           // useState = זיכרון של הקומפוננטה | useEffect = מפעיל קוד בזמנים מסוימים
import { useNavigate } from "react-router-dom";         // הוק שמאפשר לעבור בין דפים באתר
import "../styles/auth.css";                             // קובץ העיצוב (צבעים, גדלים, אנימציות)
import { useLang } from "../context/LanguageContext";    // הוק לתמיכה בשתי שפות (עברית/אנגלית)

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */

/** User icon — full name input */
const IconUser = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/** Envelope icon — email input */
const IconMail = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);

/** Lock icon — password input */
const IconLock = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="3" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/** Phone icon — phone number input */
const IconPhone = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

/** Map pin icon — address/location input */
const IconMapPin = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/** Dollar icon — price range input */
const IconDollar = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/** Eye icon — show password */
const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/** Eye-off icon — hide password */
const IconEyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

/** Wrench icon — Professional role card */
const IconWrench = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

/** House icon — Client role card */
const IconHome = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-4 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1" />
  </svg>
);

/** Arrow-left icon — back button */
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/** Arrow-right icon — next step button */
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** Spinner icon — loading state on submit */
const IconSpinner = () => (
  <svg className="auth-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

/** Check-circle icon — success state */
const IconCheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4F6AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11.5 14.5 16 9.5" />
  </svg>
);


/* ─────────────────────────────────────────────
   Available service categories for Professionals
   These come from the backend in production.
   🔗 GET /api/categories
   ───────────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  { id: "electrical", label: "Electrical", he: "חשמל", icon: "⚡" },
  { id: "plumbing", label: "Plumbing", he: "שרברבות", icon: "🔧" },
  { id: "ac", label: "AC / HVAC", he: "מזגנים", icon: "❄️" },
  { id: "painting", label: "Painting", he: "צביעה", icon: "🎨" },
  { id: "carpentry", label: "Carpentry", he: "נגרות", icon: "🪚" },
  { id: "cleaning", label: "Cleaning", he: "ניקיון", icon: "🧹" },
  { id: "locksmith", label: "Locksmith", he: "מנעולן", icon: "🔑" },
  { id: "appliances", label: "Appliances", he: "מכשירי חשמל", icon: "🔌" },
];


/* =============================================
 *  הקומפוננטה הראשית - דף ההרשמה
 *  מנוהלת ב-4 שלבים:
 *  שלב 1 - בחירת תפקיד | שלב 2 - פרטים אישיים | שלב 3 - פרטי מקצוען | שלב 4 - הצלחה
 * ============================================= */
export default function SignUp() {
  /* ─── הוקים בסיסיים ─── */
  const navigate = useNavigate();              // כלי לניווט בין דפים
  const { lang, dir } = useLang();             // lang = השפה ("he"/"en"), dir = הכיוון ("rtl"/"ltr")
  const isHe = lang === "he";                   // האם השפה עברית? (true/false)
  const [step, setStep] = useState(1);          // באיזה שלב אנחנו עכשיו (מתחיל ב-1)

  /* ─── משתני הטופס (כל שדה = useState נפרד) ─── */
  const [role, setRole] = useState("");                      // תפקיד: "client" או "professional"
  const [fullName, setFullName] = useState("");              // שם מלא
  const [email, setEmail] = useState("");                    // אימייל
  const [password, setPassword] = useState("");              // סיסמה
  const [confirmPassword, setConfirmPassword] = useState(""); // אימות סיסמה
  const [phone, setPhone] = useState("");                    // מספר טלפון
  const [address, setAddress] = useState("");                // כתובת/עיר
  const [avatar, setAvatar] = useState(null);                // קובץ תמונת הפרופיל (אובייקט File)
  const [avatarPreview, setAvatarPreview] = useState(null);  // תצוגה מקדימה של התמונה (Data URL)
  const [showPassword, setShowPassword] = useState(false);   // האם להציג את הסיסמה? (אייקון עין)
  const [showConfirm, setShowConfirm] = useState(false);     // האם להציג את אימות הסיסמה?

  /* ─── שדות שרלוונטיים רק לבעלי מקצוע (שלב 3) ─── */
  const [selectedCategories, setSelectedCategories] = useState([]); // רשימת קטגוריות נבחרות
  const [serviceRadius, setServiceRadius] = useState("10");         // רדיוס שירות בק"מ (סליידר)
  const [priceMin, setPriceMin] = useState("");                     // מחיר מינימום
  const [priceMax, setPriceMax] = useState("");                     // מחיר מקסימום
  const [bio, setBio] = useState("");                               // תיאור עצמי (ביוגרפיה)

  /* ─── UI State ─── אלה משתנים שלא שומרים את המידע הראשי של המשתמש כמו שם, אימייל, סיסמה, אלא שומרים איך המסך מתנהג ונראה.*/
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);    /* ─── קשור של אנימטציה של מסך─── */
  const [errors, setErrors] = useState({});  
  const [shakeError, setShakeError] = useState(false);/* ─── שולט על אנימציית רעד כשיש שגיאה */
  const [focusedField, setFocusedField] = useState(null);  /* ─── השדה שהמשתמש עומד עליו עכשיו וכותב בו.*/
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* Trigger entrance animation on mount-רץ פעם אחת כשהקומפוננטה נטענת */
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  /* Scroll to top when step changes-כשעוברים משלב לשלב, הדף חוזר אוטומטית להתחלה של העמוד בצורה חלקה. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  /**
   * toggleCategory — Add/remove a category from selection- בודקים את הקטגוריה אם קיימת מוחקים אם לא מוספים
   */
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId) /* משאירים רק את מה שלא שווה ל־categoryId */
        : [...prev, categoryId] /* אם לא קיימת הקטגוריה אז מוסיפים אותה */
    );
    if (errors.categories) setErrors((prev) => ({ ...prev, categories: null }));
  };

  /**
   * handleAvatarChange — Handle profile image upload-פונקציה שמופעלת כשבוחרים תמונה
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, avatar: "Image must be under 5MB" }));
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file); /* מתחילים לקרוא את הקובץ ולהפוך אותו לתמונה להצגה */
      if (errors.avatar) setErrors((prev) => ({ ...prev, avatar: null }));
    }
  };

  const removeAvatar = () => {  /* מאפס התמונה שנבחרה */  
    setAvatar(null);
    setAvatarPreview(null);
  };

  /**
   * validateStep2 — Validate personal details fields
   */
  const validateStep2 = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = isHe ? "שם מלא נדרש" : "Full name is required";
    if (!email.trim()) {
      newErrors.email = isHe ? "אימייל נדרש" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = isHe ? "אנא הזינו אימייל תקין" : "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = isHe ? "סיסמה נדרשת" : "Password is required";
    } else if (password.length < 6) {
      newErrors.password = isHe ? "סיסמה חייבת להכיל 6 תווים" : "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = isHe ? "הסיסמאות לא תואמות" : "Passwords do not match";
    }
    if (!phone.trim()) newErrors.phone = isHe ? "מספר טלפון נדרש" : "Phone number is required";
    if (!address.trim()) newErrors.address = isHe ? "כתובת נדרשת" : "Address is required";
    if (!agreeTerms) newErrors.terms = isHe ? "יש לאשר את התנאים" : "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * validateStep3 — Validate professional-only fields-“Unicode הוא ייצוג של טקסט באמצעות קודים מספריים כדי לאפשר תמיכה בכל השפות ולמנוע בעיות קידוד.”
   */
  const validateStep3 = () => {
    const newErrors = {};
    if (selectedCategories.length === 0) newErrors.categories = isHe ? "בחרו לפחות קטגוריה אחת" : "Select at least one service category";
    if (!priceMin || !priceMax) newErrors.price = isHe ? "\u05d0\u05e0\u05d0 \u05d4\u05d2\u05d3\u05d9\u05e8\u05d5 \u05d8\u05d5\u05d5\u05d7 \u05de\u05d7\u05d9\u05e8\u05d9\u05dd" : "Please set your price range";   
    if (!bio.trim()) newErrors.bio = isHe ? "\u05d0\u05e0\u05d0 \u05db\u05ea\u05d1\u05d5 \u05e7\u05e6\u05ea \u05e2\u05dc \u05e2\u05e6\u05de\u05db\u05dd" : "Please write a short bio"; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * handleNext — Move to the next step after validation
   */
  const handleNext = () => {
    if (step === 1) {
      if (!role) {
        setErrors({ role: isHe ? "אנא בחרו תפקיד" : "Please choose a role" });
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        return;
      }
      if (role === "client") {
        handleSubmit();
      } else {
        setErrors({});
        setStep(3);
      }
    } else if (step === 3) {
      if (!validateStep3()) {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        return;
      }
      handleSubmit();
    }
  };

  /**
   * handleBack — Go back one step
   */
  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  /**
   * handleSubmit — Send registration data to the API
   *
   * 🔗 API: POST /api/auth/register
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const body = {
        fullName,
        email,
        password,
        phone,
        address,
        role: role.toUpperCase()
      };

      if (role === 'professional') {
        body.bio = bio;
      }

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // שמירת ה-Token אחרי הרשמה מוצלחת
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('fullName', data.fullName);

      setStep(4);

    } catch (error) {
      setErrors({ general: isHe ? "ההרשמה נכשלה. נסו שוב." : error.message || "Registration failed." });
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * getInputClass — Returns CSS classes for input container-
   */
  const getInputClass = (fieldName) => {
    let cls = "auth-input-container";
    if (errors[fieldName]) cls += " auth-input-container--error";
    if (focusedField === fieldName) cls += " auth-input-container--focused";  /* שם השדה שהמשתמש עומד עליו */
    return cls;
  };

  const totalSteps = role === "professional" ? 3 : 2;         /*     מחשב כמה שלבים יש בטופס */

  return (
    <div className="auth-page" dir={dir}> /*כאן מתחיל החלק שמחזיר את ה־HTML של הקומפוננטה.─*/

      {/* ── Decorative Gradient Header ── */}
      <div className="auth-gradient-header" />
      <div className="auth-float-circle auth-float-circle--1" />
      <div className="auth-float-circle auth-float-circle--2" />
      <div className="auth-float-circle auth-float-circle--3" />

      {/* ── Back Button ──זה כפתור החזרה העליון. */}
      <button
        className="auth-back-btn"
        onClick={() => {
          if (step === 1) navigate("/");          // → Landing Page
          else if (step === 4) navigate("/login"); // → Sign In
          else handleBack();                       // → Previous step
        }}
      >
        <IconArrowLeft /> /* ציור של חץ שמאלה */
        {step === 1 ? (isHe ? "\u05d1\u05d9\u05ea" : "Home") : step === 4 ? (isHe ? "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" : "Login") : (isHe ? "\u05d7\u05d6\u05e8\u05d4" : "Back")}
      </button>

      {/* ═══════════════════════════════════════════
          MAIN CARD WRAPPER
          ═══════════════════════════════════════════ */}
      <div className={`auth-card-wrapper ${mounted ? "auth-card-wrapper--visible" : ""}`}> {/* mounted → גורם לכרטיס להופיע באנימציה
                                                                                           shakeError → גורם לכרטיס לרעוד אם יש שגיאה ── */}
        <div className={`auth-card ${shakeError ? "auth-card--shake" : ""}`}>

          {/* ── Logo ── */}
          <div className="auth-header">
            <h1 className="auth-logo">
              <span className="auth-logo-fix">Fix</span>
              <span className="auth-logo-mate">Mate</span>
            </h1>
            {step < 4 && (
              <p className="auth-subtitle">
                {step === 1 ? (isHe ? "\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df" : "Create your account") : step === 2 ? (isHe ? "\u05e4\u05e8\u05d8\u05d9\u05dd \u05d0\u05d9\u05e9\u05d9\u05d9\u05dd" : "Personal details") : (isHe ? "\u05e4\u05e8\u05d8\u05d9 \u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2" : "Professional details")}
              </p>
            )}
          </div>

          {/* ── Progress Bar ── באיזה שלב את נמצאת מתוך כמה שלבים*/}
          {step < 4 && (
            <div className="signup-progress">
              <div className="signup-progress-bar">
                <div className="signup-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
              </div>
              <span className="signup-progress-text">{isHe ? "\u05e9\u05dc\u05d1 " + step + " \u05de\u05ea\u05d5\u05da " + totalSteps : "Step " + step + " of " + totalSteps}</span>
            </div>
          )}

          {/* ── General Error ── */}
          {errors.general && (
            <div className="auth-error-banner">
              <span>⚠️</span>
              {errors.general}
            </div>
          )}


          {/* ═══════════════════════════════════════════
              STEP 1: ROLE SELECTION
              ═══════════════════════════════════════════ */}
          {step === 1 && (
            <div className="signup-step">
              <p className="signup-step-desc">{isHe ? "\u05d0\u05d9\u05da \u05ea\u05e8\u05e6\u05d5 \u05dc\u05d4\u05e9\u05ea\u05de\u05e9 \u05d1\u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8?" : "How would you like to use FixMate?"}</p>

              <div className="signup-role-grid">
                {/* Client Card */}
                <div
                  className={`signup-role-option ${role === "client" ? "signup-role-option--active" : ""}`}
                  onClick={() => { setRole("client"); if (errors.role) setErrors({}); }}
                >
                  <div className="signup-role-icon"><IconHome /></div>
                  <h3 className="signup-role-title">{isHe ? "\u05dc\u05e7\u05d5\u05d7" : "Client"}</h3>
                  <p className="signup-role-desc">{isHe ? "\u05d0\u05e0\u05d9 \u05e6\u05e8\u05d9\u05da \u05dc\u05de\u05e6\u05d5\u05d0 \u05d5\u05dc\u05d4\u05d6\u05de\u05d9\u05df \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2" : "I need to find and book home service professionals"}</p>
                  {role === "client" && <div className="signup-role-check">✓</div>}
                </div>

                {/* Professional Card */}
                <div
                  className={`signup-role-option ${role === "professional" ? "signup-role-option--active" : ""}`}
                  onClick={() => { setRole("professional"); if (errors.role) setErrors({}); }}
                >
                  <div className="signup-role-icon"><IconWrench /></div>
                  <h3 className="signup-role-title">{isHe ? "\u05d1\u05e2\u05dc \u05de\u05e7\u05e6\u05d5\u05e2" : "Professional"}</h3>
                  <p className="signup-role-desc">{isHe ? "\u05d0\u05e0\u05d9 \u05de\u05e6\u05d9\u05e2 \u05e9\u05d9\u05e8\u05d5\u05ea\u05d9 \u05d1\u05d9\u05ea \u05d5\u05e8\u05d5\u05e6\u05d4 \u05dc\u05e7\u05d1\u05dc \u05e2\u05d5\u05d3 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea" : "I offer home services and want to get more clients"}</p>
                  {role === "professional" && <div className="signup-role-check">✓</div>}
                </div>
              </div>

              {errors.role && <p className="auth-field-error" style={{ textAlign: "center" }}>{errors.role}</p>}
            </div>
          )}


          {/* ═══════════════════════════════════════════
              STEP 2: PERSONAL DETAILS
              ═══════════════════════════════════════════ */}
          {step === 2 && (
            <div className="signup-step">

              {/* Profile Photo Upload */}
              <div className="auth-avatar-upload">
                <div className="auth-avatar-circle" onClick={() => document.getElementById("avatar-input").click()}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="auth-avatar-img" />
                  ) : (   
                    <div className="auth-avatar-placeholder">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  )}
                  <div className="auth-avatar-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </div>
                <input type="file" id="avatar-input" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                <p className="auth-avatar-label">
                  {avatarPreview ? (isHe ? "\u05d4\u05d7\u05dc\u05e4\u05d5 \u05ea\u05de\u05d5\u05e0\u05d4" : "Change Photo") : (isHe ? "\u05d4\u05e2\u05dc\u05d5 \u05ea\u05de\u05d5\u05e0\u05ea \u05e4\u05e8\u05d5\u05e4\u05d9\u05dc" : "Upload Profile Photo")}
                </p>
                {avatarPreview && (
                  <button type="button" className="auth-avatar-remove" onClick={removeAvatar}>{isHe ? "\u05d4\u05e1\u05e8" : "Remove"}</button>
                )}
                {errors.avatar && <p className="auth-field-error">{errors.avatar}</p>}
              </div>

              {/* Full Name */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05e9\u05dd \u05de\u05dc\u05d0" : "Full Name"}</label>
                <div className={getInputClass("fullName")}>
                  <IconUser />
                  <input type="text" className="auth-input" placeholder={isHe ? "\u05d9\u05e9\u05e8\u05d0\u05dc \u05d9\u05e9\u05e8\u05d0\u05dc\u05d9" : "John Doe"} value={fullName}
                    onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors((p) => ({ ...p, fullName: null })); }}
                    onFocus={() => setFocusedField("fullName")} onBlur={() => setFocusedField(null)} />
                </div>
                {errors.fullName && <p className="auth-field-error">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05d0\u05d9\u05de\u05d9\u05d9\u05dc" : "Email"}</label>
                <div className={getInputClass("email")}>
                  <IconMail />
                  <input type="email" className="auth-input" placeholder="name@email.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: null })); }}
                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
                </div>
                {errors.email && <p className="auth-field-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05e1\u05d9\u05e1\u05de\u05d4" : "Password"}</label>
                <div className={getInputClass("password")}>
                  <IconLock />
                  <input type={showPassword ? "text" : "password"} className="auth-input" placeholder={isHe ? "\u05dc\u05e4\u05d7\u05d5\u05ea 6 \u05ea\u05d5\u05d5\u05d9\u05dd" : "Min. 6 characters"} value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: null })); }}
                    onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
                {errors.password && <p className="auth-field-error">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05d0\u05d9\u05de\u05d5\u05ea \u05e1\u05d9\u05e1\u05de\u05d4" : "Confirm Password"}</label>
                <div className={getInputClass("confirmPassword")}>
                  <IconLock />
                  <input type={showConfirm ? "text" : "password"} className="auth-input" placeholder={isHe ? "\u05d4\u05d6\u05d9\u05e0\u05d5 \u05e1\u05d9\u05e1\u05de\u05d4 \u05e9\u05d5\u05d1" : "Re-enter your password"} value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: null })); }}
                    onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)} />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="auth-field-error">{errors.confirmPassword}</p>}
              </div>

              {/* Phone */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05de\u05e1\u05e4\u05e8 \u05d8\u05dc\u05e4\u05d5\u05df" : "Phone Number"}</label>
                <div className={getInputClass("phone")}>
                  <IconPhone />
                  <input type="tel" className="auth-input" placeholder="+972 50-000-0000" value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((p) => ({ ...p, phone: null })); }}
                    onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} />
                </div>
                {errors.phone && <p className="auth-field-error">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05db\u05ea\u05d5\u05d1\u05ea / \u05e2\u05d9\u05e8" : "Address / City"}</label>
                <div className={getInputClass("address")}>
                  <IconMapPin />
                  <input type="text" className="auth-input" placeholder={isHe ? "\u05ea\u05dc \u05d0\u05d1\u05d9\u05d1, \u05d9\u05e9\u05e8\u05d0\u05dc" : "Tel Aviv, Israel"} value={address}
                    onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors((p) => ({ ...p, address: null })); }}
                    onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)} />
                </div>
                {errors.address && <p className="auth-field-error">{errors.address}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="auth-field">
                <label className="auth-checkbox-label" onClick={() => { setAgreeTerms(!agreeTerms); if (errors.terms) setErrors((p) => ({ ...p, terms: null })); }}>
                  <div className={`auth-checkbox ${agreeTerms ? "auth-checkbox--checked" : ""}`}>
                    {agreeTerms && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {isHe ? "\u05d0\u05e0\u05d9 \u05de\u05e1\u05db\u05d9\u05dd \u05dc" : "I agree to the "}<span className="signup-terms-link">{isHe ? "\u05ea\u05e0\u05d0\u05d9 \u05e9\u05d9\u05de\u05d5\u05e9" : "Terms of Service"}</span>{isHe ? " \u05d5" : " and "}{" "}
                  <span className="signup-terms-link">{isHe ? "\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea" : "Privacy Policy"}</span>
                </label>
                {errors.terms && <p className="auth-field-error">{errors.terms}</p>}
              </div>
            </div>
          )}


          {/* ═══════════════════════════════════════════
              STEP 3: PROFESSIONAL DETAILS
              ═══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="signup-step">

              {/* Service Categories */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d5\u05ea \u05e9\u05d9\u05e8\u05d5\u05ea" : "Service Categories"}</label>
                <p className="signup-field-hint">{isHe ? "\u05d1\u05d7\u05e8\u05d5 \u05d0\u05ea \u05db\u05dc \u05d4\u05e8\u05dc\u05d5\u05d5\u05e0\u05d8\u05d9\u05d9\u05dd" : "Select all that apply"}</p>
                <div className="signup-categories-grid">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <div key={cat.id}
                      className={`signup-category-chip ${selectedCategories.includes(cat.id) ? "signup-category-chip--active" : ""}`}
                      onClick={() => toggleCategory(cat.id)}>
                      <span className="signup-category-icon">{cat.icon}</span>
                      <span className="signup-category-label">{isHe ? cat.he : cat.label}</span>
                    </div>
                  ))}
                </div>
                {errors.categories && <p className="auth-field-error">{errors.categories}</p>}
              </div>

              {/* Service Radius */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05e8\u05d3\u05d9\u05d5\u05e1 \u05e9\u05d9\u05e8\u05d5\u05ea: " : "Service Radius: "}<strong>{serviceRadius} {isHe ? "\u05e7\u05f4\u05de" : "km"}</strong></label>
                <input type="range" className="signup-range-slider" min="5" max="50" step="5"
                  value={serviceRadius} onChange={(e) => setServiceRadius(e.target.value)} />
                <div className="signup-range-labels"><span>5 km</span><span>50 km</span></div>
              </div>

              {/* Price Range */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05d8\u05d5\u05d5\u05d7 \u05de\u05d7\u05d9\u05e8\u05d9\u05dd (\u05dc\u05e2\u05d1\u05d5\u05d3\u05d4)" : "Price Range (per job)"}</label>
                <div className="signup-price-row">
                  <div className={getInputClass("price")} style={{ flex: 1 }}>
                    <IconDollar />
                    <input type="number" className="auth-input" placeholder={isHe ? "\u05de\u05d9\u05e0\u05d9\u05de\u05d5\u05dd" : "Min"} value={priceMin}
                      onChange={(e) => { setPriceMin(e.target.value); if (errors.price) setErrors((p) => ({ ...p, price: null })); }}
                      onFocus={() => setFocusedField("price")} onBlur={() => setFocusedField(null)} />
                  </div>
                  <span className="signup-price-dash">—</span>
                  <div className={getInputClass("price")} style={{ flex: 1 }}>
                    <IconDollar />
                    <input type="number" className="auth-input" placeholder={isHe ? "\u05de\u05e7\u05e1\u05d9\u05de\u05d5\u05dd" : "Max"} value={priceMax}
                      onChange={(e) => { setPriceMax(e.target.value); if (errors.price) setErrors((p) => ({ ...p, price: null })); }}
                      onFocus={() => setFocusedField("price")} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>
                {errors.price && <p className="auth-field-error">{errors.price}</p>}
              </div>

              {/* Bio */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "\u05e2\u05dc \u05e2\u05e6\u05de\u05da" : "About You"}</label>
                <div className={`auth-input-container signup-textarea-container ${errors.bio ? "auth-input-container--error" : ""} ${focusedField === "bio" ? "auth-input-container--focused" : ""}`}>
                  <textarea className="auth-input signup-textarea"
                    placeholder={isHe ? "ספרו ללקוחות על הניסיון, הכישורים והמומחיות שלכם..." : "Tell clients about your experience, skills, and what makes you the best choice..."}
                    value={bio} onChange={(e) => { setBio(e.target.value); if (errors.bio) setErrors((p) => ({ ...p, bio: null })); }}
                    onFocus={() => setFocusedField("bio")} onBlur={() => setFocusedField(null)} rows={4} />
                </div>
                <div className="signup-char-count">{bio.length}/300</div>
                {errors.bio && <p className="auth-field-error">{errors.bio}</p>}
              </div>
            </div>
          )}


          {/* ═══════════════════════════════════════════
              STEP 4: SUCCESS SCREEN
              ═══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="signup-step signup-success">
              <div className="signup-success-icon"><IconCheckCircle /></div>
              <h2 className="signup-success-title">{isHe ? "\u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05d1\u05d0\u05d9\u05dd \u05dc\u05e4\u05d9\u05e7\u05e1\u05de\u05d9\u05d9\u05d8!" : "Welcome to FixMate!"}</h2>
              <p className="signup-success-desc">
                {isHe ? "\u05d4\u05d7\u05e9\u05d1\u05d5\u05df \u05e0\u05d5\u05e6\u05e8 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4." : "Your account has been created successfully."}
                {role === "professional"
                  ? (isHe ? " \u05d4\u05e4\u05e8\u05d5\u05e4\u05d9\u05dc \u05e9\u05dc\u05db\u05dd \u05d2\u05dc\u05d5\u05d9 \u05db\u05e2\u05ea \u05dc\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05d1\u05d0\u05d6\u05d5\u05e8 \u05e9\u05dc\u05db\u05dd." : " Your profile is now visible to clients in your area.")
                  : (isHe ? " \u05ea\u05d5\u05db\u05dc\u05d5 \u05dc\u05d7\u05e4\u05e9 \u05d5\u05dc\u05d4\u05d6\u05de\u05d9\u05df \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05d1\u05e7\u05e8\u05d1\u05ea\u05db\u05dd." : " You can now search and book professionals near you.")}
              </p>
              <button className="auth-submit-btn" onClick={() => navigate("/login")}>
                {isHe ? "\u05dc\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" : "Go to Sign In"}
                <IconArrowRight />
              </button>
            </div>
          )}


          {/* ═══════════════════════════════════════════
              NAVIGATION BUTTONS (Steps 1-3)
              ═══════════════════════════════════════════ */}
          {step < 4 && (       /*  כפתור חזרה  */
            <div className="signup-nav-buttons">
              {step > 1 && (      
                <button className="signup-back-btn" onClick={handleBack}>
                  <IconArrowLeft /> {isHe ? "\u05d7\u05d6\u05e8\u05d4" : "Back"}
                </button>
              )}
              <button
                className={`auth-submit-btn ${isLoading ? "auth-submit-btn--loading" : ""} ${step === 1 ? "signup-btn-full" : ""}`}
                onClick={handleNext} disabled={isLoading}>
                {isLoading ? (<><IconSpinner /> {isHe ? "\u05d9\u05d5\u05e6\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df..." : "Creating account..."}</>) :
                  step === 1 ? (<>{isHe ? "\u05d4\u05de\u05e9\u05da" : "Continue"} <IconArrowRight /></>) :
                  (step === 2 && role === "professional") ? (<>{isHe ? "\u05e9\u05dc\u05d1 \u05d4\u05d1\u05d0" : "Next Step"} <IconArrowRight /></>) :
                  (isHe ? "\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df" : "Create Account")}
              </button>
            </div>
          )}

          {/* ── Switch to Sign In ── */}
          {step === 1 && (
            <p className="auth-switch-text">
              {isHe ? "\u05db\u05d1\u05e8 \u05d9\u05e9 \u05dc\u05db\u05dd \u05d7\u05e9\u05d1\u05d5\u05df? " : "Already have an account? "}
              <button className="auth-switch-link" onClick={() => navigate("/login")}>{isHe ? "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" : "Sign In"}</button>
            </p>
          )}

        </div>
        <div className="auth-decorative-pill" />
      </div>
    </div>
  );
}