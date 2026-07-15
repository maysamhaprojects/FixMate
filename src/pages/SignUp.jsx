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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useLang } from "../context/LanguageContext";
import { COUNTRIES } from "../data/countries";
import { ISRAEL_CITIES } from "../data/israelCities";
import { apiFetch } from "../services/api";
import { IconUser, IconMail, IconLock, IconPhone, IconMapPin, IconDollar, IconEye, IconEyeOff, IconWrench, IconHome, IconArrowLeft, IconArrowRight, IconSpinner, IconCheckCircle } from "../components/AuthIcons";

/* ─────────────────────────────────────────────
   SVG Icon Components
   ───────────────────────────────────────────── */

/** User icon — full name input */

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


/* ─────────────────────────────────────────────
   תוכן משפטי — תנאי שימוש ומדיניות פרטיות
   ───────────────────────────────────────────── */
const LEGAL_TERMS = [
  {
    titleHe: "1. קבלת התנאים",
    titleEn: "1. Acceptance of Terms",
    bodyHe: "השימוש בפלטפורמת FixMate מהווה הסכמה מלאה לתנאי שימוש אלה. אם אינך מסכים לתנאים, אנא הימנע משימוש בשירות.",
    bodyEn: "By using the FixMate platform you fully accept these Terms of Service. If you do not agree, please refrain from using the service.",
  },
  {
    titleHe: "2. אופי השירות",
    titleEn: "2. Nature of the Service",
    bodyHe: "FixMate היא פלטפורמה המקשרת בין לקוחות לבין בעלי מקצוע בתחום שירותי הבית. FixMate אינה צד להתקשרות בין הלקוח לבעל המקצוע ואינה מספקת את השירותים בעצמה.",
    bodyEn: "FixMate is a platform connecting clients with home-service professionals. FixMate is not a party to the engagement between client and professional and does not provide the services itself.",
  },
  {
    titleHe: "3. חשבון משתמש",
    titleEn: "3. User Account",
    bodyHe: "עליך לספק מידע מדויק ומעודכן בעת ההרשמה, ולשמור על סודיות פרטי ההתחברות שלך. אתה אחראי לכל פעילות המתבצעת בחשבונך. חשבונות בעלי מקצוע כפופים לאישור מנהל.",
    bodyEn: "You must provide accurate, up-to-date information upon registration and keep your login credentials confidential. You are responsible for all activity under your account. Professional accounts are subject to admin approval.",
  },
  {
    titleHe: "4. אחריות בעלי המקצוע",
    titleEn: "4. Professional Responsibility",
    bodyHe: "בעלי המקצוע אחראים באופן בלעדי לאיכות עבודתם, לרישיונות ולביטוחים הנדרשים בחוק. FixMate אינה ערבה לטיב השירות.",
    bodyEn: "Professionals are solely responsible for the quality of their work and for holding the licenses and insurance required by law. FixMate does not guarantee service quality.",
  },
  {
    titleHe: "5. תשלומים ודירוגים",
    titleEn: "5. Payments & Ratings",
    bodyHe: "מחירים מוצגים על ידי בעלי המקצוע. דירוגים וביקורות משקפים את דעת המשתמשים בלבד. אין להזין ביקורות כוזבות או פוגעניות.",
    bodyEn: "Prices are set by professionals. Ratings and reviews reflect users' opinions only. Submitting false or abusive reviews is prohibited.",
  },
  {
    titleHe: "6. הגבלת אחריות",
    titleEn: "6. Limitation of Liability",
    bodyHe: "FixMate לא תישא באחריות לנזק ישיר או עקיף הנובע משימוש בשירות או מהתקשרות עם בעל מקצוע. השימוש בפלטפורמה הוא על אחריות המשתמש בלבד.",
    bodyEn: "FixMate shall not be liable for any direct or indirect damage arising from use of the service or engagement with a professional. Use of the platform is at your own risk.",
  },
];

