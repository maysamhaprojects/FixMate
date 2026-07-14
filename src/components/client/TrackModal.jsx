/* FixMate — מודל מעקב אחר הזמנה (לקוח) */
export default function TrackModal({ order, onClose, getSteps, t, dir }) {
  if (!order) return null;
  return (
    <div className="cd-modal-overlay" onClick={onClose}>
      <div className="cd-modal" onClick={(e) => e.stopPropagation()} style={{ direction: dir }}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">{t("cd_track_progress")}</h3>
          <button className="cd-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cd-modal-body">
          <div className="cd-track-summary">
            <div className="cd-order-avatar" style={{ width: 38, height: 38, fontSize: 15 }}>{order.proName.charAt(0)}</div>
            <div><h4 className="cd-order-name">{order.proName}</h4><p className="cd-order-role">{order.proRole} · {order.id}</p></div>
          </div>
          <div className="cd-timeline">
            {getSteps(order).map((step, i) => (
              <div className={`cd-timeline-step ${step.done ? "cd-timeline-step--done" : ""}`} key={i}>
                <div className="cd-timeline-dot">{step.done ? "✓" : (i + 1)}</div>
                <div className="cd-timeline-content"><p className="cd-timeline-label">{step.label}</p>{step.time && <p className="cd-timeline-time">{step.time}</p>}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cd-modal-footer"><button className="cd-modal-btn cd-modal-btn--primary" onClick={onClose}>{t("cd_close")}</button></div>
      </div>
    </div>
  );
}
