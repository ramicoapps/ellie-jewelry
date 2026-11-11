/*
  רשימת המוצרים של Ellie Jewelry
  ------------------------------------------------------------
  כאן מעדכנים מוצרים ומחירים. כל מוצר בנוי כך:
    id        – מזהה באנגלית (בלי רווחים), משמש לכתובת העמוד
    name      – שם המוצר
    category  – "necklaces" (שרשראות) או "earrings" (עגילים)
    sub       – תת-קטגוריה (הרשימה ב-CATEGORIES למטה), למשל "tennis"
    wear      – (לא חובה) תמונת "איך לענוד" מ-assets/img/lifestyle וטיפ קצר
    inStock   – (לא חובה) false = "אזל מהמלאי", ומופיע טופס "עדכנו אותי כשחוזר"
    price     – מחיר בשקלים (מספר בלבד)
    oldPrice  – (לא חובה) מחיר לפני הנחה
    images    – תמונות מתוך assets/img/products. הראשונה היא הראשית
    model     – (לא חובה) תמונת דוגמנית שמופיעה במעבר עכבר
    options   – אפשרויות בחירה, למשל גוון או עובי
    badge     – (לא חובה) תגית קטנה, למשל "חדש" או "רב מכר"
    featured  – true = מופיע ברשימת "האהובים שלנו" בדף הבית
    baseTone  – הגוון שמופיע בתמונה: "gold" / "silver" / "rose".
                כשבוחרים גוון אחר, האתר צובע את התמונה (הדמיה)
    toneImages – (לא חובה) תמונה אמיתית לכל גוון, למשל:
                { "זהב": "x-gold.webp", "כסף": "x-silver.webp" }
                כשיש תמונה אמיתית – היא מוצגת במקום ההדמיה
    description – תיאור קצר

  ⚠️ המחירים כרגע זמניים – יש להחליף במחירים האמיתיים.
*/

const WHATSAPP_NUMBER = "972505899955";

const CATEGORIES = {
  necklaces: {
    name: "שרשראות", image: "tennis-spikes-model.webp",
    subs: { tennis: "שרשראות טניס", collier: "קולייר טניס", rigid: "שרשראות קשיחות", delicate: "שרשראות עדינות" },
  },
  earrings: {
    name: "עגילים", image: "lotus-drop-model.webp",
    subs: { helix: "הליקס ללא חור", drop: "עגילים נופלים", double: "עגילי מחור לחור", hoops: "חישוקים", studs: "עגילים צמודים" },
  },
};

const TONES_3 = ["זהב", "כסף", "רוז גולד"];

