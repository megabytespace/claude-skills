---
name: "one-line-saas"
description: "Execution chain for one-line SaaS prompts. Chains template→scaffold→parallel build→verify→ship."
version: "2.0.0"
updated: "2026-04-23"
---

# One-Line SaaS Execution Chain

When prompt is a one-liner implying a new product (domain name, product idea, or "build X"):

## Phase 0: Research (parallel agents, ~3min)
Agent A: Firecrawl scrape 3-5 competitors→feature list+pricing+positioning.
Agent B: Keyphrase research via web search→primary keyphrase+3 secondaries.
Agent C: Infer product type from domain (skill 02)→generate PROJECT_BRIEF.md+SPEC.md with all ACs.
Agent D: If existing website→scrape all pages, extract content+images+brand colors+logo.
Research completes BEFORE any code. Builder receives pre-digested context, never calls APIs.

## Phase 1: Scaffold (<5min, sequential, informed by research)
`gh repo create <name> --template megabytespace/saas-starter --clone`→cd into it→run `scripts/scaffold.sh <name> <domain>`→live URL deployed before any feature code. Research data informs scaffold choices (stack, features, pages).

## Phase 2: Content+Media (parallel, ~5min)
Agent E: Generate all copy—hero headline, features, meta desc, JSON-LD, pricing copy. Replace SITE_NAME/HERO_HEADLINE/etc placeholders in index.html.
Agent F: Ideogram logo→favicon set→OG 1200x630→hero image. Place in public/.
Agent G: Generate project CLAUDE.md+.claude/rules/ from brief.
Agent H: Profile all collected images via GPT-4o vision→scores, placements, alt text (see skill 12 image-profiling).

## Phase 3: Build (parallel agents in worktrees, ~15min)
Agent I (backend): Auth webhooks, Stripe checkout/portal/webhooks, domain-specific API routes, Inngest workflows. Sentry+PostHog instrumentation on every route.
Agent J (frontend): Replace landing page placeholders with real content. Dashboard with real data. Auth pages via Clerk components. Uses pre-profiled images in suggested placements.
Agent K (tests): Write failing Playwright tests for every SPEC.md AC. Homepage→navigate→interact→verify. Test account flows.

## Phase 4: Verify (parallel, loop max 3)
deploy+purge→parallel: deploy-verifier+seo-auditor+visual-qa+test-writer→fix failures→redeploy→re-verify.

## Phase 5: Launch
Update saas-starter template if patterns improved. Update ~/.agentskills if new learnings. Recommendations loop (skill 14)→implement until zero. DONE.

## Parallelization Map
```
Phase 0 [A|B|C|D] ──all complete──→ Phase 1 ──sequential──→
Phase 2 [E|F|G|H] ──all complete──→ Phase 3 [I|J|K] ──all complete──→
Phase 4 [verify loop] ──green──→ Phase 5 [launch]
```
Main thread orchestrates only. Never implements. 11 parallel agents max across phases.
Research-first: builder receives pre-digested context files, never calls APIs (see skill 06 pre-digested-builds).
