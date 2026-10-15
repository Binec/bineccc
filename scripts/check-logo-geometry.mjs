import { chromium, expect } from "@playwright/test";

const base = process.env.TEST_URL ?? "http://127.0.0.1:5173";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const sample = () =>
    page.evaluate(() => {
      const logo = document.querySelector(".binec-logo").getBoundingClientRect();
      const sphere = document.querySelector(".binec-logo__sphere").getBoundingClientRect();
      const front = [...document.querySelectorAll(".binec-logo__glyph:not(.binec-logo__glyph--back)")].map((g) => {
        const r = g.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width };
      });
      const cx = sphere.x + sphere.width / 2;
      const cy = sphere.y + sphere.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      return {
        logo: { x: logo.x, y: logo.y, w: logo.width, h: logo.height },
        sphere: { cx, cy, d: sphere.width, h: sphere.height },
        xs: front.map((p) => p.x),
        ys: front.map((p) => p.y),
        widths: front.map((p) => p.w),
        centerHit: hit?.className ?? "",
        transformStyle: getComputedStyle(document.querySelector(".binec-logo__ring")).transformStyle,
      };
    });

  const a = await sample();
  await page.waitForTimeout(700);
  const b = await sample();

  const spanX = Math.max(...a.xs) - Math.min(...a.xs);
  const spanY = Math.max(...a.ys) - Math.min(...a.ys);
  const widthsVary = Math.max(...a.widths) - Math.min(...a.widths);
  const moved = a.xs.some((x, i) => Math.abs(x - b.xs[i]) > 0.5);

  const report = {
    sphereIsCircle: Math.abs(a.sphere.d - a.sphere.h) < 1.5,
    ringWiderThanSphere: spanX > a.sphere.d,
    ringIsTiltedEllipse: spanY > 2 && spanY < spanX,
    perspectiveDepth: widthsVary > 0.5,
    glyphsMove: moved,
    preserve3d: a.transformStyle,
    centerHit: a.centerHit,
    spanX: Math.round(spanX),
    spanY: Math.round(spanY),
    sphere: Math.round(a.sphere.d),
    logoBox: a.logo,
  };
  console.log(JSON.stringify(report, null, 2));
  expect(report.sphereIsCircle).toBe(true);
  expect(report.ringWiderThanSphere).toBe(true);
  expect(report.ringIsTiltedEllipse).toBe(true);
  expect(report.perspectiveDepth).toBe(true);
  expect(report.glyphsMove).toBe(true);
  expect(report.preserve3d).toBe("preserve-3d");
} finally {
  await browser.close();
}
