import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLang, translate, getLang, getDir } from "../context/LanguageContext";

export default function RatePro() {
  var navigate = useNavigate();
  var sp = useSearchParams()[0];
  var proName = sp.get("pro") || "Your Professional";
  var service = sp.get("service") || "Service";
  var lang = getLang();
  var dir = getDir();
  var isHe = lang === "he";

  var _r = useState(0); var rating = _r[0]; var setRating = _r[1];
  var _h = useState(0); var hovering = _h[0]; var setHovering = _h[1];
  var _s = useState(false); var submitted = _s[0]; var setSubmitted = _s[1];
  var _c = useState(""); var comment = _c[0]; var setComment = _c[1];
  var _ai = useState(false); var aiLoading = _ai[0]; var setAiLoading = _ai[1];
  var _sug = useState(""); var aiSuggestion = _sug[0]; var setAiSuggestion = _sug[1];
  var _show = useState(false); var showSuggestion = _show[0]; var setShowSuggestion = _show[1];
  var _dl = useState(false); var detectedHe = _dl[0]; var setDetectedHe = _dl[1];

  var labels = isHe
    ? ["", "\u05d2\u05e8\u05d5\u05e2", "\u05e1\u05d1\u05d9\u05e8", "\u05d8\u05d5\u05d1", "\u05d8\u05d5\u05d1 \u05de\u05d0\u05d5\u05d3", "\u05de\u05e2\u05d5\u05dc\u05d4"]
    : ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  var emojis = ["", "\ud83d\ude1e", "\ud83d\ude10", "\ud83d\ude42", "\ud83d\ude0a", "\ud83e\udd29"];
  var colors = ["", "#EF4444", "#F97316", "#F59E0B", "#10B981", "#2563EB"];

  var handleSubmit = function() {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(function() { navigate("/client/dashboard"); }, 2500);
  };

  var handleAiImprove = function() {
    if (!comment.trim() || comment.trim().length < 3) return;
    setAiLoading(true);
    setShowSuggestion(false);

    /* ── Smart local AI improvement ── */
    setTimeout(function() {
      var text = comment.trim();
      var improved = "";

      /* ── Detect actual language of written text ── */
      var hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
      var latinChars = (text.match(/[a-zA-Z]/g) || []).length;
      var textIsHebrew = hebrewChars > latinChars;
      setDetectedHe(textIsHebrew);

      if (textIsHebrew) {
        /* ── Hebrew improvements ── */
        if (text.length < 15) {
          /* Too short — suggest elaboration */
          var shortExpand = {
            "\u05DE\u05E2\u05D5\u05DC\u05D4": "\u05E9\u05D9\u05E8\u05D5\u05EA \u05DE\u05E2\u05D5\u05DC\u05D4! \u05D1\u05E2\u05DC \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2 \u05D4\u05D9\u05D4 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9, \u05D4\u05D2\u05D9\u05E2 \u05D1\u05D6\u05DE\u05DF \u05D5\u05E2\u05E9\u05D4 \u05E2\u05D1\u05D5\u05D3\u05D4 \u05DE\u05E6\u05D5\u05D9\u05E0\u05EA. \u05DE\u05DE\u05DC\u05D9\u05E5 \u05D1\u05D4\u05D7\u05DC\u05D8!",
            "\u05DE\u05D3\u05D4\u05D9\u05DD": "\u05D7\u05D5\u05D5\u05D9\u05D4 \u05DE\u05D3\u05D4\u05D9\u05DE\u05D4! \u05D1\u05E2\u05DC \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2 \u05D4\u05E4\u05D2\u05D9\u05DF \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05D5\u05EA \u05D5\u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D1 \u05DC\u05E4\u05E8\u05D8\u05D9\u05DD. \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D1\u05D5\u05E6\u05E2\u05D4 \u05D1\u05E8\u05DE\u05D4 \u05D2\u05D1\u05D5\u05D4\u05D4 \u05D5\u05D0\u05E0\u05D9 \u05DE\u05DE\u05DC\u05D9\u05E5 \u05D1\u05D7\u05D5\u05DD!",
            "\u05D8\u05D5\u05D1": "\u05E9\u05D9\u05E8\u05D5\u05EA \u05D8\u05D5\u05D1 \u05D5\u05D0\u05DE\u05D9\u05DF. \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D1\u05D5\u05E6\u05E2\u05D4 \u05D1\u05E8\u05DE\u05D4 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9\u05EA \u05D5\u05D4\u05EA\u05D5\u05E6\u05D0\u05D4 \u05D4\u05D9\u05D9\u05EA\u05D4 \u05DE\u05E9\u05D1\u05D9\u05E2\u05D4.",
            "\u05D2\u05E8\u05D5\u05E2": "\u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05DC\u05D0 \u05E2\u05DE\u05D3 \u05D1\u05E6\u05D9\u05E4\u05D9\u05D5\u05EA \u05E9\u05DC\u05D9. \u05D4\u05D9\u05D4 \u05E4\u05E8\u05E7 \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05D9 \u05D1\u05D9\u05DF \u05DE\u05D4 \u05E9\u05D4\u05D5\u05D1\u05D8\u05D7 \u05DC\u05D1\u05D9\u05DF \u05DE\u05D4 \u05E9\u05D1\u05D5\u05E6\u05E2.",
            "\u05E1\u05D1\u05D9\u05E8": "\u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05D4\u05D9\u05D4 \u05E1\u05D1\u05D9\u05E8. \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D4\u05D5\u05E9\u05DC\u05DE\u05D4, \u05D0\u05DA \u05D9\u05E9 \u05DE\u05E7\u05D5\u05DD \u05DC\u05E9\u05D9\u05E4\u05D5\u05E8 \u05D1\u05EA\u05E7\u05E9\u05D5\u05E8\u05EA \u05D5\u05D1\u05D3\u05D9\u05D9\u05E7\u05E0\u05D5\u05EA.",
            "\u05DE\u05D5\u05DE\u05DC\u05E5": "\u05DE\u05DE\u05DC\u05D9\u05E5 \u05D1\u05D7\u05D5\u05DD! \u05D1\u05E2\u05DC \u05D4\u05DE\u05E7\u05E6\u05D5\u05E2 \u05D4\u05D9\u05D4 \u05D0\u05D3\u05D9\u05D1 \u05D5\u05DE\u05E7\u05E6\u05D5\u05E2\u05D9. \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D1\u05D5\u05E6\u05E2\u05D4 \u05D1\u05E8\u05DE\u05D4 \u05D4\u05D2\u05D1\u05D5\u05D4\u05D4 \u05D1\u05D9\u05D5\u05EA\u05E8.",
          };
          var found = false;
          Object.keys(shortExpand).forEach(function(key) {
            if (text.includes(key) && !found) { improved = shortExpand[key]; found = true; }
          });
          if (!found) {
            improved = "\u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05D4\u05D9\u05D4 " + text + ". \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D1\u05D5\u05E6\u05E2\u05D4 \u05D1\u05D0\u05D5\u05E4\u05DF \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D5\u05D0\u05E0\u05D9 \u05DE\u05DE\u05DC\u05D9\u05E5 \u05D1\u05D4\u05D7\u05DC\u05D8.";
          }
        } else {
          /* Longer text — polish it */
          improved = text;
          /* Capitalize opening */
          if (!improved.startsWith("\u05D4") && !improved.startsWith("\u05D0\u05E0\u05D9") && !improved.startsWith("\u05D4\u05E9")) {
            improved = "\u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05D4\u05D9\u05D4 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05DE\u05D0\u05D5\u05D3. " + improved;
          }
          /* Add polite ending if missing */
          if (!improved.includes("\u05DE\u05DE\u05DC\u05D9\u05E5") && !improved.includes("\u05EA\u05D5\u05D3\u05D4") && !improved.includes("!")) {
            improved = improved.replace(/[.!?\s]+$/, "") + ". \u05DE\u05DE\u05DC\u05D9\u05E5 \u05D1\u05D4\u05D7\u05DC\u05D8!";
          }
          /* Clean up punctuation */
          improved = improved.replace(/\?\?+/g, "?").replace(/!!+/g, "!").replace(/\.\./g, ".");
        }
      } else {
        /* ── English improvements ── */
        if (text.length < 15) {
          var enExpand = {
            "great": "Great service! The professional was skilled, arrived on time, and completed the job efficiently. Highly recommended.",
            "good": "Good experience overall. The work was done professionally and the results met my expectations.",
            "bad": "The service did not meet my expectations. There was a noticeable gap between what was promised and what was delivered.",
            "terrible": "Very disappointing experience. The quality of work was below acceptable standards and did not match the agreed scope.",
            "ok": "The service was acceptable. The job was completed, though there is room for improvement in communication and timeliness.",
            "excellent": "Excellent service from start to finish! The professional was knowledgeable, punctual, and delivered outstanding results. Highly recommended!",
            "amazing": "Amazing experience! The professional exceeded my expectations with their expertise and attention to detail. Would definitely hire again.",
            "awful": "The service was very poor. The work quality was unacceptable and communication throughout the process was lacking.",
            "perfect": "Perfect service! Everything was handled with care and professionalism. The results exceeded my expectations. Highly recommended!",
            "slow": "The service took longer than expected. While the final result was adequate, the timeline could have been better communicated.",
            "fast": "Impressively fast service! The professional completed the job quickly without compromising on quality. Very satisfied.",
            "recommend": "I highly recommend this professional. The service was excellent, the work was thorough, and the pricing was fair.",
          };
          var enFound = false;
          Object.keys(enExpand).forEach(function(key) {
            if (text.toLowerCase().includes(key) && !enFound) { improved = enExpand[key]; enFound = true; }
          });
          if (!enFound) {
            improved = "The service was " + text.toLowerCase() + ". The professional handled the job competently and I would consider using their services again.";
          }
        } else {
          improved = text;
          /* Capitalize first letter */
          improved = improved.charAt(0).toUpperCase() + improved.slice(1);
          /* Add professional tone */
          if (!improved.includes("professional") && !improved.includes("service") && !improved.includes("recommend")) {
            improved = improved.replace(/[.!?\s]+$/, "") + ". Overall a professional experience.";
          }
          /* Clean punctuation */
          improved = improved.replace(/\?\?+/g, "?").replace(/!!+/g, "!").replace(/\.\./g, ".");
          /* Ensure ends with period */
          if (!/[.!?]$/.test(improved)) improved += ".";
        }
      }

      setAiSuggestion(improved);
      setShowSuggestion(true);
      setAiLoading(false);
    }, 1200);
  };

  var handleAcceptAi = function() {
    setComment(aiSuggestion);
    setShowSuggestion(false);
    setAiSuggestion("");
  };

  var handleRejectAi = function() {
    setShowSuggestion(false);
    setAiSuggestion("");
  };

  return (
    <div dir={dir} style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{"\n        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Heebo:wght@400;500;600;700;800;900&display=swap');\n        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\n        @keyframes popIn{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}\n        .starBtn:hover svg{transform:scale(1.2)}\n        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}\n        *{box-sizing:border-box;margin:0}\n      "}</style>

      {submitted && (
        <div style={{ textAlign: "center", animation: "fadeUp .4s", maxWidth: 420, width: "100%" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "popIn .5s" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 800, color: "#1A2B4A", marginBottom: 10 }}>
            {isHe ? "\u05ea\u05d5\u05d3\u05d4 \u05e8\u05d1\u05d4! \ud83c\udf89" : "Thank You! \ud83c\udf89"}
          </h2>
          <p style={{ fontSize: 16, color: "#7C8DB5", lineHeight: 1.6 }}>
            {isHe ? "\u05d4\u05d3\u05d9\u05e8\u05d5\u05d2 \u05e9\u05dc " + rating + " \u05db\u05d5\u05db\u05d1\u05d9\u05dd \u05e0\u05e9\u05dc\u05d7." : "Your " + rating + "-star rating has been submitted."}
            {comment.trim() && (<><br />{isHe ? "\u05D4\u05DE\u05E9\u05D5\u05D1 \u05E9\u05DC\u05DA \u05E0\u05E8\u05E9\u05DD \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4 \u2705" : "Your review has been recorded \u2705"}</>)}
            <br />
            {isHe ? "\u05de\u05e2\u05d1\u05d9\u05e8 \u05dc\u05d3\u05e9\u05d1\u05d5\u05e8\u05d3..." : "Redirecting to dashboard..."}
          </p>
        </div>
      )}

      {!submitted && (
        <div style={{ background: "#FFF", borderRadius: 28, padding: "44px 32px 36px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,.06)", border: "1px solid #E8ECF4", animation: "fadeUp .4s" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, margin: "0 auto 16px", boxShadow: "0 6px 24px rgba(37,99,235,.25)" }}>
            {proName.split(" ").map(function(w) { return w[0]; }).join("").slice(0, 2)}
          </div>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 800, color: "#1A2B4A", marginBottom: 4 }}>
            {isHe ? "\u05d0\u05d9\u05da \u05d4\u05d9\u05d4 \u05d4\u05d7\u05d5\u05d5\u05d9\u05d4?" : "How was your experience?"}
          </h2>
          <p style={{ fontSize: 15, color: "#7C8DB5", marginBottom: 6 }}>
            {isHe ? "\u05d3\u05e8\u05d2\u05d5 \u05d0\u05ea " : "Rate "}<strong style={{ color: "#2563EB" }}>{proName}</strong>
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 28 }}>{service}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            {[1, 2, 3, 4, 5].map(function(star) {
              var active = star <= (hovering || rating);
              var activeColor = colors[hovering || rating] || "#E2E8F0";
              return (
                <button key={star} className="starBtn" onClick={function() { setRating(star); }} onMouseEnter={function() { setHovering(star); }} onMouseLeave={function() { setHovering(0); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, transition: "transform .15s", transform: active ? "scale(1.1)" : "scale(1)" }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill={active ? activeColor : "none"} stroke={active ? activeColor : "#D1D5DB"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all .2s" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              );
            })}
          </div>

          <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            {(hovering || rating) > 0 && (
              <div style={{ animation: "fadeUp .2s", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28 }}>{emojis[hovering || rating]}</span>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit'", color: colors[hovering || rating] }}>{labels[hovering || rating]}</span>
              </div>
            )}
          </div>

          {/* ── Comment Box ── */}
          {rating > 0 && (
            <div style={{ marginBottom: 24, animation: "fadeUp .3s", textAlign: isHe ? "right" : "left" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
                {isHe ? "\u05E1\u05E4\u05E8\u05D5 \u05DC\u05E0\u05D5 \u05E2\u05D5\u05D3 (\u05D0\u05D5\u05E4\u05E6\u05D9\u05D5\u05E0\u05DC\u05D9)" : "Tell us more (optional)"}
              </label>
              <textarea
                value={comment}
                onChange={function(e) { setComment(e.target.value); }}
                placeholder={isHe
                  ? "\u05DE\u05D4 \u05D4\u05D9\u05D4 \u05D8\u05D5\u05D1? \u05DE\u05D4 \u05D0\u05E4\u05E9\u05E8 \u05DC\u05E9\u05E4\u05E8? \u05E1\u05E4\u05E8\u05D5 \u05DC\u05E0\u05D5..."
                  : "What went well? What could improve? Share your thoughts..."}
                rows={3}
                maxLength={500}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 14,
                  border: "2px solid #E8ECF4", background: "#F8FAFF",
                  fontSize: 14, fontFamily: isHe ? "'Heebo','DM Sans',sans-serif" : "'DM Sans',sans-serif",
                  color: "#1A2B4A", resize: "vertical", outline: "none",
                  transition: "border-color .2s", direction: dir,
                  lineHeight: 1.6, minHeight: 90,
                }}
                onFocus={function(e) { e.target.style.borderColor = "#2563EB"; e.target.style.background = "#FFF"; }}
                onBlur={function(e) { e.target.style.borderColor = "#E8ECF4"; e.target.style.background = "#F8FAFF"; }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                  {rating <= 2
                    ? (isHe ? "\uD83D\uDCA1 \u05D4\u05DE\u05E9\u05D5\u05D1 \u05E9\u05DC\u05DA \u05E2\u05D5\u05D6\u05E8 \u05DC\u05E0\u05D5 \u05DC\u05D4\u05E9\u05EA\u05E4\u05E8" : "\uD83D\uDCA1 Your feedback helps us improve")
                    : (isHe ? "\u2728 \u05E0\u05E9\u05DE\u05D7 \u05DC\u05E9\u05DE\u05D5\u05E2 \u05E2\u05D5\u05D3" : "\u2728 We\u2019d love to hear more")}
                </span>
                <span style={{ fontSize: 11, color: comment.length > 450 ? "#EF4444" : "#94A3B8" }}>{comment.length}/500</span>
              </div>

              {/* ── AI Improve Button ── */}
              {comment.trim().length >= 3 && !showSuggestion && (
                <button onClick={handleAiImprove} disabled={aiLoading}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", marginTop: 12, padding: "11px 16px", borderRadius: 12,
                    border: "2px solid #E0E7FF", background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
                    color: "#4F46E5", fontSize: 13, fontWeight: 600, cursor: aiLoading ? "wait" : "pointer",
                    fontFamily: isHe ? "'Heebo','DM Sans',sans-serif" : "'DM Sans',sans-serif",
                    transition: "all .2s", opacity: aiLoading ? 0.7 : 1,
                  }}>
                  {aiLoading ? (
                    <>
                      <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #A5B4FC", borderTopColor: "#4F46E5", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                      {(comment.match(/[\u0590-\u05FF]/g) || []).length > (comment.match(/[a-zA-Z]/g) || []).length ? "\u05DE\u05E9\u05E4\u05E8 \u05D0\u05EA \u05D4\u05D8\u05E7\u05E1\u05D8..." : "Improving your text..."}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4m0 14v-4m-9-5h4m14 0h-4m-1.5-6.5L13 7m-2 10l-2.5 2.5M19.5 7.5L17 10M7 14l-2.5 2.5"/></svg>
                      {(comment.match(/[\u0590-\u05FF]/g) || []).length > (comment.match(/[a-zA-Z]/g) || []).length ? "\u2728 \u05E9\u05E4\u05E8\u05D5 \u05D8\u05E7\u05E1\u05D8 \u05E2\u05DD AI" : "\u2728 Improve with AI"}
                    </>
                  )}
                </button>
              )}

              {/* ── AI Suggestion Panel ── */}
              {showSuggestion && (
                <div style={{ marginTop: 14, padding: "16px", borderRadius: 16, border: "2px solid #C7D2FE", background: "linear-gradient(135deg,#EEF2FF,#FFF)", animation: "fadeUp .3s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4m0 14v-4m-9-5h4m14 0h-4m-1.5-6.5L13 7m-2 10l-2.5 2.5M19.5 7.5L17 10M7 14l-2.5 2.5"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5" }}>
                      {detectedHe ? "\u05D2\u05E8\u05E1\u05D4 \u05DE\u05E9\u05D5\u05E4\u05E8\u05EA:" : "Improved version:"}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#1A2B4A", lineHeight: 1.7, marginBottom: 14, direction: detectedHe ? "rtl" : "ltr", textAlign: detectedHe ? "right" : "left",
                    fontFamily: detectedHe ? "'Heebo','DM Sans',sans-serif" : "'DM Sans',sans-serif",
                    background: "#FFF", borderRadius: 10, padding: "12px 14px", border: "1px solid #E0E7FF" }}>
                    {aiSuggestion}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleAcceptAi}
                      style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#4F46E5", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {detectedHe ? "\u05D0\u05E9\u05E8\u05D5 \u05D2\u05E8\u05E1\u05D4" : "Accept"}
                    </button>
                    <button onClick={handleRejectAi}
                      style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #E2E8F0", background: "#FFF", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      {detectedHe ? "\u05D4\u05E9\u05D0\u05E8\u05D5 \u05DE\u05E7\u05D5\u05E8\u05D9" : "Keep original"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={handleSubmit} disabled={rating === 0}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: rating > 0 ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: rating > 0 ? "#FFF" : "#94A3B8", fontSize: 17, fontWeight: 700, fontFamily: "'Outfit'", cursor: rating > 0 ? "pointer" : "not-allowed", boxShadow: rating > 0 ? "0 8px 30px rgba(37,99,235,.3)" : "none", transition: "all .3s", marginBottom: 12 }}>
            {isHe ? (comment.trim() ? "\u2B50 \u05E9\u05DC\u05D7\u05D5 \u05D3\u05D9\u05E8\u05D5\u05D2 \u05D5\u05DE\u05E9\u05D5\u05D1" : "\u2b50 \u05e9\u05dc\u05d7\u05d5 \u05d3\u05d9\u05e8\u05d5\u05d2") : (comment.trim() ? "\u2b50 Submit Rating & Review" : "\u2b50 Submit Rating")}
          </button>

          <button onClick={function() { navigate("/client/dashboard"); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#94A3B8", fontWeight: 500, padding: 8 }}>
            {isHe ? "\u05d3\u05dc\u05d2\u05d5 \u05dc\u05e2\u05ea \u05e2\u05ea\u05d4" : "Skip for now"}
          </button>
        </div>
      )}
    </div>
  );
}