const LEGAL_PRIVACY = [
  {
    titleHe: "1. איזה מידע אנו אוספים",
    titleEn: "1. Information We Collect",
    bodyHe: "אנו אוספים מידע שתמסור בעת ההרשמה: שם מלא, אימייל, מספר טלפון, כתובת/עיר, ולבעלי מקצוע — קטגוריות שירות, טווח מחירים ותיאור.",
    bodyEn: "We collect information you provide upon registration: full name, email, phone number, address/city, and for professionals — service categories, price range and description.",
  },
  {
    titleHe: "2. כיצד אנו משתמשים במידע",
    titleEn: "2. How We Use Information",
    bodyHe: "המידע משמש לניהול חשבונך, לקישור בין לקוחות לבעלי מקצוע, לשיפור השירות ולתקשורת איתך בנוגע להזמנות ולעדכונים.",
    bodyEn: "The information is used to manage your account, connect clients with professionals, improve the service, and communicate with you about bookings and updates.",
  },
  {
    titleHe: "3. שיתוף מידע",
    titleEn: "3. Information Sharing",
    bodyHe: "לא נמכור את המידע האישי שלך לצדדים שלישיים. פרטים רלוונטיים (כגון שם וטלפון) עשויים להיות משותפים בין לקוח לבעל מקצוע לצורך ביצוע השירות בלבד.",
    bodyEn: "We will not sell your personal information to third parties. Relevant details (such as name and phone) may be shared between client and professional solely to perform the service.",
  },
  {
    titleHe: "4. אבטחת מידע",
    titleEn: "4. Data Security",
    bodyHe: "סיסמאות נשמרות בצורה מוצפנת. אנו נוקטים באמצעים סבירים להגנה על המידע, אך לא ניתן להבטיח אבטחה מוחלטת ברשת.",
    bodyEn: "Passwords are stored encrypted. We take reasonable measures to protect your data, but no method of transmission over the internet is completely secure.",
  },
  {
    titleHe: "5. זכויותיך",
    titleEn: "5. Your Rights",
    bodyHe: "באפשרותך לצפות, לעדכן או למחוק את פרטיך האישיים בכל עת דרך הגדרות החשבון או בפנייה אלינו.",
    bodyEn: "You may view, update or delete your personal details at any time via your account settings or by contacting us.",
  },
  {
    titleHe: "6. יצירת קשר",
    titleEn: "6. Contact Us",
    bodyHe: "לשאלות בנוגע לפרטיות ניתן לפנות אלינו בכתובת support@fixmate.co.il.",
    bodyEn: "For any privacy-related questions, contact us at support@fixmate.co.il.",
  },
];


/* =============================================
 *  MAIN COMPONENT: SignUp
 * ============================================= */
