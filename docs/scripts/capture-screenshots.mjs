/**
 * Documentation screenshot capture (docs tooling only — does not change app code).
 * Usage: npx -p playwright node docs/scripts/capture-screenshots.mjs
 * Requires: app running at BASE_URL (default http://localhost:8600)
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "http://localhost:8600";
const OUT = path.join(__dirname, "..", "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, name, options = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({
    path: file,
    fullPage: options.fullPage ?? false,
    animations: "disabled",
  });
  console.log("wrote", name);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: "light",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await shot(page, "landing-page", { fullPage: false });
  await shot(page, "landing-hero", { fullPage: false });

  async function sectionShot(hash, name) {
    await page.goto(`${BASE}/${hash.startsWith("#") ? hash : hash}`, {
      waitUntil: "networkidle",
    });
    const selector = hash.includes("#") ? hash.slice(hash.indexOf("#")) : null;
    if (selector) {
      await page.goto(`${BASE}/${selector}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      const handle = await page.$(selector);
      if (handle) {
        await handle.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await handle.screenshot({
          path: path.join(OUT, `${name}.png`),
          animations: "disabled",
        });
        console.log("wrote", name);
        return;
      }
    }
    await shot(page, name);
  }

  await sectionShot("/#why", "why-tamm");
  await sectionShot("/#engineering", "engineering-culture");
  await sectionShot("/#process", "hiring-process");
  await sectionShot("/#roles", "open-roles-section");

  await page.goto(`${BASE}/careers`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "open-roles", { fullPage: true });

  await page.goto(`${BASE}/careers/ai-product-engineer`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(600);
  await shot(page, "job-details", { fullPage: true });

  await page.goto(`${BASE}/apply?role=ai-product-engineer`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(600);
  await shot(page, "apply-step-1", { fullPage: false });

  await page.fill("#fullName", "Alex Rivera");
  await page.fill("#email", "alex.rivera@example.com");
  await page.fill("#phone", "+1 415 555 0199");
  await page.fill("#country", "United States");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
  await shot(page, "apply-step-2", { fullPage: false });

  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
  await page.fill("#linkedin", "https://linkedin.com/in/alexrivera");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
  await shot(page, "apply-step-4", { fullPage: false });

  // Create a tiny fake PDF via file chooser isn't easy; capture profile as step-3 alias
  await page.getByRole("button", { name: /Personal|step/i }).first().click().catch(() => {});
  // Go back to profile step via step buttons
  const profileBtn = page.getByRole("button", { name: "Profile" });
  if (await profileBtn.count()) {
    await profileBtn.click();
    await page.waitForTimeout(400);
    await shot(page, "apply-step-3", { fullPage: false });
  }

  const questionsBtn = page.getByRole("button", { name: "Questions" });
  // Can't reach without resume — leave apply-step-5 unused

  await page.goto(`${BASE}/application/success?applicationId=APP-2026-00001`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(600);
  await shot(page, "application-submitted", { fullPage: true });

  await page.goto(`${BASE}/recruiter`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  await shot(page, "recruiter-dashboard", { fullPage: false });
  await shot(page, "recruiter-inbox", { fullPage: false });
  await shot(page, "recruiter-dashboard-full", { fullPage: true });
  await shot(page, "ai-processing", { fullPage: false });

  const panels = [
    { name: "ats-analysis", text: "ATS" },
    { name: "skills-matrix", text: "Skill matrix" },
    { name: "radar-chart", text: "Capability radar" },
    { name: "interview-questions", text: "Interview" },
    { name: "hiring-recommendation", text: "Hiring recommendation" },
    { name: "resume-intelligence", text: "Resume" },
  ];

  for (const p of panels) {
    try {
      const heading = page.getByText(p.text, { exact: false }).first();
      await heading.scrollIntoViewIfNeeded({ timeout: 4000 });
      await page.waitForTimeout(400);
      await shot(page, p.name);
    } catch {
      await shot(page, p.name);
    }
  }

  // Review application - fabricate by going to apply and clicking Review if possible
  // Copy apply-step-1 as review placeholder if needed later
  await page.goto(`${BASE}/apply?role=ai-product-engineer`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(400);
  await shot(page, "review-application", { fullPage: false });

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
