import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_URL ?? "http://127.0.0.1:5173";
await mkdir(".checks", { recursive: true });
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader"] });
const errors = [];
const results = [];

async function openPage(context) {
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  return page;
}

async function visit(page, selector) {
  await page.locator(selector).evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: "instant" });
  });
  await page.waitForTimeout(1000);
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
  const page = await openPage(desktop);
  await visit(page, "#values");
  await expect(page.locator('[data-micro-3d="orbit"]')).toHaveAttribute("data-rendered", "true", { timeout: 15000 });
  const orbitBefore = await page.locator('[data-micro-3d="orbit"]').screenshot();
  await page.waitForTimeout(650);
  const orbitAfter = await page.locator('[data-micro-3d="orbit"]').screenshot();
  expect(orbitBefore.equals(orbitAfter)).toBe(false);
  results.push("WebGL: rendered sculpture visibly animates between frames");
  await page.screenshot({ path: ".checks/3d-values.png" });
  await visit(page, "#work");
  await expect(page.locator('[data-micro-3d="asterisk"]')).toHaveAttribute("data-rendered", "true", { timeout: 15000 });
  await expect(page.locator("#featured-project-list > li")).toHaveCount(9);
  await page.mouse.move(1390, 120);
  await page.screenshot({ path: ".checks/3d-work-desktop.png" });
  await page.getByRole("button", { name: "3D", exact: true }).click();
  await expect(page.locator("#featured-project-list > li")).toHaveCount(3);
  results.push("Desktop: all nine projects and the three-project 3D filter");

  const first = page.getByRole("button", { name: "Abrir proyecto: BINEC 3D", exact: true });
  await first.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "BINEC 3D", exact: true })).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveAttribute("href", "https://www.behance.net/gallery/51974341/BINEC-3D");
  await dialog.getByRole("button", { name: "Proyecto siguiente", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Modelado y animación 3D", exact: true })).toBeVisible();
  await page.waitForTimeout(900);
  const imageLoaded = await dialog.locator('img[alt="Modelado y animación 3D"]').evaluate((image) => image.complete && image.naturalWidth > 0);
  expect(imageLoaded).toBe(true);
  await page.screenshot({ path: ".checks/3d-gallery-desktop.png" });
  await page.mouse.move(700, 370);
  await page.mouse.wheel(0, 220);
  await expect(dialog.getByRole("heading", { name: "Personaje Nobody", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading", { name: "Modelado y animación 3D", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
  results.push("Gallery: local images, Behance links, buttons, wheel, arrows, Escape and focus restoration");

  await page.getByRole("button", { name: "EN", exact: true }).first().click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("group", { name: "Filter projects" })).toBeVisible();
  await page.getByRole("button", { name: "Digital", exact: true }).click();
  await expect(page.locator("#featured-project-list > li")).toHaveCount(6);
  await page.getByRole("button", { name: "Open project: Atlas Architects", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Atlas Architects" })).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveAttribute("href", "#contact");
  await page.keyboard.press("Escape");
  await visit(page, "#contact");
  await expect(page.locator('[data-micro-3d="cube"]')).toHaveAttribute("data-rendered", "true", { timeout: 15000 });
  await expect(page.locator('[data-micro-3d="orbit"]')).toHaveAttribute("data-motion", "paused");
  await page.screenshot({ path: ".checks/3d-contact.png" });
  results.push("ES/EN, preserved digital projects and offscreen 3D pause");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const phone = await openPage(mobile);
  await visit(phone, "#work");
  await phone.getByRole("button", { name: "3D", exact: true }).click();
  await phone.waitForTimeout(900);
  await phone.screenshot({ path: ".checks/3d-work-mobile.png" });
  await phone.getByRole("button", { name: "Abrir proyecto: BINEC 3D", exact: true }).click();
  const mobileDialog = phone.getByRole("dialog");
  await expect(mobileDialog).toBeVisible();
  await phone.waitForTimeout(800);
  const session = await mobile.newCDPSession(phone);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 330, y: 300 }] });
  for (let i = 1; i <= 10; i += 1) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 330 - i * 26, y: 300 }] });
    await phone.waitForTimeout(24);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(mobileDialog.getByRole("heading", { name: "Modelado y animación 3D", exact: true })).toBeVisible();
  await phone.waitForTimeout(900);
  await phone.screenshot({ path: ".checks/3d-gallery-mobile.png" });
  await mobileDialog.getByRole("button", { name: "Personaje Nobody", exact: true }).click();
  await expect(mobileDialog.getByRole("heading", { name: "Personaje Nobody", exact: true })).toBeVisible();
  await mobileDialog.getByRole("button", { name: "Cerrar galería", exact: true }).click();
  await expect(mobileDialog).toBeHidden();
  expect(await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  results.push("Mobile: real touch swipe, direct project dots, close and no horizontal overflow");

  const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  const quiet = await openPage(reduced);
  await visit(quiet, "#values");
  const sculpture = quiet.locator('[data-micro-3d="orbit"]');
  await expect(sculpture).toHaveAttribute("data-rendered", "true", { timeout: 15000 });
  await expect(sculpture).toHaveAttribute("data-motion", "paused");
  await quiet.waitForTimeout(800);
  const staticBefore = await sculpture.screenshot();
  await quiet.waitForTimeout(650);
  const staticAfter = await sculpture.screenshot();
  expect(staticBefore.equals(staticAfter)).toBe(true);
  results.push("Reduced motion: static 3D rendering");

  const fallbackBrowser = await chromium.launch({ args: ["--disable-webgl"] });
  try {
    const fallback = await openPage(await fallbackBrowser.newContext());
    await visit(fallback, "#work");
    await expect(fallback.locator('[data-micro-3d="asterisk"]')).toHaveAttribute("data-rendered", "false", { timeout: 15000 });
    await expect(fallback.locator('[data-micro-3d="asterisk"] svg')).toBeVisible();
    results.push("No WebGL: decorative fallback remains visible and page remains functional");
  } finally {
    await fallbackBrowser.close();
  }
  expect(errors).toEqual([]);
  console.log(JSON.stringify({ results, errors, screenshots: ".checks/3d-*.png" }, null, 2));
} finally {
  await browser.close();
}