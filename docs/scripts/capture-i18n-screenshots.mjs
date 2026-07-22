/**
 * i18n documentation screenshot capture (docs tooling only — does not change app code).
 * Usage: BASE_URL=http://localhost:8712 node docs/scripts/capture-i18n-screenshots.mjs
 * Requires: app running at BASE_URL with the i18n locale provider active.
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || "http://localhost:8712";
const OUT = path.join(__dirname, "..", "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: "disabled" });
  console.log("wrote", name);
}

async function withLocale(browser, locale, fn) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: "light",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.addInitScript((loc) => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("foundry.locale", loc);
  }, locale);
  await fn(page);
  await context.close();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  await withLocale(browser, "en", async (page) => {
    await page.goto(`${BASE}/careers`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await shot(page, "i18n-careers-en");
  });

  await withLocale(browser, "ar", async (page) => {
    await page.goto(`${BASE}/careers`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await shot(page, "i18n-careers-ar");
  });

  await withLocale(browser, "en", async (page) => {
    await page.goto(`${BASE}/recruiter`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1400);
    await shot(page, "i18n-recruiter-en");
  });

  await withLocale(browser, "ar", async (page) => {
    await page.goto(`${BASE}/recruiter`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1400);
    await shot(page, "i18n-recruiter-ar");
  });

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
