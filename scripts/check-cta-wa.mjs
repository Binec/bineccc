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

  // 1. Behance banner CTA replaced
  const behanceBanner = page.locator("#behance").locator("text=Llena el formulario").first();
  await expect(behanceBanner).toBeVisible();
  const formButton = page.locator('#behance a[href="#contact"]').filter({ hasText: "Llenar formulario" });
  await expect(formButton).toBeVisible();

  // Check no "descubre el portafolio completo en behance.net/binec"
  const oldText = await page.locator("#behance").getByText("Descubre el portafolio completo en").count();
  expect(oldText).toBe(0);
  results.push("Behance banner updated with 'Llenar formulario' CTA button and removed old discover text");

  // Clicking "Llenar formulario" scrolls to #contact
  await formButton.click();
  await page.waitForTimeout(600);
  const contactVisible = await page.locator("#contact").isVisible();
  expect(contactVisible).toBe(true);

  // 2. WhatsApp links with phone 5533313935
  const waLinks = await page.locator('a[href*="5533313935"]').all();
  expect(waLinks.length).toBeGreaterThanOrEqual(3);
  results.push(`Found ${waLinks.length} WhatsApp CTAs linked to 5533313935`);

  // Floating WA button is visible
  const floatingWa = page.locator('aside[aria-label="WhatsApp"] a');
  await expect(floatingWa).toBeVisible();
  const floatingHref = await floatingWa.getAttribute("href");
  expect(floatingHref).toContain("5533313935");
  results.push("Floating WhatsApp button is visible and links to 5533313935");

  // Contact section direct WhatsApp
  const contactWa = page.locator('#contact a[href*="5533313935"]');
  await expect(contactWa.first()).toBeVisible();
  await expect(contactWa.first()).toContainText("55 3331 3935");

  // Footer WhatsApp
  const footerWa = page.locator('footer a[href*="5533313935"]');
  await expect(footerWa).toBeVisible();

  // Test EN version
  await page.getByRole("button", { name: "EN", exact: true }).first().click();
  await page.waitForTimeout(300);
  await expect(page.locator('#behance a[href="#contact"]').filter({ hasText: "Fill out the form" })).toBeVisible();
  results.push("EN translation working: 'Fill out the form'");

  await page.screenshot({ path: ".checks/cta-and-whatsapp.png" });

  expect(errors).toEqual([]);
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
