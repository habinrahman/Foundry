import type { Messages } from "../en";

export const recruiter = {
  dashboard: {
    hiringReport: "تقرير التوظيف",
    roleContext:
      "{role} · مُقيَّم بناءً على المتطلبات الأساسية، وعمق المقابلة، وإشارة التواصل.",
    updatedPrefix: "آخر تحديث",
    commands: "الأوامر",
    insightLabel: "الرؤية 0{index}",
    candidateFallback: "المرشح",
    metricsAriaLabel: "مقاييس عمليات التوظيف",
    insightsAriaLabel: "رؤى تفاعلية",
    scoreOverviewAriaLabel: "نظرة عامة على الدرجات",
  },
  scores: {
    overall: { label: "الإجمالي", hint: "مقياس التوظيف المُجمّع" },
    aiConfidence: { label: "ثقة الذكاء الاصطناعي", hint: "درجة اليقين بالتوافق" },
    ats: { label: "ATS", hint: "بنية السيرة الذاتية" },
    technical: { label: "التقني", hint: "عمق المقابلة" },
    communication: { label: "التواصل", hint: "وضوح اتخاذ القرار" },
  },
  metrics: {
    applications: { label: "الطلبات", hint: "من Tamm Careers" },
    pendingReview: { label: "قيد المراجعة", hint: "في انتظار تحليل الذكاء الاصطناعي" },
    averageAtsMatch: {
      label: "متوسط تطابق ATS",
      hintAnalyzed: "على المرشحين الذين تمت مراجعتهم",
      hintEmpty: "قم بالتحليل للعرض",
    },
    interviewsSuggested: {
      label: "مقابلات مقترحة",
      hint: "مرشحون لديهم تقارير ذكاء اصطناعي",
    },
  },
  notices: {
    demoFallback:
      "يتم عرض تحليل تجريبي تمثيلي — نص السيرة الذاتية غير متاح لهذا الطلب.",
    liveAnalysisFailed:
      "فشل التحليل المباشر — يتم عرض رؤى تجريبية تمثيلية لهذا المرشح.",
    analyzeFailedGeneric: "تعذّر تحليل الطلب.",
  },
  applications: {
    eyebrow: "الطلبات",
    heading: "الطلبات الواردة من Tamm Careers",
    refresh: "تحديث",
    loading: "جارٍ تحميل الطلبات…",
    loadFailed: "فشل تحميل الطلبات",
    empty: {
      title: "لا توجد طلبات بعد",
      description:
        "ستظهر هنا الطلبات المُرسلة عبر Tamm Careers تلقائيًا لمراجعتها بمساعدة الذكاء الاصطناعي.",
      action: "فتح صفحة الوظائف",
    },
    appliedPrefix: "تم التقديم",
    analyzing: "جارٍ التحليل…",
    viewCandidate: "عرض المرشح",
    atsMatchLabel: "تطابق ATS",
    badges: {
      resumeParsed: "السيرة الذاتية · تم التحليل",
      resumeUploaded: "السيرة الذاتية · تم التحميل",
      resumeMissing: "السيرة الذاتية · غير متوفرة",
      aiProcessing: "الذكاء الاصطناعي · قيد المعالجة",
      aiReady: "الذكاء الاصطناعي · جاهز",
      aiReadyToAnalyze: "الذكاء الاصطناعي · جاهز للتحليل",
      aiDemoAvailable: "الذكاء الاصطناعي · نموذج تجريبي متاح",
    },
  },
  panels: {
    radar: {
      title: "مخطط القدرات",
      subtitle: "تركيبة المقابلة والسيرة الذاتية",
      scoreLabel: "الدرجة",
      empty: {
        title: "لا توجد بيانات قدرات بعد",
        description: "شغّل تحليلًا لعرض مخطط القدرات.",
      },
    },
    skillMatrix: {
      title: "مصفوفة المهارات",
      subtitle: "الكفاءة مقارنةً بأهمية الوظيفة",
      proficiency: "الكفاءة",
      relevance: "الأهمية",
      empty: {
        title: "لا توجد مهارات مُحدَّدة بعد",
        description: "شغّل تحليلًا لعرض مصفوفة المهارات.",
      },
    },
    timeline: {
      title: "المسار الزمني",
      subtitle: "المسار المهني والمقابلات",
      empty: {
        title: "لا يوجد مسار زمني بعد",
        description: "شغّل تحليلًا لعرض المسار الزمني للمرشح.",
      },
    },
    resumeSummary: {
      title: "ملخص السيرة الذاتية",
      candidateFallback: "المرشح",
      linkedin: "LinkedIn",
      github: "GitHub",
      portfolio: "معرض الأعمال",
    },
    projects: {
      title: "المشاريع",
      subtitle: "إشارات من أعمال مُسلَّمة",
      openAria: "فتح {name}",
      empty: {
        title: "لا توجد مشاريع بعد",
        description: "شغّل تحليلًا لإظهار الأعمال المُسلَّمة.",
      },
    },
    strengths: {
      title: "نقاط القوة",
      subtitle: "إشارات من السيرة الذاتية والمقابلة",
    },
    weaknesses: {
      title: "نقاط الضعف",
      subtitle: "الثغرات والمجالات التي تحتاج تطويرًا",
      missingSkills: "مهارات مفقودة",
    },
    interviewQa: {
      emptyTitle: "لا توجد مقابلة بعد",
      emptyDescription:
        "شغّل محادثة المرشح لتوليد أسئلة تقنية تكيّفية.",
      title: "جدول المقابلة",
      caption: "أسئلة المقابلة التقنية والإجابات ودرجات الذكاء الاصطناعي",
      columns: {
        index: "#",
        question: "السؤال",
        answer: "الإجابة",
        aiNote: "ملاحظة الذكاء الاصطناعي",
        score: "الدرجة",
      },
    },
    aiEvaluation: {
      title: "تقييم الذكاء الاصطناعي",
      subtitle: "سرد تدريجي مع درجة ثقة مُحسوبة",
      fitConfidence: "ثقة التوافق",
      strengths: "نقاط قوة التقييم",
      weaknesses: "نقاط ضعف التقييم",
    },
    hiringRecommendation: {
      title: "توصية التوظيف",
      subtitle: "واجهة استباقية — تُحدّث جلسة الذاكرة فورًا",
      saving: "جارٍ الحفظ…",
      rationalePrefix: "تعليل الذكاء الاصطناعي",
      options: {
        strongHire: {
          label: "Strong Hire",
          description: "نعم واضحة — التقدّم إلى مسار العرض الوظيفي",
        },
        hire: {
          label: "Hire",
          description: "تطابق جيد — المضي قدمًا بثقة",
        },
        interview: {
          label: "Interview",
          description: "مرشّح واعد — الاستمرار في جولات أعمق",
        },
        reject: {
          label: "Reject",
          description: "أدنى من المعيار المطلوب — الرفض بلباقة",
        },
      },
    },
  },
  export: {
    groupLabel: "تصدير تقرير التوظيف",
    pdf: { label: "PDF", hint: "تقرير جاهز للطباعة", toast: "جارٍ فتح نافذة الطباعة" },
    markdown: {
      label: "Markdown",
      hint: "مستند قابل للمشاركة",
      toast: "تم تنزيل ملف Markdown",
    },
    json: {
      label: "JSON",
      hint: "بيانات الجلسة الكاملة",
      toast: "تم تنزيل ملف JSON",
    },
    csv: {
      label: "CSV",
      hint: "متوافق مع جداول البيانات",
      toast: "تم تنزيل ملف CSV",
    },
    reset: "إعادة تعيين",
    resetAria: "إعادة تعيين المرشح التجريبي",
    resetToast: "تمت إعادة تعيين الجلسة التجريبية",
    actionAriaLabel: "تصدير {label}: {hint}",
  },
  analysisLanguage: {
    generatedIn: "تم إنشاؤه باللغة {language}.",
    regenerateIn: "إعادة الإنشاء باللغة {language}",
  },
} as const satisfies Messages["recruiter"];
