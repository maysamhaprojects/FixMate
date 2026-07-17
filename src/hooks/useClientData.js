/**
 * ============================================================
 *  FixMate — הלוגיקה של דשבורד הלקוח
 *  כל ה-state, קריאות השרת והפעולות — מופרדים מהתצוגה.
 *
 *  שימוש:  const c = useClientData({ t, lang, isHe });
 * ============================================================
 */
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { CANCEL_FEE, GRACE_MINUTES } from "../data/clientConstants";

export function useClientData({ t, lang, isHe }) {
  const [mounted, setMounted] = useState(false);
  const [userName] = useState(localStorage.getItem("fullName") || (lang === "he" ? "אורח" : "Guest"));
  const [avatarPic, setAvatarPic] = useState(localStorage.getItem("profilePicture") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email") || "");
  const [orders, setOrders] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ratedIds, setRatedIds] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllComplaints, setShowAllComplaints] = useState(false);

  /* עריכת הזמנה */
  const [editOrder, setEditOrder] = useState(null);
  const [trackOrder, setTrackOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editAddr, setEditAddr] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  /* תלונה */
  const [showComplaint, setShowComplaint] = useState(false);
  const [compSubject, setCompSubject] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compOrderId, setCompOrderId] = useState("");
  const [compSaving, setCompSaving] = useState(false);

  /* הודעת toast פנימית (במקום alert של הדפדפן) */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* אנימציית כניסה */
  useEffect(() => {
    const tm = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(tm);
  }, []);

  /* רענון אוטומטי — כל 20 שניות + כשחוזרים ללשונית */
  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const bump = () => setRefreshTick((x) => x + 1);
    const iv = setInterval(bump, 20000);
    window.addEventListener("focus", bump);
    return () => { clearInterval(iv); window.removeEventListener("focus", bump); };
  }, []);

  /* משיכת ההזמנות האמיתיות של הלקוח המחובר */
  useEffect(() => {
    apiFetch("/api/client/bookings")
      .then((r) => (r.ok ? r.json() : null))
      .then((list) => {
        if (!Array.isArray(list)) return;
        // מסתירים הזמנות מבוטלות מ"הזמנות פעילות"
        setOrders(list.filter((b) => (b.status || "").toUpperCase() !== "CANCELLED").map((b) => {
          const sched = b.scheduledAt || "";
          const proName = (b.pro && b.pro.fullName) || (lang === "he" ? "בעל מקצוע" : "Professional");
          return {
            id: "ORD-" + b.id,
            bookingId: b.id,
            createdAt: b.createdAt || null,
            proName,
            proRole: b.serviceType || "",
            proAvatar: null,
            proPic: (b.pro && b.pro.profilePicture) || "",
            rating: null,
            status: (b.status || "PENDING").toLowerCase(),
            price: b.totalPrice != null ? b.totalPrice : null,  // המחיר הסופי — null עד שבעל המקצוע קובע אותו
            date: sched.slice(0, 10),
            time: sched.slice(11, 16),
            phone: (b.pro && b.pro.phone) || "",
            address: b.address || "",
            description: b.notes || b.serviceType || "",
          };
        }));
      })
      .catch(() => { /* אם נכשל — נשארים עם רשימה ריקה */ });
  }, [lang, refreshTick]);

  /* משיכת התראות אמיתיות לפי סטטוס ההזמנות */
  useEffect(() => {
    apiFetch("/api/client/notifications")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        const he = lang === "he";
        const textFor = (n) => {
          const pro = n.proName || (he ? "בעל המקצוע" : "the professional");
          switch (n.type) {
            case "confirmed":   return he ? `ההזמנה שלך עם ${pro} אושרה` : `Your order with ${pro} was confirmed`;
            case "in_progress": return he ? `${pro} התחיל לטפל בהזמנה שלך` : `${pro} started working on your order`;
            case "completed":   return he ? `העבודה עם ${pro} הושלמה — אפשר לדרג!` : `Job with ${pro} completed — you can rate now!`;
            case "cancelled":   return he ? `ההזמנה עם ${pro} בוטלה` : `Order with ${pro} was cancelled`;
            default:            return he ? "עדכון בהזמנה" : "Order update";
          }
        };
        setNotifications(list.map((n) => ({
          id: n.id,
          type: n.type,
          text: textFor(n),
          time: (n.date || "").slice(0, 10),
          read: false,
        })));
      })
      .catch(() => { /* אם נכשל — נשארים ריקים */ });
  }, [lang, refreshTick]);

  /* אילו הזמנות כבר דורגו — כדי להסתיר את כפתור "דרג" */
  useEffect(() => {
    apiFetch("/api/client/rated-bookings")
      .then((r) => (r.ok ? r.json() : []))
      .then((ids) => { if (Array.isArray(ids)) setRatedIds(ids); })
      .catch(() => {});
  }, [refreshTick]);

  /* תמונת פרופיל של המשתמש המחובר */
  useEffect(() => {
    apiFetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u) {
          setAvatarPic(u.profilePicture || "");
          localStorage.setItem("profilePicture", u.profilePicture || "");
          if (u.email) { setUserEmail(u.email); localStorage.setItem("email", u.email); }
        }
      })
      .catch(() => {});
  }, [refreshTick]);

  /* התלונות של הלקוח + הסטטוס שלהן (מתעדכן אוטומטית) */
  useEffect(() => {
    apiFetch("/api/complaints/mine")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => { if (Array.isArray(list)) setMyComplaints(list); })
      .catch(() => {});
  }, [refreshTick]);

  const activeOrders = orders;

  const STATUS_MAP = {
    pending:     { label: t("cd_pending"),     color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
    confirmed:   { label: t("cd_confirmed"),   color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
    in_progress: { label: t("cd_in_progress"), color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
    completed:   { label: t("cd_completed"),   color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
  };

  /* ── עריכת הזמנה ── */
  const openEdit = (order) => {
    setEditOrder(order);
    setEditDate(order.date);
    setEditTime(order.time);
    setEditAddr(order.address || "");
    setEditDesc(order.description);
  };

  const saveEdit = () => {
    const order = editOrder;
    if (!order.bookingId) {
      showToast(isHe ? "שגיאה: חסר מזהה הזמנה. רענני את הדף ונסי שוב." : "Error: missing booking id. Hard-refresh and try again.", "error");
      return;
    }
    // מאחדים תאריך + שעה ל-LocalDateTime בפורמט ISO
    const scheduledAt = editDate ? (editDate + "T" + (editTime || "00:00") + ":00") : null;
    setEditSaving(true);
    apiFetch("/api/client/bookings/" + order.bookingId, {
      method: "PUT",
      body: JSON.stringify({ scheduledAt, address: editAddr.trim(), notes: editDesc }),
    })
      .then((r) => {
        if (r.ok) {
          setOrders(prev => prev.map(o => o.id === order.id
            ? { ...o, date: editDate, time: editTime, address: editAddr.trim(), description: editDesc }
            : o));
          setEditOrder(null);
          showToast(isHe ? "ההזמנה עודכנה בהצלחה" : "Order updated successfully", "success");
        } else {
          r.text().then((msg) => showToast((isHe ? "עדכון נכשל: " : "Update failed: ") + (msg || ("קוד " + r.status)), "error"));
        }
      })
      .catch((e) => showToast((isHe ? "שגיאת רשת: " : "Network error: ") + e.message, "error"))
      .finally(() => setEditSaving(false));
  };

  /* ── תלונה ── */
  const openComplaint = (order) => {
    setCompSubject("");
    setCompDesc("");
    setCompOrderId(order && order.bookingId ? String(order.bookingId) : "");
    setShowComplaint(true);
  };

  const submitComplaint = () => {
    if (!compSubject.trim() || !compDesc.trim()) {
      showToast(isHe ? "יש למלא נושא ותיאור" : "Please fill subject and description", "error");
      return;
    }
    const body = { subject: compSubject.trim(), description: compDesc.trim() };
    if (compOrderId) body.bookingId = Number(compOrderId);
    setCompSaving(true);
    apiFetch("/api/complaints", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((r) => {
        if (r.ok) {
          setShowComplaint(false);
          showToast(isHe ? "התלונה נשלחה בהצלחה. הצוות יטפל בה." : "Complaint submitted. Our team will handle it.", "success");
        } else {
          r.text().then((msg) => showToast((isHe ? "שליחה נכשלה: " : "Submit failed: ") + (msg || ("קוד " + r.status)), "error"));
        }
      })
      .catch((e) => showToast((isHe ? "שגיאת רשת: " : "Network error: ") + e.message, "error"))
      .finally(() => setCompSaving(false));
  };

  /* ── ביטול הזמנה ומדיניות הקנס ── */
  const getHoursUntilOrder = (order) => {
    const d = new Date(`${order.date} ${order.time}`);
    return Math.max(0, Math.round((d - new Date()) / 36e5));
  };
  const isWithin48Hours = (order) => getHoursUntilOrder(order) < 48;
  const isGracePeriod = (order) => {
    if (!order.createdAt) return false;
    return (Date.now() - new Date(order.createdAt).getTime()) < GRACE_MINUTES * 60 * 1000;
  };
  // קנס נגבה רק אם הפגישה בתוך 48 שעות וגם עברה תקופת החסד מההזמנה
  const chargesFee = (order) => isWithin48Hours(order) && !isGracePeriod(order);

  const confirmCancel = () => {
    const order = cancelConfirm;
    if (!order.bookingId) {
      showToast(isHe ? "שגיאה: חסר מזהה הזמנה. רענני את הדף ונסי שוב." : "Error: missing booking id. Hard-refresh and try again.", "error");
      return;
    }
    const q = cancelReason.trim() ? "?reason=" + encodeURIComponent(cancelReason.trim()) : "";
    apiFetch("/api/client/bookings/" + order.bookingId + q, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          setOrders(prev => prev.filter(o => o.id !== order.id)); // הוסר מהתצוגה רק אם השרת אישר
          setCancelConfirm(null); setCancelReason("");
          showToast(isHe ? "ההזמנה בוטלה" : "Order cancelled", "success");
        } else {
          showToast((isHe ? "ביטול נכשל (קוד " : "Cancel failed (code ") + r.status + ")", "error");
        }
      })
      .catch((e) => { showToast((isHe ? "שגיאת רשת: " : "Network error: ") + e.message, "error"); });
  };

  /* ── התראות ── */
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  /* ── שלבי מעקב אחר הזמנה ── */
  const getProgressSteps = (order) => [
    { label: t("cd_order_placed"), done: true,                           time: "Feb 17, 10:30 AM" },
    { label: t("cd_pro_assigned"), done: true,                           time: "Feb 17, 11:00 AM" },
    { label: t("cd_pro_on_way"),   done: order.status === "in_progress", time: order.status === "in_progress" ? "Feb 18, 1:45 PM" : "" },
    { label: t("cd_work_started"), done: false,                          time: "" },
    { label: t("cd_job_completed"),done: false,                          time: "" },
  ];

  return {
    mounted,
    userName, avatarPic, userEmail,
    orders, activeOrders,
    showNotif, setShowNotif,
    showProfile, setShowProfile,
    notifications, unreadCount, markAsRead, markAllRead, clearNotification,
    ratedIds, myComplaints,
    showAllOrders, setShowAllOrders,
    showAllComplaints, setShowAllComplaints,
    STATUS_MAP,

    /* עריכה */
    editOrder, setEditOrder, openEdit, saveEdit, editSaving,
    editDate, setEditDate, editTime, setEditTime,
    editAddr, setEditAddr, editDesc, setEditDesc,

    /* מעקב */
    trackOrder, setTrackOrder, getProgressSteps,

    /* ביטול */
    cancelConfirm, setCancelConfirm, cancelReason, setCancelReason,
    confirmCancel, chargesFee, getHoursUntilOrder, CANCEL_FEE,

    /* תלונה */
    showComplaint, setShowComplaint, openComplaint, submitComplaint, compSaving,
    compSubject, setCompSubject, compDesc, setCompDesc, compOrderId, setCompOrderId,

    /* toast */
    toast, showToast,
  };
}
