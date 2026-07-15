/**
 * ============================================================
 *  FixMate — הלוגיקה של מסך הזמנת בעל מקצוע
 *  צ'אט האבחון, בחירת עיר/תאריך/שעה, טעינת בעלי מקצוע, ויצירת ההזמנה.
 *
 *  שימוש:  const b = useBooking({ t, lang, isHe, navigate });
 * ============================================================
 */
import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../services/api";
import { ISRAEL_CITIES } from "../data/israelCities";
import { catIcons, CAT_MATCH, CAT_LABEL_KEYS, getDiagnosis, getDiagnosisFromText, TIME_OPTIONS } from "../data/bookingCatalog";

export function useBooking({ t, lang, isHe, navigate }) {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState(null);
  const [issue, setIssue] = useState(null);

  /* Chat state */
  const [msgs, setMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const chatEndRef = useRef(null);

  /* Step 2+3 state */
  const [cityQ, setCityQ] = useState("");
  const [city, setCity] = useState(null);
  const [dd, setDd] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [results, setResults] = useState(false);
  const [modal, setModal] = useState(null);
  const [ok, setOk] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookErr, setBookErr] = useState("");
  const [desc, setDesc] = useState("");
  const iRef = useRef(null);
  const dRef = useRef(null);

  // אותה רשימת ערי ישראל כמו במסך ההרשמה — חיפוש בעברית ובאנגלית, הצגה לפי שפת הממשק
  const filtered = (cityQ
    ? ISRAEL_CITIES.filter(c => c.he.includes(cityQ.trim()) || c.en.toLowerCase().includes(cityQ.toLowerCase()))
    : ISRAEL_CITIES
  ).map(c => (isHe ? c.he : c.en));
  const ready = city && date && time;
  const today = new Date().toISOString().split("T")[0];

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, analyzing]);

  /* Close city dropdown on outside click */
  useEffect(() => {
    const h = (e) => {
      if (dRef.current && !dRef.current.contains(e.target) && iRef.current && !iRef.current.contains(e.target))
        setDd(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Initial bot greeting */
  useEffect(() => {
    const greeting = isHe
      ? "שלום! 👋 אני העוזר החכם של FixMate. צלם את התקלה או תאר אותה — ואני אזהה את סוג הבעיה ואמצא לך בעל מקצוע."
      : "Hi there! 👋 I'm FixMate's smart assistant. Snap a photo of the issue or describe it — and I'll identify the problem and find you the right professional.";
    setMsgs([{ role: "bot", text: greeting }]);
  }, [isHe]);

  const catLabel = cat ? t(CAT_LABEL_KEYS[cat]) : "";
  const issueLabel = issue ? t(`bp_iss_${issue}`) : "";
  const timeLabel = TIME_OPTIONS.find(ti => ti.value === time)?.label || "";

  /* בעלי מקצוע אמיתיים ומאושרים מהשרת */
  const [pros, setPros] = useState([]);
  const [prosLoading, setProsLoading] = useState(false);

  useEffect(() => {
    if (!results) return;
    setProsLoading(true);
    apiFetch("/api/client/pros")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        setPros(arr.map((p) => {
          const u = p.user || {};
          const name = u.fullName || (isHe ? "בעל מקצוע" : "Professional");
          const parts = name.trim().split(/\s+/);
          const avatar = ((parts[0] || "?")[0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
          return {
            id: p.id,
            userId: (p.user && p.user.id) || null,   // מזהה ה-User (נדרש ליצירת הזמנה)
            name,
            specialty: p.specialty || "",
            rating: p.totalRatings > 0 ? Number(p.averageRating).toFixed(1) : (isHe ? "חדש" : "New"),
            reviews: p.totalRatings || 0,
            city: p.location || "—",
            price: p.hourlyRate != null ? String(p.hourlyRate) : "—",
            avatar,
            profilePicture: u.profilePicture || "",
            expYears: p.yearsExperience != null ? p.yearsExperience : "—",
            phone: u.phone || "",
            available: "confirmed",
          };
        }));
      })
      .catch(() => setPros([]))
      .finally(() => setProsLoading(false));
  }, [results, isHe]);

  /* מסננים לפי הקטגוריה שנבחרה — רק בעלי מקצוע שתחום ההתמחות שלהם תואם */
  const visiblePros = cat
    ? pros.filter((p) => {
        const spec = (p.specialty || "").toLowerCase();
        if (!spec) return false;
        const keys = CAT_MATCH[cat] || [cat];
        return keys.some((k) => spec.includes(k.toLowerCase()));
      })
    : pros;

  /* יצירת הזמנה אמיתית בשרת */
  const confirmBooking = async () => {
    if (!modal) return;
    if (!modal.userId) { setBookErr(isHe ? "לא ניתן להזמין בעל מקצוע זה" : "Cannot book this professional"); return; }
    setBooking(true);
    setBookErr("");
    try {
      const r = await apiFetch("/api/client/bookings", {
        method: "POST",
        body: JSON.stringify({
          proId: modal.userId,
          serviceType: catLabel || modal.specialty || "",
          scheduledAt: date + "T" + time + ":00",
          address: city,
          notes: desc || "",
        }),
      });
      if (!r.ok) throw new Error("failed");
      setModal(null);
      setOk(true);
      setTimeout(() => { setOk(false); navigate("/client/dashboard"); }, 2500);
    } catch (e) {
      setBookErr(isHe ? "יצירת ההזמנה נכשלה. נסו שוב." : "Failed to create booking. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString(isHe ? "he-IL" : "en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

  const goBack = () => {
    if (step === 2 && results) setResults(false);
    else if (step === 2) { setStep(1); }
    else navigate("/client/dashboard");
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setImagePreview(url);
      setMsgs(prev => [...prev, { role: "user", image: url }]);
      runAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSend = () => {
    const txt = chatInput.trim();
    if (!txt) return;
    setMsgs(prev => [...prev, { role: "user", text: txt }]);
    setChatInput("");
    const textDiag = getDiagnosisFromText(txt);
    runAnalysis(textDiag);
  };

  const runAnalysis = (textDiag) => {
    setAnalyzing(true);
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const diag = textDiag || getDiagnosis();
      setDiagnosis(diag);
      setCat(diag.cat);
      setIssue(diag.issue);
      const langData = isHe ? diag.he : diag.en;
      const botMsg = `**${langData.title}** ${catIcons[diag.cat]}\n\n${langData.desc}`;
      setMsgs(prev => [...prev, { role: "bot", text: botMsg }]);
      setAnalyzing(false);
    }, delay);
  };

  const confirmDiagnosis = () => {
    setStep(2);
    setCity(null);
    setCityQ("");
    setDate("");
    setTime("");
    setResults(false);
  };

  return {
    step, setStep,
    cat, issue, catLabel, issueLabel, timeLabel,

    /* צ'אט */
    msgs, chatInput, setChatInput, analyzing, diagnosis, imagePreview,
    fileRef, chatEndRef, handlePhoto, handleTextSend, confirmDiagnosis,

    /* עיר / תאריך / שעה */
    cityQ, setCityQ, city, setCity, dd, setDd,
    date, setDate, time, setTime,
    filtered, ready, today, fmtDate,
    iRef, dRef,

    /* תוצאות והזמנה */
    results, setResults, visiblePros, prosLoading,
    modal, setModal, ok, booking, bookErr,
    desc, setDesc, confirmBooking,

    goBack,
  };
}
