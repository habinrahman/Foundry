import type { Messages } from "../en";

export const common = {
  light: "فاتح",
  dark: "داكن",
  switchToLightMode: "التبديل إلى الوضع الفاتح",
  switchToDarkMode: "التبديل إلى الوضع الداكن",
  back: "رجوع",
  continue: "متابعة",
  edit: "تعديل",
  close: "إغلاق",
  search: "بحث",
  refresh: "تحديث",
  reset: "إعادة تعيين",
  reload: "إعادة تحميل",
  noMatches: "لا توجد نتائج مطابقة",
  unknownError: "حدث خطأ ما.",
  contact: "تواصل معنا",
  privacy: "الخصوصية",
  accessibility: "إمكانية الوصول",
  emptyValue: "—",
  justNow: "الآن",
  minutesAgo: "منذ {minutes} دقيقة",
  hoursAgo: "منذ {hours} ساعة",
  daysAgo: "منذ {days} يوم",
  resumeDropzone: {
    title: "أسقط سيرتك الذاتية هنا",
    description:
      "PDF أو DOCX · حتى 8 ميجابايت. يتم استخراج النص من جهة الخادم وإرساله إلى Gemini للتحليل الفوري.",
    browse: "تصفح الملفات",
    selectedPrefix: "المحدد",
    ariaLabel:
      "تحميل السيرة الذاتية. اسحب وأسقط ملف PDF أو DOCX، أو اضغط Enter للتصفح.",
  },
} as const satisfies Messages["common"];
