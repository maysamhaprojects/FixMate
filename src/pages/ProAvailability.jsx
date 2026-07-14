/**
 * FixMate — Pro Weekly Availability
 * ROUTE: /pro/availability
 * API: GET /api/pro/availability · PUT /api/pro/availability (per day)
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";
import { apiFetch } from "../services/api";

const DAYS = [
  { key: "SUNDAY",    he: "ראשון",  en: "Sunday" },
  { key: "MONDAY",    he: "שני",    en: "Monday" },
  { key: "TUESDAY",   he: "שלישי",  en: "Tuesday" },
  { key: "WEDNESDAY", he: "רביעי",  en: "Wednesday" },
  { key: "THURSDAY",  he: "חמישי",  en: "Thursday" },
  { key: "FRIDAY",    he: "שישי",   en: "Friday" },
  { key: "SATURDAY",  he: "שבת",    en: "Saturday" },
];

const IconBack = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconClock = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);

export default function ProAvailability() {
  const navigate = useNavigate();
  const lang = getLang();
  const dir = getDir();
  const isHe = lang === "he";

  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // מצב ברירת מחדל לכל 7 הימים
  const [week, setWeek] = useState(
    DAYS.map((d) => ({ day: d.key, available: false, start: "09:00", end: "17:00" }))
  );

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  /* טעינת הזמינות הקיימת מהשרת */
  useEffect(() => {
    apiFetch("/api/pro/availability")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setWeek((prev) =>
          prev.map((row) => {
            const found = list.find((x) => x.dayOfWeek === row.day);
            if (!found) return row;
            return {
              day: row.day,
              available: found.available,
              start: (found.startTime || "09:00").slice(0, 5),
              end: (found.endTime || "17:00").slice(0, 5),
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const updateDay = (i, patch) =>
    setWeek((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2600);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // שומרים כל יום בנפרד (הבקאנד מקבל יום בודד ומעדכן/יוצר)
      for (const row of week) {
        await apiFetch("/api/pro/availability", {
          method: "PUT",
          body: JSON.stringify({
            dayOfWeek: row.day,
            startTime: row.start + ":00",
            endTime: row.end + ":00",
            available: row.available,
          }),
        });
      }
      setShowSuccess(true);
      setTimeout(() => navigate("/pro/dashboard"), 2200);
    } catch (e) {
      showToast(isHe ? "השמירה נכשלה" : "Failed to save", false);
    } finally {
      setSaving(false);
    }
  };

  const timeInput = {
    border: "1.5px solid #E8ECF4", borderRadius: 10, padding: "8px 10px",
    fontSize: 14, fontFamily: "inherit", color: "#1A2B4A", outline: "none", background: "#F8FAFF",
  };

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'DM Sans', sans-serif", opacity: mounted ? 1 : 0, transition: "opacity .35s" }}>

      {/* Top nav */}
      <nav style={{ background: "#FFF", borderBottom: "1px solid #EAEEF5", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/pro/dashboard")} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", cursor: "pointer", color: "#2563EB", fontSize: 15, fontWeight: 600, fontFamily: "inherit" }}>
          <IconBack /> {isHe ? "לדשבורד" : "Dashboard"}
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: "#1A2B4A" }}>Fix</span><span style={{ color: "#4F6AFF" }}>Mate</span>
        </h1>
        <div style={{ width: 90 }} />
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800, color: "#1A2B4A", marginBottom: 4 }}>
            {isHe ? "זמינות שבועית" : "Weekly Availability"}
          </h2>
          <p style={{ fontSize: 15, color: "#94A3B8" }}>
            {isHe ? "הגדירו באילו ימים ושעות אתם זמינים לעבודה" : "Set the days and hours you're available for work"}
          </p>
        </div>

        {/* Day rows */}
        <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #EAEEF5", boxShadow: "0 2px 16px rgba(15,23,42,.04)", overflow: "hidden" }}>
          {week.map((row, i) => {
            const d = DAYS[i];
            return (
              <div key={row.day} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: i < week.length - 1 ? "1px solid #F1F5F9" : "none", flexWrap: "wrap" }}>
                {/* Toggle + day name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 130 }}>
                  <button onClick={() => updateDay(i, { available: !row.available })}
                    style={{ width: 44, height: 26, borderRadius: 20, border: "none", cursor: "pointer", padding: 3, background: row.available ? "#4F6AFF" : "#CBD5E1", transition: "background .2s", display: "flex", justifyContent: row.available ? "flex-end" : "flex-start" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#FFF", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: row.available ? "#1A2B4A" : "#94A3B8" }}>{isHe ? d.he : d.en}</span>
                </div>

                {/* Time range */}
                {row.available ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                    <IconClock />
                    <input type="time" value={row.start} onChange={(e) => updateDay(i, { start: e.target.value })} style={timeInput} />
                    <span style={{ color: "#94A3B8" }}>–</span>
                    <input type="time" value={row.end} onChange={(e) => updateDay(i, { end: e.target.value })} style={timeInput} />
                  </div>
                ) : (
                  <span style={{ flex: 1, textAlign: "end", fontSize: 13, color: "#CBD5E1", fontWeight: 500 }}>{isHe ? "לא זמין" : "Unavailable"}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", height: 52, marginTop: 22, borderRadius: 14, border: "none", cursor: saving ? "default" : "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "#FFF", background: "linear-gradient(135deg,#4F6AFF,#3B4FE0)", boxShadow: "0 6px 18px rgba(79,106,255,.3)", opacity: saving ? 0.7 : 1 }}>
          {saving ? (isHe ? "שומר..." : "Saving...") : (isHe ? "שמור זמינות" : "Save Availability")}
        </button>
      </div>

      {/* Success modal — קופץ ואז חוזרים לדשבורד */}
      {showSuccess && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#FFF", borderRadius: 20, padding: "34px 40px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.3)", maxWidth: 360, animation: "popIn .25s ease" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11.5 14.5 16 9.5" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>
              {isHe ? "הזמינות נשמרה!" : "Availability saved!"}
            </h3>
            <p style={{ fontSize: 14, color: "#94A3B8" }}>
              {isHe ? "מעבירים אותך לדשבורד..." : "Redirecting to dashboard..."}
            </p>
          </div>
          <style>{"@keyframes popIn { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }"}</style>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 1000, background: toast.ok ? "#059669" : "#DC2626", color: "#FFF", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,.2)" }}>
          {toast.ok ? "✅ " : "⚠️ "}{toast.msg}
        </div>
      )}
    </div>
  );
}
