import type { CandidateSession } from "@/types/dashboard";

export const DEMO_CANDIDATE: CandidateSession = {
  id: "cand_demo_aisha",
  roleTitle: "AI Product Engineer",
  updatedAt: new Date().toISOString(),
  analysisLanguage: "en",
  resume: {
    name: "Aisha Rahman",
    email: "aisha.rahman@email.com",
    phone: "+1 (415) 555-0142",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "LLM Orchestration",
      "Prompt Engineering",
      "RAG",
      "Evaluation Harnesses",
      "PostgreSQL",
      "Product Design Collaboration",
      "System Design",
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        startDate: "2016-08",
        endDate: "2020-05",
        highlights: ["AI coursework", "HCI elective focus"],
      },
    ],
    experience: [
      {
        company: "Northline Labs",
        title: "Senior Product Engineer",
        location: "San Francisco, CA",
        startDate: "2023-03",
        endDate: null,
        current: true,
        description:
          "Owns AI-assisted workflows for an internal knowledge product used by 4k weekly active users.",
        highlights: [
          "Shipped retrieval + citation UX that cut support escalations 28%",
          "Built offline eval suite for answer faithfulness and latency budgets",
          "Partnered with design on streaming response patterns and failure states",
        ],
        technologies: ["TypeScript", "Next.js", "Python", "OpenAI", "pgvector"],
      },
      {
        company: "Cascade Health",
        title: "Full-Stack Engineer",
        location: "Remote",
        startDate: "2020-07",
        endDate: "2023-02",
        current: false,
        description:
          "Built clinician-facing web apps with strong reliability and accessibility requirements.",
        highlights: [
          "Led migration to typed API contracts across 3 product surfaces",
          "Introduced structured logging that reduced MTTR by 35%",
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      },
    ],
    projects: [
      {
        name: "EvalBench",
        description:
          "Open-source harness for scoring LLM product features across faithfulness, tone, and cost.",
        technologies: ["Python", "TypeScript", "Gemini", "Zod"],
        url: "https://github.com/example/evalbench",
        highlights: [
          "Supports rubric + LLM-as-judge scoring",
          "Used internally to gate weekly model upgrades",
        ],
      },
      {
        name: "Briefly",
        description:
          "AI meeting brief generator with source-linked summaries for product teams.",
        technologies: ["Next.js", "RAG", "Tailwind"],
        url: "https://briefly.example.com",
        highlights: [
          "Streaming UI with progressive disclosure",
          "Citation chips mapped to transcript spans",
        ],
      },
    ],
    achievements: [
      {
        title: "Engineering Excellence Award",
        description: "Recognized for shipping AI eval gates into the release pipeline.",
        date: "2024-11",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        date: "2022-06",
        credentialUrl: null,
      },
    ],
    github: "https://github.com/aisharahman",
    portfolio: "https://aisharahman.dev",
    linkedin: "https://linkedin.com/in/aisharahman",
    rawTextExcerpt:
      "Senior product engineer shipping AI-native workflows with strong eval discipline.",
  },
  analysis: {
    professionalSummary:
      "Aisha Rahman is a senior product engineer with deep experience shipping AI-assisted product surfaces. She combines strong TypeScript/React craft with practical LLM orchestration, evaluation harnesses, and product collaboration. Her recent work shows measurable impact on quality, latency, and support load.",
    topStrengths: [
      "End-to-end ownership of AI product features",
      "Strong eval and quality gating mindset",
      "Clear product collaboration and UX sensitivity",
      "Solid TypeScript / Next.js execution",
      "Evidence of measurable business impact",
    ],
    weaknesses: [
      "Limited explicit agent/multi-tool orchestration depth on resume",
      "Less visible large-scale distributed systems leadership",
      "Few published technical write-ups beyond projects",
    ],
    missingSkills: [
      "Agent frameworks at production scale",
      "Formal MLOps / model fine-tuning ownership",
      "Mobile product experience",
    ],
    atsScore: 88,
    hiringRecommendation: "Strong Hire",
    recommendationRationale:
      "Clear must-have coverage for an AI Product Engineer: shipped LLM features, eval loops, and polished product UX with quantified outcomes. Gaps are addressable and do not block a senior hire path.",
  },
  fit: {
    headline:
      "You ship AI product features with the eval discipline this role needs.",
    narrative:
      "Your background maps cleanly to an AI Product Engineer mandate: you have built retrieval-backed experiences, streaming UX, and offline evaluation gates rather than demos. At Northline Labs you reduced escalations while holding latency budgets — exactly the product/quality trade-off this role optimizes for. Your TypeScript and Next.js depth means you can own the product surface, not only the prompt layer. The main stretch is broader agent orchestration; your EvalBench work suggests you already think in measurable quality loops, which transfers well.",
    matchPoints: [
      "Production LLM features with citations and streaming UX",
      "Offline evaluation harness experience",
      "Strong collaboration signal with design/product",
      "Quantified outcomes on quality and support load",
    ],
    riskPoints: [
      "Agentic tooling depth is thinner than pure AI-platform peers",
      "Would benefit from clearer articulation of failure-mode playbooks in interview",
    ],
    confidence: 0.86,
  },
  questions: {
    adaptationNotes:
      "Weighted toward LLM systems, product trade-offs, and eval design given Aisha's Northline + EvalBench background.",
    questions: [
      {
        id: "q1",
        question:
          "Walk through how you would design an offline evaluation suite for a RAG answer feature before a model upgrade.",
        category: "llm-systems",
        difficulty: "medium",
        rationale: "Directly maps to her EvalBench / faithfulness work.",
        expectedSignals: [
          "Rubrics",
          "Gold sets",
          "Regression gates",
          "Cost/latency awareness",
        ],
      },
      {
        id: "q2",
        question:
          "A streaming AI response starts strong then becomes confidently wrong. How do you design the UX and system response?",
        category: "product-sense",
        difficulty: "medium",
        rationale: "Tests product judgment under non-determinism.",
        expectedSignals: [
          "Interrupt/regenerate",
          "Citation checks",
          "Confidence cues",
          "Telemetry",
        ],
      },
      {
        id: "q3",
        question:
          "How do you decide between prompt changes, retrieval improvements, and fine-tuning for a quality issue?",
        category: "architecture",
        difficulty: "hard",
        rationale: "Senior AI product trade-off thinking.",
        expectedSignals: [
          "Diagnosis first",
          "Cost of change",
          "Measurable uplift",
          "Reversibility",
        ],
      },
      {
        id: "q4",
        question:
          "Explain a time you debugged a flaky LLM feature in production. What instrumentation mattered?",
        category: "debugging",
        difficulty: "medium",
        rationale: "Looks for production maturity.",
        expectedSignals: [
          "Traces",
          "Prompt/versioning",
          "Replay",
          "User impact triage",
        ],
      },
      {
        id: "q5",
        question:
          "Design the data model for storing citations that must map back to source spans in a transcript.",
        category: "fundamentals",
        difficulty: "easy",
        rationale: "Grounds architecture basics from Briefly-like work.",
        expectedSignals: [
          "Offsets/spans",
          "Source ids",
          "Integrity checks",
        ],
      },
      {
        id: "q6",
        question:
          "How would you set latency and cost budgets for an AI feature used by 4k WAU?",
        category: "product-sense",
        difficulty: "medium",
        rationale: "Scale matches her current product.",
        expectedSignals: [
          "p95 targets",
          "Caching",
          "Model tiering",
          "Degradation paths",
        ],
      },
      {
        id: "q7",
        question:
          "Where do LLM-as-judge evaluations fail, and how do you mitigate that?",
        category: "llm-systems",
        difficulty: "hard",
        rationale: "Stress-tests eval sophistication.",
        expectedSignals: [
          "Bias",
          "Rubric leakage",
          "Human calibration",
          "Ensemble checks",
        ],
      },
      {
        id: "q8",
        question:
          "Describe how you partner with design on AI empty/error/partial states.",
        category: "behavioral-technical",
        difficulty: "easy",
        rationale: "Product collaboration signal.",
        expectedSignals: [
          "State matrix",
          "Content strategy",
          "User recovery",
        ],
      },
      {
        id: "q9",
        question:
          "Propose an architecture for tool-calling agents that must remain auditable for enterprise customers.",
        category: "architecture",
        difficulty: "hard",
        rationale: "Probes the gap area around agents.",
        expectedSignals: [
          "Action logs",
          "Policy layer",
          "Human approval",
          "Idempotency",
        ],
      },
      {
        id: "q10",
        question:
          "How do you communicate AI quality risk to a PM who wants to ship this week?",
        category: "behavioral-technical",
        difficulty: "medium",
        rationale: "Executive communication for hiring bar.",
        expectedSignals: [
          "Risk framing",
          "Mitigations",
          "Go/no-go criteria",
        ],
      },
    ],
  },
  answers: [
    {
      questionId: "q1",
      answer:
        "I start with a fixed gold set covering easy/hard/adversarial queries, score faithfulness and citation coverage, and gate upgrades on no-regression plus latency budgets. I keep human spot-checks for judge drift.",
    },
    {
      questionId: "q2",
      answer:
        "I treat mid-stream failure as a first-class state: allow stop/regenerate, show source chips early, and log partial completions. If citations fail validation, I collapse the answer into a safer summary with explicit uncertainty.",
    },
    {
      questionId: "q3",
      answer:
        "I diagnose whether the miss is retrieval, instructions, or model capability. Prompt/retrieval first because they are reversible; fine-tune only when the gap is systematic and measurable across eval slices.",
    },
    {
      questionId: "q4",
      answer:
        "We had intermittent citation mismatches. Prompt+doc versioning, request traces, and replay fixtures let us isolate a chunker change. We added a span integrity check before render.",
    },
    {
      questionId: "q5",
      answer:
        "Store sourceId, start/end offsets, checksum of the span text, and a display snippet. Validate checksums at render time so stale indexes cannot silently cite the wrong span.",
    },
    {
      questionId: "q6",
      answer:
        "Set p95 latency from user workflow tolerance, tier models by query complexity, cache retrieval for repeated intents, and degrade to extractive summaries when budgets are exceeded.",
    },
    {
      questionId: "q7",
      answer:
        "Judges overfit rubrics and prefer verbose answers. I calibrate with blinded human labels, use multiple judges sparingly, and track disagreement clusters as eval bugs.",
    },
    {
      questionId: "q8",
      answer:
        "We maintain a state matrix with design: idle, streaming, partial, blocked, and failed. Each state has copy, recovery actions, and analytics events so UX and engineering share one contract.",
    },
    {
      questionId: "q9",
      answer:
        "I'd put a policy layer in front of tools, require structured action logs, support human approval for irreversible actions, and make tool calls idempotent with correlation ids for audit replay.",
    },
    {
      questionId: "q10",
      answer:
        "I frame residual risk with user impact, likelihood, and mitigations, then propose a narrow ship behind a flag with eval gates and a rollback owner. If gates fail, we don't negotiate the quality bar.",
    },
  ],
  evaluation: {
    overallScore: 91,
    strengths: [
      "Strong systems + product framing on AI quality",
      "Concrete instrumentation and rollback thinking",
      "Clear communication under ambiguity",
      "Good calibration on when not to fine-tune",
    ],
    weaknesses: [
      "Agent audit design was solid but less battle-tested than RAG/eval answers",
      "Could quantify cost trade-offs more explicitly in two answers",
    ],
    overallEvaluation:
      "Aisha performs at a senior AI Product Engineer bar. She consistently grounds answers in evaluation, UX failure modes, and ship criteria. Communication is crisp and decision-oriented. Recommend Strong Hire with interview confirmation on agent governance depth.",
    hiringRecommendation: "Strong Hire",
    perQuestion: [
      {
        questionId: "q1",
        score: 9,
        strengths: ["Gold sets", "Regression gates"],
        weaknesses: ["Could mention slice coverage explicitly"],
        feedback: "Excellent eval design instinct.",
      },
      {
        questionId: "q2",
        score: 9,
        strengths: ["UX states", "Safety collapse"],
        weaknesses: [],
        feedback: "Product-mature response.",
      },
      {
        questionId: "q3",
        score: 9,
        strengths: ["Diagnosis-first", "Reversibility"],
        weaknesses: [],
        feedback: "Strong architectural judgment.",
      },
      {
        questionId: "q4",
        score: 8,
        strengths: ["Replay", "Integrity check"],
        weaknesses: ["Less on customer comms during incident"],
        feedback: "Solid production debugging story.",
      },
      {
        questionId: "q5",
        score: 9,
        strengths: ["Checksums", "Span model"],
        weaknesses: [],
        feedback: "Clean fundamentals.",
      },
      {
        questionId: "q6",
        score: 8,
        strengths: ["Tiering", "Degradation"],
        weaknesses: ["Cost numbers were light"],
        feedback: "Good budget thinking.",
      },
      {
        questionId: "q7",
        score: 9,
        strengths: ["Judge bias", "Calibration"],
        weaknesses: [],
        feedback: "Sophisticated eval literacy.",
      },
      {
        questionId: "q8",
        score: 9,
        strengths: ["Shared state matrix"],
        weaknesses: [],
        feedback: "Excellent cross-functional signal.",
      },
      {
        questionId: "q9",
        score: 8,
        strengths: ["Policy layer", "Auditability"],
        weaknesses: ["Less real production anecdote"],
        feedback: "Good design, slightly theoretical.",
      },
      {
        questionId: "q10",
        score: 10,
        strengths: ["Risk framing", "Go/no-go"],
        weaknesses: [],
        feedback: "Executive-quality communication.",
      },
    ],
  },
  scores: {
    overallScore: 91,
    aiConfidence: 86,
    atsScore: 88,
    technicalScore: 90,
    communicationScore: 94,
  },
  skillMatrix: [
    {
      skill: "TypeScript / React",
      proficiency: 92,
      relevance: 95,
      evidence: "Multi-year product engineering ownership",
    },
    {
      skill: "LLM Orchestration",
      proficiency: 88,
      relevance: 98,
      evidence: "Production RAG + streaming features",
    },
    {
      skill: "Prompt / Eval Design",
      proficiency: 90,
      relevance: 97,
      evidence: "EvalBench + release gates",
    },
    {
      skill: "System Design",
      proficiency: 84,
      relevance: 90,
      evidence: "Citations, budgets, degradation paths",
    },
    {
      skill: "Product Sense",
      proficiency: 91,
      relevance: 96,
      evidence: "UX state matrix + measurable outcomes",
    },
    {
      skill: "Agent Tooling",
      proficiency: 72,
      relevance: 88,
      evidence: "Interview design strong; less shipped depth",
    },
    {
      skill: "Data / SQL",
      proficiency: 80,
      relevance: 75,
      evidence: "PostgreSQL + pgvector usage",
    },
    {
      skill: "Communication",
      proficiency: 94,
      relevance: 92,
      evidence: "Crisp risk framing in answers",
    },
  ],
  radar: [
    { axis: "Technical", score: 90, fullMark: 100 },
    { axis: "AI Systems", score: 88, fullMark: 100 },
    { axis: "Product", score: 91, fullMark: 100 },
    { axis: "Communication", score: 94, fullMark: 100 },
    { axis: "Architecture", score: 85, fullMark: 100 },
    { axis: "Execution", score: 89, fullMark: 100 },
  ],
  timeline: [
    {
      id: "t1",
      label: "B.S. Computer Science",
      detail: "UC Berkeley",
      at: "2016 – 2020",
      kind: "education",
    },
    {
      id: "t2",
      label: "Full-Stack Engineer",
      detail: "Cascade Health — typed APIs, reliability",
      at: "2020 – 2023",
      kind: "experience",
    },
    {
      id: "t3",
      label: "Senior Product Engineer",
      detail: "Northline Labs — AI workflows, eval gates",
      at: "2023 – Present",
      kind: "experience",
    },
    {
      id: "t4",
      label: "EvalBench",
      detail: "Open-source LLM evaluation harness",
      at: "2024",
      kind: "project",
    },
    {
      id: "t5",
      label: "Engineering Excellence Award",
      detail: "AI quality gates in release pipeline",
      at: "2024-11",
      kind: "milestone",
    },
    {
      id: "t6",
      label: "AI Interview Loop",
      detail: "10 adaptive technical questions completed",
      at: "2026-07",
      kind: "interview",
    },
  ],
};
