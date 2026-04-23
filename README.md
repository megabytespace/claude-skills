<div align="center">
  <a href="https://github.com/megabytespace/claude-skills">
    <img width="148" alt="Emdash Skills" src="https://raw.githubusercontent.com/megabytespace/claude-skills/master/logo.png" />
  </a>
  <h1>Emdash Skills</h1>
  <p><strong>Autonomous product-building OS for Claude Code.<br/>One-line prompts → deployed products on Cloudflare Workers.</strong></p>
</div>

<div align="center">
  <a href="https://megabyte.space"><img alt="Homepage" src="https://img.shields.io/website?down_color=%23FF4136&down_message=Down&label=Homepage&logo=home-assistant&logoColor=white&up_color=%232ECC40&up_message=Up&url=https%3A%2F%2Fmegabyte.space&style=for-the-badge" /></a>
  <a href="https://github.com/megabytespace/claude-skills/blob/master/LICENSE"><img alt="License: Rutgers" src="https://img.shields.io/badge/License-Rutgers-7C3AED?logo=open-source-initiative&logoColor=white&style=for-the-badge" /></a>
  <a href="https://github.com/megabytespace/claude-skills"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/megabytespace/claude-skills?logo=github&logoColor=white&style=for-the-badge&color=060610" /></a>
  <a href="https://github.com/megabytespace/claude-skills/issues"><img alt="Issues" src="https://img.shields.io/github/issues/megabytespace/claude-skills?logo=github&logoColor=white&style=for-the-badge&color=00E5FF" /></a>
</div>

<br/>

<div align="center">
  <code>14 categories</code> · <code>89 reference docs</code> · <code>18 agents</code> · <code>12 templates</code>
</div>

<br/>

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR PROMPT                              │
│              "Build a SaaS for dog walkers"                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SKILL ROUTER                                │
│  Matches prompt → loads smallest useful subset of skills        │
│  01-OS always loaded │ then 02-Brief → 05-Arch → 06-Build      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ ARCHITECT│  │ PARALLEL │  │ PARALLEL │
        │  (Opus)  │  │  BUILD   │  │  VERIFY  │
        │          │  │ 3-5 agents│  │ 3 agents │
        │ repo-map │  │ frontend │  │ deploy   │
        │ task graph│  │ backend  │  │ seo      │
        │ seams    │  │ content  │  │ visual   │
        └──────────┘  │ media    │  │ a11y     │
                      │ tests    │  └──────────┘
                      └──────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HARD GATES                                 │
│  Playwright 6bp ✓ │ Vision ≥8/10 ✓ │ Lighthouse A11y ≥95 ✓     │
│  axe-core 0 ✓ │ SEO GREEN ✓ │ 0 errors ✓ │ Flesch ≥60 ✓       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   DEPLOYED   │
                    │ CF Workers   │
                    │   + purged   │
                    └──────────────┘
```

## Install

```bash
# Plugin (recommended)
claude plugin install megabytespace/claude-skills

# Manual
git clone https://github.com/megabytespace/claude-skills ~/.agentskills
```

## Skill Categories

```
          ┌──────────────────────────────────────────────┐
          │              EMDASH SKILL MAP                 │
          │                                               │
          │   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │
          │   │ 01  │→ │ 02  │→ │ 03  │→ │ 04  │       │
          │   │ OS  │  │Brief│  │Plan │  │Pref │       │
          │   │  4  │  │  0  │  │  1  │  │  3  │       │
          │   └─────┘  └─────┘  └─────┘  └─────┘       │
          │                                               │
          │   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │
          │   │ 05  │→ │ 06  │→ │ 07  │→ │ 08  │       │
          │   │Arch │  │Build│  │ QA  │  │Ship │       │
          │   │ 10  │  │ 23  │  │ 23  │  │  9  │       │
          │   └─────┘  └─────┘  └─────┘  └─────┘       │
          │                                               │
          │   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │
          │   │ 09  │→ │ 10  │→ │ 11  │→ │ 12  │       │
          │   │Brand│  │ UX  │  │Motn │  │Media│       │
          │   │  4  │  │  1  │  │  0  │  │  5  │       │
          │   └─────┘  └─────┘  └─────┘  └─────┘       │
          │                                               │
          │          ┌─────┐  ┌─────┐                    │
          │          │ 13  │→ │ 14  │                    │
          │          │Grow │  │Ideas│                    │
          │          │  6  │  │  0  │                    │
          │          └─────┘  └─────┘                    │
          │                                               │
          │   Numbers = reference docs per category       │
          └──────────────────────────────────────────────┘
