# 📘 תיעוד מסך — Client Dashboard

**קובץ:** `src/pages/ClientDashboard.jsx`
**נתיב:** `/client/dashboard`
**מטרה:** דשבורד ראשי ללקוחות — הצגת הזמנות, פעולות מהירות, התראות, ופרופיל.

---

## 🗂️ תוכן עניינים

1. [סקירה כללית](#סקירה-כללית)
2. [ייבואים](#ייבואים)
3. [אייקונים](#אייקונים)
4. [נתוני דמה](#נתוני-דמה)
5. [משתני מצב (States)](#משתני-מצב-states)
6. [אפקטים (useEffect)](#אפקטים-useeffect)
7. [פונקציות עזר](#פונקציות-עזר)
8. [מבנה המסך (JSX)](#מבנה-המסך-jsx)
9. [מודלים](#מודלים)
10. [חיבור לשרת](#חיבור-לשרת)

---

## סקירה כללית

המסך מחולק לחלקים הבאים:

```
┌────────────────────────────────────────┐
│  FixMate          🔔  👤  ⎋            │  ← ניווט עליון
├────────────────────────────────────────┤
│  שלום, מיסם 👋                          │  ← ברכה
│  מה נעשה היום?                          │
├────────────────────────────────────────┤
│  [📷 Snap]  [🔍 Search]  [🗺️ Map]     │  ← 3 כרטיסי פעולה
├────────────────────────────────────────┤
│  הזמנות פעילות (4)                      │  ← רשימת הזמנות
│  ┌──────────────────────────────────┐ │
│  │ 👤 אורי כהן - חשמלאי  [אושר]     │ │
│  │ תיקון מתג תאורה                  │ │
│  │ [צור קשר] [בטל]                  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## ייבואים

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang, translate, getLang, getDir } from "../context/LanguageContext";
import "../styles/client.css";
```

| מה | תפקיד |
|----|-------|
| `useState` | זיכרון של הקומפוננטה |
| `useEffect` | הרצת קוד בזמנים מסוימים |
| `useNavigate` | ניווט בין דפים |
| `translate` | פונקציית תרגום (אנגלית/עברית) |
| `getLang`, `getDir` | שפה וכיוון טקסט |
| `client.css` | קובץ עיצוב |

---

## אייקונים

15 אייקוני SVG שמשמשים במסך:

| אייקון | תפקיד |
|--------|-------|
| `IconCamera` | כרטיס "צילום תקלה" |
| `IconSearch` | כרטיס "חיפוש מקצוען" |
| `IconMindMap` | כרטיס "מפת רעיונות" |
| `IconBell` | פעמון התראות |
| `IconUser` | תפריט פרופיל |
| `IconLogout` | יציאה מהמערכת |
| `IconStar` | דירוג ⭐ |
| `IconClock` | שעה 🕐 |
| `IconPhone` | טלפון 📞 |
| `IconWrench` | לוגו FixMate |
| `IconEdit` | עריכה |
| `IconHistory` | היסטוריה |
| `IconHeart` | מועדפים |
| `IconSettings` | הגדרות |
| `IconArrowRight` | חץ ניווט |

---

## נתוני דמה

```jsx
var MOCK_ORDERS_DATA = {
  en: [...],  // הזמנות באנגלית
  he: [...],  // הזמנות בעברית
};
```

**שדות בכל הזמנה:**

| שדה | סוג | דוגמה |
|-----|------|--------|
| `id` | מזהה | `"ORD-1041"` |
| `proName` | שם מקצוען | `"אורי כהן"` |
| `proRole` | מקצוע | `"חשמלאי"` |
| `rating` | דירוג | `4.8` |
| `status` | סטטוס | `"confirmed"` |
| `date` | תאריך | `"20/02/2026"` |
| `time` | שעה | `"10:00"` |
| `phone` | טלפון | `"+972 50-123-4567"` |
| `description` | תיאור העבודה | `"תיקון מתג..."` |

---

## משתני מצב (States)

```jsx
const [mounted, setMounted] = useState(false);        // אנימציית כניסה
const [userName] = useState(...);                      // שם המשתמש
const [orders, setOrders] = useState([]);              // רשימת הזמנות
const [showNotif, setShowNotif] = useState(false);     // תפריט התראות פתוח?
const [showProfile, setShowProfile] = useState(false); // תפריט פרופיל פתוח?
const [notifications, setNotifications] = useState([...]); // רשימת התראות

// עריכת הזמנה
const [editOrder, setEditOrder] = useState(null);   // איזו הזמנה עורכים
const [editDate, setEditDate] = useState("");       // תאריך חדש
const [editTime, setEditTime] = useState("");       // שעה חדשה
const [editDesc, setEditDesc] = useState("");       // תיאור חדש

// מעקב וביטול
const [trackOrder, setTrackOrder] = useState(null);    // הזמנה במעקב
const [cancelConfirm, setCancelConfirm] = useState(null); // הזמנה לביטול
```

---

## אפקטים (useEffect)

### 1️⃣ טעינת הזמנות מהשרת

```jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:8080/api/client/bookings', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) {
      const mapped = data.map(o => ({ ... }));
      setOrders(mapped);
    }
  });
}, []);
```

**מה עושה:**
1. מוציא את הטוקן מה־localStorage
2. שולח בקשה לשרת עם הטוקן
3. ממיר את הנתונים לפורמט שהדף מצפה לו
4. שומר ברשימת ההזמנות

### 2️⃣ אנימציית כניסה

```jsx
useEffect(() => {
  const tm = setTimeout(() => setMounted(true), 50);
  return () => clearTimeout(tm);
}, []);
```

**מה עושה:** אחרי 50ms מפעיל אנימציית הופעה של הדף.

---

## פונקציות עזר

### 🎨 STATUS_MAP — מפת סטטוסים

```jsx
const STATUS_MAP = {
  pending:     { label: "ממתין",    color: "#F59E0B" }, // כתום
  confirmed:   { label: "אושר",     color: "#3B82F6" }, // כחול
  in_progress: { label: "בתהליך",   color: "#10B981" }, // ירוק
  completed:   { label: "הושלם",    color: "#6B7280" }, // אפור
  cancelled:   { label: "בוטל",     color: "#EF4444" }, // אדום
};
```

### ✏️ עריכת הזמנה

```jsx
openEdit(order)  // פותח מודל עריכה ומזין את הערכים הנוכחיים
saveEdit()       // שומר את השינויים ברשימת ההזמנות
```

### ❌ ביטול הזמנה

```jsx
CANCEL_FEE = 50                           // דמי ביטול
getHoursUntilOrder(order)                  // כמה שעות עד ההזמנה
isWithin48Hours(order)                     // האם פחות מ־48 שעות?
confirmCancel()                            // מבצע את הביטול
```

**חוקי ביטול:**
- פחות מ־48 שעות → **דמי ביטול 50₪**
- מעל 48 שעות → **חינם** ✅

### 🔔 התראות

```jsx
unreadCount                 // כמה התראות לא נקראו
markAsRead(id)              // מסמן התראה כנקראה
markAllRead()               // מסמן הכל כנקרא
clearNotification(id)       // מוחק התראה
```

---

## מבנה המסך (JSX)

### 📍 1. ניווט עליון (`<nav>`)

```
FixMate                        🔔  👤  ⎋
```

- **לוגו** — קליקבילי, מחזיר לדף הבית
- **פעמון** — פותח תפריט התראות עם נקודה אדומה אם יש לא־נקראות
- **פרופיל** — פותח תפריט אישי
- **יציאה** — חוזר לדף התחברות

### 📍 2. ברכה

```jsx
<h1>שלום, {userName} 👋</h1>
<p>מה נעשה היום?</p>
```

### 📍 3. שלושה כרטיסי פעולה

| כרטיס | צבע | נתיב |
|-------|------|-------|
| 📷 **Snap** | כתום | `/client/snap` |
| 🔍 **Search** | כחול | `/client/search` |
| 🗺️ **Idea Map** | סגול | `/client/ideamap` |

### 📍 4. רשימת הזמנות פעילות

לכל הזמנה מוצגת:

```
┌──────────────────────────────────┐
│ 👤 אורי כהן                [אושר]│
│    חשמלאי              ORD-1041  │
│                                   │
│ תיקון מתג תאורה במטבח             │
│                                   │
│ ⭐ 4.8   🕐 20/02, 10:00   📞 ... │
│                                   │
│ [📞 צור קשר]  [בטל]              │
└──────────────────────────────────┘
```

**כפתורים לפי סטטוס:**

| סטטוס | כפתורים |
|--------|---------|
| `pending` | בטל / ערוך |
| `confirmed` | צור קשר / בטל |
| `in_progress` | עקוב |
| `completed` | ⭐ דרג |

---

## מודלים

### 📝 מודל עריכה

**מוצג כש:** לוחצים "ערוך" על הזמנה.
**שדות:**
- מזהה (לקריאה בלבד)
- מקצוען (לקריאה בלבד)
- תאריך ✏️
- שעה ✏️
- תיאור ✏️

**כפתורים:** "שמור שינויים" / "ביטול"

### 📍 מודל מעקב

**מוצג כש:** לוחצים "עקוב" על הזמנה `in_progress`.
**תוכן:** ציר זמן עם 5 שלבים:

1. ✅ הזמנה נשלחה
2. ✅ מקצוען הוקצה
3. 🔄 מקצוען בדרך
4. ⬜ העבודה החלה
5. ⬜ העבודה הושלמה

### ❌ מודל ביטול

**מוצג כש:** לוחצים "בטל" על הזמנה.
**לוגיקה:**
- בודק כמה זמן נשאר עד ההזמנה
- אם `< 48 שעות` → מציג **דמי ביטול 50₪** 💰
- אחרת → **חינם** ✅

---

## חיבור לשרת

### 📡 נתיב API

```
GET http://localhost:8080/api/client/bookings
```

### 🔑 אימות

```
Authorization: Bearer <token>
```

הטוקן נלקח מ־`localStorage`.

### 📥 פורמט תשובה (מהשרת)

```json
[
  {
    "id": 1041,
    "pro": { "fullName": "אורי כהן", "phone": "+972-..." },
    "serviceType": "חשמלאי",
    "status": "CONFIRMED",
    "scheduledAt": "2026-02-20T10:00",
    "notes": "תיקון מתג..."
  }
]
```

### 🔄 המרה (ב־Frontend)

הנתונים מומרים למבנה הבא:

```js
{
  id: "ORD-1041",
  proName: "אורי כהן",
  proRole: "חשמלאי",
  status: "confirmed",     // אותיות קטנות
  date: "2026-02-20T10:00",
  phone: "+972-...",
  description: "תיקון מתג..."
}
```

---

## 🔐 אבטחה

- **טוקן** נשמר ב־`localStorage` ונשלח עם כל בקשה
- אם הטוקן פג — השרת יחזיר 401 (לא מטופל כרגע, צריך להוסיף)
- ללא טוקן — לא ייטענו הזמנות

---

## 📱 תמיכה בשפה

- `lang` — מקבל "he" או "en"
- `dir` — מקבל "rtl" או "ltr"
- `translate(key)` — מתרגם לפי השפה
- הנתונים (mock) מוגדרים **בשתי השפות**

---

## 🎯 סיכום

**המסך כולל:**
- ✅ ניווט עם התראות ופרופיל
- ✅ ברכה אישית למשתמש
- ✅ 3 כרטיסי פעולה מהירים
- ✅ רשימת הזמנות עם סטטוסים
- ✅ 3 מודלים (עריכה, מעקב, ביטול)
- ✅ תמיכה בעברית ואנגלית
- ✅ חיבור לשרת עם אימות טוקן

**תלויות:**
- React + React Router
- LanguageContext (שפה ותרגום)
- Backend API ב־`localhost:8080`
- קובץ עיצוב `client.css`
