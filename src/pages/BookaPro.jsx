import { useNavigate } from "react-router-dom";
import { useLang, LangToggle } from "../context/LanguageContext";
import { useBooking } from "../hooks/useBooking";
import { IconBack, IconForward, IconCheck, IconStar, IconLocation, IconClock, IconX, IconSearch, IconPin, IconCalendar, IconClockLg, IconCamera, IconImage, IconSend } from "../components/BookIcons";
import { catIcons, CAT_LABEL_KEYS, TIME_OPTIONS } from "../data/bookingCatalog";

/*
  FixMate - Book a Pro (with AI Chatbot Step 1)
  Step 1: Photo upload + AI chatbot identifies issue
  Step 2: Fill location + date + time
  Step 3: Show professionals → book

  אייקונים → components/BookIcons.jsx
  קטלוג    → data/bookingCatalog.js
*/


const fld = (ok) => ({
  width: "100%", padding: "13px 16px", borderRadius: 14,
  border: ok ? "2px solid #2563EB" : "2px solid #EEF1F8",
  background: "#F8FAFF", fontSize: 15,
  color: ok ? "#1A2B4A" : "#94A3B8",
  fontFamily: "'DM Sans',sans-serif", outline: "none",
  transition: "all 0.25s", appearance: "none",
  WebkitAppearance: "none", cursor: "pointer", boxSizing: "border-box",
});

