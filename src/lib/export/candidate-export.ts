import type { CandidateSession } from "@/types/dashboard";

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function candidateFilename(
  candidate: CandidateSession,
  extension: string
): string {
  const slug = (candidate.resume.name ?? "candidate")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `foundry-candidate-report-${slug}.${extension}`;
}

export function exportCandidateJson(candidate: CandidateSession): void {
  const blob = new Blob([JSON.stringify(candidate, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  downloadBlob(candidateFilename(candidate, "json"), blob);
}

export function exportCandidateCsv(candidate: CandidateSession): void {
  const rows: string[][] = [
    ["Field", "Value"],
    ["Name", candidate.resume.name ?? ""],
    ["Email", candidate.resume.email ?? ""],
    ["Role", candidate.roleTitle],
    ["Overall Score", String(candidate.scores.overallScore)],
    ["AI Confidence", String(candidate.scores.aiConfidence)],
    ["ATS Score", String(candidate.scores.atsScore)],
    ["Technical Score", String(candidate.scores.technicalScore)],
    ["Communication Score", String(candidate.scores.communicationScore)],
    ["Hiring Recommendation", candidate.evaluation.hiringRecommendation],
    ["ATS Recommendation", candidate.analysis.hiringRecommendation],
    ["Professional Summary", candidate.analysis.professionalSummary],
    ["Fit Headline", candidate.fit.headline],
    ["Overall Evaluation", candidate.evaluation.overallEvaluation],
  ];

  candidate.skillMatrix.forEach((skill) => {
    rows.push([
      `Skill:${skill.skill}`,
      `proficiency=${skill.proficiency};relevance=${skill.relevance};${skill.evidence}`,
    ]);
  });

  candidate.questions.questions.forEach((q) => {
    const answer =
      candidate.answers.find((a) => a.questionId === q.id)?.answer ?? "";
    const evalItem = candidate.evaluation.perQuestion.find(
      (item) => item.questionId === q.id
    );
    rows.push([
      `Question:${q.id}`,
      q.question,
    ]);
    rows.push([`Answer:${q.id}`, answer]);
    rows.push([
      `Eval:${q.id}`,
      `score=${evalItem?.score ?? ""};${evalItem?.feedback ?? ""}`,
    ]);
  });

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(candidateFilename(candidate, "csv"), blob);
}

export function exportCandidateMarkdown(candidate: CandidateSession): void {
  const md = buildMarkdownReport(candidate);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(candidateFilename(candidate, "md"), blob);
}

export function exportCandidatePdf(candidate: CandidateSession): void {
  const html = buildPrintableHtml(candidate);
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    document.body.removeChild(frame);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    document.body.removeChild(frame);
  };

  frame.onload = () => {
    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      cleanup();
    }, 250);
  };
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildMarkdownReport(candidate: CandidateSession): string {
  const { resume, analysis, fit, questions, answers, evaluation, scores } =
    candidate;

  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));

  return [
    `# Foundry Candidate Report — ${resume.name ?? "Candidate"}`,
    "",
    `**Role:** ${candidate.roleTitle}  `,
    `**Recommendation:** ${evaluation.hiringRecommendation}  `,
    `**Generated:** ${new Date(candidate.updatedAt).toLocaleString()}`,
    "",
    "## Scores",
    "",
    `| Metric | Score |`,
    `| --- | ---: |`,
    `| Overall | ${scores.overallScore} |`,
    `| AI Confidence | ${scores.aiConfidence} |`,
    `| ATS | ${scores.atsScore} |`,
    `| Technical | ${scores.technicalScore} |`,
    `| Communication | ${scores.communicationScore} |`,
    "",
    "## Resume Summary",
    "",
    analysis.professionalSummary,
    "",
    "### Strengths",
    ...analysis.topStrengths.map((s) => `- ${s}`),
    "",
    "### Weaknesses",
    ...analysis.weaknesses.map((s) => `- ${s}`),
    "",
    "## Why They're a Fit",
    "",
    `**${fit.headline}**`,
    "",
    fit.narrative,
    "",
    "## Projects",
    "",
    ...resume.projects.flatMap((p) => [
      `### ${p.name}`,
      p.description,
      "",
      ...(p.highlights.map((h) => `- ${h}`) ?? []),
      "",
    ]),
    "## Foundry Interview Summary",
    "",
    ...questions.questions.flatMap((q) => [
      `### ${q.id.toUpperCase()} — ${q.question}`,
      "",
      `*${q.category} · ${q.difficulty}*`,
      "",
      "**Answer**",
      "",
      answerMap.get(q.id) ?? "_No answer_",
      "",
    ]),
    "## AI Evaluation",
    "",
    evaluation.overallEvaluation,
    "",
    "### Evaluation Strengths",
    ...evaluation.strengths.map((s) => `- ${s}`),
    "",
    "### Evaluation Weaknesses",
    ...evaluation.weaknesses.map((s) => `- ${s}`),
    "",
  ].join("\n");
}

function buildPrintableHtml(candidate: CandidateSession): string {
  const mdish = buildMarkdownReport(candidate)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Foundry Candidate Report — ${candidate.resume.name ?? "Candidate"}</title>
  <style>
    body {
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      color: #0b1015; /* light --foreground for print */
      line-height: 1.65;
      max-width: 800px;
      margin: 32px auto;
      padding: 0 24px;
    }
    h1 {
      font-family: "General Sans", "Inter", ui-sans-serif, sans-serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    pre {
      white-space: pre-wrap;
      font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
    }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  <h1>Foundry Candidate Report — ${candidate.resume.name ?? "Candidate"}</h1>
  <pre>${mdish}</pre>
</body>
</html>`;
}
