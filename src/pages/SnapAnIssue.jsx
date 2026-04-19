/* ═══════════════════════════════════════════════
   FixMate - דף צילום תקלה (SnapAnIssue)
   צ'אט עם בוט AI - המשתמש מעלה תמונה או מתאר בעיה → ה-AI מאבחן ומציע DIY / מקצוען
   ═══════════════════════════════════════════════ */

import { useState, useRef, useEffect } from "react";                 // useState=זיכרון | useRef=הפנייה לאלמנט/ערך | useEffect=הרצה בזמן
import { useNavigate } from "react-router-dom";                       // הוק לניווט
import { analyzeIssue, ISSUE_CATEGORIES } from "../services/issueAI"; // שירות ה-AI (analyzeIssue=פונקציה, ISSUE_CATEGORIES=רשימת קטגוריות)

/* ─── אייקונים (SVG) ─── */
const IconBack  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;                                                                                  // חץ חזרה
const IconCamera= () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;                             // מצלמה - לצילום ישיר
const IconSend  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;                                                                         // מטוס נייר - שליחה
const IconImage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;                                   // תמונה - העלאה מהגלריה
const IconBot   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;  // רובוט - לאווטאר הבוט
const IconTool  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;    // מפתח ברגים - לכלים
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;   // משולש אזהרה - לסכנה

/* ─── אווטאר קבוע של הבוט (ריבוע כחול עם אייקון רובוט) ─── */
const BOT_AVATAR = (
  <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <IconBot />
  </div>
);

/* ═══════════════════════════════════════════════
   הקומפוננטה הראשית - דף צילום תקלה
   ═══════════════════════════════════════════════ */