export default function BookaPro() {
  const navigate = useNavigate();
  const { t, dir, lang } = useLang();
  const isRTL = dir === "rtl";
  const isHe = lang === "he";

  /* כל הלוגיקה מגיעה מ-hooks/useBooking.js */
  const {
    step, setStep,
    cat, issue, catLabel, issueLabel, timeLabel,
    msgs, chatInput, setChatInput, analyzing, diagnosis, imagePreview,
    fileRef, chatEndRef, handlePhoto, handleTextSend, confirmDiagnosis,
    cityQ, setCityQ, city, setCity, dd, setDd,
    date, setDate, time, setTime,
    filtered, ready, today, fmtDate,
    iRef, dRef,
    results, setResults, visiblePros, prosLoading,
    modal, setModal, ok, booking, bookErr,
    desc, setDesc, confirmBooking,
    goBack,
  } = useBooking({ t, lang, isHe, navigate });

  const BackIcon = isRTL ? IconForward : IconBack;

  const renderBotText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i} style={{ color: "#2563EB" }}>{p.slice(2, -2)}</strong>
        : p.includes("\n\n") ? <span key={i}>{p.split("\n\n").map((s, j) => <span key={j}>{j > 0 && <><br /><br /></>}{s}</span>)}</span> : p
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", minHeight: "100vh", direction: dir, textAlign: isRTL ? "right" : "left" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes checkPop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .hc:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(37,99,235,.1);border-color:#93B4F5!important}
        .hch:hover{transform:translateY(-1px);border-color:#93B4F5!important}
        .hp:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.08)}
        .hb:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-1px)}
        .hdd:hover{background:#EEF2FF!important}
        *{box-sizing:border-box;margin:0}
        input::placeholder,textarea::placeholder{color:#94A3B8}
        select:focus,input:focus{border-color:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,.08)}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 12px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          <button onClick={goBack} style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F4FF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer" }}><BackIcon /></button>
          <span style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A" }}>{t("bp_title")}</span>
          <LangToggle />
        </div>
      </nav>

      {/* STEPPER */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, background: step >= s || (s === 3 && results) ? "#2563EB" : "#E2E8F0", color: step >= s || (s === 3 && results) ? "#FFF" : "#94A3B8", transition: "all .4s cubic-bezier(.4,0,.2,1)", boxShadow: (step === s || (s === 3 && results && step === 2)) ? "0 0 0 4px rgba(37,99,235,.15)" : "none" }}>
                {(step > s || (s <= 2 && results)) ? <IconCheck /> : s === 1 ? "\ud83d\udcf7" : s === 2 ? "\ud83d\udccd" : "\ud83d\udc77"}
              </div>
              {i < 2 && <div style={{ width: 80, height: 3, background: step > s || (s === 1 && step >= 2) || (s === 2 && results) ? "#2563EB" : "#E2E8F0", transition: "all .4s", borderRadius: 2, margin: "0 8px" }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 88, marginTop: 10 }}>
          {[isHe ? "\u05e6\u05dc\u05dd \u05ea\u05e7\u05dc\u05d4" : "Snap Issue", isHe ? "\u05de\u05d9\u05e7\u05d5\u05dd \u05d5\u05d6\u05de\u05df" : "When & Where", isHe ? "\u05d1\u05d7\u05e8 \u05de\u05e7\u05e6\u05d5\u05e2\u05df" : "Choose Pro"].map((l, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: step >= i + 1 ? 600 : 400, color: step >= i + 1 ? "#2563EB" : "#94A3B8", textAlign: "center", width: 80 }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 40px" }}>

        {/* ==================== STEP 1: CHATBOT ==================== */}
        {step === 1 && (
          <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", boxShadow: "0 4px 24px rgba(0,0,0,.03)", animation: "fadeUp .4s", overflow: "hidden", display: "flex", flexDirection: "column", height: "min(65vh, 540px)" }}>
            {/* Chat header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8ECF4", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18 }}>{"\ud83e\udd16"}</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", fontFamily: isHe ? "'Heebo'" : "'Outfit'" }}>{isHe ? "\u05e2\u05d5\u05d6\u05e8 \u05d7\u05db\u05dd" : "Smart Assistant"}</div>
                <div style={{ fontSize: 12, color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
                  {isHe ? "\u05de\u05d5\u05db\u05df \u05dc\u05e0\u05d9\u05ea\u05d5\u05d7" : "Ready to analyze"}
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s" }}>
                  <div style={{ maxWidth: "80%", padding: m.image ? "6px" : "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#F0F4FF", color: m.role === "user" ? "#FFF" : "#1A2B4A", fontSize: 14, lineHeight: 1.6, fontFamily: isHe ? "'Heebo','DM Sans'" : "'DM Sans'" }}>
                    {m.image ? <img src={m.image} alt="Issue" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 14, display: "block" }} /> : renderBotText(m.text)}
                  </div>
                </div>
              ))}

              {/* Analyzing dots */}
              {analyzing && (
                <div style={{ display: "flex", justifyContent: "flex-start", animation: "fadeUp .3s" }}>
                  <div style={{ padding: "14px 22px", borderRadius: "18px 18px 18px 4px", background: "#F0F4FF", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 1, 2].map(d => (
                      <span key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                    ))}
                    <span style={{ fontSize: 13, color: "#7C8DB5", marginInlineStart: 8 }}>{isHe ? "\u05de\u05e0\u05ea\u05d7..." : "Analyzing..."}</span>
                  </div>
                </div>
              )}

              {/* Confirm button after diagnosis */}
              {diagnosis && !analyzing && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8, animation: "fadeUp .4s" }}>
                  <button className="hb" onClick={confirmDiagnosis} style={{ padding: "14px 36px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#059669,#10B981)", color: "#FFF", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: isHe ? "'Heebo'" : "'Outfit'", boxShadow: "0 6px 24px rgba(5,150,105,.3)", display: "flex", alignItems: "center", gap: 8, transition: "all .3s" }}>
                    <IconCheck />
                    {isHe ? `\u05d0\u05e9\u05e8! \u05ea\u05de\u05e6\u05d0 \u05dc\u05d9 ${t(CAT_LABEL_KEYS[diagnosis.cat])}` : `Got it! Find me a ${t(CAT_LABEL_KEYS[diagnosis.cat])}`}
                  </button>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #E8ECF4", background: "#FAFBFE" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                {/* Camera button */}
                <button onClick={() => fileRef.current?.click()} style={{ width: 42, height: 42, borderRadius: 12, border: "2px solid #E2E8F0", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2563EB", flexShrink: 0, transition: "all .2s" }} title={isHe ? "\u05e6\u05dc\u05dd \u05ea\u05de\u05d5\u05e0\u05d4" : "Upload photo"}>
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />

                {/* Text input */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#FFF", borderRadius: 14, border: "2px solid #EEF1F8", padding: "10px 14px", transition: "border-color .2s" }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleTextSend()}
                    placeholder={isHe ? "\u05ea\u05d0\u05e8 \u05d0\u05ea \u05d4\u05ea\u05e7\u05dc\u05d4 \u05d0\u05d5 \u05e6\u05dc\u05dd..." : "Describe the issue or snap a photo..."}
                    disabled={analyzing}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontFamily: isHe ? "'Heebo','DM Sans'" : "'DM Sans'", color: "#1A2B4A", direction: dir, textAlign: isRTL ? "right" : "left" }}
                  />
                </div>

                {/* Send button */}
                <button onClick={handleTextSend} disabled={!chatInput.trim() || analyzing} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: chatInput.trim() && !analyzing ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: chatInput.trim() && !analyzing ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", cursor: chatInput.trim() && !analyzing ? "pointer" : "not-allowed", flexShrink: 0, transition: "all .2s" }}>
                  <IconSend />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: WHEN & WHERE + RESULTS ==================== */}
        {step === 2 && (
          <div style={{ animation: "fadeUp .4s" }}>
            {/* Summary chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#EEF2FF", color: "#3B5BDB", fontSize: 13, fontWeight: 600 }}>{catIcons[cat]} {catLabel}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#EEF2FF", color: "#3B5BDB", fontSize: 13, fontWeight: 600 }}>{"\ud83d\udd27"} {issueLabel}</span>
              {city && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#F0FDF4", color: "#059669", fontSize: 13, fontWeight: 600 }}>{"\ud83d\udccd"} {city}</span>}
              {date && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#FFF7ED", color: "#C2410C", fontSize: 13, fontWeight: 600 }}>{"\ud83d\udcc5"} {fmtDate(date)}</span>}
              {time && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 50, background: "#F5F3FF", color: "#7C3AED", fontSize: 13, fontWeight: 600 }}>{"\ud83d\udd50"} {timeLabel}</span>}
            </div>

            {/* FORM */}
            {results === false && (
              <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", padding: "28px 24px", marginBottom: 20, boxShadow: "0 4px 24px rgba(0,0,0,.03)" }}>
                <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{t("bp_when_where")}</h2>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginBottom: 28 }}>{t("bp_when_where_sub")}</p>

                {/* Location */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}><IconPin /></span>{t("bp_location")}
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFF", borderRadius: 14, border: dd ? "2px solid #2563EB" : "2px solid #EEF1F8", padding: "13px 16px", transition: "all .25s", boxShadow: dd ? "0 0 0 4px rgba(37,99,235,.08)" : "none" }}>
                      <span style={{ color: dd ? "#2563EB" : "#94A3B8", flexShrink: 0, display: "flex" }}><IconSearch /></span>
                      <input ref={iRef} type="text" placeholder={t("bp_search_city")} value={cityQ}
                        onChange={e => { setCityQ(e.target.value); setDd(true); if (city) setCity(null); }}
                        onFocus={() => setDd(true)}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: "'DM Sans'", color: "#1A2B4A", direction: "ltr", textAlign: isRTL ? "right" : "left" }} />
                      {cityQ && <button onClick={() => { setCity(null); setCityQ(""); iRef.current?.focus(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 2 }}><IconX /></button>}
                    </div>
                    {dd && (
                      <div ref={dRef} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#FFF", borderRadius: 16, border: "1px solid #E8ECF4", boxShadow: "0 12px 40px rgba(0,0,0,.10)", maxHeight: 220, overflowY: "auto", zIndex: 50, animation: "fadeUp .2s" }}>
                        {filtered.length > 0 ? filtered.map(c => {
                          const mi = c.toLowerCase().indexOf(cityQ.toLowerCase());
                          return (
                            <div key={c} className="hdd" onClick={() => { setCity(c); setCityQ(c); setDd(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", cursor: "pointer", borderBottom: "1px solid #F5F7FA", background: city === c ? "#EEF2FF" : "transparent" }}>
                              <span style={{ color: "#2563EB", flexShrink: 0, display: "flex" }}><IconPin /></span>
                              <span style={{ fontSize: 14, color: "#1A2B4A" }}>{cityQ && mi >= 0 ? <>{c.slice(0, mi)}<strong style={{ color: "#2563EB" }}>{c.slice(mi, mi + cityQ.length)}</strong>{c.slice(mi + cityQ.length)}</> : c}</span>
                            </div>
                          );
                        }) : <div style={{ padding: "20px 18px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>{t("bp_no_cities")}</div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date + Time */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2410C" }}><IconCalendar /></span>{t("bp_date")}
                    </label>
                    <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} style={fld(!!date)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED" }}><IconClockLg /></span>{t("bp_time")}
                    </label>
                    <select value={time} onChange={e => setTime(e.target.value)} style={{ ...fld(!!time), backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: isRTL ? "left 16px center" : "right 16px center", [isRTL ? "paddingLeft" : "paddingRight"]: 40 }}>
                      <option value="" disabled>{t("bp_select_time")}</option>
                      <optgroup label={t("bp_morning")}>
                        {TIME_OPTIONS.filter(ti => parseInt(ti.value) < 12).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}
                      </optgroup>
                      <optgroup label={t("bp_afternoon")}>
                        {TIME_OPTIONS.filter(ti => parseInt(ti.value) >= 12 && parseInt(ti.value) < 16).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}
                      </optgroup>
                      <optgroup label={t("bp_evening")}>
                        {TIME_OPTIONS.filter(ti => parseInt(ti.value) >= 16).map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <button className="hb" disabled={!ready} onClick={() => setResults(true)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: ready ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: ready ? "#FFF" : "#94A3B8", fontSize: 17, fontWeight: 700, fontFamily: "'Outfit'", cursor: ready ? "pointer" : "not-allowed", boxShadow: ready ? "0 8px 30px rgba(37,99,235,.3)" : "none", transition: "all .3s" }}>
                  {t("bp_search_btn")}
                </button>
              </div>
            )}

            {/* RESULTS */}
            {results === true && city && (
              <div style={{ background: "#FFF", borderRadius: 20, border: "1px solid #E8ECF4", padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,.03)", animation: "fadeUp .4s" }}>
                <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>{t("bp_available_in")} {city}</h2>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginBottom: 20 }}>{t("bp_found")} <strong style={{ color: "#2563EB" }}>{visiblePros.length}</strong> {visiblePros.length > 1 ? t("bp_professionals") : t("bp_professional")} {catLabel ? "· " + catLabel : ""} {t("bp_for")} <strong>{fmtDate(date)}</strong> {t("bp_at")} <strong>{timeLabel}</strong></p>

                {prosLoading && (
                  <div style={{ textAlign: "center", padding: "30px", color: "#94A3B8", fontSize: 15 }}>{isHe ? "\u05d8\u05d5\u05e2\u05df \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2..." : "Loading professionals..."}</div>
                )}
                {!prosLoading && visiblePros.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
                    <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#64748B" }}>{isHe ? `\u05d0\u05d9\u05df \u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05d6\u05de\u05d9\u05e0\u05d9\u05dd \u05dc${catLabel}` : `No professionals available for ${catLabel}`}</p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>{isHe ? "\u05e0\u05e1\u05d5 \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4 \u05d0\u05d7\u05e8\u05ea, \u05d0\u05d5 \u05e9\u05d1\u05e2\u05dc\u05d9 \u05de\u05e7\u05e6\u05d5\u05e2 \u05d9\u05ea\u05d5\u05d5\u05e1\u05e4\u05d5 \u05d1\u05e7\u05e8\u05d5\u05d1" : "Try another category, or check back soon"}</p>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
                  {visiblePros.map(p => {
                    const specLabel = p.specialty
                      ? (CAT_LABEL_KEYS[p.specialty] ? t(CAT_LABEL_KEYS[p.specialty]) : p.specialty)
                      : catLabel;
                    return (
                    <div key={p.id} className="hp" style={{ background: "#FFF", borderRadius: 20, border: "1px solid #EEF1F8", padding: 0, overflow: "hidden", transition: "all .3s", boxShadow: "0 2px 14px rgba(15,23,42,.04)" }}>
                      {/* Header strip */}
                      <div style={{ height: 6, background: "linear-gradient(90deg,#4F6AFF,#2563EB)" }} />
                      <div style={{ padding: "20px 22px" }}>
                        {/* Top: avatar + name + verified */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                          <div style={{ width: 56, height: 56, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0, fontFamily: "'Outfit'" }}>{p.profilePicture ? <img src={p.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.avatar}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 16.5, fontWeight: 800, color: "#1A2B4A", fontFamily: "'Outfit'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                              {/* Verified badge */}
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="#2563EB" style={{ flexShrink: 0 }}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5, fontSize: 12, fontWeight: 600, color: "#3B5BDB", background: "#EEF2FF", padding: "3px 10px", borderRadius: 20 }}>{catIcons[p.specialty] || catIcons[cat] || "\ud83d\udee0\ufe0f"} {specLabel}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                          <div style={{ display: "flex", gap: 1 }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={p.reviews > 0 && s <= Math.round(Number(p.rating)) ? "#F59E0B" : "#E2E8F0"}><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 9 8.5"/></svg>
                            ))}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>{p.rating}</span>
                          <span style={{ fontSize: 12, color: "#94A3B8" }}>({p.reviews} {t("bp_reviews")})</span>
                        </div>

                        {/* Info rows */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                          <div style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}><IconLocation />{p.city}</div>
                          <div style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}><IconClock />{p.expYears} {t("bp_yrs_exp")}</div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                            <span style={{ fontSize: 17, fontWeight: 800, color: "#1A2B4A", fontFamily: "'Outfit'" }}>{"\u20aa"}{p.price}<span style={{ fontSize: 12, fontWeight: 500, color: "#94A3B8" }}> / {isHe ? "\u05e9\u05e2\u05d4" : "hr"}</span></span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#059669", background: "#ECFDF5", padding: "5px 11px", borderRadius: 20 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669" }} />{isHe ? "\u05d6\u05de\u05d9\u05df" : "Available"}</span>
                          </div>
                        </div>

                        <button className="hb" onClick={() => setModal(p)} style={{ width: "100%", padding: "13px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 14.5, fontWeight: 700, cursor: "pointer", transition: "all .2s", boxShadow: "0 4px 14px rgba(37,99,235,.28)" }}>{t("bp_book_now")}</button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .25s" }}>
          <div onClick={() => setModal(null)} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(6px)" }} />
          <div style={{ background: "#FFF", borderRadius: 24, width: "100%", maxWidth: 480, padding: "32px 28px", boxShadow: "0 24px 80px rgba(0,0,0,.18)", animation: "slideUp .35s cubic-bezier(.4,0,.2,1)", maxHeight: "85vh", overflowY: "auto", position: "relative", zIndex: 1001, direction: dir, textAlign: isRTL ? "right" : "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700, color: "#1A2B4A" }}>{t("bp_confirm_title")}</h3>
                <p style={{ fontSize: 14, color: "#7C8DB5", marginTop: 4 }}>{modal.name} {"\u2014"} {catLabel}</p>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}><IconX /></button>
            </div>
            <div style={{ background: "#F8FAFF", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
              {[
                { icon: <IconPin />, color: "#2563EB", text: city },
                { icon: <IconCalendar />, color: "#C2410C", text: fmtDate(date) },
                { icon: <IconClockLg />, color: "#7C3AED", text: timeLabel },
                { icon: <span style={{ fontSize: 16 }}>{catIcons[cat]}</span>, color: null, text: `${catLabel} \u2014 ${issueLabel}` },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, padding: "6px 0" }}>
                  <span style={{ color: r.color, display: "flex" }}>{r.icon}</span>
                  <span style={{ color: "#4A5568" }}><strong>{r.text}</strong></span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 6, display: "block" }}>{t("bp_notes")}</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t("bp_notes_placeholder")} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#1A2B4A", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontFamily: "inherit", direction: dir }} />
            </div>

            {/* Cancellation Policy */}
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{"\u26a0\ufe0f"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>{t("bp_cancel_policy")}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>{"\u2705"}</span>
                  <span style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.5 }}>{isHe ? <>{"\u05d1\u05d9\u05d8\u05d5\u05dc"} <strong style={{ color: "#059669" }}>{t("bp_cancel_free")}</strong> {t("bp_cancel_before")} {"\u2014"} <strong style={{ color: "#059669" }}>{t("bp_cancel_free_label")}</strong></> : <>Cancel <strong style={{ color: "#059669" }}>{t("bp_cancel_free")}</strong> {t("bp_cancel_before")} {"\u2014"} <strong style={{ color: "#059669" }}>{t("bp_cancel_free_label")}</strong></>}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>{"\ud83d\udcb0"}</span>
                  <span style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.5 }}>{isHe ? <>{"\u05d1\u05d9\u05d8\u05d5\u05dc"} <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid")}</strong> {t("bp_cancel_before")} {"\u2014"} <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid_label")}</strong></> : <>Cancel <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid")}</strong> {t("bp_cancel_before")} {"\u2014"} <strong style={{ color: "#DC2626" }}>{t("bp_cancel_paid_label")}</strong></>}</span>
                </div>
              </div>
            </div>

            {bookErr && <p style={{ color: "#DC2626", fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>{bookErr}</p>}
            <button disabled={booking} onClick={confirmBooking} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 16, fontWeight: 700, cursor: booking ? "default" : "pointer", fontFamily: "'Outfit'", boxShadow: "0 6px 24px rgba(37,99,235,.3)", display: "block", opacity: booking ? 0.7 : 1 }}>{booking ? (isHe ? "יוצר הזמנה..." : "Creating...") : t("bp_confirm_btn")}</button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {ok && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20, animation: "fadeIn .25s" }}>
          <div style={{ background: "#FFF", borderRadius: 24, padding: "48px 36px", textAlign: "center", maxWidth: 400, width: "100%", animation: "slideUp .35s cubic-bezier(.4,0,.2,1)", boxShadow: "0 24px 80px rgba(0,0,0,.18)", direction: dir }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "checkPop .5s" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 700, color: "#1A2B4A", marginBottom: 8 }}>{t("bp_success")}</h3>
            <p style={{ fontSize: 15, color: "#7C8DB5", lineHeight: 1.6 }}>{t("bp_success_sub")}<br />{t("bp_redirect")}</p>
          </div>
        </div>
      )}
    </div>
  );
}