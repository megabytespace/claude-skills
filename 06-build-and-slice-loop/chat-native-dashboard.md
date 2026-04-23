---
name: "Chat-Native Dashboard"
description: "ChatGPT-style three-column layout as primary interface for all service apps. Login=dashboard with blur overlay. Chat is the operating system — every feature accessible through conversation + inline widgets."
---

# Chat-Native Dashboard Pattern
## Architecture
Three-column layout: left=thread history+data editor | center=chat with inline widgets | right=contextual panel (phone/status/settings). Auth overlay=same page with `backdrop-filter:blur(12px)` over dashboard, not a separate route. `/login`→redirect to `/dashboard`.

## Widget System
Chat messages carry `widget` and `widgetData` fields. Template uses `@if (msg.widget === 'type')` to render inline interactive components. Core widgets: ssn-auth|voice-biometric|upload|status-cards|quick-actions|video-player|application-video|timeline|progress|confirm|data-view|form-wizard. Every AI response includes contextual action buttons via `buttons[]` array.

## Auth Flow
anonymous→SSN entry (overlay)→voice biometric (overlay)→authenticated (blur dissolves). SSN: AES-256-GCM encrypted, font-mono tracking-wide centered input. Voice: 5-second recording, animated pulse rings, processing spinner, green checkmark on success. Skip option for anonymous browsing.

## Data Management
"Your Data" slides over left sidebar as overlay panel. All fields needed for government form submissions: name|dob|gender|phone|email|address|county|household|income|homeless|disabled|blind|deaf|veteran|children|language. Save to backend API. Submission videos listed below profile fields with play buttons.

## Real-Time Features
Phone panel: Twilio Voice SDK v2 WebRTC. Live transcript in right sidebar. Call duration timer. Drag-and-drop file upload anywhere on chat window. Upload progress bar with animation. Thread history persisted to sessionStorage (future: backend).

## Key Principles
1. Chat=primary interface. Phone calls and web forms are secondary access methods.
2. Every feature is a chat widget. Status checks, file uploads, form reviews — all inline.
3. Auth is a layer, not a page. Dashboard always visible behind blur.
4. Mobile-responsive: sidebars become slide-out drawers with backdrop overlays.
5. Evidence-first: every form submission generates video + screenshots accessible from chat.
