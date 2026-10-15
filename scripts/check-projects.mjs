import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_URL ?? "http://127.0.0.1:4173";
await mkdir(".checks", { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.locator("#work").evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  await page.waitForTimeout(1200);

  const rows = page.locator("#featured-project-list > li");
  await expect(rows).toHaveCount(6);
  const titles = await rows.locator("button span.font-display").allTextContents();
  expect(titles).toEqual(["BINEC 3D", "Modelado y animación 3D", "Personaje Nobody", "UX - UI", "ux ai", "Rolando por el poniente"]);
  results.push("6 projects in order: " + titles.join(" | "));

  await page.getByRole("button", { name: "Web / UX", exact: true }).click();
  await expect(rows).toHaveCount(3);
  results.push("Web / UX filter shows the 3 UX and web projects");

  // every Behance cover really loads (list thumbnail + large lightbox image)
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: ".checks/projects-list.png" });
  await page.getByRole("button", { name: "Abrir proyecto: UX - UI", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "UX - UI", exact: true })).toBeVisible();
  await page.waitForTimeout(1500);
  const current = dialog.locator('img[alt="UX - UI"]');
  await expect.poll(() => current.evaluate((i) => i.complete && i.naturalWidth > 0), { timeout: 10000 }).toBe(true);
  const size = await current.evaluate((i) => `${i.naturalWidth}x${i.naturalHeight}`);
  results.push(`UX - UI lightbox image loaded (${size})`);
  await expect(dialog.getByRole("link").first()).toHaveAttribute("href", "https://www.behance.net/gallery/127795965/UX-UI");
  await page.screenshot({ path: ".checks/projects-uxui-dialog.png" });
  await dialog.getByRole("button", { name: "Proyecto siguiente", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "ux ai", exact: true })).toBeVisible();
  await expect(dialog.getByRole("link").first()).toHaveAttribute("href", "https://www.behance.net/gallery/243632817/ux-ai");
  const next = dialog.locator('img[alt="ux ai"]');
  await expect.poll(() => next.evaluate((i) => i.complete && i.naturalWidth > 0), { timeout: 10000 }).toBe(true);
  results.push(`ux ai lightbox image loaded (${await next.evaluate((i) => `${i.naturalWidth}x${i.naturalHeight}`)})`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: ".checks/projects-uxai-dialog.png" });
  await dialog.getByRole("button", { name: "Proyecto siguiente", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Rolando por el poniente", exact: true })).toBeVisible();
  await expect(dialog.getByRole("link").first()).toHaveAttribute("href", "https://www.behance.net/gallery/153620301/Rolando-por-el-poniente");
  await expect(dialog.getByRole("button", { name: "Proyecto siguiente", exact: true })).toBeDisabled();
  const rolando = dialog.locator('img[alt="Rolando por el poniente"]');
  await expect.poll(() => rolando.evaluate((i) => i.complete && i.naturalWidth > 0), { timeout: 15000 }).toBe(true);
  await page.screenshot({ path: ".checks/projects-rolando-dialog.png" });
  results.push("Project 6: Rolando por el poniente, original cover loaded and correct Behance link");
  results.push("Lightbox: Behance covers load and link to the right project pages");
  await page.keyboard.press("Escape");

  const archive = page.locator("#behance");
  await archive.scrollIntoViewIfNeeded();
  await expect(archive.locator("article")).toHaveCount(4);
  expect(await archive.locator("article h3").allTextContents()).toEqual([
    "Empaque Weisser", "Callan los vecinos", "Demo Stand Sonrics Halloween", "Modelado y animación 3D",
  ]);
  await expect(archive.getByText("4 proyectos publicados", { exact: true })).toBeVisible();
  await page.screenshot({ path: ".checks/behance-second-row.png" });
  results.push("Behance archive retains only the original second row of 4 projects");

  await page.getByRole("button", { name: "EN", exact: true }).first().click();
  await expect(archive.getByText("4 published projects", { exact: true })).toBeVisible();
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open project: Rolando por el poniente", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Rolando por el poniente", exact: true })).toBeVisible();
  await expect(dialog.getByText("Digital design", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  results.push("English version has updated project copy and 4-project archive count");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(base, { waitUntil: "domcontentloaded" });
  await mobile.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await expect(mobile.locator("#featured-project-list > li")).toHaveCount(6);
  await expect(mobile.locator("#behance article")).toHaveCount(4);
  await mobile.getByRole("button", { name: "Abrir proyecto: Rolando por el poniente", exact: true }).click();
  await expect(mobile.getByRole("dialog").getByRole("heading", { name: "Rolando por el poniente", exact: true })).toBeVisible();
  await expect(mobile.getByRole("dialog").getByRole("link")).toHaveAttribute("href", "https://www.behance.net/gallery/153620301/Rolando-por-el-poniente");
  await mobile.screenshot({ path: ".checks/projects-rolando-mobile.png" });
  expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  results.push("Mobile: 6 featured projects, 4 archive projects, project 6 opens correctly, no horizontal overflow");
  await mobile.close();

  expect(errors).toEqual([]);
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
