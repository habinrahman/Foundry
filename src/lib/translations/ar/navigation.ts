import type { Messages } from "../en";

export const navigation = {
  about: "نظرة عامة",
  engineering: "الهندسة",
  openRoles: "الوظائف المتاحة",
  apply: "تقديم",
  talk: "محادثة",
  hire: "التوظيف",
  skipToContent: "تخطي إلى المحتوى",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  language: "اللغة",
  switchLanguage: "تبديل اللغة",
  ariaLabels: {
    careersNav: "الوظائف",
    careersMobileNav: "قائمة الوظائف للجوال",
    primaryNav: "القائمة الرئيسية",
    mobileNav: "قائمة الجوال",
  },
} as const satisfies Messages["navigation"];
