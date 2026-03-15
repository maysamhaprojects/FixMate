import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IconBack = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const IconCamera = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconSend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconImage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconBot = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
const IconTool = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

/* Simulated AI responses based on issue category */
const AI_RESPONSES = {
  leaky_faucet: {
    diagnosis: "Leaky Faucet / Dripping Tap",
    severity: "low",
    canDIY: true,
    description: "I can see a dripping faucet. This is usually caused by a worn-out washer or O-ring. Good news — this is a common DIY fix!",
    steps: [
      "Turn off the water supply valves under the sink",
      "Remove the faucet handle (usually a screw under the cap)",
      "Pull out the old cartridge or stem",
      "Replace the rubber washer or O-ring (take the old one to the hardware store to match size)",
      "Reassemble in reverse order",
      "Turn water back on and test",
    ],
    tools: ["Adjustable wrench", "Screwdriver", "Replacement washer/O-ring"],
    estimatedTime: "20-30 minutes",
    estimatedCost: "₪10-30 for parts",
  },
  clogged_drain: {
    diagnosis: "Clogged / Slow Drain",
    severity: "low",
    canDIY: true,
    description: "Looks like a clogged drain. Before calling a plumber, try these simple steps that work in most cases.",
    steps: [
      "Remove the drain cover and clear any visible debris",
      "Pour boiling water down the drain (carefully!)",
      "If still slow: pour ½ cup baking soda, then ½ cup vinegar",
      "Wait 30 minutes, then flush with hot water",
      "If still blocked: use a plunger with firm up-down motions",
      "For stubborn clogs: try a drain snake (available at hardware stores)",
    ],
    tools: ["Plunger", "Baking soda + vinegar", "Drain snake (optional)"],
    estimatedTime: "15-45 minutes",
    estimatedCost: "₪0-40",
  },
  broken_socket: {
    diagnosis: "Damaged Electrical Socket",
    severity: "high",
    canDIY: false,
    description: "I can see a damaged electrical socket. This involves electrical wiring and can be dangerous. I strongly recommend hiring a licensed electrician for this repair.",
    safetyWarning: "Working with electrical wiring without proper training can cause electrocution or fire. Please do not attempt this yourself.",
    category: "electricity",
  },
  wall_crack: {
    diagnosis: "Wall Crack / Plaster Damage",
    severity: "medium",
    canDIY: true,
    description: "I can see a crack in the wall/plaster. Small cracks (under 5mm) are usually cosmetic and easy to fix yourself. Larger cracks may indicate structural issues.",
    steps: [
      "Clean the crack — remove loose plaster with a scraper",
      "Widen the crack slightly to a V-shape for better adhesion",
      "Dampen the area with a spray bottle",
      "Apply filler/spackle with a putty knife, pressing firmly into the crack",
      "Let dry completely (check product instructions, usually 2-4 hours)",
      "Sand smooth with fine sandpaper (120-150 grit)",
      "Prime and paint to match the wall",
    ],
    tools: ["Putty knife", "Spackle/wall filler", "Sandpaper", "Paint"],
    estimatedTime: "1-2 hours (plus drying time)",
    estimatedCost: "₪20-50",
  },
  running_toilet: {
    diagnosis: "Running / Leaking Toilet",
    severity: "low",
    canDIY: true,
    description: "A running toilet usually means the flapper valve needs replacement. This is one of the easiest plumbing fixes!",
    steps: [
      "Remove the toilet tank lid",
      "Check if the flapper (rubber seal at bottom) is worn or warped",
      "Turn off water supply valve behind the toilet",
      "Flush to empty the tank",
      "Unhook the old flapper and replace with a new one (universal fit)",
      "Turn water back on and test",
    ],
    tools: ["Replacement flapper valve", "No tools needed!"],
    estimatedTime: "10-15 minutes",
    estimatedCost: "₪15-30",
  },
  ac_not_cooling: {
    diagnosis: "AC Not Cooling Properly",
    severity: "medium",
    canDIY: true,
    description: "Before calling a technician, there are a few things you can check yourself that solve most AC cooling issues.",
    steps: [
      "Check that the AC is set to COOL mode (not FAN or DRY)",
      "Lower the temperature setting to at least 3°C below room temperature",
      "Clean or replace the air filters — pull out the front filters and wash with water",
      "Check that the outdoor unit is not blocked by debris or plants",
      "Make sure all windows and doors are closed",
      "If still not cooling after cleaning filters, it may need a gas refill — call a technician",
    ],
    tools: ["Water and mild soap for filter cleaning"],
    estimatedTime: "15-20 minutes for filter cleaning",
    estimatedCost: "₪0 (free if filters are the issue)",
  },
};

