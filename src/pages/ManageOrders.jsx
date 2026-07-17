/**
 * =============================================
 *  FixMate – Manage Orders v2
 * =============================================
 *  ROUTE: /pro/orders
 *  FILE:  src/pages/ManageOrders.jsx
 *
 *  עיצוב: כרטיסים צבעוניים לפי סטטוס, Light theme
 *  כל כרטיס מקבל צבע רקע + border עליון בולט לפי הסטטוס שלו
 *
 *  אייקונים → components/OrderIcons.jsx
 *  לוגיקה   → hooks/useProOrders.js
 *  קבועים   → data/orderConstants.jsx
 *  עיצוב    → styles/manageOrders.css
 *
 *  🚩 BACKEND NOTE:
 *     - טעינת הזמנות  ← GET  /api/pro/orders
 *     - עדכון סטטוס   ← PUT  /api/pro/orders/:id/status
 * =============================================
 */

import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";
import { useProOrders } from "../hooks/useProOrders";
import { STATUS_STYLE, getActions, MODAL_CFG, FILTERS } from "../data/orderConstants";
import { IconWrench } from "../components/ProIcons";
import { IconBack, IconSearch, IconCal, IconPin, IconPhone } from "../components/OrderIcons";
import "../styles/manageOrders.css";

export default function ManageOrders() {
  const navigate = useNavigate();
  const lang = getLang();
  const dir  = getDir();
  const isHe = lang === "he";
  const L = (obj) => obj && typeof obj === "object" ? (obj[lang] ?? obj.en ?? "") : (obj ?? "");

  /* כל הלוגיקה מגיעה מ-hooks/useProOrders.js */
  const {
    mounted,
    filtered, count,
    activeFilter, setActiveFilter,
    search, setSearch,
    modal, setModal,
    finalPrice, setFinalPrice,
    priceRange, priceError,
    doAction,
  } = useProOrders({ L });

  return (
    <div className="mo-page" dir={dir} style={{
      fontFamily: isHe ? "'Heebo','DM Sans',sans-serif" : "'DM Sans',sans-serif",
      opacity: mounted ? 1 : 0,
    }}>

      {/* ══ NAVBAR ══ */}
      <nav className="mo-nav">
        <div className="mo-nav-inner">
          <div className="mo-logo">
            <div className="mo-logo-badge"><IconWrench /></div>
            <span className="mo-logo-text">Fix<b>Mate</b> <span className="mo-logo-tag">Pro</span></span>
          </div>
          <button className="flt-btn mo-back-btn" onClick={() => navigate("/pro/dashboard")}>
            <IconBack /> {isHe ? "חזרה לדשבורד" : "Back to Dashboard"}
          </button>
        </div>
      </nav>

      {/* ══ MAIN ══ */}
      <main className="mo-main">

        {/* כותרת + חיפוש */}
        <div className="top-row">
          <div>
            <h1 className="mo-title">{isHe ? "ניהול הזמנות" : "Manage Orders"}</h1>
            <p className="mo-subtitle">{filtered.length} {isHe ? "הזמנות" : "orders"}</p>
          </div>
          <div className="mo-search-wrap">
            <span className="mo-search-ico"><IconSearch /></span>
            <input
              className="mo-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isHe ? "חיפוש..." : "Search..."}
            />
          </div>
        </div>

        {/* ── פילטרים ── */}
        <div className="mo-filters">
          {FILTERS.map(f => {
            const active = activeFilter === f.id;
            const st = f.id !== "all" ? STATUS_STYLE[f.id] : null;
            const n  = count(f.id);
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={"flt-btn" + (active ? " flt-btn--active" : "")}
                /* הצבע נגזר מהסטטוס שנבחר — לכן נשאר inline */
                style={active ? {
                  background: st ? st.topBar : "#1A2B4A",
                  boxShadow: `0 4px 14px ${st ? st.topBar + "55" : "rgba(26,43,74,.3)"}`,
                } : undefined}
              >
                {st && <span className="mo-flt-dot" style={{ background: active ? "rgba(255,255,255,.8)" : st.dot }} />}
                {L(f.label)}
                {n > 0 && <span className="mo-flt-count">{n}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Grid כרטיסים ── */}
        {filtered.length === 0 ? (
          <div className="mo-empty">
            <div className="mo-empty-emoji">📭</div>
            <p className="mo-empty-title">{isHe ? "אין הזמנות" : "No orders found"}</p>
            <p className="mo-empty-sub">{isHe ? "נסי פילטר אחר" : "Try a different filter"}</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((order, idx) => {
              const st      = STATUS_STYLE[order.status];
              const actions = getActions(order.status);
              return (
                <div key={order.id} className="order-card"
                  style={{ background: st.cardBg, animation: `fadeUp ${.35 + idx * .05}s` }}>

                  {/* פס צבעוני עליון לפי סטטוס */}
                  <div className="mo-card-bar" style={{ background: st.topBar }} />

                  <div className="mo-card-body">

                    {/* שורה עליונה: אווטאר + שם + תג סטטוס */}
                    <div className="mo-card-top">
                      <div className="mo-card-who">
                        {/* ראשית שם — הצבע נגזר מהסטטוס */}
                        <div className="mo-avatar" style={{ border: `2px solid ${st.topBar}33`, color: st.topBar, boxShadow: `0 2px 8px ${st.topBar}22` }}>
                          {L(order.clientName).charAt(0)}
                        </div>
                        <div>
                          <p className="mo-client">{L(order.clientName)}</p>
                          <p className="mo-order-id">{order.id}</p>
                        </div>
                      </div>

                      {/* תג סטטוס */}
                      <span className="mo-tag" style={{ color: st.tagColor, background: st.tagBg, border: `1px solid ${st.tagBorder}` }}>
                        <span className="mo-tag-dot" style={{ background: st.dot }} />
                        <st.Icon /> {L(st.label)}
                      </span>
                    </div>

                    {/* שירות + תיאור */}
                    <p className="mo-service">{L(order.service)}</p>
                    <p className="mo-desc">{L(order.description)}</p>

                    {/* סיבת ביטול — מוצג רק בהזמנות מבוטלות שיש להן סיבה */}
                    {order.status === "cancelled" && order.cancellationReason && (
                      <div className="mo-cancel-box">
                        <span className="mo-cancel-label">{isHe ? "סיבת הביטול:" : "Cancel reason:"}</span>
                        <span className="mo-cancel-text">{order.cancellationReason}</span>
                      </div>
                    )}

                    {/* מטא-דאטה */}
                    <div className="mo-meta">
                      <span className="mo-meta-item"><IconCal /> {L(order.date)}, {order.time}</span>
                      <span className="mo-meta-item"><IconPin /> {L(order.location)}</span>
                      {/* מחיר: מוצג רק בהזמנה שהושלמה עם מחיר. עד הסיום — "ייקבע בסיום" */}
                      {order.status === "done" && order.price != null && order.price > 0
                        ? <span className="mo-price">₪{order.price}</span>
                        : order.status === "done"
                          ? <span className="mo-price-pending">—</span>
                          : <span className="mo-price-pending">{isHe ? "המחיר ייקבע בסיום" : "Price set on completion"}</span>}
                    </div>

                    {/* שורה תחתונה: חיוג + כפתורי פעולה */}
                    <div className="mo-card-foot">
                      <button className="mo-call-btn" onClick={() => window.open(`tel:${order.phone}`)}>
                        <IconPhone /> {order.phone}
                      </button>

                      {/* כפתורי פעולה קומפקטיים */}
                      <div className="mo-actions">
                        {actions.length > 0 ? actions.map(a => (
                          <button
                            key={a.id}
                            className="act-btn"
                            onClick={() => setModal({ order, actionId: a.id })}
                            /* צבע הכפתור מוגדר בקבועים לפי הפעולה */
                            style={{ border: a.border ?? "none", background: a.bg, color: a.color, boxShadow: a.glow ? `0 4px 12px ${a.glow}` : "none" }}
                          >
                            {a.icon} {L(a.label)}
                          </button>
                        )) : (
                          <span className="mo-done-note">
                            {order.status === "done"      && (isHe ? "✅ הושלם" : "✅ Completed")}
                            {order.status === "cancelled" && (isHe ? "❌ בוטל"  : "❌ Cancelled")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══ MODAL אישור פעולה ══ */}
      {modal && (() => {
        const cfg = MODAL_CFG[modal.actionId];
        return (
          <div className="mo-overlay" onClick={() => setModal(null)}>
            <div className="mo-modal" onClick={e => e.stopPropagation()}>
              <div className="mo-modal-emoji">{cfg.emoji}</div>
              <h3 className="mo-modal-title">{L(cfg.title)}</h3>
              <p className="mo-modal-line"><strong>{L(modal.order.clientName)}</strong> — {L(modal.order.service)}</p>
              <p className="mo-modal-when">{L(modal.order.date)}, {modal.order.time}</p>

              {/* בסיום העבודה — בעל המקצוע קובע את המחיר הסופי (בתוך הטווח שהבטיח) */}
              {modal.actionId === "finish" && (
                <div className="mo-price-field">
                  <label className="mo-price-label">{isHe ? "מה המחיר הסופי של העבודה?" : "What's the final price for this job?"}</label>
                  <div className={"mo-price-input-wrap" + (priceError ? " mo-price-input-wrap--err" : "")}>
                    <span className="mo-price-shekel">₪</span>
                    <input
                      className="mo-price-input"
                      type="number"
                      min="0"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      placeholder="0"
                      autoFocus
                    />
                  </div>
                  {/* מציגים את הטווח שבעל המקצוע הבטיח, אם הוגדר */}
                  {(priceRange.min != null || priceRange.max != null) && (
                    <p className="mo-price-range-note">
                      {isHe ? "הטווח שהגדרת: " : "Your range: "}
                      ₪{priceRange.min ?? 0}{priceRange.max != null ? "–₪" + priceRange.max : "+"}
                    </p>
                  )}
                  {priceError ? (
                    <p className="mo-price-err">
                      {priceError.kind === "above"
                        ? (isHe ? `המחיר גבוה מהטווח שהבטחת (עד ₪${priceError.max}). כדי לגבות יותר — עדכן/י את הטווח בפרופיל.`
                                : `Above your promised range (up to ₪${priceError.max}). To charge more, update your range in the profile.`)
                        : (isHe ? `המחיר נמוך מהטווח שהבטחת (מ-₪${priceError.min}).`
                                : `Below your promised range (from ₪${priceError.min}).`)}
                    </p>
                  ) : (
                    <p className="mo-price-hint">{isHe ? "הלקוח יראה את הסכום הזה כמחיר לתשלום" : "The client will see this as the amount to pay"}</p>
                  )}
                </div>
              )}

              <div className="mo-modal-btns">
                <button className="mo-modal-cancel" onClick={() => setModal(null)}>
                  {isHe ? "ביטול" : "Cancel"}
                </button>
                <button
                  className="mo-modal-ok"
                  onClick={() => doAction(modal.order.id, modal.actionId)}
                  disabled={modal.actionId === "finish" && (finalPrice === "" || !!priceError)}
                  style={{ background: cfg.btnBg, boxShadow: `0 6px 20px ${cfg.glow}` }}
                >
                  {L(cfg.btn)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
