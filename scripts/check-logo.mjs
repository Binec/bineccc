import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_URL ?? "http://127.0.0.1:5173";
await mkdir(".checks", { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];

try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: "networkidle" });
    const link = page.getByRole("link", { name: "BINEC — Inicio" });
    await expect(link).toBeVisible();
    await page.waitForTimeout(1200);
    const logo = page.locator(".binec-logo");
    const box = await logo.boundingBox();
    const a = await logo.screenshot();
    await page.waitForTimeout(900);
    const b = await logo.screenshot();
    expect(a.equals(b)).toBe(false); // ring is orbiting
    await page.screenshot({ path: `.checks/logo-${name}.png`, clip: { x: 0, y: 0, width: viewport.width, height: 140 } });
    await logo.screenshot({ path: `.checks/logo-${name}-zoom.png` });
    results.push(`${name}: visible, ${Math.round(box.width)}px, orbiting`);

    // logo still visible when scrolled over the light roller-coaster image
    await page.locator("#values").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `.checks/logo-${name}-scrolled.png`, clip: { x: 0, y: 0, width: viewport.width, height: 140 } });
    await link.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 }).toBeLessThan(40);
    results.push(`${name}: logo link returns to top`);
    await page.close();
  }

  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(base, { waitUntil: "networkidle" });
  await reduced.waitForTimeout(1200);
  const r1 = await reduced.locator(".binec-logo").screenshot();
  await reduced.waitForTimeout(800);
  const r2 = await reduced.locator(".binec-logo").screenshot();
  expect(r1.equals(r2)).toBe(true);
  results.push("reduced motion: ring static");

  expect(errors).toEqual([]);
  console.log(JSON.stringify({ results }, null, 2));
} finally {
  await browser.close();
}
