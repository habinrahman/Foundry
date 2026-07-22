export const recruiter = {
  dashboard: {
    hiringReport: "Hiring report",
    roleContext:
      "{role} · calibrated against must-haves, interview depth, and communication signal.",
    updatedPrefix: "Updated",
    commands: "Commands",
    insightLabel: "Insight 0{index}",
    candidateFallback: "Candidate",
    metricsAriaLabel: "Hiring operations metrics",
    insightsAriaLabel: "Interactive insights",
    scoreOverviewAriaLabel: "Score overview",
  },
  scores: {
    overall: { label: "Overall", hint: "Composite hiring bar" },
    aiConfidence: { label: "AI Confidence", hint: "Fit certainty" },
    ats: { label: "ATS", hint: "Resume structure" },
    technical: { label: "Technical", hint: "Interview depth" },
    communication: { label: "Communication", hint: "Decision framing" },
  },
  metrics: {
    applications: { label: "Applications", hint: "From Tamm Careers" },
    pendingReview: { label: "Pending review", hint: "Awaiting AI analysis" },
    averageAtsMatch: {
      label: "Average ATS match",
      hintAnalyzed: "Across reviewed candidates",
      hintEmpty: "Analyze to populate",
    },
    interviewsSuggested: {
      label: "Interviews suggested",
      hint: "Candidates with AI reports",
    },
  },
  notices: {
    demoFallback:
      "Showing representative demo analysis — resume text unavailable for this application.",
    liveAnalysisFailed:
      "Live analysis failed — showing representative demo insights for this candidate.",
    analyzeFailedGeneric: "Unable to analyze application.",
  },
  applications: {
    eyebrow: "Applications",
    heading: "Incoming from Tamm Careers",
    refresh: "Refresh",
    loading: "Loading applications…",
    loadFailed: "Failed to load applications",
    empty: {
      title: "No applications yet",
      description:
        "Applications submitted through Tamm Careers will appear here automatically for AI-assisted review.",
      action: "Open Careers",
    },
    appliedPrefix: "Applied",
    analyzing: "Analyzing…",
    viewCandidate: "View candidate",
    atsMatchLabel: "ATS Match",
    badges: {
      resumeParsed: "Resume · Parsed",
      resumeUploaded: "Resume · Uploaded",
      resumeMissing: "Resume · Missing",
      aiProcessing: "AI · Processing",
      aiReady: "AI · Ready",
      aiReadyToAnalyze: "AI · Ready to analyze",
      aiDemoAvailable: "AI · Demo available",
    },
  },
  panels: {
    radar: {
      title: "Capability radar",
      subtitle: "Interview + resume composite",
      scoreLabel: "Score",
      empty: {
        title: "No capability data yet",
        description: "Run an analysis to populate the capability radar.",
      },
    },
    skillMatrix: {
      title: "Skill matrix",
      subtitle: "Proficiency vs role relevance",
      proficiency: "Proficiency",
      relevance: "Relevance",
      empty: {
        title: "No skills mapped yet",
        description: "Run an analysis to populate the skill matrix.",
      },
    },
    timeline: {
      title: "Timeline",
      subtitle: "Career + interview arc",
      empty: {
        title: "No timeline yet",
        description: "Run an analysis to populate the candidate timeline.",
      },
    },
    resumeSummary: {
      title: "Resume Summary",
      candidateFallback: "Candidate",
      linkedin: "LinkedIn",
      github: "GitHub",
      portfolio: "Portfolio",
    },
    projects: {
      title: "Projects",
      subtitle: "Signal from shipped work",
      openAria: "Open {name}",
      empty: {
        title: "No projects yet",
        description: "Run an analysis to surface shipped work.",
      },
    },
    strengths: {
      title: "Strengths",
      subtitle: "Resume + interview signals",
    },
    weaknesses: {
      title: "Weaknesses",
      subtitle: "Gaps and stretch areas",
      missingSkills: "Missing skills",
    },
    interviewQa: {
      emptyTitle: "No interview yet",
      emptyDescription:
        "Run the candidate conversation to generate adaptive technical questions.",
      title: "Interview table",
      caption: "Technical interview questions, answers, and AI scores",
      columns: {
        index: "#",
        question: "Question",
        answer: "Answer",
        aiNote: "AI note",
        score: "Score",
      },
    },
    aiEvaluation: {
      title: "AI Evaluation",
      subtitle: "Streaming narrative with calibrated confidence",
      fitConfidence: "Fit confidence",
      strengths: "Evaluation strengths",
      weaknesses: "Evaluation weaknesses",
    },
    hiringRecommendation: {
      title: "Hiring Recommendation",
      subtitle: "Optimistic UI — updates in-memory session instantly",
      saving: "Saving…",
      rationalePrefix: "AI rationale",
      options: {
        strongHire: {
          label: "Strong Hire",
          description: "Clear yes — advance to offer track",
        },
        hire: {
          label: "Hire",
          description: "Solid match — proceed with confidence",
        },
        interview: {
          label: "Interview",
          description: "Promising — continue deeper loops",
        },
        reject: {
          label: "Reject",
          description: "Below bar — politely decline",
        },
      },
    },
  },
  export: {
    groupLabel: "Export hiring report",
    pdf: { label: "PDF", hint: "Print-ready report", toast: "Opening print dialog" },
    markdown: {
      label: "Markdown",
      hint: "Shareable write-up",
      toast: "Markdown downloaded",
    },
    json: {
      label: "JSON",
      hint: "Full session payload",
      toast: "JSON downloaded",
    },
    csv: {
      label: "CSV",
      hint: "Spreadsheet-friendly",
      toast: "CSV downloaded",
    },
    reset: "Reset",
    resetAria: "Reset demo candidate",
    resetToast: "Demo session reset",
    actionAriaLabel: "Export {label}: {hint}",
  },
  analysisLanguage: {
    generatedIn: "Generated in {language}.",
    regenerateIn: "Regenerate in {language}",
  },
};
