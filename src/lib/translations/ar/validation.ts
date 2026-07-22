import type { Messages } from "../en";

export const validation = {
  fullNameRequired: "أدخل اسمك الكامل",
  emailInvalid: "أدخل بريدًا إلكترونيًا صحيحًا",
  phoneRequired: "أدخل رقم هاتف",
  countryRequired: "أدخل بلد إقامتك",
  roleRequired: "اختر وظيفة",
  experienceRequired: "اختر مستوى الخبرة",
  linkedInUrlInvalid: "أدخل رابط LinkedIn صحيحًا",
  urlInvalid: "أدخل رابطًا صحيحًا",
  resumeRequired: "قم بتحميل سيرة ذاتية بصيغة PDF أو DOCX",
  interestReasonTooShort: "يرجى مشاركة فقرة قصيرة على الأقل",
  strongFitReasonTooShort: "يرجى مشاركة فقرة قصيرة على الأقل",
  fileTypeInvalid: "يرجى تحميل سيرة ذاتية بصيغة PDF أو DOCX.",
  fileTooLarge: "يجب أن يكون حجم الملف أقل من {maxSizeMb} ميجابايت.",
} as const satisfies Messages["validation"];