export default function SnapAnIssue() {
  const navigate = useNavigate();                                                  // כלי ניווט
  /* ─── רשימת ההודעות (מתחילה עם הודעת ברכה מהבוט) ─── */
  const [messages,     setMessages    ] = useState([{ id: 0, from: "bot", type: "text", text: "Hi! 👋 I'm FixMate AI Assistant. Upload a photo of your issue, or select a common problem below, and I'll try to help you fix it yourself!", time: new Date() }]);
  const [input,        setInput       ] = useState("");                             // טקסט שהמשתמש מקליד
  const [imagePreview, setImagePreview] = useState(null);                           // תצוגה מקדימה של התמונה
  const [imageBase64,  setImageBase64 ] = useState(null);                           // התמונה כמחרוזת base64 (לשליחה ל-AI)
  const [loading,      setLoading     ] = useState(false);                          // האם ה-AI עובד עכשיו?
  const [lastResult,   setLastResult  ] = useState(null);                           // התוצאה האחרונה מ-AI

  /* ─── הפניות (refs) - לא גורמות לרינדור מחדש ─── */
  const fileRef  = useRef(null);    // הפנייה ל-input של בחירת קבצים
  const chatRef  = useRef(null);    // הפנייה לאזור הצ'אט (לגלילה)
  const inputRef = useRef(null);    // הפנייה לשדה הקלט
  const msgId    = useRef(1);       // מזהה ייחודי לכל הודעה (מתחיל מ-1)

  /* ─── גלילה אוטומטית לסוף הצ'אט כשיש הודעה חדשה ─── */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;   // גולל למטה
  }, [messages, loading]);   // רץ בכל פעם שההודעות משתנות או המצב טעינה

  /* ─── פונקציות עזר ─── */

  // יוצר מזהה חדש להודעה הבאה
  const nextId = () => ++msgId.current;

  /* ─── הוספת הודעה של הבוט - עם עיכוב לאפקט "מקליד" ─── */
  const pushBot = (type, payload, delay = 600) => new Promise(resolve => {
    setTimeout(() => {
      // מוסיף הודעה חדשה של הבוט עם מזהה, זמן, סוג, ותוכן
      setMessages(prev => [...prev, { id: nextId(), from: "bot", type, time: new Date(), ...payload }]);
      resolve();   // מסמן שהפונקציה סיימה
    }, delay);
  });

  /* ─── הוספת הודעה של המשתמש (ללא עיכוב) ─── */
  const pushUser = (type, payload) => {
    setMessages(prev => [...prev, { id: nextId(), from: "user", type, time: new Date(), ...payload }]);
  };

  /* ─── פונקציה לפורמט זמן יפה (HH:MM AM/PM) ─── */
  const fmt = d => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  /* ═══════════════════════════════════════════════
     טיפול בבחירת תמונה מהמצלמה/גלריה
     ═══════════════════════════════════════════════ */
  const handleImagePick = e => {
    const file = e.target.files?.[0];            // הקובץ שנבחר
    if (!file) return;                            // אם לא נבחר - יוצאים
    const reader = new FileReader();              // קורא קבצים
    reader.onload = ev => {
      setImagePreview(ev.target.result);          // תצוגה מקדימה
      setImageBase64(ev.target.result);           // שומר כמחרוזת base64
    };
    reader.readAsDataURL(file);                   // מתחיל לקרוא את הקובץ
  };

  /* ═══════════════════════════════════════════════
     פונקציית הניתוח המרכזית - מפעילה את ה-AI ומציגה תוצאה
     ═══════════════════════════════════════════════ */
  const runAnalysis = async ({ text, imageB64, userMsg }) => {
    if (loading) return;   // אם כבר טוענים - לא עושים כלום

    // 1. מציג את הודעת המשתמש (תמונה או טקסט)
    if (userMsg.type === "image") {
      pushUser("image", { image: imageB64, text: "📷 Photo uploaded" });  // הודעת תמונה
      setImagePreview(null);    // מנקה תצוגה מקדימה
      setImageBase64(null);      // מנקה base64
    } else {
      pushUser("text", { text });   // הודעת טקסט
      setInput("");                  // מנקה שדה הקלט
    }

    // 2. מצב טעינה + הודעת ביניים של הבוט
    setLoading(true);                 // מדליק את מצב הטעינה
    await pushBot("text", { text: imageB64 ? "📸 Analyzing your photo..." : "🔍 Let me check that for you..." }, 400);

    // 3. קריאה לשירות AI (mock או אמיתי - אותו interface)
    let result;
    try {
      result = await analyzeIssue({ text, imageBase64: imageB64 });   // מחכה לתשובה מה-AI
    } catch {
      // אם יש שגיאה - מציג הודעת כישלון
      setLoading(false);
      await pushBot("text", { text: "Sorry, something went wrong. Please try again 🙏" });
      return;
    }

    setLoading(false);                // מכבה טעינה
    setLastResult(result);             // שומר את התוצאה

    // 4. הודעת אבחון (מה ה-AI זיהה)
    await pushBot("text", {
      text: `🎯 **Diagnosis: ${result.diagnosis}**\n\n${result.description}`,
    }, 200);

    // 5. כרטיס תוצאה - DIY אם אפשר לתקן לבד, אחרת pro_card עם אזהרה
    await pushBot(result.canDIY ? "diy_card" : "pro_card", { result }, 400);
  };

  /* ─── פונקציות שליחה (handlers) ─── */

  // שליחת הודעת טקסט
  const handleSendText = () => {
    if (!input.trim() || loading) return;   // בודק שיש טקסט ולא בטעינה
    runAnalysis({ text: input.trim(), imageB64: null, userMsg: { type: "text" } });
  };

  // שליחת תמונה
  const handleSendImage = () => {
    if (!imageBase64 || loading) return;    // בודק שיש תמונה ולא בטעינה
    runAnalysis({ text: "", imageB64: imageBase64, userMsg: { type: "image" } });
  };

  // לחיצה על כפתור "בחירה מהירה" (קטגוריה נפוצה)
  const handleQuickSelect = cat => {
    runAnalysis({ text: cat.label, imageB64: null, userMsg: { type: "text" } });
  };

  /* ═══════════════════════════════════════════════
     פונקציה שמציגה הודעה אחת - סוגים שונים לפי msg.type
     ═══════════════════════════════════════════════ */
  const renderMsg = msg => {
    const isBot = msg.from === "bot";      // האם ההודעה מהבוט?
    const key   = msg.id;                   // מזהה ייחודי

    /* ═══ סוג 1: כרטיס DIY (אם אפשר לתקן לבד) ═══ */
    if (msg.type === "diy_card") {
      const r = msg.result;                 // תוצאת ה-AI
      return (
        <div key={key} style={{ display: "flex", gap: 10, marginBottom: 16, animation: "fadeUp .4s" }}>
          {BOT_AVATAR}                       {/* אווטאר הבוט בצד */}
          <div style={{ flex: 1, maxWidth: 380 }}>
            {/* ─── כרטיס ירוק של מדריך DIY ─── */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 18, padding: "20px 18px", marginBottom: 8 }}>
              {/* כותרת: "DIY Fix Guide" עם תג "You can fix this!" */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🛠️</span>
                <span style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#166534" }}>DIY Fix Guide</span>
                <span style={{ marginInlineStart: "auto", fontSize: 11, fontWeight: 600, color: "#FFF", background: "#16A34A", padding: "3px 10px", borderRadius: 20 }}>You can fix this!</span>
              </div>
              {/* ─── רשימת שלבי התיקון (ממוספרים) ─── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {r.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    {/* עיגול ירוק עם מספר השלב */}
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.5 }}>{step}</span>   {/* טקסט השלב */}
                  </div>
                ))}
              </div>
              {/* ─── רשימת כלים נדרשים ─── */}
              <div style={{ background: "#FFF", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ color: "#2563EB", display: "flex" }}><IconTool /></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>Tools Needed</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {/* תגיות של הכלים */}
                  {r.tools.map((t, i) => (
                    <span key={i} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: "#EEF2FF", color: "#3B5BDB", fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
              {/* ─── זמן משוער + עלות משוערת (2 קופסאות) ─── */}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "#FFF", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#7C8DB5", marginBottom: 2 }}>⏱️ Est. Time</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>{r.estimatedTime}</div>
                </div>
                <div style={{ flex: 1, background: "#FFF", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#7C8DB5", marginBottom: 2 }}>💰 Est. Cost</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{r.estimatedCost}</div>
                </div>
              </div>
            </div>
            {/* ─── קופסה תחתונה: "עדיין צריך מקצוען?" + כפתור הזמנה ─── */}
            <div style={{ background: "#FFF", border: "1px solid #E8ECF4", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#4A5568" }}>Still need a pro?</span>
              <button onClick={() => navigate("/client/search")} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📅 Book a Pro</button>
            </div>
            <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block" }}>{fmt(msg.time)}</span>   {/* זמן ההודעה */}
          </div>
        </div>
      );
    }

    /* ═══ סוג 2: כרטיס "דרוש מקצוען" (אדום - סכנה) ═══ */
    if (msg.type === "pro_card") {
      const r = msg.result;
      return (
        <div key={key} style={{ display: "flex", gap: 10, marginBottom: 16, animation: "fadeUp .4s" }}>
          {BOT_AVATAR}
          <div style={{ flex: 1, maxWidth: 380 }}>
            {/* ─── כרטיס אדום של אזהרה ─── */}
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 18, padding: "20px 18px", marginBottom: 6 }}>
              {/* כותרת עם אייקון אזהרה */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#DC2626", display: "flex" }}><IconAlert /></span>
                <span style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#991B1B" }}>Professional Required</span>
              </div>
              {/* הסבר הבטיחות */}
              <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, marginBottom: 14 }}>{r.safetyWarning}</p>
              {/* כפתור "מצא מקצוען" (טקסט מותאם לחשמלאי או כללי) */}
              <button onClick={() => navigate("/client/search")} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit'", boxShadow: "0 6px 24px rgba(37,99,235,.3)" }}>
                🔍 Find a {r.category === "electricity" ? "Licensed Electrician" : "Professional"}
              </button>
            </div>
            <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block" }}>{fmt(msg.time)}</span>
          </div>
        </div>
      );
    }

    /* ═══ סוג 3: הודעת תמונה (מיושרת לימין - מהמשתמש) ═══ */
    if (msg.type === "image") {
      return (
        <div key={key} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, animation: "fadeUp .3s" }}>
          <div style={{ maxWidth: 260 }}>
            <img src={msg.image} alt="uploaded" style={{ width: "100%", borderRadius: 16, border: "2px solid #E8ECF4", display: "block", marginBottom: 4 }} />   {/* התמונה */}
            <span style={{ fontSize: 11, color: "#94A3B8", display: "block", textAlign: "right" }}>{fmt(msg.time)}</span>   {/* זמן */}
          </div>
        </div>
      );
    }

    /* ═══ סוג 4: הודעת טקסט רגילה (בוט משמאל, משתמש מימין) ═══ */
    return (
      <div key={key} style={{ display: "flex", gap: 10, marginBottom: 16, flexDirection: isBot ? "row" : "row-reverse", animation: "fadeUp .3s" }}>
        {isBot && BOT_AVATAR}                    {/* אווטאר רק לבוט */}
        <div style={{ maxWidth: 340 }}>
          {/* בועת ההודעה - כחולה למשתמש, אפורה לבוט */}
          <div style={{ background: isBot ? "#F0F4FF" : "linear-gradient(135deg,#2563EB,#1D4ED8)", color: isBot ? "#1A2B4A" : "#FFF", padding: "12px 16px", borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {/* מפרק את הטקסט לפי "**" כדי להבליט חלקים עם <strong> */}
            {msg.text.split("**").map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi}>{part}</strong> : <span key={pi}>{part}</span>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block", textAlign: isBot ? "left" : "right" }}>{fmt(msg.time)}</span>
        </div>
      </div>
    );
  };

  /* ─── האם אפשר לשלוח? (יש טקסט או תמונה ולא בטעינה) ─── */
  const canSend = (input.trim() || imageBase64) && !loading;

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", height: "100vh", display: "flex", flexDirection: "column", direction: "ltr" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        .quickBtn:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(37,99,235,.12); border-color:#93B4F5 !important; }
        * { box-sizing:border-box; margin:0; }
      `}</style>

      {/* ═══ תפריט ניווט עליון ═══ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 12px rgba(0,0,0,.04)", flexShrink: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          {/* כפתור חזרה לדשבורד */}
          <button onClick={() => navigate("/client/dashboard")} style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F4FF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer" }}><IconBack /></button>
          {/* כותרת הדף + תת-כותרת */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A", display: "block" }}>Snap an Issue</span>
            <span style={{ fontSize: 12, color: "#7C8DB5" }}>AI-Powered Diagnosis</span>
          </div>
          <div style={{ width: 40 }} />   {/* ריווח למרכז את הכותרת */}
        </div>
      </nav>

      {/* ═══ אזור הצ'אט (גולל) ═══ */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {messages.map(renderMsg)}    {/* מציג את כל ההודעות */}

        {/* ─── אנימציית "מקליד..." (3 נקודות) - מוצגת בזמן טעינה ─── */}
        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {BOT_AVATAR}
            <div style={{ background: "#F0F4FF", padding: "14px 20px", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 6 }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", animation: `pulse 1.2s infinite ${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ─── כפתורי בחירה מהירה (מוצגים רק בהודעה ראשונה) ─── */}
        {messages.length === 1 && !loading && (
          <div style={{ animation: "fadeUp .5s", marginTop: 8 }}>
            <p style={{ fontSize: 13, color: "#7C8DB5", marginBottom: 12 }}>Common issues:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {/* כל קטגוריה = כפתור עם אייקון ותווית */}
              {ISSUE_CATEGORIES.map(cat => (
                <button key={cat.id} className="quickBtn" onClick={() => handleQuickSelect(cat)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "2px solid #EEF1F8", background: "#FFF", fontSize: 13, fontWeight: 500, color: "#4A5568", cursor: "pointer", transition: "all .2s" }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ שורת תצוגה מקדימה של תמונה (מוצגת אחרי בחירת תמונה, לפני שליחה) ═══ */}
      {imagePreview && (
        <div style={{ padding: "12px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFF", borderRadius: 16, padding: "12px 16px", border: "1px solid #E8ECF4" }}>
            <img src={imagePreview} alt="preview" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }} />     {/* תצוגה מקדימה */}
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>Photo ready to analyze</span>
              <span style={{ fontSize: 12, color: "#7C8DB5", display: "block" }}>Tap send to start diagnosis</span>
            </div>
            {/* כפתור X - מסיר את התמונה */}
            <button onClick={() => { setImagePreview(null); setImageBase64(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 18 }}>✕</button>
          </div>
        </div>
      )}

      {/* ═══ שורת קלט תחתונה (מצלמה + גלריה + טקסט + שליחה) ═══ */}
      <div style={{ flexShrink: 0, background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #E8ECF4", padding: "14px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* ─── כפתור מצלמה (פותח מצלמת הטלפון) ─── */}
          <button onClick={() => fileRef.current?.click()} style={{ width: 46, height: 46, borderRadius: 14, border: "2px solid #EEF1F8", background: "#FFF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <IconCamera />
          </button>
          {/* input נסתר - נפתח כשלוחצים על כפתור המצלמה. capture="environment" = מצלמה אחורית */}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImagePick} style={{ display: "none" }} />

          {/* ─── כפתור גלריה (יוצר input דינמי ללא capture) ─── */}
          <button onClick={() => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = handleImagePick; i.click(); }} style={{ width: 46, height: 46, borderRadius: 14, border: "2px solid #EEF1F8", background: "#FFF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <IconImage />
          </button>

          {/* ─── שדה טקסט (לקלט הודעות) ─── */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F8FAFF", borderRadius: 14, border: "2px solid #EEF1F8", padding: "0 16px" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}                                                                      // מעדכן את הטקסט
              onKeyDown={e => { if (e.key === "Enter") imagePreview ? handleSendImage() : handleSendText(); }}               // Enter = שליחה
              placeholder="Describe your issue..."
              disabled={loading}                                                                                              // מנטרל בזמן טעינה
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: "'DM Sans'", color: "#1A2B4A", padding: "13px 0" }}
            />
          </div>

          {/* ─── כפתור שליחה (מנוטרל אם אין תוכן) ─── */}
          <button
            onClick={() => imagePreview ? handleSendImage() : handleSendText()}         // שולח תמונה או טקסט לפי מה שיש
            disabled={!canSend}
            style={{ width: 46, height: 46, borderRadius: 14, border: "none", background: canSend ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: canSend ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", cursor: canSend ? "pointer" : "not-allowed", flexShrink: 0, transition: "all .2s", boxShadow: canSend ? "0 4px 16px rgba(37,99,235,.3)" : "none" }}>
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}