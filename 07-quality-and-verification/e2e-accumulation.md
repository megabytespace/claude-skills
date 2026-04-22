---
name: "E2E Test Accumulation"
description: "Tests accumulate and never shrink. Each feature adds to the journey test. Cross-page navigation required. 100% E2E feature coverage — every feature has a test. One-line code changes must trigger the full suite to catch regressions."
---

# E2E Test Accumulation (***NEVER DELETE TESTS***)

## Core Rule
Tests are append-only. Every feature built adds tests. Tests are never deleted — only updated when the feature they test changes. The test suite grows monotonically. A shrinking test suite means lost coverage means silent breakage.

## The Growing Journey Test

### Structure: Parallel Journey Chunks (~30s each)
Each chunk is a self-contained journey segment that: authenticates → navigates to its area via UI clicks → tests that area's features → exits. Chunks run in parallel. Cross-page navigation happens WITHIN each chunk. The full suite finishes in ~30-60s regardless of how many features exist.

```typescript
// e2e/journeys/discovery.spec.ts (~30s)
// Tests: homepage, navigation, footer, SEO, a11y
test.describe('Journey: Discovery', () => {
  test('Homepage → nav → every page loads → footer links', async ({ page }) => {
    await page.goto(PROD_URL);
    await expect(page.locator('h1')).toBeVisible();
    // Click through every nav link, verify each page
    for (const link of await page.locator('nav a[href]').all()) {
      await link.click();
      await expect(page.locator('h1')).toBeVisible();
      await page.goBack();
    }
    // Footer links
    for (const link of await page.locator('footer a[href]').all()) {
      const href = await link.getAttribute('href');
      if (href?.startsWith('http')) {
        const res = await page.request.get(href);
        expect(res.status()).toBeLessThan(400);
      }
    }
  });
});

// e2e/journeys/auth.spec.ts (~30s)
// Tests: signup, login, logout, profile, session persistence
test.describe('Journey: Auth', () => {
  test('Homepage → Sign Up → complete form → dashboard → logout → login', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.click('nav >> text=Sign Up');
    await expect(page).toHaveURL(/sign-up/);
    // ... complete signup with test account
    await expect(page).toHaveURL(/dashboard/);
    // Navigate to profile via UI
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Profile');
    await expect(page.locator('h1')).toHaveText(/Profile/);
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Log out');
    await expect(page).toHaveURL(/$/);
    // Login again
    await page.click('nav >> text=Log in');
    // ... login with test account
    await expect(page).toHaveURL(/dashboard/);
  });
});

// e2e/journeys/crud.spec.ts (~30s)
// Tests: create, read, update, delete for the core entity
test.describe('Journey: CRUD', () => {
  test('Login → dashboard → create item → edit → verify list → delete → verify gone', async ({ page }) => {
    await loginAsTestUser(page); // shared helper — logs in via UI clicks
    await page.click('[data-testid="sidebar-items"]');
    // Create
    await page.click('text=New Item');
    await page.fill('[data-testid="item-name"]', 'Test Item');
    await page.click('text=Save');
    await expect(page.locator('text=Test Item')).toBeVisible();
    // Edit
    await page.click('text=Test Item');
    await page.fill('[data-testid="item-name"]', 'Updated Item');
    await page.click('text=Save');
    await expect(page.locator('text=Updated Item')).toBeVisible();
    // Delete
    await page.click('[data-testid="delete-item"]');
    await page.click('text=Yep, delete it'); // microcopy!
    await expect(page.locator('text=Updated Item')).not.toBeVisible();
  });
});

// e2e/journeys/billing.spec.ts (~30s)
// Tests: pricing page, checkout flow, subscription status
test.describe('Journey: Billing', () => {
  test('Homepage → Pricing → select plan → dashboard → Settings → Billing', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.click('nav >> text=Pricing');
    await expect(page.locator('[data-testid="pricing-table"]')).toBeVisible();
    // Login and check billing
    await loginAsTestUser(page);
    await page.click('text=Settings');
    await page.click('text=Billing');
    await expect(page.locator('[data-testid="subscription-status"]')).toBeVisible();
  });
});

// e2e/journeys/[feature-name].spec.ts (~30s each)
// NEW FEATURES: create a new file per feature area
// Each file: login → navigate to feature via clicks → test the feature → cleanup
```

### Shared Helpers (don't repeat auth in every chunk)
```typescript
// e2e/helpers/auth.ts
export async function loginAsTestUser(page: Page) {
  await page.goto(PROD_URL);
  await page.click('nav >> text=Log in');
  await page.fill('[data-testid="email"]', 'test@megabyte.space');
  await page.fill('[data-testid="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('text=Log in');
  await expect(page).toHaveURL(/dashboard/);
}
```

### Playwright Config: Parallel + 30s Budget
```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,          // all spec files run in parallel
  workers: 4,                    // 4 browser instances simultaneously
  timeout: 30_000,               // 30s per test — if it takes longer, it's too big
  retries: 1,                    // one retry for flaky network
  use: {
    baseURL: process.env.PROD_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
});
```

