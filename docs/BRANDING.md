# Universal WebSocket Chat Simulator — Branding Guide

## 1. Name & Identity

### 1.1 Project Name

- **Name**: Universal WebSocket Chat Simulator
- **Pronunciation**: "Universal Web-Socket Chat Simulator"
- **Etymology**: "Universal" emphasizes backend-agnostic design. "WebSocket" identifies the protocol. "Chat Simulator" describes the purpose — simulating chat participants for testing.
- **In code**: `universal-websocket-chat-simulator` (package name), `ws-chat-sim` (short alias)
- **In prose**: Universal WebSocket Chat Simulator (full), WS Chat Sim (short)

### 1.2 Tagline

- **Primary**: "Test any WebSocket chat backend, no frontend required."
- **Technical**: "Multi-client WebSocket testing tool with configurable protocols and authentication."
- **Marketing**: "Debug real-time messaging without building a frontend."

### 1.3 Elevator Pitch

Universal WebSocket Chat Simulator is a browser-based developer tool that lets you simulate multiple chat participants over WebSocket connections. Each client gets its own identity, authentication credentials, and message protocol — all configurable. It works with any backend, any auth method, and any JSON message format. Deploy with Docker Compose and start testing in seconds.

## 2. Logo

### 2.1 Concept

A stylized chat bubble containing a WebSocket "plug" or connection icon. The design communicates both messaging (chat bubble) and connectivity (WebSocket/plug). Minimal, geometric, works at small sizes.

### 2.2 Specifications

- **Primary mark**: Chat bubble with embedded connection nodes (dots representing clients)
- **Icon mark**: Simplified chat bubble with single connection dot — for favicon/app icon
- **Wordmark**: "WS Chat Sim" in monospace font
- **Minimum size**: 16px (icon), 120px width (wordmark)
- **Clear space**: 1x icon height on all sides

### 2.3 AI Generation Prompt

```
Minimal flat vector logo for a developer tool called "WebSocket Chat Simulator".
Style: geometric, clean lines, no gradients.
Composition: chat bubble shape with 3 connected dots inside (representing multi-client).
Colors: primary #3B82F6 (blue), accent #10B981 (green), dark background #1E293B.
Format: 1:1 square, 512x512px.
Avoid: text in logo, 3D effects, photorealism, complex details.
```

## 3. Color Palette

### 3.1 Brand Colors

| Role      | Name        | Hex     | RGB              | Usage                                 |
| --------- | ----------- | ------- | ---------------- | ------------------------------------- |
| Primary   | Signal Blue | #3B82F6 | rgb(59,130,246)  | Main buttons, links, active states    |
| Secondary | Slate       | #64748B | rgb(100,116,139) | Secondary text, inactive states       |
| Accent    | Pulse Green | #10B981 | rgb(16,185,129)  | Success, connected status, highlights |

### 3.2 Neutrals

| Role           | Hex     | Usage                       |
| -------------- | ------- | --------------------------- |
| Text Primary   | #F1F5F9 | Body text (dark mode)       |
| Text Secondary | #94A3B8 | Captions, placeholders      |
| Background     | #0F172A | Page background (dark mode) |
| Surface        | #1E293B | Cards, panels, sidebar      |
| Border         | #334155 | Dividers, input borders     |

### 3.3 Semantic Colors

| Role    | Hex     | Usage                              |
| ------- | ------- | ---------------------------------- |
| Success | #10B981 | Connected, message sent            |
| Error   | #EF4444 | Disconnected, failed, errors       |
| Warning | #F59E0B | Connecting, reconnecting, warnings |
| Info    | #3B82F6 | Informational, neutral highlights  |

### 3.4 Dark Mode

Dark mode is the default (developer tool). Light mode available via toggle.

| Role           | Dark    | Light   |
| -------------- | ------- | ------- |
| Background     | #0F172A | #FFFFFF |
| Surface        | #1E293B | #F8FAFC |
| Text Primary   | #F1F5F9 | #0F172A |
| Text Secondary | #94A3B8 | #64748B |
| Border         | #334155 | #E2E8F0 |

### 3.5 CSS Variables

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #10b981;
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-border: #334155;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

## 4. Typography

### 4.1 Font Stack

| Role     | Font           | Weights  | Fallback              |
| -------- | -------------- | -------- | --------------------- |
| Headings | Inter          | 600, 700 | system-ui, sans-serif |
| Body     | Inter          | 400, 500 | system-ui, sans-serif |
| Code     | JetBrains Mono | 400      | monospace             |

### 4.2 Type Scale

| Element | Size     | Weight | Line Height |
| ------- | -------- | ------ | ----------- |
| H1      | 1.5rem   | 700    | 1.2         |
| H2      | 1.25rem  | 600    | 1.3         |
| H3      | 1.125rem | 600    | 1.4         |
| Body    | 0.875rem | 400    | 1.6         |
| Small   | 0.75rem  | 400    | 1.5         |
| Code    | 0.8rem   | 400    | 1.5         |

## 5. Voice & Tone

### 5.1 Personality

- **Direct**: No fluff. Get to the point. "Connection failed: timeout after 10s" not "Oops! We couldn't connect."
- **Technical**: Use correct terminology. Developers are the audience.
- **Helpful**: Error messages include what happened and what to do next.
- **Honest**: Document limitations clearly. "Browser cannot send custom headers" not "Headers may not work."

### 5.2 Writing Rules

- Headlines: Short, action-oriented. "Add Client" not "Create a New Client Session"
- Documentation: Technical level, minimal jargon explanation (audience is developers)
- Error messages: Specific, include the actual error. "WebSocket connection to ws://localhost:8000/ws failed: Connection refused"
- UI labels: Concise. "Endpoint" not "WebSocket Endpoint URL"

### 5.3 Vocabulary

| Prefer               | Avoid                                  |
| -------------------- | -------------------------------------- |
| Client               | User, Participant, Session             |
| Connect / Disconnect | Start / Stop, Open / Close             |
| Inspector            | Debug panel, Log viewer, Console       |
| Protocol profile     | Message format, Schema, Adapter config |
| Endpoint             | URL, Server address, Host              |

## 6. Visual Language

### 6.1 Border Radius

- Small (buttons, inputs): 4px
- Medium (cards, panels): 8px
- Large (modals): 12px
- Full (badges, avatars): 9999px

### 6.2 Shadows

- Minimal. Use borders instead of shadows for separation.
- Modal overlay: `0 4px 24px rgba(0,0,0,0.3)`

### 6.3 Spacing

- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48

### 6.4 Icons

- Library: Lucide React
- Style: Outline, 1.5px stroke
- Size: 16px (inline), 20px (buttons), 24px (navigation)

## 7. Assets Checklist

| Asset       | Format      | Size               | Status |
| ----------- | ----------- | ------------------ | ------ |
| Logo (full) | SVG + PNG   | vector / 1024px    | TBD    |
| Icon        | SVG + PNG   | 512px, 192px, 64px | TBD    |
| Favicon     | .ico + .png | 32px, 16px         | TBD    |
| OG Image    | PNG         | 1200×630           | TBD    |
