/**
 * ============================================================
 *  FixMate — מודלים של דשבורד האדמין
 *  חולצו מ-AdminDashboard: אישור/דחיית בעל מקצוע, צפייה בפרופיל,
 *  צפייה בתלונה, צפייה במשתמש, ו-Toast.
 * ============================================================
 */
import { IcoAlert } from "../AdminIcons";

/* עוזרים — מעטפת מודל וכפתור */
function Overlay({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFF", borderRadius: 24, padding: "30px", maxWidth: wide ? 520 : 400, width: "100%", animation: "popIn .22s", boxShadow: "0 24px 60px rgba(0,0,0,.2)" }}>
        {children}
      </div>
    </div>
  );
}

function MBtn({ label, onClick, bg, glow }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, padding: "13px", borderRadius: 14, border: bg ? "none" : "1.5px solid #E2E8F0", background: bg || "#FFF", color: bg ? "#FFF" : "#64748B", fontSize: 14, fontWeight: bg ? 700 : 600, cursor: "pointer", fontFamily: "inherit", boxShadow: glow ? `0 6px 18px ${glow}` : "none", transition: "all .16s" }}>
      {label}
    </button>
  );
}

export default function AdminModals({ modal, setModal, L, isHe, dir, rejectReason, setRejectReason, compResponse, setCompResponse, approvePro, rejectPro, resolveComp, toggleUser, toast }) {
  return (
    <>
      {modal?.type === "approve_pro" && (
        <Overlay onClose={() => setModal(null)}>
          <div style={{ textAlign: "center", direction: dir }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>{L("Approve this professional?", "לאשר בעל מקצוע זה?")}</h3>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}><strong>{isHe ? modal.data.nameHe : modal.data.name}</strong></p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>{isHe ? modal.data.tradeHe : modal.data.trade} · {isHe ? modal.data.cityHe : modal.data.city}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Cancel", "ביטול")} onClick={() => setModal(null)} />
              <MBtn label={L("Yes, Approve ✓", "כן, אשר ✓")} onClick={() => approvePro(modal.data.id)} bg="#059669" glow="rgba(5,150,105,.28)" />
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "reject_pro" && (
        <Overlay onClose={() => { setModal(null); setRejectReason(""); }}>
          <div style={{ direction: dir }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 46, marginBottom: 10 }}>🚫</div>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A", marginBottom: 6 }}>{L("Reject this professional?", "לדחות בעל מקצוע זה?")}</h3>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}><strong>{isHe ? modal.data.nameHe : modal.data.name}</strong></p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>{isHe ? modal.data.tradeHe : modal.data.trade} · {isHe ? modal.data.cityHe : modal.data.city}</p>
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>
              {L("Reason for rejection (required — the professional will see it)", "סיבת הדחייה (חובה — בעל המקצוע יראה אותה)")}
            </label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3}
              placeholder={isHe ? "לדוגמה: חסרים מסמכים / פרטים לא מלאים..." : "e.g. Missing documents / incomplete details..."}
              style={{ width: "100%", border: "1.5px solid #E8ECF4", borderRadius: 12, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", color: "#1A2B4A", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: rejectReason.trim() ? 18 : 6, direction: dir }} />
            {!rejectReason.trim() && (
              <p style={{ fontSize: 12, color: "#DC2626", marginBottom: 14 }}>{isHe ? "יש לכתוב סיבה כדי לדחות" : "A reason is required to reject"}</p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Cancel", "ביטול")} onClick={() => { setModal(null); setRejectReason(""); }} />
              <button
                onClick={() => rejectReason.trim() && rejectPro(modal.data.id, rejectReason)}
                disabled={!rejectReason.trim()}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#FFF", cursor: rejectReason.trim() ? "pointer" : "not-allowed", background: rejectReason.trim() ? "#DC2626" : "#E2E8F0", boxShadow: rejectReason.trim() ? "0 6px 18px rgba(220,38,38,.28)" : "none" }}>
                {L("Yes, Reject", "כן, דחה")}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_pro" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit'", fontWeight: 800, fontSize: 20 }}>
                {modal.data.avatar}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.nameHe : modal.data.name}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>{isHe ? modal.data.tradeHe : modal.data.trade} · {isHe ? modal.data.cityHe : modal.data.city}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: L("Email", "אימייל"),        val: modal.data.email },
                { label: L("Phone", "טלפון"),          val: modal.data.phone },
                { label: L("Category", "קטגוריה"),     val: isHe ? modal.data.tradeHe : modal.data.trade },
                { label: L("City", "עיר"),             val: isHe ? modal.data.cityHe : modal.data.city },
                { label: L("Price / hr", "מחיר לשעה"), val: modal.data.hourlyRate != null ? "₪" + modal.data.hourlyRate : "—" },
                { label: L("Experience", "ניסיון"),    val: isHe ? modal.data.expHe : modal.data.exp },
              ].map(r => (
                <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                </div>
              ))}
            </div>
            {modal.data.bio && (
              <div style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{L("About", "על עצמו")}</p>
                <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>{modal.data.bio}</p>
              </div>
            )}
            {/* מסמכים שהועלו — ניתן לצפייה */}
            <div style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px", marginBottom: 22 }}>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 8 }}>{L("Documents", "מסמכים")} ({modal.data.docs})</p>
              {modal.data.docFiles && modal.data.docFiles.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {modal.data.docFiles.map((d, i) => (
                    <a key={i} href={d.data} target="_blank" rel="noreferrer" download={d.name}
                      style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF", border: "1px solid #E8ECF4", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{L("View", "צפה")}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#94A3B8" }}>{L("No documents uploaded", "לא הועלו מסמכים")}</p>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Reject", "דחה")} onClick={() => { setModal({ type: "reject_pro", data: modal.data }); setRejectReason(""); }} bg="#DC2626" glow="rgba(220,38,38,.25)" />
              <MBtn label={L("Approve ✓", "אשר ✓")} onClick={() => approvePro(modal.data.id)} bg="#059669" glow="rgba(5,150,105,.28)" />
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_complaint" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoAlert /></div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.subjectHe : modal.data.subject}</h3>
                  <p style={{ fontSize: 12, color: "#94A3B8" }}>{modal.data.orderId} · {modal.data.date}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: L("From", "מ"),         val: `${isHe ? modal.data.fromHe : modal.data.from} (${isHe ? modal.data.roleHe : modal.data.role})` },
                  { label: L("Priority", "עדיפות"), val: modal.data.priority },
                  { label: L("Status", "סטטוס"),    val: modal.data.status === "open" ? L("Open", "פתוח") : L("Resolved", "טופל") },
                  { label: L("Assigned", "משוייך"),  val: modal.data.assignedTo || L("Unassigned", "לא משוייך") },
                ].map(r => (
                  <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                  </div>
                ))}
              </div>

              {/* תיאור התלונה המלא */}
              <div style={{ marginTop: 14, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{L("Complaint details", "פירוט התלונה")}</p>
                <p style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{modal.data.description || "—"}</p>
                {modal.data.email && <p style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>✉️ {modal.data.email}</p>}
              </div>

              {/* תגובת האדמין (תישלח במייל למתלונן) */}
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 6 }}>
                  {L("Response to complainant (sent by email)", "תגובה למתלונן (תישלח במייל)")}
                </p>
                <textarea value={compResponse} onChange={(e) => setCompResponse(e.target.value)} rows={3}
                  disabled={modal.data.status !== "open"}
                  placeholder={L("Write a reply to the user...", "כתוב תגובה למשתמש...")}
                  style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", color: "#1A2B4A", outline: "none", resize: "vertical", boxSizing: "border-box", background: modal.data.status !== "open" ? "#F8FAFF" : "#FFF" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Close", "סגור")} onClick={() => setModal(null)} />
              {modal.data.status === "open" && (
                <MBtn label={L("Mark Resolved ✓", "סמן כטופל ✓")} onClick={() => resolveComp(modal.data.id, compResponse)} bg="#059669" glow="rgba(5,150,105,.28)" />
              )}
            </div>
          </div>
        </Overlay>
      )}

      {modal?.type === "view_user" && (
        <Overlay onClose={() => setModal(null)} wide>
          <div style={{ direction: dir }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: modal.data.role === "pro" ? "linear-gradient(135deg,#EDE9FE,#DDD6FE)" : "linear-gradient(135deg,#DBEAFE,#BFDBFE)", color: modal.data.role === "pro" ? "#5B21B6" : "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>
                {modal.data.avatar}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800, color: "#1A2B4A" }}>{isHe ? modal.data.nameHe : modal.data.name}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8" }}>{isHe ? modal.data.roleHe : modal.data.role} · {modal.data.email}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: L("City", "עיר"),       val: isHe ? modal.data.cityHe : modal.data.city },
                { label: L("Orders", "הזמנות"),  val: modal.data.orders },
                { label: L("Member since", "מ"), val: modal.data.joined },
                { label: L("Status", "סטטוס"),   val: modal.data.status === "active" ? L("Active", "פעיל") : L("Suspended", "מושעה") },
                ...(modal.data.rating ? [{ label: L("Rating", "דירוג"), val: `⭐ ${modal.data.rating}` }] : []),
              ].map(r => (
                <div key={r.label} style={{ background: "#F8FAFF", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>{r.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>{r.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MBtn label={L("Close", "סגור")} onClick={() => setModal(null)} />
              <MBtn
                label={modal.data.status === "active" ? L("Suspend User", "השעה") : L("Restore User", "שחזר")}
                onClick={() => toggleUser(modal.data.id)}
                bg={modal.data.status === "active" ? "#EF4444" : "#059669"}
                glow={modal.data.status === "active" ? "rgba(239,68,68,.28)" : "rgba(5,150,105,.28)"}
              />
            </div>
          </div>
        </Overlay>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 600, animation: "toastIn .25s", pointerEvents: "none" }}>
          <div style={{ padding: "12px 24px", borderRadius: 22, background: toast.type === "warning" ? "#FEF3C7" : toast.type === "info" ? "#EFF6FF" : "#0F172A", color: toast.type === "warning" ? "#92400E" : toast.type === "info" ? "#1D4ED8" : "#FFF", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.18)", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}
