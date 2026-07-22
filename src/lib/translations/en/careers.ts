export const careers = {
  shell: {
    skipToContent: "Skip to content",
    apply: "Apply",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    title: "Build AI that transforms manufacturing.",
    description:
      "Join engineers who turn models into durable product—grounded in real operations, measured by quality, and shipped with care.",
    applyNow: "Apply Now",
    viewRoles: "View Engineering Roles",
  },
  socialProof: {
    ariaLabel: "Illustrative engineering footprint",
    trustedBy: "Trusted by teams building the future of manufacturing AI",
    illustrativeNote: "Illustrative metrics · demo data",
    stats: {
      countries: "Countries",
      engineers: "Engineers",
      deployments: "Deployments",
      platformUptime: "Platform uptime",
    },
  },
  why: {
    eyebrow: "Why Tamm",
    title: "Engineers who want depth and leverage.",
    description:
      "At {company}, you work on AI that has to earn trust in complex physical environments—not demos that disappear after a launch post.",
    items: [
      {
        title: "AI-first engineering",
        body: "Models, agents, and evaluation are part of the product—not a side experiment.",
      },
      {
        title: "Real-world impact",
        body: "Your work reaches manufacturers who need clearer decisions on the floor.",
      },
      {
        title: "Ownership",
        body: "Small teams, clear outcomes, and room to shape architecture and craft.",
      },
      {
        title: "Global collaboration",
        body: "Remote-friendly culture with asynchronous writing and crisp reviews.",
      },
      {
        title: "Continuous learning",
        body: "Budget and time for deep work, papers, and shipping what you learn.",
      },
    ],
  },
  philosophy: {
    eyebrow: "Engineering philosophy",
    title: "How we work.",
    description:
      "Principles that guide how we ship AI in the physical world—speed with judgment, not speed for its own sake.",
    prose:
      "We protect focus time, write things down, and celebrate shipping that makes operators' days easier. Remote-first does not mean disconnected—it means intentional.",
    principles: [
      {
        title: "Ship with judgment",
        body: "Tight loops from idea to production signal—but never at the cost of reliability, privacy, or trust.",
      },
      {
        title: "Build responsibly",
        body: "Reliability, privacy, and trust are product features. We measure what we ship and how it behaves in the field.",
      },
      {
        title: "Learn in public",
        body: "Curiosity is expected; teaching is celebrated. Share what you learn inside the team and ship the insights.",
      },
      {
        title: "Own outcomes",
        body: "We measure impact, not ticket volume. Small teams, clear outcomes, and room to shape architecture and craft.",
      },
    ],
  },
  challenges: {
    eyebrow: "Engineering challenges",
    title: "Engineering Challenges",
    subtitle:
      "Real engineering problems. Real production constraints. Real ownership.",
    domains: [
      {
        name: "AI Systems",
        items: [
          {
            title: "Production AI Evaluation",
            body: "Evaluate LLM behavior using structured metrics—regression gates, human review, and production signals that tell you when quality drifts.",
            icon: "brain",
          },
          {
            title: "Multi-Agent Orchestration",
            body: "Coordinate specialized agents with clear handoffs, tool contracts, and failure isolation—so complex workflows stay predictable under load.",
            icon: "layers",
          },
        ],
      },
      {
        name: "Platform Engineering",
        items: [
          {
            title: "Cloud Infrastructure",
            body: "Run services across regions with deployment pipelines, secrets rotation, and cost boundaries that match real traffic.",
            icon: "cloud",
          },
          {
            title: "Reliability & Observability",
            body: "Instrument traces, SLOs, and evidence trails so you can explain what the system did and why—not just that it ran.",
            icon: "activity",
          },
        ],
      },
      {
        name: "Developer Experience",
        items: [
          {
            title: "Developer Tooling",
            body: "Build workflows that fit how recruiters and engineers actually work—fast iteration, typed APIs, and interfaces that reduce context switching.",
            icon: "wrench",
          },
          {
            title: "Manufacturing Reasoning",
            body: "Ground analysis in operational context—equipment, shifts, and floor constraints—not generic summaries that miss what matters on the line.",
            icon: "cog",
          },
        ],
      },
    ],
  },
  bridge: {
    text: "These engineering challenges converge in Foundry—our AI Hiring Intelligence platform, where AI systems, infrastructure, and developer experience come together to support modern hiring.",
  },
  foundryShowcase: {
    eyebrow: "Building Foundry",
    title: "Building Foundry",
    description:
      "Foundry is one AI Hiring Intelligence platform, not six disconnected tools. Here's how a single candidate session moves through it—from resume to recommendation, fully traceable.",
    beats: [
      {
        id: "resumeIntelligence",
        title: "A resume becomes structured data.",
        body: "The moment a resume lands, Foundry parses experience, skills, and education into structured fields—no manual re-entry, no lost context.",
        ariaLabel:
          "Illustrative Foundry screen: a resume parsed into candidate name, role, and a list of extracted skill tags.",
      },
      {
        id: "atsAnalysis",
        title: "AI evaluates fit in context.",
        body: "Instead of keyword matching, Foundry scores a candidate against the actual role—skills, experience, and signals that correlate with success.",
        ariaLabel:
          "Illustrative Foundry screen: an overall match score with a breakdown across skills, experience, and role alignment.",
      },
      {
        id: "recruiterDashboard",
        title: "Recruiters see everything in one workspace.",
        body: "Every candidate, every signal, every stage—collected into a single dashboard recruiters actually want to use, with a live feed of what Foundry just did.",
        ariaLabel:
          "Illustrative Foundry screen: a recruiter dashboard with pipeline stats and a recent activity feed.",
      },
      {
        id: "interviewGeneration",
        title: "Interviews adapt to the candidate.",
        body: "Foundry generates role-specific questions from the resume and job description, so every conversation goes deeper instead of repeating a generic script.",
        ariaLabel:
          "Illustrative Foundry screen: a generated interview question set grouped by category.",
      },
      {
        id: "hiringRecommendation",
        title: "AI recommends, with evidence attached.",
        body: "Every recommendation carries its reasoning—strengths, gaps, and a confidence level—so a recruiter decides with context, not a black box.",
        ariaLabel:
          "Illustrative Foundry screen: a hiring recommendation with a confidence meter and supporting rationale.",
      },
      {
        id: "applicationTimeline",
        title: "Every step stays traceable.",
        body: "From submission to decision, Foundry keeps a structured trace of what happened and when—evidence you can revisit, not a system that forgets.",
        ariaLabel:
          "Illustrative Foundry screen: a session timeline showing completed, current, and upcoming stages.",
      },
    ],
    mockups: {
      resumeIntelligence: {
        windowLabel: "Resume Intelligence",
        urlPath: "foundry.app/candidates/fdy-2481/resume",
        panelTitle: "Resume Intelligence",
        panelSubtitle: "Parsed automatically from the uploaded PDF",
        candidateName: "Amara Okafor",
        candidateRole: "Senior Backend Engineer · Candidate",
        metaExperience: "8 years experience",
        metaEducation: "B.S. Computer Science",
        metaLocation: "Remote · GMT+2",
        skillsLabel: "Extracted skills",
        skills: [
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Distributed Systems",
          "API Design",
          "Kubernetes",
          "System Design",
          "Observability",
        ],
      },
      atsAnalysis: {
        windowLabel: "ATS Analysis",
        urlPath: "foundry.app/candidates/fdy-2481/analysis",
        panelTitle: "ATS Analysis",
        panelSubtitle: "Context-aware scoring, not keyword matching",
        scoreLabel: "Match score",
        scoreCaption: "Illustrative product UI · demo score",
        statusBadge: "Strong match",
        breakdownLabel: "Scoring breakdown",
        categories: ["Skills match", "Experience match", "Role alignment"],
      },
      recruiterDashboard: {
        windowLabel: "Recruiter Dashboard",
        urlPath: "foundry.app/dashboard",
        panelTitle: "Recruiter Dashboard",
        panelSubtitle: "Every candidate, one workspace",
        stats: ["Open roles", "In review", "Interviews scheduled"],
        activityLabel: "Recent activity",
        activity: [
          "Resume parsed — Amara Okafor",
          "ATS analysis complete",
          "Interview questions generated",
          "Recommendation submitted",
        ],
      },
      interviewGeneration: {
        windowLabel: "Interview Generation",
        urlPath: "foundry.app/candidates/fdy-2481/interview",
        panelTitle: "Interview Generation",
        panelSubtitle: "Adaptive question set from resume and role",
        questions: [
          {
            category: "Systems design",
            text: "Walk through how you would scale a write-heavy API under a sudden traffic spike.",
          },
          {
            category: "Technical depth",
            text: "How did you validate correctness before rolling out your last major schema migration?",
          },
          {
            category: "Behavioral",
            text: "Describe a time you disagreed with a technical decision. What did you do next?",
          },
          {
            category: "Role fit",
            text: "Which part of a candidate evaluation pipeline would you improve first, and why?",
          },
        ],
      },
      hiringRecommendation: {
        windowLabel: "Hiring Recommendation",
        urlPath: "foundry.app/candidates/fdy-2481/recommendation",
        panelTitle: "Hiring Recommendation",
        panelSubtitle: "Evidence-backed, not a black box",
        recommendation: "Strong Hire",
        confidenceLabel: "Confidence",
        rationaleLabel: "Rationale",
        rationale: [
          "Skill evidence matches the role's core systems requirements.",
          "Interview responses show structured reasoning under ambiguity.",
          "No unresolved evaluation flags from the analysis stage.",
        ],
      },
      applicationTimeline: {
        windowLabel: "Application Timeline",
        urlPath: "foundry.app/candidates/fdy-2481/timeline",
        panelTitle: "Application Timeline",
        panelSubtitle: "Session trace inside Foundry",
        stages: [
          "Submitted",
          "Parsed",
          "Analyzed",
          "Interviewed",
          "Recommended",
          "Archived",
        ],
      },
    },
  },
  pipeline: {
    eyebrow: "Foundry architecture",
    title: "How Foundry Works",
    description:
      "This is the product's processing pipeline, not the hiring journey below—one request moves through six stages, each handing a clean, structured contract to the next.",
    listAriaLabel: "Foundry processing pipeline, six stages",
    stages: [
      {
        title: "Resume",
        body: "A candidate's resume enters Foundry as the source document—unstructured text and layout, nothing assumed yet.",
      },
      {
        title: "Parsing",
        body: "Foundry extracts structured fields—experience, skills, education—from the raw document into a consistent schema.",
      },
      {
        title: "Knowledge Extraction",
        body: "Structured fields become linked entities: skills, roles, and relationships the reasoning stage can query directly.",
      },
      {
        title: "AI Reasoning",
        body: "A language model evaluates the entity graph against the role's requirements and produces a scored, evidenced assessment.",
      },
      {
        title: "Hiring Intelligence",
        body: "The assessment becomes a structured report—strengths, gaps, and a confidence level a recruiter can act on.",
      },
      {
        title: "Recruiter Workspace",
        body: "The report lands in the recruiter's dashboard alongside every other candidate, ready for review.",
      },
    ],
  },
  comparison: {
    eyebrow: "Before and after",
    title: "Traditional Hiring vs Foundry",
    description:
      "Foundry didn't add steps to hiring—it replaced the manual ones. Each row is the same job, done differently.",
    rows: [
      { from: "Manual Review", to: "AI Resume Intelligence" },
      { from: "Keyword Matching", to: "Context-Aware Analysis" },
      { from: "Generic Notes", to: "Structured Hiring Report" },
      { from: "Inconsistent Questions", to: "Role-Specific Interview Generation" },
      { from: "Subjective Evaluations", to: "Evidence-Based Recommendations" },
    ],
  },
  engineeringCulture: {
    eyebrow: "Engineering culture",
    title: "How we build.",
    description:
      "A culture that values speed with judgment—and learning in public inside the team.",
    items: [
      {
        title: "Ship quickly",
        body: "Tight loops from idea to production signal.",
      },
      {
        title: "Build responsibly",
        body: "Reliability, privacy, and trust are product features.",
      },
      {
        title: "Learn continuously",
        body: "Curiosity is expected; teaching is celebrated.",
      },
      {
        title: "Own outcomes",
        body: "We measure impact, not ticket volume.",
      },
    ],
  },
  life: {
    eyebrow: "Life at Tamm",
    title: "Calm intensity.",
    description:
      "We protect focus time, write things down, and celebrate shipping that makes operators’ days easier.",
    body: "Expect thoughtful design reviews, honest postmortems, and teammates who care about both craft and clarity. Remote-first does not mean disconnected—it means intentional.",
  },
  build: {
    eyebrow: "What you'll build",
    title: "The technical surface area.",
    description:
      "From model interfaces to cloud systems—manufacturing intelligence needs the full stack.",
    items: [
      { label: "LLMs" },
      { label: "AI agents" },
      { label: "Developer tools" },
      { label: "Automation" },
      { label: "Cloud" },
      { label: "Scalable systems" },
      { label: "Manufacturing intelligence" },
    ],
  },
  benefits: {
    eyebrow: "Benefits",
    title: "Support for serious work.",
    items: [
      {
        title: "Remote friendly",
        body: "Work from where you do your best thinking.",
      },
      {
        title: "Flexible hours",
        body: "Overlap matters; rigid presence does not.",
      },
      {
        title: "Learning budget",
        body: "Courses, books, and conferences supported.",
      },
      {
        title: "Competitive compensation",
        body: "Salary and equity aligned with impact.",
      },
      {
        title: "Top equipment",
        body: "The tools you need to ship without friction.",
      },
      {
        title: "Global team",
        body: "Diverse collaborators across time zones.",
      },
    ],
  },
  process: {
    eyebrow: "Hiring process",
    title: "Clear steps. No mystery theater.",
    description:
      "We respect your time with a transparent path from application to offer.",
    steps: [
      {
        title: "Application",
        body: "Submit your profile and resume through Careers.",
      },
      {
        title: "Resume review",
        body: "Our team reviews experience against the role.",
      },
      {
        title: "Technical interview",
        body: "Deep dive on systems, craft, and judgment.",
      },
      {
        title: "System design",
        body: "Collaborate on a realistic engineering problem.",
      },
      {
        title: "Offer",
        body: "Align on scope, impact, and how we’ll work together.",
      },
    ],
  },
  timeline: {
    eyebrow: "Your journey",
    title: "From application to offer.",
    description:
      "Six clear stages, the same for every candidate—no mystery theater, no lost applications.",
    stages: [
      {
        title: "Application",
        body: "Submit your profile and resume in minutes.",
      },
      {
        title: "Resume Processing",
        body: "Foundry structures your experience automatically.",
      },
      {
        title: "AI Analysis",
        body: "Your background is scored against the real role.",
      },
      {
        title: "Recruiter Review",
        body: "A recruiter reads your evidence-backed profile.",
      },
      {
        title: "Interview",
        body: "A focused conversation with the team you'd join.",
      },
      {
        title: "Offer",
        body: "We align on scope, impact, and how we'll work together.",
      },
    ],
  },
  roles: {
    eyebrow: "Open roles",
    title: "Engineering opportunities.",
    description:
      "Start with a role that matches your craft—every application is reviewed carefully.",
    seeAll: "See all open roles",
    technologiesLabel: "Technologies",
    apply: "Apply",
    viewRole: "View role",
    metadata: {
      departments: {
        Engineering: "Engineering",
      },
      locations: {
        Remote: "Remote",
      },
      employmentTypes: {
        "Full-time": "Full-time",
      },
      experienceLevels: {
        "3+ years": "3+ years",
        "5+ years": "5+ years",
        "8+ years": "8+ years",
      },
    },
    bySlug: {
      "ai-product-engineer": {
        summary:
          "Help manufacturers make better decisions using production AI—bridging model quality, product craft, and plant-floor constraints.",
        responsibilities: [
          "Design and ship end-to-end AI product surfaces used by operators and engineers",
          "Partner with research and platform teams to productionize models and agents",
          "Instrument quality, latency, and trust signals for every AI interaction",
          "Translate manufacturing workflows into clear product requirements and UX",
          "Own features from prototype through rollout and iteration",
        ],
        requirements: [
          "Strong product engineering background with shipped user-facing systems",
          "Hands-on experience with LLMs, retrieval, or agent-style workflows",
          "Comfortable across TypeScript/React and at least one backend runtime",
          "Clear written communication and bias toward measurable outcomes",
          "Curiosity about industrial or operational software is a plus",
        ],
      },
      "founding-ai-engineer": {
        summary:
          "Help define the AI stack that powers manufacturing intelligence—architecture, evaluation, and durable agent systems.",
        responsibilities: [
          "Set technical direction for core AI services and evaluation harnesses",
          "Build reliable pipelines for document understanding and decision support",
          "Establish standards for prompt/tool design, safety, and observability",
          "Mentor engineers and raise the quality bar for AI delivery",
        ],
        requirements: [
          "Deep experience shipping ML/AI systems in production",
          "Strong software engineering fundamentals beyond notebooks",
          "Comfort owning ambiguous early-stage technical problems",
          "Experience with cloud infrastructure and scalable services",
        ],
      },
      "ai-research-engineer": {
        summary:
          "Turn research ideas into robust systems—evaluation suites, adapters, and experiments that improve manufacturing outcomes.",
        responsibilities: [
          "Design experiments that connect model behavior to product metrics",
          "Build evaluation datasets and regression gates for AI features",
          "Prototype new approaches for retrieval, grounding, and tool use",
          "Partner with product engineers to land research in production",
        ],
        requirements: [
          "Background in applied ML, NLP, or related research engineering",
          "Ability to write production-quality code, not only research code",
          "Familiarity with modern LLM tooling and evaluation methods",
          "Strong experimental hygiene and communication skills",
        ],
      },
      "generative-ai-engineer": {
        summary:
          "Build generative systems that draft, summarize, and assist across manufacturing knowledge—grounded, fast, and trustworthy.",
        responsibilities: [
          "Implement generation pipelines with retrieval and structured outputs",
          "Optimize for latency, cost, and answer quality in production",
          "Collaborate on UX patterns that make AI assistance feel reliable",
          "Maintain prompt/tool libraries and regression coverage",
        ],
        requirements: [
          "Shipped generative AI features in a product environment",
          "Experience with structured generation, tools, or RAG systems",
          "Solid TypeScript or Python engineering skills",
          "Attention to failure modes, citations, and user trust",
        ],
      },
      "senior-backend-engineer-nodejs": {
        summary:
          "Design resilient APIs and services that move manufacturing data securely—from ingestion to insight—at production scale.",
        responsibilities: [
          "Build and evolve Node.js services with strong typing and observability",
          "Design APIs used by product and AI surfaces",
          "Improve reliability, performance, and data integrity",
          "Partner with platform and AI teams on shared contracts",
        ],
        requirements: [
          "Deep Node.js / TypeScript backend experience",
          "Strong grasp of distributed systems and API design",
          "Experience with relational databases and migrations",
          "Comfort operating services in cloud environments",
        ],
      },
      "engineering-lead": {
        summary:
          "Lead a product engineering team shipping manufacturing AI—setting the technical bar and aligning delivery with impact.",
        responsibilities: [
          "Lead roadmap execution across product and platform initiatives",
          "Coach engineers; run crisp planning and review rituals",
          "Balance speed with reliability for systems used in the field",
          "Partner with design, research, and go-to-market stakeholders",
        ],
        requirements: [
          "Track record leading engineers on shipped products",
          "Strong technical judgment across web and service architectures",
          "Excellent communication and prioritization skills",
          "Experience in B2B or operational software is a plus",
        ],
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered plainly.",
    description:
      "Straight answers about Foundry and how we hire—no marketing gloss.",
    items: [
      {
        question: "How does Foundry help recruiters?",
        answer:
          "Foundry structures incoming resumes, scores each candidate against the actual role, generates role-specific interview questions, and surfaces an evidence-backed recommendation—all in one recruiter workspace instead of scattered spreadsheets and inboxes.",
      },
      {
        question: "What AI models power Foundry?",
        answer:
          "Foundry uses Google's Gemini models through a configured AI provider for parsing, scoring, and generation. We don't publish a fixed model roster here, since the provider and model can be configured per deployment.",
      },
      {
        question: "What technologies power Foundry?",
        answer:
          "The product is built with Next.js, React, and TypeScript, with Google's Gemini models via @google/genai for AI features, Zod for schema validation, Framer Motion for interface animation, and Tailwind CSS for styling.",
      },
      {
        question: "How are resumes analyzed?",
        answer:
          "An uploaded resume is parsed into structured fields—experience, skills, education—then evaluated against the role's requirements. The result is a scored assessment with supporting evidence, not a keyword match.",
      },
      {
        question: "Is remote work supported?",
        answer:
          "Yes. We're a remote-friendly team with flexible hours; what matters is reasonable overlap with your team, not rigid presence.",
      },
      {
        question: "How long is the hiring process?",
        answer:
          "It varies by role and stage of interviews, but every candidate moves through the same clear stages shown in our timeline above—application, review, interview, and offer—with no open-ended waiting.",
      },
      {
        question: "Can candidates see the AI analysis?",
        answer:
          "Candidates get a status view after applying that tracks where their application stands in the pipeline. The full internal analysis and scoring detail is part of the recruiter workspace, not exposed as a public report.",
      },
    ],
  },
  cta: {
    title: "Ready to build with us?",
    description:
      "Apply in minutes. Our recruiting team reviews every submission.",
    applyNow: "Apply Now",
  },
  footer: {
    tagline: "Engineering careers at {company}. Build AI for the physical world.",
    groups: {
      engineering: {
        heading: "Engineering",
        philosophy: "Philosophy",
        challenges: "Challenges",
        openRoles: "Open Roles",
      },
      hiring: {
        heading: "Hiring",
        timeline: "Timeline",
        faq: "FAQ",
        apply: "Apply",
      },
      foundry: {
        heading: "Foundry",
        overview: "Foundry",
        pipeline: "How It Works",
        comparison: "Before & After",
        recruiterDemo: "Recruiter Demo",
      },
      company: {
        heading: "Company",
        why: "Why Tamm",
        contact: "Contact",
      },
    },
    demoNotice:
      "Portfolio project · a demonstration of Foundry, our AI hiring concept. All data shown is illustrative.",
    copyright: "© 2026 {company}",
  },
  index: {
    eyebrow: "Engineering",
    title: "Open roles",
    description:
      "Find a role that matches how you like to build—then apply with a focused, multi-step experience.",
  },
  detail: {
    allRoles: "All roles",
    whatYoullDo: "What you'll do",
    whatWereLookingFor: "What we're looking for",
    applyForRole: "Apply for this role",
    viewOtherRoles: "View other roles",
  },
  jobCard: {
    technologies: "Technologies",
    apply: "Apply",
    viewRole: "View role",
  },
  heroVisual: {
    hiringIntelligence: "Hiring intelligence",
    resumeToDecision: "Resume → Decision",
    liveSignal: "live signal",
    nodes: {
      resume: "Resume",
      skills: "Skills",
      knowledgeGraph: "Knowledge Graph",
      insights: "Insights",
      decision: "Decision",
    },
  },
};
