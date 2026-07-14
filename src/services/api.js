/**
 * ============================================================
 *  FixMate — שכבת ה-API המרכזית
 *  כל הבקשות לשרת עוברות דרך הקובץ הזה.
 *  כתובת הבקאנד מוגדרת כאן פעם אחת בלבד, וה-token מתווסף אוטומטית.
 * ============================================================
 */

// כתובת הבקאנד — מקום אחד יחיד לשנות אם השרת עובר
export const API_BASE = "http://localhost:8080";

/**
 * עוטף את fetch:
 *  - מוסיף את כתובת הבסיס (אז מעבירים רק את הנתיב, למשל "/api/client/bookings")
 *  - מוסיף Content-Type: application/json
 *  - מוסיף Authorization: Bearer <token> אוטומטית אם המשתמש מחובר
 * מחזיר את אותו Response של fetch — אז r.ok / r.json() / r.text() עובדים כרגיל.
 */
export function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...(options.headers || {}),
  };
  return fetch(API_BASE + path, { ...options, headers });
}