export default function SignUp() {
  /* ─── Navigation hook for page transitions ─── */
  const navigate = useNavigate();
  const { lang, dir } = useLang();
  const isHe = lang === "he";
  const [step, setStep] = useState(1);

  /* ─── Form Data ─── */
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(COUNTRIES[0]); // ברירת מחדל: ישראל
  const [phoneDdOpen, setPhoneDdOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [address, setAddress] = useState("");
  const [addrOpen, setAddrOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ─── Professional-Only Fields ─── */
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [serviceRadius, setServiceRadius] = useState("10");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [docs, setDocs] = useState([]); // [{ name, data(base64) }]

  /* ─── UI State ─── */
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({});
  const [shakeError, setShakeError] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // null | "terms" | "privacy"

  /* Trigger entrance animation on mount */
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  /* Scroll to top when step changes */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  /* סינון ערי ישראל לפי מה שהוקלד (עברית או אנגלית) — מיידי, מהרשימה המקומית */
  const cityMatches = (() => {
    if (!addrOpen) return [];
    const q = address.trim().toLowerCase();
    if (!q) return [];
    return ISRAEL_CITIES.filter(
      (c) => c.he.includes(address.trim()) || c.en.toLowerCase().includes(q)
    ).slice(0, 12);
  })();

  /**
   * handleDocsChange — קריאת מסמכים שהועלו והמרתם ל-base64
   */
  const handleDocsChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        setErrors((p) => ({ ...p, docs: isHe ? "כל קובץ חייב להיות עד 3MB" : "Each file must be under 3MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setDocs((prev) => [...prev, { name: file.name, data: reader.result }]);
      reader.readAsDataURL(file);
    });
    if (errors.docs) setErrors((p) => ({ ...p, docs: null }));
    e.target.value = "";
  };
  const removeDoc = (idx) => setDocs((prev) => prev.filter((_, i) => i !== idx));

  /**
   * toggleCategory — Add/remove a category from selection
   */
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
    if (errors.categories) setErrors((prev) => ({ ...prev, categories: null }));
  };

  /**
   * handleAvatarChange — Handle profile image upload
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
      reader.readAsDataURL(file);
      if (errors.avatar) setErrors((prev) => ({ ...prev, avatar: null }));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
  };

  /* ─────────────────────────────────────────────
     בדיקת חוזק סיסמה — מחזיר אילו תנאים מולאו
     ───────────────────────────────────────────── */
  const COMMON_PASSWORDS = ["12345678", "password", "password1", "12345678910", "qwerty123", "123456789", "1234567890"];
  const getPasswordChecks = (pw) => ({
    length:    pw.length >= 8,
    upper:     /[A-Z]/.test(pw),
    lower:     /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[!@#$%^&*]/.test(pw),
    notCommon: pw.length > 0 && !COMMON_PASSWORDS.includes(pw.toLowerCase()),
  });
  const passwordChecks = getPasswordChecks(password);
  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);

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
    } else if (!isPasswordStrong) {
      newErrors.password = isHe
        ? "הסיסמה אינה עומדת בכל התנאים"
        : "Password does not meet all requirements";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = isHe ? "הסיסמאות לא תואמות" : "Passwords do not match";
    }
    const localPhone = phone.replace(/^0+/, ""); // מסירים 0 מוביל אם הוזן
    if (!phone.trim()) {
      newErrors.phone = isHe ? "מספר טלפון נדרש" : "Phone number is required";
    } else if (localPhone.length !== phoneCountry.len) {
      newErrors.phone = isHe
        ? `נדרשות ${phoneCountry.len} ספרות עבור ${phoneCountry.he}`
        : `${phoneCountry.len} digits required for ${phoneCountry.en}`;
    }
    if (!address.trim()) newErrors.address = isHe ? "כתובת נדרשת" : "Address is required";
    if (!agreeTerms) newErrors.terms = isHe ? "יש לאשר את התנאים" : "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * validateStep3 — Validate professional-only fields
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
      // ──────────────────────────────────────────
      // TODO: Replace with actual API call:
      //
      // const body = { fullName, email, password, phone, address, role };
      // if (role === 'professional') {
      //   body.categories = selectedCategories;
      //   body.serviceRadius = parseInt(serviceRadius);
      //   body.priceMin = parseInt(priceMin);
      //   body.priceMax = parseInt(priceMax);
      //   body.bio = bio;
      // }
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(body),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      //
      // 🚩 [PAYMENT-FLAG] Future: professionals → subscription page
      // ──────────────────────────────────────────

      // מרכיבים מספר בין-לאומי מלא: קידומת + מספר מקומי (בלי 0 מוביל)
      const fullPhone = phoneCountry.dial + phone.replace(/^0+/, "");

      // גוף הבקשה — בסיס לכולם, ולבעל מקצוע מוסיפים את פרטי המקצוע שנאספו
      const body = {
        fullName,
        email,
        password,
        phone: fullPhone,
        role: role.toUpperCase(),
      };
      if (role === 'professional') {
        body.specialty = selectedCategories[0] || "";          // הקטגוריה הראשית (למשל plumbing)
        body.location = address;                                 // העיר שנבחרה
        body.hourlyRate = priceMin ? parseFloat(priceMin) : null; // מחיר מינימלי כמחיר לשעה
        body.bio = bio;
        body.yearsExperience = yearsExp !== "" ? parseInt(yearsExp) : null;
        body.documents = docs.length > 0 ? JSON.stringify(docs) : null;
      }

      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (role === 'professional') {
        navigate('/login', { state: { notice: 'נרשמת בהצלחה! החשבון שלך ממתין לאישור אדמין.' } });
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('fullName', data.fullName);
        setStep(4);
      }
    } catch (error) {
      const msg = error.message || "";
      if (msg === "Your account is pending admin approval") {
        navigate('/login', { state: { notice: 'נרשמת בהצלחה! החשבון שלך ממתין לאישור אדמין.' } });
        return;
      }
      // הודעה מדויקת לפי סוג השגיאה
      let general = isHe ? "ההרשמה נכשלה. נסו שוב." : "Registration failed. Please try again.";
      if (msg.indexOf("Email already exists") >= 0) {
        general = isHe ? "האימייל הזה כבר רשום. נסו להתחבר או השתמשו באימייל אחר." : "This email is already registered. Try logging in or use another email.";
      }
      setErrors({ general });
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * getInputClass — Returns CSS classes for input container
   */
  const getInputClass = (fieldName) => {
    let cls = "auth-input-container";
    if (errors[fieldName]) cls += " auth-input-container--error";
    if (focusedField === fieldName) cls += " auth-input-container--focused";
    return cls;
  };

  const totalSteps = role === "professional" ? 3 : 2;

  return (
    <div className="auth-page" dir={dir}>

      {/* ── Decorative Gradient Header ── */}
      <div className="auth-gradient-header" />
      <div className="auth-float-circle auth-float-circle--1" />
      <div className="auth-float-circle auth-float-circle--2" />
      <div className="auth-float-circle auth-float-circle--3" />

      {/* ── Back Button ── */}
      <button
        className="auth-back-btn"
        onClick={() => {
          if (step === 1) navigate("/");          // → Landing Page
          else if (step === 4) navigate("/login"); // → Sign In
          else handleBack();                       // → Previous step
        }}
      >
        <IconArrowLeft />
        {step === 1 ? (isHe ? "\u05d1\u05d9\u05ea" : "Home") : step === 4 ? (isHe ? "\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5\u05ea" : "Login") : (isHe ? "\u05d7\u05d6\u05e8\u05d4" : "Back")}
      </button>

      {/* ═══════════════════════════════════════════
          MAIN CARD WRAPPER
          ═══════════════════════════════════════════ */}
      <div className={`auth-card-wrapper ${mounted ? "auth-card-wrapper--visible" : ""}`}>
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

          {/* ── Progress Bar ── */}
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
                  <div className="signup-role-icon"><IconHome size={36} /></div>
                  <h3 className="signup-role-title">{isHe ? "\u05dc\u05e7\u05d5\u05d7" : "Client"}</h3>
                  <p className="signup-role-desc">{isHe ? "\u05d0\u05e0\u05d9 \u05e6\u05e8\u05d9\u05da \u05dc\u05de\u05e6\u05d5\u05d0 \u05d5\u05dc\u05d4\u05d6\u05de\u05d9\u05df \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2" : "I need to find and book home service professionals"}</p>
                  {role === "client" && <div className="signup-role-check">✓</div>}
                </div>

                {/* Professional Card */}
                <div
                  className={`signup-role-option ${role === "professional" ? "signup-role-option--active" : ""}`}
                  onClick={() => { setRole("professional"); if (errors.role) setErrors({}); }}
                >
                  <div className="signup-role-icon"><IconWrench size={36} /></div>
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
                  <input type={showPassword ? "text" : "password"} className="auth-input" placeholder={isHe ? "\u05dc\u05e4\u05d7\u05d5\u05ea 8 \u05ea\u05d5\u05d5\u05d9\u05dd" : "Min. 8 characters"} value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: null })); }}
                    onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                  <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>

                {/* \u05e6'\u05e7\u05dc\u05d9\u05e1\u05d8 \u05d7\u05d5\u05d6\u05e7 \u05e1\u05d9\u05e1\u05de\u05d4 \u2014 \u05de\u05d5\u05e4\u05d9\u05e2 \u05db\u05e9\u05de\u05ea\u05d7\u05d9\u05dc\u05d9\u05dd \u05dc\u05d4\u05e7\u05dc\u05d9\u05d3 */}
                {password && (
                  <div style={{ marginTop: 10, background: "#F8FAFF", border: "1px solid #E8ECF4", borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                      { ok: passwordChecks.length,    he: "\u05dc\u05e4\u05d7\u05d5\u05ea 8 \u05ea\u05d5\u05d5\u05d9\u05dd",                    en: "At least 8 characters" },
                      { ok: passwordChecks.upper,     he: "\u05d0\u05d5\u05ea \u05d2\u05d3\u05d5\u05dc\u05d4 \u05d0\u05d7\u05ea (A-Z)",              en: "One uppercase letter (A-Z)" },
                      { ok: passwordChecks.lower,     he: "\u05d0\u05d5\u05ea \u05e7\u05d8\u05e0\u05d4 \u05d0\u05d7\u05ea (a-z)",               en: "One lowercase letter (a-z)" },
                      { ok: passwordChecks.number,    he: "\u05de\u05e1\u05e4\u05e8 \u05d0\u05d7\u05d3 (0-9)",                   en: "One number (0-9)" },
                      { ok: passwordChecks.special,   he: "\u05ea\u05d5 \u05de\u05d9\u05d5\u05d7\u05d3 \u05d0\u05d7\u05d3 (!@#$%^&*)",          en: "One special character (!@#$%^&*)" },
                      { ok: passwordChecks.notCommon, he: "\u05dc\u05d0 \u05e1\u05d9\u05e1\u05de\u05d4 \u05e4\u05e9\u05d5\u05d8\u05d4 (12345678, password)", en: "Not a common password" },
                    ].map((req, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: req.ok ? "#059669" : "#94A3B8", fontWeight: req.ok ? 600 : 400 }}>
                        <span style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: req.ok ? "#D1FAE5" : "#EEF2F7", color: req.ok ? "#059669" : "#CBD5E1", fontSize: 10, fontWeight: 800 }}>
                          {req.ok ? "\u2713" : "\u25cb"}
                        </span>
                        {isHe ? req.he : req.en}
                      </div>
                    ))}
                  </div>
                )}

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
                <div style={{ display: "flex", gap: 8, position: "relative" }}>

                  {/* \u05d1\u05d5\u05e8\u05e8 \u05de\u05d3\u05d9\u05e0\u05d4 */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <button type="button"
                      onClick={() => { setPhoneDdOpen(!phoneDdOpen); setCountrySearch(""); }}
                      className="auth-input-container"
                      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", minWidth: 118, height: "100%", padding: "0 12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", background: "#EEF2FF", borderRadius: 6, padding: "3px 6px", letterSpacing: 0.5 }}>{phoneCountry.code}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", direction: "ltr" }}>{phoneCountry.dial}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: phoneDdOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {phoneDdOpen && (
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", insetInlineStart: 0, zIndex: 60, width: 280, background: "#FFF", borderRadius: 14, border: "1px solid #E8ECF4", boxShadow: "0 12px 32px rgba(0,0,0,.14)", overflow: "hidden" }}>
                        {/* שדה חיפוש */}
                        <div style={{ padding: 10, borderBottom: "1px solid #F1F5F9" }}>
                          <input autoFocus type="text" value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder={isHe ? "חיפוש מדינה..." : "Search country..."}
                            style={{ width: "100%", border: "1px solid #E8ECF4", borderRadius: 10, padding: "9px 12px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                        </div>
                        <div style={{ maxHeight: 240, overflowY: "auto" }}>
                          {COUNTRIES.filter((c) => {
                            const q = countrySearch.trim().toLowerCase();
                            if (!q) return true;
                            return c.en.toLowerCase().includes(q) || (c.he && c.he.includes(q)) || c.dial.includes(q);
                          }).map((c) => {
                            const active = c.code === phoneCountry.code;
                            return (
                              <button key={c.code} type="button"
                                onClick={() => { setPhoneCountry(c); setPhone((prev) => prev.slice(0, c.len + 1)); setPhoneDdOpen(false); if (errors.phone) setErrors((p) => ({ ...p, phone: null })); }}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", border: "none", borderBottom: "1px solid #F1F5F9", cursor: "pointer", fontFamily: "inherit", background: active ? "#F0F4FF" : "#FFF" }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", background: "#EEF2FF", borderRadius: 6, padding: "3px 6px", letterSpacing: 0.5, minWidth: 30, textAlign: "center" }}>{c.code}</span>
                                <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: "#1A2B4A", flex: 1, textAlign: "start" }}>{isHe ? c.he : c.en}</span>
                                <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600, direction: "ltr" }}>{c.dial}</span>
                              </button>
                            );
                          })}
                          {COUNTRIES.filter((c) => {
                            const q = countrySearch.trim().toLowerCase();
                            if (!q) return true;
                            return c.en.toLowerCase().includes(q) || (c.he && c.he.includes(q)) || c.dial.includes(q);
                          }).length === 0 && (
                            <div style={{ padding: "16px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                              {isHe ? "לא נמצאה מדינה" : "No country found"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* \u05e9\u05d3\u05d4 \u05d4\u05de\u05e1\u05e4\u05e8 \u05e2\u05dd \u05e7\u05d9\u05d3\u05d5\u05de\u05ea */}
                  <div className={getInputClass("phone")} style={{ flex: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#64748B", direction: "ltr", paddingInlineEnd: 4 }}>{phoneCountry.dial}</span>
                    <input type="tel" inputMode="numeric" maxLength={phoneCountry.len + 1} className="auth-input"
                      placeholder={isHe ? "מספר טלפון" : "Phone number"} value={phone}
                      onChange={(e) => {
                        // רק ספרות · מאפשרים 0 מוביל · חוסמים באורך של המדינה (+1 עבור 0 מוביל)
                        let d = e.target.value.replace(/\D/g, "");
                        const max = phoneCountry.len + 1;
                        if (d.length > max) d = d.slice(0, max);
                        setPhone(d);
                        if (errors.phone) setErrors((p) => ({ ...p, phone: null }));
                      }}
                      onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>
                {errors.phone && <p className="auth-field-error">{errors.phone}</p>}
              </div>

              {/* Address \u2014 \u05d4\u05e9\u05dc\u05de\u05d4 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05d1\u05ea\u05d5\u05da \u05d4\u05e9\u05d3\u05d4 (OpenStreetMap) */}
              <div className="auth-field" style={{ position: "relative" }}>
                <label className="auth-label">{isHe ? "\u05e2\u05d9\u05e8" : "City"}</label>
                <div className={getInputClass("address")}>
                  <IconMapPin />
                  <input type="text" className="auth-input" autoComplete="off"
                    placeholder={isHe ? "\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05dc\u05d4\u05e7\u05dc\u05d9\u05d3 \u05e9\u05dd \u05e2\u05d9\u05e8..." : "Start typing a city..."} value={address}
                    onChange={(e) => { setAddress(e.target.value.replace(/[0-9]/g, "")); setAddrOpen(true); if (errors.address) setErrors((p) => ({ ...p, address: null })); }}
                    onFocus={() => { setFocusedField("address"); setAddrOpen(true); }}
                    onBlur={() => { setFocusedField(null); setTimeout(() => setAddrOpen(false), 150); }} />
                </div>

                {/* \u05e8\u05e9\u05d9\u05de\u05ea \u05d4\u05e6\u05e2\u05d5\u05ea \u05d1\u05ea\u05d5\u05da \u05d4\u05e9\u05d3\u05d4 */}
                {addrOpen && address.trim().length >= 1 && cityMatches.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", insetInlineStart: 0, right: 0, left: 0, zIndex: 60, background: "#FFF", borderRadius: 12, border: "1px solid #E8ECF4", boxShadow: "0 12px 32px rgba(15,23,42,.14)", overflow: "hidden", maxHeight: 300, overflowY: "auto" }}>
                    {cityMatches.map((c) => (
                      <button key={c.en} type="button"
                        onMouseDown={(e) => { e.preventDefault(); setAddress(isHe ? c.he : c.en); setAddrOpen(false); if (errors.address) setErrors((p) => ({ ...p, address: null })); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", border: "none", borderBottom: "1px solid #F5F7FA", cursor: "pointer", fontFamily: "inherit", background: "#FFF", textAlign: "start" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, color: "#1A2B4A", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{isHe ? c.he : c.en}</div>
                          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{isHe ? "\u05d9\u05e9\u05e8\u05d0\u05dc" : "Israel"}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

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
                  {isHe ? "\u05d0\u05e0\u05d9 \u05de\u05e1\u05db\u05d9\u05dd \u05dc" : "I agree to the "}<span className="signup-terms-link" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLegalModal("terms"); }}>{isHe ? "\u05ea\u05e0\u05d0\u05d9 \u05e9\u05d9\u05de\u05d5\u05e9" : "Terms of Service"}</span>{isHe ? " \u05d5" : " and "}{" "}
                  <span className="signup-terms-link" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLegalModal("privacy"); }}>{isHe ? "\u05de\u05d3\u05d9\u05e0\u05d9\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea" : "Privacy Policy"}</span>
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

              {/* Years of Experience */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "שנות ניסיון" : "Years of Experience"}</label>
                <div className={getInputClass("yearsExp")}>
                  <input type="number" min="0" max="60" className="auth-input" placeholder={isHe ? "לדוגמה: 5" : "e.g. 5"} value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value.replace(/[^\d]/g, "").slice(0, 2))}
                    onFocus={() => setFocusedField("yearsExp")} onBlur={() => setFocusedField(null)} />
                </div>
              </div>

              {/* Documents / Certificates */}
              <div className="auth-field">
                <label className="auth-label">{isHe ? "מסמכים ותעודות" : "Documents & Certificates"}</label>
                <p className="signup-field-hint">{isHe ? "רישיון, תעודות, ביטוח (עד 3MB לקובץ)" : "License, certificates, insurance (max 3MB each)"}</p>
                <button type="button" onClick={() => document.getElementById("docs-input").click()}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px dashed #C7D2FE", background: "#F8FAFF", color: "#2563EB", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  {isHe ? "העלו מסמכים" : "Upload documents"}
                </button>
                <input type="file" id="docs-input" multiple accept="image/*,.pdf" style={{ display: "none" }} onChange={handleDocsChange} />
                {docs.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {docs.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1F5F9", borderRadius: 10, padding: "8px 12px", fontSize: 13 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        <span style={{ flex: 1, color: "#1A2B4A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                        <button type="button" onClick={() => removeDoc(i)} style={{ border: "none", background: "none", cursor: "pointer", color: "#DC2626", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.docs && <p className="auth-field-error">{errors.docs}</p>}
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
          {step < 4 && (
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

      {/* ═══════════ חלון תנאי שימוש / מדיניות פרטיות ═══════════ */}
      {legalModal && (
        <div onClick={() => setLegalModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
          <div onClick={(e) => e.stopPropagation()} dir={dir}
            style={{ width: "100%", maxWidth: 560, background: "#FFF", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,.3)", overflow: "hidden", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>

            {/* כותרת */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #EEF1F6" }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 19, fontWeight: 800, color: "#1A2B4A" }}>
                {legalModal === "terms"
                  ? (isHe ? "תנאי שימוש" : "Terms of Service")
                  : (isHe ? "מדיניות פרטיות" : "Privacy Policy")}
              </h2>
              <button type="button" onClick={() => setLegalModal(null)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* תוכן */}
            <div style={{ overflowY: "auto", padding: "20px 24px", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
              <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>
                {isHe ? "עודכן לאחרונה: יולי 2026" : "Last updated: July 2026"}
              </p>
              {(legalModal === "terms" ? LEGAL_TERMS : LEGAL_PRIVACY).map((sec, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>
                    {isHe ? sec.titleHe : sec.titleEn}
                  </h3>
                  <p>{isHe ? sec.bodyHe : sec.bodyEn}</p>
                </div>
              ))}
            </div>

            {/* כפתור סגירה/אישור */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #EEF1F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button"
                onClick={() => { setAgreeTerms(true); setLegalModal(null); if (errors.terms) setErrors((p) => ({ ...p, terms: null })); }}
                style={{ padding: "10px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {isHe ? "הבנתי ואני מסכים" : "I understand & agree"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}