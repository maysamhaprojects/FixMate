/* FixMate — הודעת Toast פנימית (כללית) */
export default function Toast({ toast, dir }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, insetInlineStart: "50%", transform: "translateX(-50%)", zIndex: 2000, direction: dir,
      display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", borderRadius: 14,
      background: toast.type === "error" ? "#FEF2F2" : "#ECFDF5", border: "1px solid " + (toast.type === "error" ? "#FECACA" : "#A7F3D0"),
      color: toast.type === "error" ? "#B91C1C" : "#065F46", boxShadow: "0 8px 30px rgba(15,23,42,.14)", fontSize: 14, fontWeight: 600, maxWidth: "90vw", animation: "cdFadeIn .2s ease" }}>
      <span style={{ fontSize: 16 }}>{toast.type === "error" ? "⚠️" : "✓"}</span>
      <span>{toast.msg}</span>
    </div>
  );
}
