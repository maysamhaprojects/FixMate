/* FixMate — מודל הגשת תלונה (לקוח) */
export default function ComplaintModal({ open, onClose, subject, setSubject, desc, setDesc, orderId, setOrderId, orders, saving, onSubmit, t, dir, isHe }) {
  if (!open) return null;
  return (
    <div className="cd-modal-overlay" onClick={onClose}>
      <div className="cd-modal" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">{isHe ? "הגשת תלונה" : "File a Complaint"}</h3>
          <button className="cd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cd-modal-body">
          <div className="cd-modal-field">
            <label className="cd-modal-label">{isHe ? "נושא" : "Subject"}</label>
            <input type="text" className="cd-modal-input" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder={isHe ? "לדוגמה: בעל המקצוע לא הגיע" : "e.g. The professional didn't show up"} />
          </div>
          <div className="cd-modal-field">
            <label className="cd-modal-label">{isHe ? "הזמנה קשורה (אופציונלי)" : "Related order (optional)"}</label>
            <select className="cd-modal-input" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">{isHe ? "— ללא —" : "— None —"}</option>
              {orders.filter(o => o.bookingId).map(o => (
                <option key={o.bookingId} value={o.bookingId}>{o.id} · {o.proName} ({o.proRole})</option>
              ))}
            </select>
          </div>
          <div className="cd-modal-field">
            <label className="cd-modal-label">{isHe ? "פירוט התלונה" : "Description"}</label>
            <textarea className="cd-modal-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
              placeholder={isHe ? "תארי מה קרה..." : "Describe what happened..."} />
          </div>
        </div>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn--secondary" onClick={onClose} disabled={saving}>{t("cancel")}</button>
          <button className="cd-modal-btn cd-modal-btn--primary" onClick={onSubmit} disabled={saving}>
            {saving ? (isHe ? "שולח..." : "Sending...") : (isHe ? "שלח תלונה" : "Submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