### The 30-Second Rule
Each journey chunk MUST complete in ≤30s. If it grows past 30s, SPLIT it into two chunks. The split point is wherever a natural navigation boundary exists (e.g., "auth journey" vs "dashboard journey"). Both new chunks still navigate via UI clicks. Both still run in parallel with everything else.

### Why Parallel Chunks Beat Serial
- 10 features × 30s serial = 5 minutes
- 10 features × 30s parallel (4 workers) = ~75 seconds
- Cross-page navigation still tested WITHIN each chunk
- Auth state is independent per chunk (each logs in fresh)
- One flaky chunk doesn't block the others
- New features = new file, existing files untouched

## Cross-Page Navigation Rules

### Never use `page.goto()` for internal navigation
```typescript
// BAD — skips the navigation UI, misses broken links
await page.goto('/dashboard/settings');

// GOOD — clicks through like a real user
await page.click('nav >> text=Dashboard');
await page.click('[data-testid="settings-link"]');
await expect(page).toHaveURL(/settings/);
```

### Exception: first page load only
```typescript
// OK — the journey starts somewhere
await page.goto(PROD_URL);
// After this, all navigation is via clicks
```

### Every navigation must verify
```typescript
// After clicking a link, verify:
// 1. URL changed
await expect(page).toHaveURL(/expected-path/);
// 2. Page content loaded
await expect(page.locator('h1')).toBeVisible();
// 3. No console errors
// 4. No network errors (4xx/5xx)
```

## 100% Feature Coverage

### The Coverage Matrix
Every project maintains a coverage matrix in SPEC.md:

```markdown
## E2E Coverage Matrix
| Feature | Journey Test | Edge Cases | Error States | Mobile |
|---------|-------------|------------|--------------|--------|
| Homepage | 01-03 | homepage.spec.ts | ✅ | ✅ |
| Auth | 04-06 | auth.spec.ts | ✅ | ✅ |
| Dashboard | 07 | dashboard.spec.ts | ✅ | ✅ |
| CRUD | 08-10 | crud.spec.ts | ✅ | ✅ |
| Billing | 11-12 | billing.spec.ts | ✅ | ✅ |
```

### Coverage Rule
If a feature exists in the UI, it MUST have:
1. A step in the journey test (proves it works in context)
2. A dedicated spec file (proves edge cases)
3. Error state coverage (proves graceful failure)
4. Mobile viewport test (proves responsive)

No feature ships without all four. The completeness-checker agent verifies this.

## How Tests Grow

### When a new feature is built:
1. Add journey test steps (append to journey.spec.ts)
2. Create feature spec file (e2e/feature-name.spec.ts)
3. Update coverage matrix in SPEC.md
4. Run full suite — ALL tests must pass (including old ones)

### When a feature changes:
1. Update the affected journey test steps (don't delete, modify)
2. Update the feature spec file
3. Run full suite — regression detected if old tests break

### When a feature is removed:
1. Mark journey test steps as skipped with comment: `// REMOVED: feature-name, date, reason`
2. Don't delete the test file — archive to e2e/archived/
3. This preserves the record of what the feature did

## One-Line Change Regression Detection

The point: when you change ONE line of code, the full E2E suite runs and catches any collateral damage.

```bash
# Pre-push hook or CI gate
npx playwright test --project=chromium
# Runs: journey.spec.ts (the full serial journey)
# Runs: *.spec.ts (all feature-specific parallel tests)
# Runs: a11y.spec.ts (axe-core audit)
# Runs: visual.spec.ts (screenshot comparison)
# If ANY test fails → push blocked
```

### The Regression Chain
Feature A depends on Feature B depends on Feature C.
Change Feature C → journey test catches if B or A broke.
Isolated tests for C pass but journey test fails at step B → you broke the integration.
This is ONLY catchable with cross-page sequential testing.

## Anti-Patterns

### NEVER: Test each page in isolation
```typescript
// BAD — doesn't test navigation, doesn't test auth state, doesn't test cross-page data
test('dashboard loads', async ({ page }) => {
  await page.goto('/dashboard'); // skips login!
});
```

### NEVER: Delete tests when refactoring
```typescript
// BAD — "these tests are outdated, I'll rewrite them later"
// REALITY: "later" never comes, coverage decreases, bugs ship
```

### NEVER: Use test.skip() without a tracking issue
```typescript
// BAD
test.skip('broken test', async () => { /* ... */ });
// GOOD
test.skip('broken test — tracking: GH-123', async () => { /* ... */ });
```

### NEVER: Mock the backend in E2E
```typescript
// BAD — tests pass but production breaks
await page.route('**/api/**', route => route.fulfill({ body: mockData }));
// GOOD — hit the real API on the real production URL
```

## Integration with Build Loop
The build-and-slice-loop (skill 06) MUST:
1. Write failing journey test step BEFORE implementing feature
2. Implement feature until test passes
3. Run FULL suite (not just the new test)
4. Deploy only if ALL tests pass
5. Post-deploy: run suite again against production URL

The UI completeness sweep (skill 07) MUST:
1. After all features built, run journey test end-to-end
2. Any test failure = not done
3. Coverage matrix must show 100% — every feature row filled
