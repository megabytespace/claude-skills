#!/usr/bin/env node
/**
 * Headless asset + console scan across the live site. Runs N pages in
 * parallel, captures every console error/warning and every failed network
 * request, prints a per-route report, ends with a summary.
 *
 * Usage: node scripts/scan-assets.mjs [base-url]
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.argv[2] || 'https://njsk-org.manhattan.workers.dev';
const CONCURRENCY = 6;

const data = readFileSync('src/data/blog-posts.ts', 'utf8');
const blogSlugs = [...data.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

const routes = [
  '/',
  '/about',
  '/team',
  '/services',
  '/services/mens-dining-hall',
  '/services/womens-center',
  '/services/health-clinic',
  '/donate',
  '/volunteer',
  '/we-need',
  '/contact',
  '/mass-schedule',
  '/blog',
  '/faq',
  ...blogSlugs.slice(0, 8).map((s) => `/blog/${s}`),
];

async function check(browser, route) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errors = [];
  const warnings = [];
  const failed = [];

  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    if (t === 'error') errors.push(text);
    else if (t === 'warning') warnings.push(text);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    failed.push(`${req.failure()?.errorText || 'failed'} ${req.url()}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
  });

  const url = BASE + route;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    errors.push(`navigation: ${e.message}`);
  }

  await ctx.close();
  return { route, errors, warnings, failed };
}

async function main() {
  const browser = await chromium.launch();
  const results = [];
  let i = 0;

  async function worker() {
    while (i < routes.length) {
      const route = routes[i++];
      const r = await check(browser, route);
      results.push(r);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();

  results.sort((a, b) => a.route.localeCompare(b.route));

  let totalErr = 0;
  let totalWarn = 0;
  let totalFail = 0;
  for (const r of results) {
    if (!r.errors.length && !r.warnings.length && !r.failed.length) continue;
    console.log(`\n${r.route}`);
    for (const e of r.errors) console.log(`  ERROR ${e}`);
    for (const w of r.warnings) console.log(`  WARN  ${w}`);
    for (const f of r.failed) console.log(`  FAIL  ${f}`);
    totalErr += r.errors.length;
    totalWarn += r.warnings.length;
    totalFail += r.failed.length;
  }

  console.log(
    `\nScanned ${results.length} routes. Errors: ${totalErr}. Warnings: ${totalWarn}. Failed requests: ${totalFail}.`,
  );
  process.exit(totalErr || totalFail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