const ISSUE_CATEGORIES = [
  { id: "leaky_faucet", label: "Leaky Faucet", icon: "🚰" },
  { id: "clogged_drain", label: "Clogged Drain", icon: "🔧" },
  { id: "broken_socket", label: "Broken Socket", icon: "⚡" },
  { id: "wall_crack", label: "Wall Crack", icon: "🧱" },
  { id: "running_toilet", label: "Running Toilet", icon: "🚽" },
  { id: "ac_not_cooling", label: "AC Not Cooling", icon: "❄️" },
];

export default function SnapAnIssue() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 I'm FixMate AI Assistant. Upload a photo of your issue, or select a common problem below, and I'll try to help you fix it yourself!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosed, setDiagnosed] = useState(null);
  const fileRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, analyzing]);

  const addBotMessage = (text, delay = 800) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text, time: new Date() }]);
        resolve();
      }, delay);
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSendImage = async () => {
    if (!imagePreview) return;

    // Add user message with image
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "📷 Photo uploaded", image: imagePreview, time: new Date() },
    ]);
    setImage(null);
    setImagePreview(null);
    setAnalyzing(true);

    // Simulate AI analysis
    await addBotMessage("📸 Analyzing your photo...", 1000);
    await addBotMessage("🔍 Detecting issue type...", 1500);

    // Random diagnosis for demo
    const keys = Object.keys(AI_RESPONSES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const response = AI_RESPONSES[randomKey];

    setAnalyzing(false);
    setDiagnosed(response);

    await addBotMessage(`🎯 **Diagnosis: ${response.diagnosis}**\n\n${response.description}`, 1000);

    if (response.canDIY) {
      await addBotMessage("diy_guide", 500);
    } else {
      await addBotMessage("need_pro", 500);
    }
  };

  const handleQuickSelect = async (issueId) => {
    const issue = ISSUE_CATEGORIES.find((c) => c.id === issueId);
    const response = AI_RESPONSES[issueId];

    setMessages((prev) => [
      ...prev,
      { from: "user", text: `${issue.icon} ${issue.label}`, time: new Date() },
    ]);

    setAnalyzing(true);
    await addBotMessage("🔍 Let me check what I can do for you...", 1000);

    setAnalyzing(false);
    setDiagnosed(response);

    await addBotMessage(`🎯 **Diagnosis: ${response.diagnosis}**\n\n${response.description}`, 800);

    if (response.canDIY) {
      await addBotMessage("diy_guide", 500);
    } else {
      await addBotMessage("need_pro", 500);
    }
  };

  const handleSendText = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text, time: new Date() }]);

    setAnalyzing(true);
    await addBotMessage("Let me think about that... 🤔", 1000);

    // Simple keyword matching for demo
    const lower = text.toLowerCase();
    let matchKey = null;
    if (lower.includes("faucet") || lower.includes("drip") || lower.includes("tap")) matchKey = "leaky_faucet";
    else if (lower.includes("drain") || lower.includes("clog") || lower.includes("block")) matchKey = "clogged_drain";
    else if (lower.includes("socket") || lower.includes("electric") || lower.includes("outlet")) matchKey = "broken_socket";
    else if (lower.includes("crack") || lower.includes("wall") || lower.includes("plaster")) matchKey = "wall_crack";
    else if (lower.includes("toilet") || lower.includes("running") || lower.includes("flush")) matchKey = "running_toilet";
    else if (lower.includes("ac") || lower.includes("cool") || lower.includes("air")) matchKey = "ac_not_cooling";

    setAnalyzing(false);

    if (matchKey) {
      const response = AI_RESPONSES[matchKey];
      setDiagnosed(response);
      await addBotMessage(`🎯 **Diagnosis: ${response.diagnosis}**\n\n${response.description}`, 500);
      if (response.canDIY) {
        await addBotMessage("diy_guide", 500);
      } else {
        await addBotMessage("need_pro", 500);
      }
    } else {
      await addBotMessage("I'm not sure about that specific issue. Try uploading a photo or selecting one of the common problems below for better results! 📷", 500);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const renderMessage = (msg, i) => {
    const isBot = msg.from === "bot";

    // Special DIY guide card
    if (msg.text === "diy_guide" && diagnosed?.canDIY) {
      return (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, animation: "fadeUp .4s" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconBot /></div>
          <div style={{ flex: 1, maxWidth: 380 }}>
            {/* DIY Guide Card */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 18, padding: "20px 18px", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🛠️</span>
                <span style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#166534" }}>DIY Fix Guide</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#FFF", background: "#16A34A", padding: "3px 10px", borderRadius: 20 }}>You can fix this!</span>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {diagnosed.steps.map((step, si) => (
                  <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{si + 1}</div>
                    <span style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Tools needed */}
              <div style={{ background: "#FFF", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ color: "#2563EB", display: "flex" }}><IconTool /></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>Tools Needed</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {diagnosed.tools.map((t, ti) => (
                    <span key={ti} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: "#EEF2FF", color: "#3B5BDB", fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Time + Cost */}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "#FFF", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#7C8DB5", marginBottom: 2 }}>⏱️ Est. Time</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>{diagnosed.estimatedTime}</div>
                </div>
                <div style={{ flex: 1, background: "#FFF", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#7C8DB5", marginBottom: 2 }}>💰 Est. Cost</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{diagnosed.estimatedCost}</div>
                </div>
              </div>
            </div>

            {/* Still need help? */}
            <div style={{ background: "#FFF", border: "1px solid #E8ECF4", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#4A5568" }}>Still need help?</span>
              <button onClick={() => navigate("/client/search")} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                📅 Book a Pro
              </button>
            </div>

            <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block" }}>{formatTime(msg.time)}</span>
          </div>
        </div>
      );
    }

    // Special "need a pro" card
    if (msg.text === "need_pro" && diagnosed && !diagnosed.canDIY) {
      return (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, animation: "fadeUp .4s" }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconBot /></div>
          <div style={{ flex: 1, maxWidth: 380 }}>
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 18, padding: "20px 18px", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#DC2626", display: "flex" }}><IconAlert /></span>
                <span style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#991B1B" }}>Professional Required</span>
              </div>
              <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, marginBottom: 14 }}>
                {diagnosed.safetyWarning}
              </p>
              <button onClick={() => navigate("/client/search")} className="hb" style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit'", boxShadow: "0 6px 24px rgba(37,99,235,.3)" }}>
                🔍 Find a {diagnosed.category === "electricity" ? "Licensed Electrician" : "Professional"}
              </button>
            </div>
            <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block" }}>{formatTime(msg.time)}</span>
          </div>
        </div>
      );
    }

    // Regular message
    return (
      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, flexDirection: isBot ? "row" : "row-reverse", animation: "fadeUp .3s" }}>
        {isBot && (
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconBot /></div>
        )}
        <div style={{ maxWidth: 340 }}>
          {msg.image && (
            <img src={msg.image} alt="uploaded" style={{ width: "100%", maxWidth: 240, borderRadius: 16, marginBottom: 6, border: "2px solid #E8ECF4" }} />
          )}
          <div style={{
            background: isBot ? "#F0F4FF" : "linear-gradient(135deg,#2563EB,#1D4ED8)",
            color: isBot ? "#1A2B4A" : "#FFF",
            padding: "12px 16px",
            borderRadius: isBot ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}>
            {msg.text.split("**").map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi}>{part}</strong> : <span key={pi}>{part}</span>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, display: "block", textAlign: isBot ? "left" : "right" }}>{formatTime(msg.time)}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", background: "linear-gradient(135deg,#F0F4FF 0%,#F8FAFF 50%,#FFF 100%)", height: "100vh", display: "flex", flexDirection: "column", direction: "ltr", textAlign: "left" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .hb:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-1px)}
        .quickBtn:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(37,99,235,.12);border-color:#93B4F5!important}
        *{box-sizing:border-box;margin:0}
        input::placeholder,textarea::placeholder{color:#94A3B8}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E8ECF4", boxShadow: "0 1px 12px rgba(0,0,0,.04)", flexShrink: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
          <button onClick={() => navigate("/client/dashboard")} style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F4FF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#5A6B8A", cursor: "pointer" }}><IconBack /></button>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 700, color: "#1A2B4A", display: "block" }}>Snap an Issue</span>
            <span style={{ fontSize: 12, color: "#7C8DB5" }}>AI-Powered Diagnosis</span>
          </div>
          <div style={{ width: 40 }} />
        </div>
      </nav>

      {/* CHAT AREA */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {messages.map((msg, i) => renderMessage(msg, i))}

        {/* Analyzing animation */}
        {analyzing && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconBot /></div>
            <div style={{ background: "#F0F4FF", padding: "14px 20px", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 6 }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", animation: `pulse 1.2s infinite ${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick select buttons - show only at start */}
        {messages.length <= 1 && !analyzing && (
          <div style={{ animation: "fadeUp .5s", marginTop: 8 }}>
            <p style={{ fontSize: 13, color: "#7C8DB5", marginBottom: 12 }}>Common issues:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ISSUE_CATEGORIES.map((cat) => (
                <button key={cat.id} className="quickBtn" onClick={() => handleQuickSelect(cat.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "2px solid #EEF1F8", background: "#FFF", fontSize: 13, fontWeight: 500, color: "#4A5568", cursor: "pointer", transition: "all .2s" }}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div style={{ padding: "12px 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F8FAFF", borderRadius: 16, padding: "12px 16px", border: "1px solid #E8ECF4" }}>
            <img src={imagePreview} alt="preview" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>Photo ready to analyze</span>
              <span style={{ fontSize: 12, color: "#7C8DB5", display: "block" }}>Tap send to start diagnosis</span>
            </div>
            <button onClick={() => { setImage(null); setImagePreview(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 18 }}>✕</button>
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div style={{ flexShrink: 0, background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #E8ECF4", padding: "14px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* Camera button */}
          <button onClick={() => fileRef.current?.click()}
            style={{ width: 46, height: 46, borderRadius: 14, border: "2px solid #EEF1F8", background: "#FFF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}>
            <IconCamera />
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: "none" }} />

          {/* Gallery button */}
          <button onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.onchange = (e) => handleImageUpload(e); inp.click(); }}
            style={{ width: 46, height: 46, borderRadius: 14, border: "2px solid #EEF1F8", background: "#FFF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}>
            <IconImage />
          </button>

          {/* Text input */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F8FAFF", borderRadius: 14, border: "2px solid #EEF1F8", padding: "0 16px", transition: "all .25s" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") imagePreview ? handleSendImage() : handleSendText(); }}
              placeholder="Describe your issue..."
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: "'DM Sans'", color: "#1A2B4A", padding: "13px 0" }}
            />
          </div>

          {/* Send button */}
          <button onClick={() => imagePreview ? handleSendImage() : handleSendText()}
            disabled={!input.trim() && !imagePreview}
            style={{ width: 46, height: 46, borderRadius: 14, border: "none", background: (input.trim() || imagePreview) ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "#E2E8F0", color: (input.trim() || imagePreview) ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", cursor: (input.trim() || imagePreview) ? "pointer" : "not-allowed", flexShrink: 0, transition: "all .2s", boxShadow: (input.trim() || imagePreview) ? "0 4px 16px rgba(37,99,235,.3)" : "none" }}>
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  );
}