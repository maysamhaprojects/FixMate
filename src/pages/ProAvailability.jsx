/**
 * =============================================
 *  FixMate – Manage Availability v2
 * =============================================
 *  ROUTE: /pro/availability
 *  FILE:  src/pages/ProAvailability.jsx
 *
 *  🚩 BACKEND NOTE:
 *     GET    /api/pro/slots?month=YYYY-MM
 *     POST   /api/pro/slots        { date, startTime, endTime }
 *     DELETE /api/pro/slots/:id
 *     POST   /api/pro/blocked-days { date }
 *     DELETE /api/pro/blocked-days/:date
 *     POST   /api/pro/slots/copy-week { sourceWeekStart, targetWeekStart }
 * =============================================
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLang, getDir } from "../context/LanguageContext";

/* ─── tiny helpers ─── */
const pad  = (n) => String(n).padStart(2, "0");
const fmt  = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today = fmt(new Date());

/* ─── icons ─── */
const Ico = ({ d, s = 18, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);
const IcoBack     = () => <Ico s={17} d={<polyline points="15 18 9 12 15 6"/>}/>;
const IcoLeft     = () => <Ico s={16} d={<polyline points="15 18 9 12 15 6"/>}/>;
const IcoRight    = () => <Ico s={16} d={<polyline points="9 18 15 12 9 6"/>}/>;
const IcoPlus     = () => <Ico s={15} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>;
const IcoTrash    = () => <Ico s={14} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>}/>;
const IcoClock    = () => <Ico s={13} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const IcoBlock    = () => <Ico s={15} d={<><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>}/>;
const IcoCheck    = () => <Ico s={13} d={<polyline points="20 6 9 17 4 12"/>}/>;
const IcoUser     = () => <Ico s={13} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const IcoCopy     = () => <Ico s={14} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>}/>;
const IcoWrench   = () => <Ico s={19} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>;
const IcoSun      = () => <Ico s={14} d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>}/>;

/* ── Mock Data ── */
const t0 = new Date();
const MOCK_SLOTS = {
  [fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()))]: [
    { id:"s1", startTime:"09:00", endTime:"10:00", booked:true,  clientName:"Sarah Cohen"   },
    { id:"s2", startTime:"11:00", endTime:"12:00", booked:false, clientName:null            },
    { id:"s3", startTime:"14:00", endTime:"15:30", booked:true,  clientName:"Amit Levy"     },
    { id:"s4", startTime:"16:00", endTime:"17:00", booked:false, clientName:null            },
  ],
  [fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()+1))]: [
    { id:"s5", startTime:"10:00", endTime:"11:00", booked:false, clientName:null },
    { id:"s6", startTime:"13:00", endTime:"14:00", booked:false, clientName:null },
  ],
  [fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()+3))]: [
    { id:"s7", startTime:"09:00", endTime:"10:30", booked:true, clientName:"Rina Goldberg" },
  ],
  [fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()+5))]: [
    { id:"s8", startTime:"15:00", endTime:"16:00", booked:false, clientName:null },
  ],
};
const MOCK_BLOCKED = [
  fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()+2)),
  fmt(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()+7)),
];

/* ── Quick-slot presets ── */
const PRESETS_EN = [
  { label:"Morning",   slots:[{s:"08:00",e:"09:00"},{s:"09:00",e:"10:00"},{s:"10:00",e:"11:00"}] },
  { label:"Afternoon", slots:[{s:"13:00",e:"14:00"},{s:"14:00",e:"15:00"},{s:"15:00",e:"16:00"}] },
  { label:"Full Day",  slots:[{s:"08:00",e:"09:00"},{s:"09:00",e:"10:00"},{s:"10:00",e:"11:00"},{s:"12:00",e:"13:00"},{s:"13:00",e:"14:00"},{s:"14:00",e:"15:00"},{s:"15:00",e:"16:00"}] },
];
const PRESETS_HE = [
  { label:"בוקר",      slots:[{s:"08:00",e:"09:00"},{s:"09:00",e:"10:00"},{s:"10:00",e:"11:00"}] },
  { label:"אחה\"צ",    slots:[{s:"13:00",e:"14:00"},{s:"14:00",e:"15:00"},{s:"15:00",e:"16:00"}] },
  { label:"יום מלא",   slots:[{s:"08:00",e:"09:00"},{s:"09:00",e:"10:00"},{s:"10:00",e:"11:00"},{s:"12:00",e:"13:00"},{s:"13:00",e:"14:00"},{s:"14:00",e:"15:00"},{s:"15:00",e:"16:00"}] },
];

