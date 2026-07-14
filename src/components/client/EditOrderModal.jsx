/* FixMate — מודל עריכת הזמנה (לקוח) */
export default function EditOrderModal({ order, onClose, date, setDate, time, setTime, addr, setAddr, desc, setDesc, saving, onSave, t, dir, isHe }) {
  if (!order) return null;
  return (
    <div className="cd-modal-overlay" onClick={onClose}>
      <div className="cd-modal" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">{t("cd_edit_order")}</h3>
          <button className="cd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cd-modal-body">
          <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_order_id")}</label><p className="cd-modal-value">{order.id}</p></div>
          <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_professional")}</label><p className="cd-modal-value">{order.proName} — {order.proRole}</p></div>
          <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_date")}</label><input type="date" className="cd-modal-input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_time")}</label><input type="time" className="cd-modal-input" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="cd-modal-field"><label className="cd-modal-label">{isHe ? "כתובת" : "Address"}</label><input type="text" className="cd-modal-input" value={addr} onChange={(e) => setAddr(e.target.value)} placeholder={isHe ? "רחוב, עיר" : "Street, city"} /></div>
          <div className="cd-modal-field"><label className="cd-modal-label">{t("cd_description")}</label><textarea className="cd-modal-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} /></div>
        </div>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn--secondary" onClick={onClose} disabled={saving}>{t("cancel")}</button>
          <button className="cd-modal-btn cd-modal-btn--primary" onClick={onSave} disabled={saving}>{saving ? (isHe ? "שומר..." : "Saving...") : t("cd_save_changes")}</button>
        </div>
      </div>
    </div>
  );
}
