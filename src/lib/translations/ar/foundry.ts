import type { Messages } from "../en";

export const foundry = {
  shell: {
    skipToContent: "تخطي إلى المحتوى",
    search: "بحث",
    openCommandPalette: "فتح لوحة الأوامر",
  },
  commandPalette: {
    placeholder: "اكتب أمرًا أو ابحث…",
    noMatches: "لا توجد نتائج مطابقة",
    ariaLabel: "لوحة الأوامر",
    escKey: "esc",
    groups: {
      navigate: "التنقّل",
      appearance: "المظهر",
      export: "التصدير",
      session: "الجلسة",
      help: "المساعدة",
    },
    items: {
      candidateUpload: "تحميل ملف المرشح",
      recruiterDashboard: "لوحة تحكم فريق التوظيف",
      switchToLight: "التبديل إلى الوضع الفاتح",
      switchToDark: "التبديل إلى الوضع الداكن",
      exportPdf: "تصدير PDF",
      exportMarkdown: "تصدير Markdown",
      exportJson: "تصدير JSON",
      exportCsv: "تصدير CSV",
      resetDemoCandidate: "إعادة تعيين المرشح التجريبي",
      keyboardShortcuts: "اختصارات لوحة المفاتيح",
    },
  },
  errorBoundary: {
    eyebrow: "حدث خطأ ما",
    defaultTitle: "واجهت هذه الصفحة خطأً غير متوقع",
    unknownError: "خطأ غير معروف في التطبيق",
    reload: "إعادة تحميل",
  },
  notFound: {
    eyebrow: "404",
    title: "ضلّت هذه الصفحة طريقها في مسار التوظيف",
    description:
      "الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها. لنعدك إلى المسار الصحيح.",
    backToHome: "العودة إلى الرئيسية",
  },
  talk: {
    eyebrow: "محادثة",
    title: "تحدّث مع Foundry",
    ariaLabel: "محادثة الذكاء الاصطناعي",
    foundryLabel: "Foundry",
    welcome:
      "أسقط سيرة ذاتية وسأرافقك في مسار التوظيف — تحليل، واستدلال، ومقابلة، وتقرير.",
    askLinkedin:
      "تمام. اختياريًا: ألصق رابط LinkedIn لأتحقق من إشارات إضافية — أو استمر بدونه.",
    demoUsed:
      "يتم استخدام نص السيرة الذاتية التجريبية مع تحليل Gemini المباشر. أضف LinkedIn إذا أردت — أو استمر.",
    skipUploadDemo: "تخطي التحميل — استخدام المرشح التجريبي",
    demoFileLabel: "استخدام السيرة الذاتية التجريبية (Aisha Rahman)",
    uploadedFile: "تم تحميل {fileName}",
    linkedInLabel: "رابط LinkedIn",
    linkedInPlaceholder: "https://linkedin.com/in/you",
    continue: "متابعة",
    skip: "تخطي",
    continueWithoutLinkedin: "الاستمرار بدون LinkedIn",
    analyzingMessage: "جارٍ تشغيل خط أنابيب التوظيف بالذكاء الاصطناعي المباشر…",
    sourcePrefix: "المصدر",
    openRecruiterReport: "فتح تقرير فريق التوظيف",
    startOver: "البدء من جديد",
    readyAgain:
      "جاهز عندما تكون جاهزًا — أسقط سيرة ذاتية أخرى أو استخدم الملف التجريبي.",
  },
} as const satisfies Messages["foundry"];
