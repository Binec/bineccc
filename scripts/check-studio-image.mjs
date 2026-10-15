import { chromium, expect } from "@playwright/test";

const base = process.env.TEST_URL ?? "http://127.0.0.1:4173";
const EXPECTED =
  "https://github.com/Binec/landing-clientes/blob/main/public/assets/bineccoaster.png?raw=true";
const browser = await chromium.launch();
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });

  const img = page.locator("section img").filter({ hasNot: page.locator("img") }).nth(0);
  const section = page.locator('img[src*="bineccoaster"], img[src*="rollercoaster"]').first();
  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(() => section.evaluate((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, h: i.naturalHeight })), { timeout: 20000 })
    .toEqual(expect.objectContaining({ ok: true }));

  const info = await section.evaluate((i) => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight }));
  const usedGitHub = info.src.includes("bineccoaster");
  expect(usedGitHub).toBe(true);

  const caption = await page.locator("section", { has: page.locator('img[src*="bineccoaster"]') }).locator("span").first().textContent();
  console.log(JSON.stringify({ results: [`Loaded: ${info.src}`, `Natural size: ${info.w}x${info.h}`, `Caption: ${caption?.trim()}`], errors }, null, 2));
  expect(errors).toEqual([]);
} finally {
  await browser.close();
}
