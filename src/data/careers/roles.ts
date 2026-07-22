export interface CareerRole {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  summary: string;
  technologies: string[];
  responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}

export const CAREERS_ROLES: CareerRole[] = [
  {
    slug: "ai-product-engineer",
    title: "AI Product Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "3+ years",
    featured: true,
    summary:
      "Help manufacturers make better decisions using production AI—bridging model quality, product craft, and plant-floor constraints.",
    technologies: ["TypeScript", "Python", "LLMs", "React", "FastAPI"],
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
  {
    slug: "founding-ai-engineer",
    title: "Founding AI Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "5+ years",
    summary:
      "Help define the AI stack that powers manufacturing intelligence—architecture, evaluation, and durable agent systems.",
    technologies: ["Python", "LLMs", "RAG", "TypeScript", "Cloud"],
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
  {
    slug: "ai-research-engineer",
    title: "AI Research Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "3+ years",
    summary:
      "Turn research ideas into robust systems—evaluation suites, adapters, and experiments that improve manufacturing outcomes.",
    technologies: ["Python", "PyTorch", "Evaluation", "NLP", "LLMs"],
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
  {
    slug: "generative-ai-engineer",
    title: "Generative AI Engineer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "3+ years",
    summary:
      "Build generative systems that draft, summarize, and assist across manufacturing knowledge—grounded, fast, and trustworthy.",
    technologies: ["TypeScript", "Python", "RAG", "LLMs", "Streaming"],
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
  {
    slug: "senior-backend-engineer-nodejs",
    title: "Senior Backend Engineer (Node.js)",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "5+ years",
    summary:
      "Design resilient APIs and services that move manufacturing data securely—from ingestion to insight—at production scale.",
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "APIs", "Cloud"],
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
  {
    slug: "engineering-lead",
    title: "Engineering Lead",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    experience: "8+ years",
    summary:
      "Lead a product engineering team shipping manufacturing AI—setting the technical bar and aligning delivery with impact.",
    technologies: ["Architecture", "TypeScript", "People", "Delivery", "AI"],
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
];

export function getRoleBySlug(slug: string): CareerRole | undefined {
  return CAREERS_ROLES.find((role) => role.slug === slug);
}

export function getFeaturedRoles(): CareerRole[] {
  const featured = CAREERS_ROLES.filter((role) => role.featured);
  return featured.length > 0 ? featured : CAREERS_ROLES.slice(0, 1);
}
