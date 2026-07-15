import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";
import { useSnapIssue } from "../hooks/useSnapIssue";
import { IconBack, IconCamera, IconSend, IconImage, IconBot, IconTool, IconAlert } from "../components/SnapIcons";
import { ISSUE_CATEGORIES } from "../data/diyGuides";
import "../styles/snapIssue.css";

/*
  FixMate - Snap an Issue (AI DIY assistant)
  ROUTE: /client/snap

  אייקונים → components/SnapIcons.jsx
  מדריכים  → data/diyGuides.js
  לוגיקה   → hooks/useSnapIssue.js
  עיצוב    → styles/snapIssue.css
*/

export default function SnapAnIssue() {
  const navigate = useNavigate();
  const lang = getLang();
  const dir = getDir();
  const isHe = lang === "he";
  const L = (obj) => (obj && typeof obj === "object" && obj[lang] != null) ? obj[lang] : (typeof obj === "string" ? obj : (obj && obj.en) || "");

  /* כל הלוגיקה מגיעה מ-hooks/useSnapIssue.js */
  const {
    messages,
    input, setInput,
    imagePreview, setImagePreview, setImage,
    analyzing, diagnosed,
    fileRef, chatRef, inputRef,
    handleImageUpload, handleSendImage, handleQuickSelect, handleSendText,
    formatTime,
  } = useSnapIssue({ isHe, L });

  const canSend = !!(input.trim() || imagePreview);

  const renderMessage = (msg, i) => {
    const isBot = msg.from === "bot";

    // Special DIY guide card
    if (msg.text === "diy_guide" && diagnosed?.canDIY) {
      return (
        <div key={i} className="si-card-row">
          <div className="si-bot-avatar"><IconBot /></div>
          <div className="si-card-col">
            {/* DIY Guide Card */}
            <div className="si-diy">
              <div className="si-diy-head">
                <span className="si-diy-emoji">🛠️</span>
                <span className="si-diy-title">{isHe ? "מדריך תיקון עצמי" : "DIY Fix Guide"}</span>
                <span className="si-diy-badge">{isHe ? "אפשר לתקן לבד!" : "You can fix this!"}</span>
              </div>

              {/* Steps */}
              <div className="si-steps">
                {diagnosed.steps.map((step, si) => (
                  <div key={si} className="si-step">
                    <div className="si-step-num">{si + 1}</div>
                    <span className="si-step-text">{L(step)}</span>
                  </div>
                ))}
              </div>

              {/* Tools needed */}
              <div className="si-tools">
                <div className="si-tools-head">
                  <span className="si-tools-ico"><IconTool /></span>
                  <span className="si-tools-title">{isHe ? "כלים נדרשים" : "Tools Needed"}</span>
                </div>
                <div className="si-tools-list">
                  {diagnosed.tools.map((t, ti) => (
                    <span key={ti} className="si-tool-chip">{L(t)}</span>
                  ))}
                </div>
              </div>

              {/* Time + Cost */}
              <div className="si-meta">
                <div className="si-meta-box">
                  <div className="si-meta-label">⏱️ {isHe ? "זמן משוער" : "Est. Time"}</div>
                  <div className="si-meta-val">{L(diagnosed.estimatedTime)}</div>
                </div>
                <div className="si-meta-box">
                  <div className="si-meta-label">💰 {isHe ? "עלות משוערת" : "Est. Cost"}</div>
                  <div className="si-meta-val si-meta-val--cost">{L(diagnosed.estimatedCost)}</div>
                </div>
              </div>
            </div>

            {/* Still need help? */}
            <div className="si-help">
              <span className="si-help-text">{isHe ? "עדיין צריכים עזרה?" : "Still need help?"}</span>
              <button className="si-help-btn" onClick={() => navigate("/client/search")}>
                📅 {isHe ? "הזמן בעל מקצוע" : "Book a Pro"}
              </button>
            </div>

            <span className="si-msg-time">{formatTime(msg.time)}</span>
          </div>
        </div>
      );
    }

    // Special "need a pro" card
    if (msg.text === "need_pro" && diagnosed && !diagnosed.canDIY) {
      return (
        <div key={i} className="si-card-row">
          <div className="si-bot-avatar"><IconBot /></div>
          <div className="si-card-col">
            <div className="si-pro">
              <div className="si-pro-head">
                <span className="si-pro-ico"><IconAlert /></span>
                <span className="si-pro-title">{isHe ? "נדרש בעל מקצוע" : "Professional Required"}</span>
              </div>
              <p className="si-pro-warning">{L(diagnosed.safetyWarning)}</p>
              <button className="hb si-pro-btn" onClick={() => navigate("/client/search")}>
                🔍 {isHe
                  ? (diagnosed.category === "electricity" ? "מצא חשמלאי מוסמך" : "מצא בעל מקצוע")
                  : ("Find a " + (diagnosed.category === "electricity" ? "Licensed Electrician" : "Professional"))}
              </button>
            </div>
            <span className="si-msg-time">{formatTime(msg.time)}</span>
          </div>
        </div>
      );
    }

    // Regular message
    return (
      <div key={i} className={"si-msg" + (isBot ? " si-msg--bot" : "")}>
        {isBot && <div className="si-bot-avatar"><IconBot /></div>}
        <div className="si-msg-col">
          {msg.image && <img className="si-msg-img" src={msg.image} alt="uploaded" />}
          <div className="si-bubble">
            {msg.text.split("**").map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi}>{part}</strong> : <span key={pi}>{part}</span>
            )}
          </div>
          <span className="si-msg-time">{formatTime(msg.time)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="si-page" dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>

      {/* NAV */}
      <nav className="si-nav">
        <div className="si-nav-inner">
          <button className="si-back-btn" onClick={() => navigate("/client/dashboard")}><IconBack /></button>
          <div className="si-nav-mid">
            <span className="si-nav-title">Snap an Issue</span>
            <span className="si-nav-sub">AI-Powered Diagnosis</span>
          </div>
          <div className="si-nav-spacer" />
        </div>
      </nav>

      {/* CHAT AREA */}
      <div className="si-chat" ref={chatRef}>
        {messages.map((msg, i) => renderMessage(msg, i))}

        {/* Analyzing animation */}
        {analyzing && (
          <div className="si-analyzing">
            <div className="si-bot-avatar"><IconBot /></div>
            <div className="si-analyzing-bubble">
              {[0, 1, 2].map((d) => (
                /* ההשהיה שונה לכל נקודה כדי ליצור גל — לכן inline */
                <div key={d} className="si-analyzing-dot" style={{ animation: `pulse 1.2s infinite ${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick select buttons - show only at start */}
        {messages.length <= 1 && !analyzing && (
          <div className="si-quick">
            <p className="si-quick-label">Common issues:</p>
            <div className="si-quick-row">
              {ISSUE_CATEGORIES.map((cat) => (
                <button key={cat.id} className="quickBtn" onClick={() => handleQuickSelect(cat.id)}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="si-preview-wrap">
          <div className="si-preview">
            <img src={imagePreview} alt="preview" />
            <div className="si-preview-col">
              <span className="si-preview-title">Photo ready to analyze</span>
              <span className="si-preview-sub">Tap send to start diagnosis</span>
            </div>
            <button className="si-preview-x" onClick={() => { setImage(null); setImagePreview(null); }}>✕</button>
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="si-inputbar">
        <div className="si-inputbar-inner">
          {/* Camera button */}
          <button className="si-icon-btn si-icon-btn--cam" onClick={() => fileRef.current?.click()}>
            <IconCamera />
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: "none" }} />

          {/* Gallery button */}
          <button
            className="si-icon-btn si-icon-btn--gallery"
            onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.onchange = (e) => handleImageUpload(e); inp.click(); }}
          >
            <IconImage />
          </button>

          {/* Text input */}
          <div className="si-text-wrap">
            <input
              className="si-text-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") imagePreview ? handleSendImage() : handleSendText(); }}
              placeholder={isHe ? "תארו את התקלה..." : "Describe your issue..."}
            />
          </div>

          {/* Send button */}
          <button
            className={"si-send-btn" + (canSend ? " si-send-btn--on" : "")}
            onClick={() => imagePreview ? handleSendImage() : handleSendText()}
            disabled={!canSend}
          >
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}