```

| # | Category | Docs | What It Handles |
|--:|----------|:----:|-----------------|
| 01 | **Operating System** | 4 | Core policy, autonomy, parallelization, AI-native coding patterns |
| 02 | **Goal & Brief** | — | Product thesis from a domain name, business model inference |
| 03 | **Planning & Research** | 1 | Competitive analysis, task decomposition, parallel workstreams |
| 04 | **Preference & Memory** | 3 | Voice of Customer data, user preferences, behavioral psychology |
| 05 | **Architecture & Stack** | 10 | CF Workers, Hono, Drizzle v1, Coolify, MCP, auth, API design |
| 06 | **Build & Slice Loop** | 23 | Forms, search, blog, i18n, PWA, webhooks, admin, data tables, chat |
| 07 | **Quality & Verification** | 23 | E2E, a11y, security hardening, perf, visual QA, adversarial, AI testing |
| 08 | **Deploy & Runtime** | 9 | CI/CD, launch-day sequence, uptime, backup, changelog, GitHub CI fix |
| 09 | **Brand & Content** | 4 | SEO engine, copy system, email templates, social automation |
| 10 | **Design System** | 1 | Anti-slop design, dark-first, bold typography, CSS architecture |
| 11 | **Motion & Interaction** | — | Scroll-driven animations, View Transitions, reduced-motion |
| 12 | **Media Orchestration** | 5 | Image/video generation, AI prompts, compression, OG previews |
| 13 | **Growth & Observability** | 6 | Stripe billing, analytics, Sentry alerts, email, experiments |
| 14 | **Idea Engine** | — | Autonomous research, evidence-backed improvement proposals |

## Agents

```
         AGENT ROUTING BY MODEL TIER

  ┌─────────────────────────────────────┐
  │            OPUS (heavy)             │
  │  Architecture │ Security │ Vision   │
  │  Completeness │ Meta-orchestration  │
  ├─────────────────────────────────────┤
  │           SONNET (standard)         │
  │  Build │ Test │ Deploy │ Debug      │
  │  Migrate │ Profile │ Simplify      │
  │  Dependencies │ Incidents │ CU-op  │
  ├─────────────────────────────────────┤
  │            HAIKU (fast)             │
  │  Content │ SEO │ A11y │ Changelog  │
  │  Cost estimation                    │
  └─────────────────────────────────────┘
```

| Agent | Model | Effort | Purpose |
|-------|:-----:|:------:|---------|
| **architect** | Opus | max | Repo-map generation, task graphs, architectural seams |
| **completeness-checker** | Opus | max | Zero Recommendations Gate — nothing ships incomplete |
| **meta-orchestrator** | Opus | max | Cross-agent coordination and task graph execution |
| **security-reviewer** | Opus | max | OWASP Top 10:2025, secrets exposure, CSP audit |
| **visual-qa** | Opus | max | Screenshot all 6 breakpoints, AI vision layout detection |
| **code-simplifier** | Sonnet | high | Reduce complexity while preserving all functionality |
| **computer-use-operator** | Sonnet | high | Native macOS app automation via Computer Use MCP |
| **dependency-auditor** | Sonnet | high | Package security, license compliance, update strategy |
| **deploy-verifier** | Sonnet | high | Post-deploy smoke tests at 6 breakpoints |
| **incident-responder** | Sonnet | high | Sentry-triggered triage, root cause, auto-fix PRs |
| **migration-agent** | Sonnet | high | Framework/DB/API migration with rollback safety |
| **performance-profiler** | Sonnet | high | Core Web Vitals analysis, bundle audit, runtime profiling |
| **test-writer** | Sonnet | high | TDD-first Playwright E2E + Vitest units, stable selectors |
| **accessibility-auditor** | Haiku | low | axe-core WCAG 2.2 AA audits and remediation guidance |
| **changelog-generator** | Haiku | low | Conventional commit parsing, user-outcome release notes |
| **content-writer** | Haiku | low | Marketing copy, microcopy, alt text, SEO content |
| **cost-estimator** | Haiku | low | Cloudflare Workers cost forecasting and free-tier warnings |
| **seo-auditor** | Haiku | low | Title, meta, H1, JSON-LD, OG tags, sitemap validation |

## Hard Gates

Every deploy must clear all gates. No exceptions. No overrides.

| Gate | Threshold | Tool |
|------|:---------:|------|
| E2E Tests | 0 failures @ 6 breakpoints | Playwright v1.56+ |
| Visual QA | ≥ 8/10 | AI vision (GPT-4o) |
| Accessibility | ≥ 95 | Lighthouse |
| A11y Violations | 0 | axe-core |
| SEO Score | GREEN | Yoast-equivalent |
| Console Errors | 0 | Browser DevTools |
| Placeholders | 0 | Content sweep |
| Readability | Flesch ≥ 60 | Copy audit |

## Stack

```
  REQUEST FLOW

  Browser ──→ CF Workers ──→ Hono RPC ──→ Drizzle v1 ──→ D1/Neon
     │              │             │              │
     │         KV/Upstash    Zod valid.     Migrations
     │              │             │
     ├── Clerk (auth)        Turnstile
     ├── Stripe (pay)        Resend (email)
     ├── PostHog (analytics) Sentry (errors)
     └── GA4/GTM (tracking)  Inngest (jobs)
