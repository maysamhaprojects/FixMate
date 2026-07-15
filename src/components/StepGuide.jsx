/**
 * ============================================================
 *  FixMate — מדריך שלב-אחר-שלב (אקורדיון)
 *  חולץ מ-MindMap.jsx. מקבל מדריך אחד ומציג את שלביו.
 *  העיצוב ב-styles/mindMap.css.
 * ============================================================
 */
import { useState } from "react";
import { IconChevron, IconWrench } from "./GuideIcons";

export default function StepGuide({ guide, isHe, navigate }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="sg-wrap">
      {/* כותרת המדריך */}
      <div className="sg-head">
        {/* הצבע נגזר מהמדריך שנבחר — לכן inline */}
        <div className="sg-head-icon" style={{ background: `${guide.color}15` }}>{guide.icon}</div>
        <div>
          <h1 className="sg-title">{guide.title}</h1>
          <p className="sg-sub">{isHe ? "עקבו אחר השלבים לפי הסדר" : "Follow the steps in order"}</p>
        </div>
      </div>

      {/* שלבים */}
      <div className="sg-steps">
        {guide.steps.map((s, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="sg-step"
              style={{
                borderColor: isOpen ? guide.color : undefined,
                boxShadow: isOpen ? `0 6px 22px ${guide.color}1F` : undefined,
              }}
            >
              <button className="sg-step-btn" onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className="sg-step-num" style={{ background: guide.color }}>{i + 1}</span>
                <span className="sg-step-label">{s.label}</span>
                <span className="sg-step-chevron"><IconChevron open={isOpen} /></span>
              </button>
              {isOpen && (
                <div className="sg-tips">
                  {s.tips.map((tip, ti) => (
                    <div key={ti} className="sg-tip">
                      <span className="sg-tip-dot" style={{ background: guide.color }} />
                      <span className="sg-tip-text">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* עדיין תקוע? */}
      <div className="sg-cta">
        <p className="sg-cta-title">{isHe ? "עדיין תקוע?" : "Still stuck?"}</p>
        <p className="sg-cta-sub">{isHe ? "בעל מקצוע מוסמך יכול לעזור מיד" : "A licensed professional can help right away"}</p>
        <button className="sg-cta-btn" onClick={() => navigate("/client/search")}>
          <IconWrench /> {isHe ? "הזמן בעל מקצוע" : "Book a professional"}
        </button>
      </div>
    </div>
  );
}