const PRODUCTS = [
  // ───────────── עגילים ─────────────
  {
    id: "helix-marquise",
    sub: "helix",
    baseTone: "rose",
    name: "הליקס ללא חור – אבן מרקיזה",
    category: "earrings",
    price: 149,
    images: ["helix-marquise.webp"],
    options: [{ label: "גוון", values: ["רוז גולד"] }],
    description: "עגיל הליקס שלא דורש חור, משובץ אבן מרקיזה מרכזית. נלבש בקלות ונותן מראה של פירסינג.",
  },
  {
    id: "helix-tennis",
    sub: "helix",
    baseTone: "rose",
    name: "הליקס ללא חור – טניס קלאסי",
    category: "earrings",
    price: 139,
    images: ["helix-tennis.webp"],
    options: [{ label: "גוון", values: ["רוז גולד"] }],
    badge: "רב מכר",
    featured: true,
    description: "עגיל הליקס קלאסי משובץ שורת אבנים, ללא צורך בחור. עדין ומתאים לכל יום.",
  },
  {
    id: "hoop-marquise",
    sub: "hoops",
    baseTone: "silver",
    name: "עגיל חישוק – מסגרת מרקיזה נופלת",
    category: "earrings",
    price: 179,
    images: ["hoop-marquise.webp"],
    options: [{ label: "גוון", values: ["כסף"] }],
    description: "חישוק משובץ עם מסגרת מרקיזה נופלת שתופסת את האור בכל תנועה.",
  },
  {
    id: "lotus-peer",
    sub: "double",
    baseTone: "rose",
    name: "עגיל מחור לחור – לוטוס פאר",
    category: "earrings",
    price: 199,
    images: ["lotus-peer.webp"],
    model: "lotus-peer-model.webp",
    options: [{ label: "גוון", values: TONES_3 }],
    badge: "חדש",
    featured: true,
    description: "עגיל מחור לחור עם פרח לוטוס משובץ ושרשרת מחברת. קיים בזהב, כסף ורוז גולד.",
  },
  {
    id: "lotus-drop",
    sub: "drop",
    baseTone: "gold",
    name: "עגיל נופל – לוטוס",
    category: "earrings",
    price: 169,
    images: ["lotus-drop.webp"],
    model: "lotus-drop-model.webp",
    options: [{ label: "גוון", values: ["זהב", "כסף"] }],
    featured: true,
    description: "עגיל לוטוס משובץ עם שרשרת נופלת ואבנים קטנות לאורכה. קיים בזהב וכסף.",
  },
  {
    id: "marquise-drop",
    sub: "drop",
    baseTone: "silver",
    name: "עגיל נופל – מרקיזה",
    category: "earrings",
    price: 159,
    images: ["marquise-drop.webp"],
    options: [{ label: "גוון", values: ["כסף"] }],
    description: "עגיל צמוד עם שרשרת עדינה ואבן מרקיזה בקצה.",
  },
  {
    id: "rainbow-drops",
    sub: "studs",
    baseTone: "silver",
    name: "עגיל קשת – שלוש טיפות",
    category: "earrings",
    price: 149,
    images: ["rainbow-drops.webp"],
    options: [{ label: "גוון", values: ["זהב", "כסף"] }],
    description: "עגיל קשת צמוד עם שלוש אבני טיפה. קיים בזהב וכסף.",
  },

  // ───────────── שרשראות ─────────────
  {
    id: "oval-classic",
    wear: { image: "wear-oval.webp", tip: "תכשיט שמתאים לכל יום: שלבי עם סוודר בגזרת V או חולצה מכופתרת פתוחה, ותני לאבן להיות במרכז." },
    sub: "delicate",
    toneImages: { "זהב": "oval-gold.webp", "כסף": "oval-silver.webp" },
    name: "שרשרת אובל קלאסית גדולה",
    category: "necklaces",
    price: 229,
    images: ["oval-gold.webp", "oval-silver.webp"],
    options: [{ label: "גוון", values: ["זהב", "כסף"] }],
    featured: true,
    description: "שרשרת עדינה עם אבן אובל גדולה בשיבוץ ארבע שיניים. קלאסיקה שמתאימה לכל מראה.",
  },
  {
    id: "thread-marquise",
    sub: "delicate",
    toneImages: { "זהב": "thread-gold.webp", "ורוד": "thread-pink.webp", "שחור": "thread-black.webp" },
    name: "שרשרת חוט – תליון טיפה מרקיז",
    category: "necklaces",
    price: 189,
    images: ["thread-marquise.webp", "thread-gold.webp", "thread-pink.webp", "thread-black.webp"],
    options: [{ label: "צבע החוט", values: ["זהב", "ורוד", "שחור"] }],
    description: "שרשרת חוטים מרובת שכבות עם תליון טיפה. קיימת במספר גוונים.",
  },
  {
    id: "tennis-graduated",
    sub: "tennis",
    baseTone: "rose",
    name: "שרשרת טניס 3 שיניים – דגרדה",
    category: "necklaces",
    price: 389,
    images: ["tennis-graduated.webp"],
    options: [{ label: "גוון", values: ["רודיום", "ציפוי זהב 14 קראט"] }],
    description: "שרשרת טניס בשיבוץ שלוש שיניים, עם אבנים שגדלות בהדרגה לכיוון המרכז.",
  },
  {
    id: "pear-tennis",
    sub: "tennis",
    name: "שרשרת טניס – אבן טיפה",
    category: "necklaces",
    price: 349,
    images: ["pear-tennis-bust.webp"],
    options: [{ label: "גוון", values: TONES_3 }],
    badge: "רב מכר",
    featured: true,
    description: "שרשרת טניס עדינה עם אבן טיפה מרכזית. קיימת בכסף, זהב ורוז גולד.",
  },
  {
    id: "tennis-classic",
    sub: "tennis",
    baseTone: "silver",
    name: "שרשרת טניס קלאסית",
    category: "necklaces",
    price: 299,
    images: ["tennis-classic.webp"],
    options: [
      { label: "עובי", values: ["2 מ״מ", "3 מ״מ", "4 מ״מ"] },
      { label: "גוון", values: ["רודיום"] },
    ],
    description: "שרשרת הטניס הקלאסית, בשלושה עוביים לבחירה.",
  },
  {
    id: "tennis-spikes",
    sub: "tennis",
    baseTone: "rose",
    name: "שרשרת טניס שפיצים 3 מ״מ",
    category: "necklaces",
    price: 329,
    images: ["tennis-spikes.webp"],
    model: "tennis-spikes-model.webp",
    options: [{ label: "גוון", values: ["כסף", "זהב"] }],
    description: "שרשרת טניס בשיבוץ שפיצים בעובי 3 מ״מ. קיימת בכסף וזהב.",
  },
  {
    id: "collier-square",
    sub: "collier",
    baseTone: "rose",
    name: "קולייר טניס 3 מ״מ – חיתוך מרובע",
    category: "necklaces",
    price: 359,
    images: ["collier-square.webp"],
    options: [{ label: "גוון", values: ["רוז גולד", "זהב", "כסף"] }],
    badge: "חדש",
    featured: true,
    description: "קולייר טניס באבנים בחיתוך מרובע. קיים ברוז גולד, זהב וכסף.",
  },
  {
    id: "collier-marquise-center",
    sub: "collier",
    baseTone: "rose",
    name: "קולייר טניס דגרדה – מרקיזה מרכזית",
    category: "necklaces",
    price: 419,
    images: ["collier-marquise-center.webp"],
    options: [{ label: "גוון", values: ["כסף", "ציפוי זהב 14 קראט"] }],
    featured: true,
    description: "קולייר טניס בדירוג אבנים עם מרקיזה מרכזית. קיים בכסף ובציפוי זהב 14 קראט.",
  },
  {
    id: "collier-mini-ovals",
    sub: "collier",
    baseTone: "rose",
    name: "קולייר טניס – מיני אובלים לרוחב",
    category: "necklaces",
    price: 389,
    images: ["collier-mini-ovals.webp"],
    options: [{ label: "גוון", values: ["זהב 14 קראט"] }],
    description: "קולייר טניס משובץ אבני אובל קטנות לרוחב, בצבע זהב 14 קראט.",
  },
  {
    id: "collier-marquises",
    sub: "collier",
    baseTone: "rose",
    name: "קולייר טניס – משובץ מרקיזות",
    category: "necklaces",
    price: 399,
    images: ["collier-marquises.webp"],
    options: [{ label: "גוון", values: ["זהב", "כסף"] }],
    featured: true,
    description: "קולייר טניס משובץ אבני מרקיזה לכל אורכו. קיים בזהב וכסף.",
  },
  {
    id: "rigid-rectangle",
    sub: "rigid",
    baseTone: "rose",
    name: "שרשרת קשיחה – מסגרת מלבן",
    category: "necklaces",
    price: 219,
    images: ["rigid-rectangle.webp"],
    options: [{ label: "גוון", values: ["כסף", "זהב"] }],
    description: "שרשרת קשיחה עם תליון מסגרת מלבנית ואבן מרכזית. קיימת בכסף וזהב.",
  },
  {
    id: "rigid-pear",
    sub: "rigid",
    baseTone: "gold",
    name: "שרשרת קשיחה – תליון טיפה",
    category: "necklaces",
    price: 219,
    images: ["rigid-pear.webp"],
    options: [{ label: "גוון", values: ["כסף", "זהב 14 קראט", "רוז גולד"] }],
    description: "שרשרת קשיחה עם תליון אבן טיפה. קיימת בכסף, זהב 14 קראט ורוז גולד.",
  },
];