```

| Layer | Technology |
|-------|------------|
| Hosting | Cloudflare Workers |
| Backend | Hono RPC + `@hono/zod-validator` |
| Frontend | Angular 20 + Ionic + PrimeNG (or vanilla) |
| Database | D1 (edge) / Neon (Postgres) |
| ORM | Drizzle v1 + Zod |
| Cache | KV / Upstash Redis |
| Auth | Clerk |
| Payments | Stripe |
| Email | Resend + Listmonk |
| Jobs | Inngest |
| Testing | Playwright v1.56+ + Vitest |
| Lint | ESLint + Prettier |
| Runtime | Bun |
| Monitoring | PostHog + Sentry + GA4/GTM |

## Templates

| Template | Purpose |
|----------|---------|
| `acceptance-criteria.md` | Structured AC with testable conditions |
| `adr-template.md` | Architecture Decision Records |
| `brief.md` | Product brief from domain name |
| `launch-checklist.md` | Pre-launch verification checklist |
| `product-intent.yaml` | Machine-readable product definition |
| `qa-report.json` | Structured QA output format |
| `repo-map.md` | Codebase architecture map |
| `saas-feature-manifest.md` | Complete SaaS feature matrix |
| `session-learning.md` | Post-session knowledge extraction |
| `starter-scaffold.md` | New project scaffolding guide |
| `task-graph.json` | Parallelizable task decomposition |

## Task Routing

The router loads the smallest useful subset per task — never the full 89 docs.

| When you say... | Skills loaded |
|-----------------|---------------|
| "Build a new project" | 02 → 03 → 05 → 06 → 09 |
| "Add a feature" | 05 → 06 → 07 |
| "Fix CI" | 07 → 08 (especially `gh-fix-ci`) |
| "Deploy this" | 08 (+ 09 if content changed) |
| "Polish the frontend" | 09 → 10 → 11 → 12 |
| "Set up billing" | 05/auth → 06/webhooks → 13/stripe |
| "Add analytics" | 13 (+ 09/social if publishing) |
| "Brainstorm ideas" | 03 → 14 |

## Philosophy

**Distribution > Technology.** The best tool nobody knows about is the worst tool. Auto-create repos for new skills. Integrate into every ecosystem. Broadcast widely.

**Boil the Lake.** When completeness costs minutes more than a shortcut, do complete. Boil lakes, flag oceans.

**TDD Always.** Failing test first → implement → pass. Real user flows. Homepage first. Click through UI. Never `page.goto()` for internal navigation.

**One Person + AI = Twenty.** The barrier is gone. What remains is taste, judgment, and willingness to do the complete thing.

## Can You Make This Better?

Seriously — [open an issue](https://github.com/megabytespace/claude-skills/issues/new?title=Improvement%20suggestion&body=I%20think%20this%20could%20be%20better%20if...) or submit a PR. Some things we're thinking about:

- **More skill categories?** Is 14 the right number or are we missing something?
- **Better agent routing?** Should model assignments shift as Claude evolves?
- **Templates you wish existed?** What boilerplate do you write over and over?
- **Skills for other stacks?** This is CF Workers + Angular today. What else?
- **Prompting patterns** that consistently produce better results?

If you've built something similar, stolen ideas from here, or just have opinions — we want to hear it. The whole point is that this gets better every day.

## License

Copyright (c) 2024-2026 [Brian Zalewski](https://megabyte.space) / [Megabyte Labs](https://megabyte.space). [The Rutgers License](LICENSE).

TL;DR — It's free. Use it. But if it helped you, be cool about it and [send what feels right](mailto:hey@megabyte.space). We made this and we'd like to eat.
