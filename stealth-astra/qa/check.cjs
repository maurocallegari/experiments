/* Run from stealth-astra: NODE_PATH=<playwright package parent> ASTRA_CHROMIUM=<binary> node qa/check.cjs */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const root = path.resolve("..");
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(root, pathname);
  if (file.endsWith("/")) file += "index.html";
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.end(data);
  });
});
(async () => {
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(4173, "127.0.0.1", resolve);
    });
    browser = await chromium.launch({
      executablePath: process.env.ASTRA_CHROMIUM || undefined,
      args: ["--no-sandbox"],
      headless: true,
    });
    const output = path.resolve(process.env.ASTRA_QA_OUTPUT || "qa/captures");
    fs.mkdirSync(output, { recursive: true });
    const results = [];
    const sizes = [
      [375, 812],
      [390, 844],
      [430, 932],
      [1440, 900],
      [1920, 1080],
      [768, 1024],
      [1024, 768],
    ];
    for (const [width, height] of sizes) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        isMobile: width < 600,
        hasTouch: width < 600,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) errors.push(r.status() + " " + r.url());
      });
      await page.goto(
        process.env.ASTRA_URL || "http://127.0.0.1:4173/stealth-astra/",
        { waitUntil: "networkidle" },
      );
      await page.evaluate(() => document.fonts.ready);
      const audit = await page.evaluate(() => {
        const rect = (e) => {
          const r = e.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            right: r.right,
            bottom: r.bottom,
          };
        };
        const intersects = (a, b) =>
          a.x < b.right - 1 &&
          a.right > b.x + 1 &&
          a.y < b.bottom - 1 &&
          a.bottom > b.y + 1;
        const copy = [
          ...document.querySelectorAll(
            ".copy h1,.copy h2,.copy>p,.copy>.button",
          ),
        ];
        const visuals = [
          ...document.querySelectorAll(".scene,.work-object"),
        ].filter((e) => getComputedStyle(e).display !== "none");
        const overlaps = [];
        for (const v of visuals)
          for (const c of copy)
            if (intersects(rect(v), rect(c)))
              overlaps.push([v.className, c.textContent.slice(0, 40)]);
        return {
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          height: document.documentElement.scrollHeight,
          overflows: [...document.querySelectorAll("body *")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width &&
                getComputedStyle(e).display !== "none" &&
                (r.right > innerWidth + 1 || r.x < -1) &&
                !e.classList.contains("skip-link")
              );
            })
            .slice(0, 20)
            .map((e) => [e.tagName, e.className, rect(e)]),
          overlaps,
          headings: [...document.querySelectorAll("h1,h2")].map((e) => ({
            text: e.textContent,
            size: getComputedStyle(e).fontSize,
            ...rect(e),
          })),
          fonts: document.fonts.check("600 20px Manrope"),
          fixed: [...document.querySelectorAll("*")]
            .filter((e) =>
              ["fixed", "sticky"].includes(getComputedStyle(e).position),
            )
            .map((e) => e.className),
          brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
            .filter((e) => e.hash && !document.getElementById(e.hash.slice(1)))
            .map((e) => e.hash),
        };
      });
      await page.screenshot({
        path: path.join(output, `${width}-full.png`),
        fullPage: true,
      });
      if ([390, 1440, 1920].includes(width))
        await page.screenshot({ path: path.join(output, `${width}-hero.png`) });
      if ([390, 1440].includes(width))
        for (const selector of [
          ".problem",
          ".frictions",
          ".ai-section",
          ".approach",
          ".build-section",
          ".evolution",
          ".contact-section",
        ])
          await page.locator(selector).screenshot({
            path: path.join(output, `${width}-${selector.slice(1)}.png`),
          });
      await page
        .getByRole("link", { name: "Parliamone", exact: false })
        .click();
      const navigation = await page.evaluate(() => ({
        hash: location.hash,
        top: document.querySelector("#contatto").getBoundingClientRect().top,
      }));
      results.push({ width, height, ...audit, errors, navigation });
      await context.close();
    }
    for (const mode of ["no-js", "reduced-motion", "motion"]) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        javaScriptEnabled: mode !== "no-js",
        reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      await page.goto(
        process.env.ASTRA_URL || "http://127.0.0.1:4173/stealth-astra/",
        { waitUntil: "networkidle" },
      );
      await page.evaluate(() => document.fonts.ready);
      await page
        .getByRole("link", { name: "Parliamone", exact: false })
        .click();
      const test = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        hash: location.hash,
        hiddenContent: [
          ...document.querySelectorAll(
            "h1,h2,.copy>p,.scene,.ai-workflow,.app-demo",
          ),
        ].filter(
          (e) =>
            getComputedStyle(e).visibility === "hidden" ||
            getComputedStyle(e).opacity === "0",
        ).length,
        animations: document.getAnimations().length,
      }));
      if (mode === "no-js") {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: path.join(output, "390-no-js.png"),
          fullPage: true,
        });
      }
      results.push({ mode, ...test });
      await context.close();
    }
    fs.writeFileSync(
      path.join(output, "results.json"),
      JSON.stringify({ browser: await browser.version(), results }, null, 2),
    );
    console.log(
      JSON.stringify(
        results.map(
          ({
            width,
            mode,
            scrollWidth,
            bodyWidth,
            overlaps,
            overflows,
            errors,
            navigation,
            overflow,
            hiddenContent,
            animations,
          }) => ({
            width,
            mode,
            scrollWidth,
            bodyWidth,
            overlaps,
            overflows,
            errors,
            navigation,
            overflow,
            hiddenContent,
            animations,
          }),
        ),
        null,
        2,
      ),
    );
    if (
      results.some(
        (r) =>
          r.errors?.length ||
          r.overlaps?.length ||
          r.overflows?.length ||
          r.overflow ||
          r.hiddenContent ||
          r.brokenAnchors?.length ||
          r.fixed?.length ||
          (r.width && !r.fonts) ||
          (r.width && r.scrollWidth > r.width) ||
          (r.navigation && r.navigation.hash !== "#contatto") ||
          (r.mode === "reduced-motion" && r.animations !== 0),
      )
    )
      process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