const HOURS = Array.from({length:14},(_,i)=>i+7).flatMap(h=>[`${pad(h)}:00`,`${pad(h)}:30`]);

/* ════════════════════════════════════
   Component
════════════════════════════════════ */
export default function ProAvailability() {
  const navigate    = useNavigate();
  const lang        = getLang();
  const dir         = getDir();
  const isHe        = lang === "he";
  const L = (en,he) => isHe ? he : en;

  const [mounted,        setMounted       ] = useState(false);
  const [viewMonth,      setViewMonth     ] = useState(new Date(t0.getFullYear(), t0.getMonth(), 1));
  const [selectedDate,   setSelectedDate  ] = useState(today);
  const [slots,          setSlots         ] = useState(MOCK_SLOTS);
  const [blocked,        setBlocked       ] = useState(MOCK_BLOCKED);
  const [modal,          setModal         ] = useState(null); // "add" | "delete" | "block" | "preset" | "copy"
  const [delTarget,      setDelTarget     ] = useState(null);
  const [newStart,       setNewStart      ] = useState("09:00");
  const [newEnd,         setNewEnd        ] = useState("10:00");
  const [formErr,        setFormErr       ] = useState("");
  const [toast,          setToast         ] = useState(null);
  const toastRef = useRef(null);

  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),40); return ()=>clearTimeout(t); },[]);

  /* toast helper */
  const showToast = (msg, type="success") => {
    setToast({msg,type});
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(null), 2800);
  };

  /* ── calendar ── */
  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDow    = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();

  const DAYS_SHORT = isHe ? ["א","ב","ג","ד","ה","ו","ש"] : ["S","M","T","W","T","F","S"];
  const MONTHS     = isHe
    ? ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];

  /* day state */
  const dayState = (ds) => {
    if (blocked.includes(ds))   return "blocked";
    const s = slots[ds];
    if (!s || !s.length)         return "empty";
    if (s.every(x=>x.booked))   return "full";
    if (s.some(x=>x.booked))    return "partial";
    return "open";
  };

  /* derived */
  const daySlots  = slots[selectedDate] ?? [];
  const isBlocked = blocked.includes(selectedDate);
  const isPast    = selectedDate < today;
  const freeCount = daySlots.filter(s=>!s.booked).length;
  const bookedCount = daySlots.filter(s=>s.booked).length;
  const PRESETS   = isHe ? PRESETS_HE : PRESETS_EN;

  /* month totals */
  const prefix = `${year}-${pad(month+1)}`;
  const monthSlots    = Object.entries(slots).filter(([k])=>k.startsWith(prefix));
  const totalFree     = monthSlots.reduce((a,[,v])=>a+v.filter(x=>!x.booked).length,0);
  const totalBooked   = monthSlots.reduce((a,[,v])=>a+v.filter(x=>x.booked).length,0);
  const totalBlocked  = blocked.filter(d=>d.startsWith(prefix)).length;

  /* ── actions ── */
  const addSlot = () => {
    setFormErr("");
    if (newStart >= newEnd) { setFormErr(L("End time must be after start","שעת סיום אחרי התחלה")); return; }
    if (daySlots.some(s=>!(newEnd<=s.startTime||newStart>=s.endTime))) {
      setFormErr(L("Overlaps with an existing slot","חפיפה עם slot קיים")); return;
    }
    const id = `s${Date.now()}`;
    setSlots(p=>({ ...p,
      [selectedDate]: [...(p[selectedDate]??[]),{id,startTime:newStart,endTime:newEnd,booked:false,clientName:null}]
                        .sort((a,b)=>a.startTime.localeCompare(b.startTime))
    }));
    setModal(null); setNewStart("09:00"); setNewEnd("10:00");
    showToast(L("Slot added ✓","חלון זמן נוסף ✓"));
  };

  const deleteSlot = () => {
    setSlots(p=>({ ...p, [selectedDate]:(p[selectedDate]??[]).filter(s=>s.id!==delTarget) }));
    setModal(null); setDelTarget(null);
    showToast(L("Slot removed","חלון זמן הוסר"), "info");
  };

  const toggleBlock = () => {
    if (isBlocked) {
      setBlocked(p=>p.filter(d=>d!==selectedDate));
      showToast(L("Day unblocked ✓","היום שוחרר ✓"));
    } else {
      if (daySlots.some(s=>s.booked)) { setModal("block"); return; }
      setBlocked(p=>[...p,selectedDate]);
      showToast(L("Day blocked","יום נחסם"), "warning");
    }
  };

  const confirmBlock = () => {
    setBlocked(p=>[...p,selectedDate]);
    setModal(null);
    showToast(L("Day blocked","יום נחסם"), "warning");
  };

  const applyPreset = (preset) => {
    const existing = (slots[selectedDate]??[]).filter(s=>s.booked); // שמור תפוסים
    const newOnes  = preset.slots
      .filter(({s,e})=>!existing.some(x=>!(e<=x.startTime||s>=x.endTime)))
      .map(({s,e})=>({id:`s${Date.now()}-${s}`,startTime:s,endTime:e,booked:false,clientName:null}));
    setSlots(p=>({ ...p,
      [selectedDate]: [...existing,...newOnes].sort((a,b)=>a.startTime.localeCompare(b.startTime))
    }));
    setModal(null);
    showToast(L(`${newOnes.length} slots added ✓`,`${newOnes.length} חלונות זמן נוספו ✓`));
  };

  /* copy today's free slots to next 4 weekdays */
  const copyToWeek = () => {
    const freeSlots = daySlots.filter(s=>!s.booked);
    if (!freeSlots.length) { showToast(L("No free slots to copy","אין חלונות זמן פנויים להעתקה"),"info"); setModal(null); return; }
    const base = new Date(selectedDate+"T12:00:00");
    let added = 0;
    setSlots(prev => {
      const next = {...prev};
      for (let i=1;i<=6;i++) {
        const d = new Date(base); d.setDate(d.getDate()+i);
        const ds = fmt(d);
        if (blocked.includes(ds)) continue;
        if (ds < today) continue;
        const existing = next[ds]??[];
        const toAdd = freeSlots
          .filter(fs=>!existing.some(e=>!(fs.endTime<=e.startTime||fs.startTime>=e.endTime)))
          .map(fs=>({...fs, id:`s${Date.now()}-${ds}-${fs.startTime}`, booked:false, clientName:null}));
        if (toAdd.length) { next[ds]=[...existing,...toAdd].sort((a,b)=>a.startTime.localeCompare(b.startTime)); added+=toAdd.length; }
      }
      return next;
    });
    setModal(null);
    showToast(L(`Copied to 6 upcoming days ✓`,`הועתק ל-6 ימים הקרובים ✓`));
  };

  /* slot duration label */
  const duration = (s,e) => {
    const [sh,sm]=[...s.split(":").map(Number)];
    const [eh,em]=[...e.split(":").map(Number)];
    const m=(eh*60+em)-(sh*60+sm);
    return m>=60 ? `${Math.floor(m/60)}h${m%60?` ${m%60}m`:""}` : `${m}m`;
  };

  /* status colors */
  const S = {
    blocked: { bar:"#EF4444", ring:"#FCA5A5", bg:"#FEF2F2", dot:"#EF4444"  },
    full:    { bar:"#3B82F6", ring:"#93C5FD", bg:"#EFF6FF", dot:"#3B82F6"  },
    partial: { bar:"#F59E0B", ring:"#FCD34D", bg:"#FFFBEB", dot:"#F59E0B"  },
    open:    { bar:"#10B981", ring:"#6EE7B7", bg:"#ECFDF5", dot:"#10B981"  },
    empty:   { bar:"transparent", ring:"transparent", bg:"transparent", dot:"transparent" },
  };

  return (
    <div style={{fontFamily:isHe?"'Heebo',sans-serif":"'DM Sans',sans-serif",background:"#F1F5FB",minHeight:"100vh",direction:dir,opacity:mounted?1:0,transition:"opacity .35s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&family=Heebo:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp  {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn   {from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .dcell{transition:all .14s ease;cursor:pointer;border-radius:10px;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;}
        .dcell:hover{transform:scale(1.08);z-index:2;}
        .hb{transition:all .16s ease;}
        .hb:hover{filter:brightness(1.06);transform:translateY(-1px);}
        .hb:active{transform:scale(.97);}
        .srow{transition:background .14s;}
        .srow:hover{background:#F0F5FF!important;}
        .pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        *{box-sizing:border-box;margin:0;}
        select{appearance:none;}
        @media(max-width:860px){.av-grid{flex-direction:column!important;}.cal-wrap{width:100%!important;min-width:unset!important;}}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px;}
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{background:"#FFF",borderBottom:"1px solid #E2E8F0",boxShadow:"0 1px 8px rgba(0,0,0,.04)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1120,margin:"0 auto",padding:"12px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",direction:"ltr"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF"}}><IcoWrench/></div>
            <span style={{fontFamily:"'Outfit'",fontSize:19,fontWeight:800,color:"#1A2B4A"}}>Fix<span style={{color:"#2563EB"}}>Mate</span> <span style={{fontSize:12,fontWeight:500,color:"#94A3B8"}}>Pro</span></span>
          </div>
          <button onClick={()=>navigate("/pro/dashboard")} className="hb"
            style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:22,border:"1.5px solid #E2E8F0",background:"#FFF",color:"#64748B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            <IcoBack/> {L("Dashboard","דשבורד")}
          </button>
        </div>
      </nav>

      {/* ══ MAIN ══ */}
      <main style={{maxWidth:1120,margin:"0 auto",padding:"26px 26px 70px"}}>

        {/* header */}
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12,animation:"fadeUp .35s"}}>
          <div>
            <h1 style={{fontFamily:"'Outfit'",fontSize:25,fontWeight:800,color:"#1A2B4A",marginBottom:3}}>{L("Manage Availability","ניהול זמינות")}</h1>
            <p style={{fontSize:13,color:"#94A3B8"}}>{L("Define your bookable time slots","הגדר חלונות זמן לקביעת תורים")}</p>
          </div>
          {/* month stats */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[
              {n:totalFree,   label:L("Free","פנוי"),   color:"#10B981",bg:"#ECFDF5",border:"#A7F3D0"},
              {n:totalBooked, label:L("Booked","תפוס"),  color:"#3B82F6",bg:"#EFF6FF",border:"#BFDBFE"},
              {n:totalBlocked,label:L("Blocked","חסום"), color:"#EF4444",bg:"#FEF2F2",border:"#FECACA"},
            ].map(({n,label,color,bg,border})=>(
              <div key={label} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:14,padding:"9px 16px",textAlign:"center",minWidth:72}}>
                <p style={{fontSize:22,fontWeight:800,fontFamily:"'Outfit'",color,lineHeight:1}}>{n}</p>
                <p style={{fontSize:11,color,fontWeight:600,marginTop:3}}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="av-grid" style={{display:"flex",gap:20,alignItems:"flex-start"}}>

          {/* ════════════ CALENDAR ════════════ */}
          <div className="cal-wrap" style={{background:"#FFF",borderRadius:22,border:"1px solid #E2E8F0",boxShadow:"0 2px 18px rgba(0,0,0,.05)",padding:"22px",minWidth:320,width:320,flexShrink:0,animation:"fadeUp .38s"}}>

            {/* nav */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,direction:"ltr"}}>
              <button onClick={()=>setViewMonth(new Date(year,month-1,1))} className="hb"
                style={{width:34,height:34,borderRadius:10,border:"1px solid #E2E8F0",background:"#F8FAFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748B"}}>
                <IcoLeft/>
              </button>
              <span style={{fontFamily:"'Outfit'",fontSize:16,fontWeight:700,color:"#1A2B4A"}}>{MONTHS[month]} {year}</span>
              <button onClick={()=>setViewMonth(new Date(year,month+1,1))} className="hb"
                style={{width:34,height:34,borderRadius:10,border:"1px solid #E2E8F0",background:"#F8FAFF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748B"}}>
                <IcoRight/>
              </button>
            </div>

            {/* day names */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
              {DAYS_SHORT.map((d,i)=>(
                <div key={i} style={{textAlign:"center",fontSize:11,fontWeight:700,color:"#94A3B8",padding:"3px 0"}}>{d}</div>
              ))}
            </div>

            {/* cells */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
              {Array.from({length:firstDow}).map((_,i)=><div key={`x${i}`}/>)}
              {Array.from({length:daysInMonth},(_,i)=>{
                const day = i+1;
                const ds  = `${year}-${pad(month+1)}-${pad(day)}`;
                const st  = dayState(ds);
                const col = S[st];
                const isSel   = ds === selectedDate;
                const isToday = ds === today;
                return (
                  <div key={day} className="dcell" onClick={()=>setSelectedDate(ds)}
                    style={{
                      background: isSel ? "#2563EB" : st==="empty" ? "#F8FAFF" : col.bg,
                      border: isSel ? "none" : `1.5px solid ${st==="empty"?"#EEF2F7":col.ring}`,
                      boxShadow: isSel ? "0 4px 16px rgba(37,99,235,.38)" : "none",
                      outline: isToday&&!isSel ? "2px solid #2563EB" : "none",
                      outlineOffset: "-2px",
                    }}>
                    <span style={{fontSize:12,fontWeight:isSel||isToday?800:500,color:isSel?"#FFF":isToday?"#2563EB":"#1A2B4A",lineHeight:1}}>
                      {day}
                    </span>
                    {st!=="empty"&&!isSel&&(
                      <span style={{width:4,height:4,borderRadius:"50%",background:col.dot,position:"absolute",bottom:4}}/>
                    )}
                  </div>
                );
              })}
            </div>

            {/* legend */}
            <div style={{marginTop:18,paddingTop:14,borderTop:"1px solid #F1F5F9",display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
              {[
                {dot:"#10B981",label:L("Free","פנוי")},
                {dot:"#F59E0B",label:L("Part.","חלקי")},
                {dot:"#3B82F6",label:L("Full","מלא")},
                {dot:"#EF4444",label:L("Blocked","חסום")},
              ].map(x=>(
                <div key={x.label} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#64748B",fontWeight:500}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:x.dot}}/>
                  {x.label}
                </div>
              ))}
            </div>
          </div>

          {/* ════════════ RIGHT PANEL ════════════ */}
          <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:14}}>

            {/* ── Day header ── */}
            <div style={{background:"#FFF",borderRadius:18,border:"1px solid #E2E8F0",padding:"18px 22px",boxShadow:"0 2px 12px rgba(0,0,0,.04)",animation:"fadeUp .4s"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>

                {/* date + counters */}
                <div>
                  <p style={{fontFamily:"'Outfit'",fontSize:18,fontWeight:800,color:"#1A2B4A",marginBottom:4}}>
                    {new Date(selectedDate+"T12:00:00").toLocaleDateString(isHe?"he-IL":"en-US",{weekday:"long",month:"long",day:"numeric"})}
                  </p>
                  <div style={{display:"flex",gap:8}}>
                    {bookedCount>0&&<span className="pill" style={{background:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE"}}><IcoCheck/>{bookedCount} {L("booked","תפוס")}</span>}
                    {freeCount>0&&<span className="pill" style={{background:"#ECFDF5",color:"#065F46",border:"1px solid #A7F3D0"}}>{freeCount} {L("free","פנוי")}</span>}
                    {isBlocked&&<span className="pill" style={{background:"#FEF2F2",color:"#991B1B",border:"1px solid #FECACA"}}><IcoBlock/>{L("Blocked","חסום")}</span>}
                    {!daySlots.length&&!isBlocked&&<span style={{fontSize:13,color:"#94A3B8"}}>{L("No slots yet","אין חלונות זמן עדיין")}</span>}
                  </div>
                </div>

                {/* action buttons */}
                {!isPast && (
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {/* block / unblock */}
                    <button onClick={toggleBlock} className="hb"
                      style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:22,border:`1.5px solid ${isBlocked?"#FECACA":"#E2E8F0"}`,background:isBlocked?"#FEF2F2":"#F8FAFF",color:isBlocked?"#DC2626":"#64748B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                      <IcoBlock/>{isBlocked?L("Unblock","שחרר"):L("Block Day","חסום יום")}
                    </button>
                    {!isBlocked&&<>
                      {/* preset */}
                      <button onClick={()=>setModal("preset")} className="hb"
                        style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:22,border:"1.5px solid #E2E8F0",background:"#F8FAFF",color:"#64748B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                        <IcoSun/>{L("Quick Add","הוסף מהיר")}
                      </button>
                      {/* copy week */}
                      {freeCount>0&&(
                        <button onClick={()=>setModal("copy")} className="hb"
                          style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:22,border:"1.5px solid #E2E8F0",background:"#F8FAFF",color:"#64748B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                          <IcoCopy/>{L("Copy to Week","העתק לשבוע")}
                        </button>
                      )}
                      {/* add manual */}
                      <button onClick={()=>{setModal("add");setFormErr("");}} className="hb"
                        style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:22,border:"none",background:"#2563EB",color:"#FFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(37,99,235,.3)"}}>
                        <IcoPlus/>{L("Add Slot","הוסף חלון זמן")}
                      </button>
                    </>}
                  </div>
                )}
              </div>
            </div>

            {/* ── Slots list / states ── */}
            {isBlocked ? (
              <div style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:18,padding:"44px 24px",textAlign:"center",animation:"fadeUp .4s"}}>
                <div style={{fontSize:44,marginBottom:12}}>🚫</div>
                <p style={{fontSize:17,fontWeight:700,color:"#991B1B",marginBottom:6}}>{L("Day Blocked","יום חסום")}</p>
                <p style={{fontSize:14,color:"#EF4444",marginBottom:20}}>{L("Clients cannot book appointments on this day","לקוחות לא יכולים לקבוע תורים ביום זה")}</p>
                {!isPast&&<button onClick={toggleBlock} className="hb"
                  style={{padding:"11px 26px",borderRadius:22,border:"none",background:"#EF4444",color:"#FFF",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(239,68,68,.28)"}}>
                  {L("Unblock This Day","שחרר יום זה")}
                </button>}
              </div>
            ) : daySlots.length === 0 ? (
              <div style={{background:"#FFF",border:"1.5px dashed #D1D9E8",borderRadius:18,padding:"52px 24px",textAlign:"center",animation:"fadeUp .4s"}}>
                <div style={{fontSize:44,marginBottom:14}}>📅</div>
                <p style={{fontSize:16,fontWeight:700,color:"#1A2B4A",marginBottom:6}}>{L("No time slots yet","אין חלונות זמן עדיין")}</p>
                <p style={{fontSize:13,color:"#94A3B8",marginBottom:22}}>{L("Add slots manually or use Quick Add to fill the day","הוסף slots ידנית או השתמש בהוסף מהיר")}</p>
                {!isPast&&(
                  <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                    <button onClick={()=>setModal("preset")} className="hb"
                      style={{padding:"11px 20px",borderRadius:22,border:"1.5px solid #E2E8F0",background:"#F8FAFF",color:"#2563EB",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                      <IcoSun/>{L("Quick Add","הוסף מהיר")}
                    </button>
                    <button onClick={()=>{setModal("add");setFormErr("");}} className="hb"
                      style={{padding:"11px 20px",borderRadius:22,border:"none",background:"#2563EB",color:"#FFF",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(37,99,235,.28)",display:"flex",alignItems:"center",gap:6}}>
                      <IcoPlus/>{L("Add Slot","הוסף חלון זמן")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{background:"#FFF",borderRadius:18,border:"1px solid #E2E8F0",overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,.04)",animation:"fadeUp .42s"}}>
                {daySlots.map((slot,i)=>(
                  <div key={slot.id} className="srow"
                    style={{display:"flex",alignItems:"center",padding:"16px 22px",borderBottom:i<daySlots.length-1?"1px solid #F1F5F9":"none",gap:14,background:"#FFF"}}>

                    {/* left accent */}
                    <div style={{width:4,height:48,borderRadius:3,background:slot.booked?"#3B82F6":"#10B981",flexShrink:0}}/>

                    {/* time block */}
                    <div style={{minWidth:130}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,fontFamily:"'Outfit'",fontSize:16,fontWeight:800,color:"#1A2B4A"}}>
                        <IcoClock/>
                        {slot.startTime} – {slot.endTime}
                      </div>
                      <span style={{fontSize:11,color:"#94A3B8",marginTop:2,display:"block"}}>
                        {duration(slot.startTime,slot.endTime)}
                      </span>
                    </div>

                    {/* status */}
                    <div style={{flex:1}}>
                      {slot.booked ? (
                        <>
                          <span className="pill" style={{background:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE"}}><IcoCheck/>{L("Booked","תפוס")}</span>
                          {slot.clientName&&(
                            <p style={{fontSize:12,color:"#64748B",marginTop:5,display:"flex",alignItems:"center",gap:4}}>
                              <IcoUser/>{slot.clientName}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="pill" style={{background:"#ECFDF5",color:"#065F46",border:"1px solid #A7F3D0"}}>
                          {L("Available","פנוי")}
                        </span>
                      )}
                    </div>

                    {/* delete btn — only free + not past */}
                    {!slot.booked && !isPast && (
                      <button onClick={()=>{setDelTarget(slot.id);setModal("delete");}} className="hb"
                        style={{width:36,height:36,borderRadius:10,border:"1px solid #FEE2E2",background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#EF4444",flexShrink:0,title:"Delete slot"}}>
                        <IcoTrash/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ════════════════════════════
          MODAL: Add Slot
      ════════════════════════════ */}
      {modal==="add"&&(
        <Overlay onClose={()=>setModal(null)}>
          <div style={{fontFamily:"inherit",direction:dir}}>
            <ModalHeader emoji="🕐" title={L("Add Time Slot","הוסף חלון זמן")}
              sub={new Date(selectedDate+"T12:00:00").toLocaleDateString(isHe?"he-IL":"en-US",{weekday:"short",month:"long",day:"numeric"})}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <TimeSelect label={L("From","משעה")} value={newStart} onChange={v=>{setNewStart(v);setFormErr("");}}/>
              <TimeSelect label={L("Until","עד שעה")} value={newEnd} onChange={v=>{setNewEnd(v);setFormErr("");}}/>
            </div>
            {/* duration preview */}
            {!formErr&&newStart<newEnd&&(
              <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#0369A1",marginBottom:14,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                <IcoClock/>{L("Duration:","משך:")} {duration(newStart,newEnd)}
              </div>
            )}
            {formErr&&<ErrBox msg={formErr}/>}
            <ModalActions
              onCancel={()=>setModal(null)}
              onConfirm={addSlot}
              confirmLabel={L("Add Slot ✓","הוסף חלון זמן ✓")}
              confirmBg="#2563EB"
              confirmGlow="rgba(37,99,235,.28)"
            />
          </div>
        </Overlay>
      )}

      {/* ════════════════════════════
          MODAL: Delete Slot
      ════════════════════════════ */}
      {modal==="delete"&&(
        <Overlay onClose={()=>setModal(null)}>
          <div style={{textAlign:"center",direction:dir}}>
            <ModalHeader emoji="🗑️" title={L("Delete this slot?","למחוק חלון זמן זה?")}
              sub={L("This cannot be undone.","פעולה לא ניתנת לביטול.")}/>
            <ModalActions
              onCancel={()=>setModal(null)}
              onConfirm={deleteSlot}
              confirmLabel={L("Yes, Delete","כן, מחק")}
              confirmBg="#EF4444"
              confirmGlow="rgba(239,68,68,.28)"
            />
          </div>
        </Overlay>
      )}

      {/* ════════════════════════════
          MODAL: Block Day (has bookings)
      ════════════════════════════ */}
      {modal==="block"&&(
        <Overlay onClose={()=>setModal(null)}>
          <div style={{textAlign:"center",direction:dir}}>
            <ModalHeader emoji="⚠️" title={L("Block this day?","לחסום יום זה?")}
              sub={L(`This day has ${bookedCount} booking(s). Blocking won't cancel them.`,`ליום זה ${bookedCount} הזמנות קיימות. חסימה לא תבטל אותן.`)}/>
            <ModalActions
              onCancel={()=>setModal(null)}
              onConfirm={confirmBlock}
              confirmLabel={L("Block Anyway","חסום בכל זאת")}
              confirmBg="#F59E0B"
              confirmGlow="rgba(245,158,11,.28)"
            />
          </div>
        </Overlay>
      )}

      {/* ════════════════════════════
          MODAL: Quick Preset
      ════════════════════════════ */}
      {modal==="preset"&&(
        <Overlay onClose={()=>setModal(null)}>
          <div style={{direction:dir}}>
            <ModalHeader emoji="⚡" title={L("Quick Add Slots","הוסף חלון זמןs מהיר")}
              sub={L("Choose a preset to fill the day","בחר תבנית למילוי היום")}/>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:8}}>
              {PRESETS.map(preset=>(
                <button key={preset.label} onClick={()=>applyPreset(preset)} className="hb"
                  style={{padding:"16px 20px",borderRadius:14,border:"1.5px solid #E2E8F0",background:"#F8FAFF",cursor:"pointer",textAlign:dir==="rtl"?"right":"left",fontFamily:"inherit"}}>
                  <p style={{fontSize:15,fontWeight:700,color:"#1A2B4A",marginBottom:4}}>{preset.label}</p>
                  <p style={{fontSize:12,color:"#94A3B8"}}>
                    {preset.slots[0].s} – {preset.slots[preset.slots.length-1].e} · {preset.slots.length} {L("slots","חלונות")}
                  </p>
                </button>
              ))}
            </div>
            <button onClick={()=>setModal(null)} className="hb"
              style={{width:"100%",padding:"12px",borderRadius:14,border:"1.5px solid #E2E8F0",background:"#FFF",color:"#64748B",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>
              {L("Cancel","ביטול")}
            </button>
          </div>
        </Overlay>
      )}

      {/* ════════════════════════════
          MODAL: Copy to Week
      ════════════════════════════ */}
      {modal==="copy"&&(
        <Overlay onClose={()=>setModal(null)}>
          <div style={{textAlign:"center",direction:dir}}>
            <ModalHeader emoji="📋" title={L("Copy to upcoming days","העתק לימים הקרובים")}
              sub={L(`Copy ${freeCount} free slot(s) to the next 6 days (skips blocked days & past conflicts)`,`העתק ${freeCount} חלונות זמן פנויים ל-6 הימים הבאים (מדלג על חסומים וחפיפות)`)}/>
            <ModalActions
              onCancel={()=>setModal(null)}
              onConfirm={copyToWeek}
              confirmLabel={L("Copy Now ✓","העתק עכשיו ✓")}
              confirmBg="#2563EB"
              confirmGlow="rgba(37,99,235,.28)"
            />
          </div>
        </Overlay>
      )}

      {/* ════════════════════════════
          TOAST
      ════════════════════════════ */}
      {toast&&(
        <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",zIndex:500,animation:"toastIn .28s",pointerEvents:"none"}}>
          <div style={{padding:"12px 22px",borderRadius:22,background:toast.type==="warning"?"#FEF3C7":toast.type==="info"?"#EFF6FF":"#1A2B4A",color:toast.type==="warning"?"#92400E":toast.type==="info"?"#1D4ED8":"#FFF",fontSize:14,fontWeight:600,boxShadow:"0 8px 30px rgba(0,0,0,.16)",whiteSpace:"nowrap",fontFamily:"inherit"}}>
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Small reusable sub-components ─── */

function Overlay({children,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.52)",backdropFilter:"blur(5px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#FFF",borderRadius:24,padding:"32px",maxWidth:420,width:"100%",animation:"popIn .22s",boxShadow:"0 24px 60px rgba(0,0,0,.18)"}}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({emoji,title,sub}){
  return(
    <div style={{marginBottom:22,textAlign:"center"}}>
      <div style={{fontSize:46,marginBottom:12,lineHeight:1}}>{emoji}</div>
      <h3 style={{fontFamily:"'Outfit'",fontSize:19,fontWeight:800,color:"#1A2B4A",marginBottom:6}}>{title}</h3>
      {sub&&<p style={{fontSize:13,color:"#94A3B8",lineHeight:1.6}}>{sub}</p>}
    </div>
  );
}

function ModalActions({onCancel,onConfirm,confirmLabel,confirmBg,confirmGlow}){
  return(
    <div style={{display:"flex",gap:10,marginTop:20}}>
      <button onClick={onCancel}
        style={{flex:1,padding:"13px",borderRadius:14,border:"1.5px solid #E2E8F0",background:"#FFF",color:"#64748B",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .16s"}}>
        ביטול
      </button>
      <button onClick={onConfirm}
        style={{flex:1,padding:"13px",borderRadius:14,border:"none",background:confirmBg,color:"#FFF",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 20px ${confirmGlow}`,fontFamily:"inherit",transition:"all .16s"}}>
        {confirmLabel}
      </button>
    </div>
  );
}

function TimeSelect({label,value,onChange}){
  const HOURS_LIST = Array.from({length:14},(_,i)=>i+7).flatMap(h=>[`${String(h).padStart(2,"0")}:00`,`${String(h).padStart(2,"0")}:30`]);
  return(
    <div>
      <label style={{fontSize:12,fontWeight:700,color:"#374151",display:"block",marginBottom:7,textTransform:"uppercase",letterSpacing:".5px"}}>{label}</label>
      <div style={{position:"relative"}}>
        <select value={value} onChange={e=>onChange(e.target.value)}
          style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1.5px solid #E2E8F0",background:"#F8FAFF",fontSize:16,fontWeight:700,color:"#1A2B4A",cursor:"pointer",outline:"none",fontFamily:"inherit",appearance:"none"}}>
          {HOURS_LIST.map(h=><option key={h} value={h}>{h}</option>)}
        </select>
        <span style={{position:"absolute",top:"50%",left:12,transform:"translateY(-50%)",pointerEvents:"none",color:"#94A3B8",fontSize:11,lineHeight:1}}>▾</span>
      </div>
    </div>
  );
}

function ErrBox({msg}){
  return(
    <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#DC2626",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
      ⚠️ {msg}
    </div>
  );
}