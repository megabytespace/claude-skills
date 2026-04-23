---
name: "Evidence Collection"
description: "Every automated form submission creates a complete evidence package: Playwright video recording, annotated screenshots with red circles on clicked buttons, action log, and manifest.json. Uploaded to R2, accessible from user dashboard."
---

# Evidence Collection Pattern
## Per-Submission Package
Every `fillForm()` call creates: EvidenceCollector instance→screenshots at each step→red circle overlays on button clicks→action log→manifest.json→video recording via Playwright `recordVideo` API. Package uploaded to R2 at `evidence/{echoId}/{appId}/{packageId}/`.

## Video Recording
Playwright `context.newContext({ recordVideo: { dir, size } })` captures entire form-filling session. Video finalized on `page.close()`. Uploaded to R2 as WebM. Public URL returned in API response and stored in application record. Users watch submissions from chat (application-video widget) or Your Data panel.

## Screenshot Annotations
Node `canvas` library draws red circles (30px radius, rgba(255,0,0,0.9) stroke + 0.15 fill) at button click positions. Each screenshot has: index, label, timestamp, size, buttonClicked metadata.

## Manifest
JSON manifest per package: packageId|echoId|appId|program|startTime|endTime|status|screenshots[]|actions[]. Enables audit trail and legal compliance.

## Access Patterns
Dashboard: status cards show video play button when videoUrl exists. Your Data panel: "Submission Videos" section lists all recordings. Chat: AI can surface video via `application-video` widget type. API: `GET /api/screenshots/:appId` returns evidence.
