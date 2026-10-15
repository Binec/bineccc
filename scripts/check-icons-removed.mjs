import { chromium, expect } from "@playwright/test";

const base = process.env.TEST_URL ?? "http://127.0.0.1:5173";
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });

  const count = (selector) => page.locator(selector).count();
  const values = await page.locator("#values").locator(".micro-object").count();
  const work = await page.locator("#work").locator(".micro-object").count();
  const contact = await page.locator("#contact").locator(".micro-object").count();

  expect(values).toBe(0);
  expect(work).toBe(0);
  expect(contact).toBe(1);
  expect(await count("#work [data-micro-3d]")).toBe(0);
  expect(await count("#values [data-micro-3d]")).toBe(0);
  expect(errors).toEqual([]);

  console.log(JSON.stringify({ values, work, contact, errors }, null, 2));
} finally {
  await browser.close();
}
