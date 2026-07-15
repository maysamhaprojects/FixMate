/**
 * ============================================================
 *  FixMate — הלוגיקה של מסך "צלם תקלה"
 *  הצ'אט, העלאת תמונה, ההתאמה לפי מילות מפתח, והפנייה לשרת.
 *
 *  שימוש:  const s = useSnapIssue({ isHe, L });
 * ============================================================
 */
import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../services/api";
import { AI_RESPONSES, ISSUE_CATEGORIES, CATEGORY_TO_KEY } from "../data/diyGuides";

export function useSnapIssue({ isHe, L }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: isHe
        ? "שלום! 👋 אני עוזר ה-AI של FixMate. העלו תמונה של התקלה או תארו אותה, ואנסה לעזור לכם לתקן בעצמכם!"
        : "Hi! 👋 I'm FixMate AI Assistant. Upload a photo of your issue, or select a common problem below, and I'll try to help you fix it yourself!",
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

  /* גלילה אוטומטית לתחתית הצ'אט */
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

  /* אחרי אבחון — מציגים מדריך עצמי או המלצה לבעל מקצוע */
  const showResult = async (response, delay = 500) => {
    if (response.canDIY) await addBotMessage("diy_guide", delay);
    else await addBotMessage("need_pro", delay);
  };

  const diagnosisLine = (response) =>
    `🎯 **${isHe ? "אבחון" : "Diagnosis"}: ${L(response.diagnosis)}**\n\n${L(response.description)}`;

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
    await addBotMessage(isHe ? "📸 מנתח את התמונה..." : "📸 Analyzing your photo...", 1000);
    await addBotMessage(isHe ? "🔍 מזהה את סוג התקלה..." : "🔍 Detecting issue type...", 1500);

    // Random diagnosis for demo
    const keys = Object.keys(AI_RESPONSES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const response = AI_RESPONSES[randomKey];

    setAnalyzing(false);
    setDiagnosed(response);

    await addBotMessage(diagnosisLine(response), 1000);
    await showResult(response);
  };

  const handleQuickSelect = async (issueId) => {
    const issue = ISSUE_CATEGORIES.find((c) => c.id === issueId);
    const response = AI_RESPONSES[issueId];

    setMessages((prev) => [
      ...prev,
      { from: "user", text: `${issue.icon} ${issue.label}`, time: new Date() },
    ]);

    setAnalyzing(true);
    await addBotMessage(isHe ? "🔍 בודק מה אפשר לעשות..." : "🔍 Let me check what I can do for you...", 1000);

    setAnalyzing(false);
    setDiagnosed(response);

    await addBotMessage(diagnosisLine(response), 800);
    await showResult(response);
  };

  const handleSendText = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text, time: new Date() }]);

    setAnalyzing(true);
    await addBotMessage(isHe ? "רגע, אני חושב על זה... 🤔" : "Let me think about that... 🤔", 1000);

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
      await addBotMessage(diagnosisLine(response), 500);
      await showResult(response);
      return;
    }

    // התאמה מקומית נכשלה — פונים לשרת (תומך גם בעברית וגם באנגלית)
    try {
      const res = await apiFetch("/api/snap/analyze", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const key = CATEGORY_TO_KEY[data.category];
      if (key && AI_RESPONSES[key]) {
        const response = AI_RESPONSES[key];
        setDiagnosed(response);
        await addBotMessage(diagnosisLine(response), 500);
        await showResult(response);
      } else {
        // קטגוריה כללית — מציגים את האבחון הבסיסי מהשרת
        setDiagnosed({
          diagnosis: data.diagnosis,
          category: data.category,
          canDIY: false,
          safetyWarning: (data.diagnosis || "") + " — " + (data.estimatedCost || ""),
        });
        await addBotMessage(`🎯 **${isHe ? "אבחון" : "Diagnosis"}: ${data.diagnosis}**\n\n💰 ${data.estimatedCost}`, 500);
        await addBotMessage("need_pro", 500);
      }
    } catch (e) {
      await addBotMessage(
        isHe
          ? "לא הצלחתי לנתח את זה כרגע. נסו להעלות תמונה או לבחור תקלה נפוצה למטה. 📷"
          : "I couldn't analyze that right now. Try uploading a photo or picking a common issue below. 📷",
        500
      );
    }
  };

  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return {
    messages,
    input, setInput,
    image, imagePreview, setImagePreview, setImage,
    analyzing, diagnosed,
    fileRef, chatRef, inputRef,
    handleImageUpload, handleSendImage, handleQuickSelect, handleSendText,
    formatTime,
  };
}
