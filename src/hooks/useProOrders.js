/**
 * ============================================================
 *  FixMate — הלוגיקה של מסך ניהול ההזמנות של בעל המקצוע
 *  טעינת ההזמנות, סינון, חיפוש, ועדכון סטטוס בשרת.
 *
 *  שימוש:  const o = useProOrders({ L });
 * ============================================================
 */
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

/* המרת סטטוס מהשרת לתצוגה */
const mapStatus = (s) => {
  if (s === "COMPLETED") return "done";
  return (s || "PENDING").toLowerCase(); // PENDING/CONFIRMED/IN_PROGRESS/CANCELLED
};

export function useProOrders({ L }) {
  const [mounted,      setMounted     ] = useState(false);
  const [orders,       setOrders      ] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search,       setSearch      ] = useState("");
  const [modal,        setModal       ] = useState(null);

  /* אנימציית כניסה */
  useEffect(() => {
    const tm = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(tm);
  }, []);

  /* טעינת ההזמנות האמיתיות של בעל המקצוע */
  const loadOrders = () => {
    apiFetch("/api/pro/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list)) return;
        setOrders(list.map((b) => {
          const sched = b.scheduledAt || "";
          const c = b.client || {};
          return {
            id: "ORD-" + b.id,
            bookingId: b.id,
            clientName: c.fullName || "",
            service: b.serviceType || "",
            description: b.notes || "",
            date: sched.slice(0, 10),
            time: sched.slice(11, 16),
            location: b.address || "",
            phone: c.phone || "",
            price: b.totalPrice != null ? b.totalPrice : null,  // null = טרם נקבע (לא מציגים ₪0)
            status: mapStatus(b.status),
            cancellationReason: b.cancellationReason || "",
          };
        }));
      })
      .catch(() => {});
  };
  useEffect(() => { loadOrders(); }, []);

  const count = (id) => id === "all" ? orders.length : orders.filter(o => o.status === id).length;

  const filtered = orders.filter(o => {
    const okStatus = activeFilter === "all" || o.status === activeFilter;
    const q = search.toLowerCase();
    const okSearch = !q || L(o.clientName).toLowerCase().includes(q) || L(o.service).toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return okStatus && okSearch;
  });

  /* מחיר סופי — נקבע על ידי בעל המקצוע בסיום העבודה */
  const [finalPrice, setFinalPrice] = useState("");

  /* עדכון סטטוס הזמנה בשרת — PUT /api/pro/orders/:id/status */
  const doAction = async (orderId, actionId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) { setModal(null); return; }
    // סטטוס לשרת (BookingStatus) וסטטוס לתצוגה
    const serverStatus = { accept: "CONFIRMED", start: "IN_PROGRESS", finish: "COMPLETED", reject: "CANCELLED" }[actionId];
    const uiStatus     = { accept: "confirmed", start: "in_progress", finish: "done",      reject: "cancelled" }[actionId];

    // בסיום — שולחים את המחיר הסופי שהוזן
    const body = { status: serverStatus };
    if (actionId === "finish" && finalPrice !== "") body.finalPrice = String(finalPrice);

    try {
      const r = await apiFetch("/api/pro/orders/" + order.bookingId + "/status", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setOrders(prev => prev.map(o => o.id === orderId
          ? { ...o, status: uiStatus, price: (actionId === "finish" && finalPrice !== "") ? Number(finalPrice) : o.price }
          : o));
      }
    } catch (e) { /* נכשל — משאירים כמו שהוא */ }
    setModal(null);
    setFinalPrice("");
  };

  return {
    mounted,
    orders, filtered, count,
    activeFilter, setActiveFilter,
    search, setSearch,
    modal, setModal,
    finalPrice, setFinalPrice,
    doAction,
  };
}
