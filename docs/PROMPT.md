# Universal WebSocket Chat Simulator — Implementation Prompt

## Project Overview

Build a browser-based developer tool that simulates multiple independent WebSocket chat participants. Each client has its own identity, authentication credentials, endpoint URL, and message protocol adapter. The tool provides a modern chat UI, a WebSocket inspector with real-time event logging, and configurable authentication methods. It is completely backend-agnostic — no assumptions about backend framework, message schema, or auth mechanism.

Key features: multi-client simulation (2-20 clients), chat interface with message bubbles, configurable message protocol adapter (field name mappings), authentication configuration (Bearer, custom headers, cookies, query params, subprotocol, none), cross-platform auth awareness (browser vs Electron vs Flutter), WebSocket inspector with filtering, connection management (connect/disconnect/reconnect/timeout), optional REST integration, Docker deployment.

Tech stack: React 19 + Vite 6 + TypeScript 5 + Tailwind CSS 4 + Zustand 5. Pure frontend SPA, no backend, no database. Deployed via Docker Compose (nginx serving static build).

## Tech Stack

| Layer            | Technology                     | Version |
| ---------------- | ------------------------------ | ------- |
| Language         | TypeScript                     | 5.7+    |
| Runtime          | Node.js                        | 20 LTS  |
| Framework        | React                          | 19      |
| Build            | Vite                           | 6       |
| State Management | Zustand                        | 5       |
| Styling          | Tailwind CSS                   | 4       |
| Testing          | Vitest + React Testing Library | Latest  |
| Linting          | ESLint + Prettier              | Latest  |
| Container        | nginx (alpine)                 | 1.27+   |

## Project Structure

```
universal-websocket-chat-simulator/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── client.ts
│   │   ├── message.ts
│   │   ├── protocol.ts
│   │   ├── inspector.ts
│   │   ├── auth.ts
│   │   ├── transport.ts
│   │   ├── rest.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── clientSlice.ts
│   │   ├── messageSlice.ts
│   │   ├── inspectorSlice.ts
│   │   ├── settingsSlice.ts
│   │   └── protocolSlice.ts
│   ├── transport/
│   │   ├── Transport.ts
│   │   ├── BrowserTransport.ts
│   │   ├── TransportFactory.ts
│   │   ├── ConnectionManager.ts
│   │   └── index.ts
│   ├── auth/
│   │   ├── AuthStrategy.ts
│   │   ├── BearerTokenAuth.ts
│   │   ├── CustomHeadersAuth.ts
│   │   ├── CookieAuth.ts
│   │   ├── QueryParamAuth.ts
│   │   ├── SubprotocolAuth.ts
│   │   ├── NoneAuth.ts
│   │   ├── AuthFactory.ts
│   │   └── index.ts
│   ├── protocol/
│   │   ├── ProtocolAdapter.ts
│   │   ├── JsonPathAdapter.ts
│   │   ├── ProfileManager.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── EventBus.ts
│   │   ├── InspectorService.ts
│   │   ├── RestClient.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useClient.ts
│   │   ├── useConnection.ts
│   │   ├── useMessages.ts
│   │   ├── useInspector.ts
│   │   └── useProtocol.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainPanel.tsx
│   │   │   └── InspectorPanel.tsx
│   │   ├── client/
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientItem.tsx
│   │   │   ├── ClientConfig.tsx
│   │   │   └── ConnectionBadge.tsx
│   │   ├── chat/
│   │   │   ├── ChatView.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageComposer.tsx
│   │   │   ├── ConversationSelector.tsx
│   │   │   └── JsonViewer.tsx
│   │   ├── inspector/
│   │   │   ├── InspectorLog.tsx
│   │   │   ├── InspectorEntry.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── ConnectionDetails.tsx
│   │   ├── settings/
│   │   │   ├── GlobalSettings.tsx
│   │   │   ├── ProtocolEditor.tsx
│   │   │   └── RestConfig.tsx
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Tooltip.tsx
│   │       └── MaskedInput.tsx
│   └── utils/
│       ├── validation.ts
│       ├── formatting.ts
│       ├── jsonPath.ts
│       ├── exportImport.ts
│       └── index.ts
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── protocol/
│   │   ├── auth/
│   │   ├── transport/
│   │   ├── store/
│   │   └── utils/
│   └── components/
├── docker/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

## Dependencies

```bash
npm init -y
npm install react@19 react-dom@19 zustand@5 tailwindcss@4 @tailwindcss/vite lucide-react
npm install -D typescript@5.7 vite@6 @vitejs/plugin-react vitest @testing-library/react @testing-library/jest-dom jsdom eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-react-refresh
```

## Configuration Files

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "tailwind.config.ts"]
}
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          state: ["zustand"],
        },
      },
    },
  },
});
```

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#64748B",
        accent: "#10B981",
        "bg-dark": "#0F172A",
        "surface-dark": "#1E293B",
        "border-dark": "#334155",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
} satisfies Config;
```

### index.html

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Universal WebSocket Chat Simulator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/index.css

```css
@import "tailwindcss";

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

body {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

### docker/Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
```

### docker/nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  simulator:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_DEFAULT_WS_URL=${VITE_DEFAULT_WS_URL:-}
      - VITE_DEFAULT_API_URL=${VITE_DEFAULT_API_URL:-}
    restart: unless-stopped
```

### .env.example

```
VITE_DEFAULT_WS_URL=
VITE_DEFAULT_API_URL=
```

### .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

### tests/setup.ts

```typescript
import "@testing-library/jest-dom";
```

## Core Type Definitions

### src/types/client.ts

```typescript
export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export interface ClientIdentity {
  username: string;
  userId?: string;
  role?: string;
  metadata?: Record<string, unknown>;
}

export interface ClientConfig {
  alias: string;
  endpoint: string;
  identity: ClientIdentity;
  authMethod: AuthMethod;
  authConfig: AuthConfig;
  protocolProfile?: string;
  autoReconnect: boolean;
  reconnectInterval: number;
  reconnectMaxAttempts: number;
  connectionTimeout: number;
}

export interface Client extends ClientConfig {
  id: string;
  connectionState: ConnectionState;
  connectedAt: number | null;
  lastError: string | null;
}
```

### src/types/message.ts

```typescript
export type MessageDirection = "incoming" | "outgoing";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatMessage {
  id: string;
  clientId: string;
  conversationId?: string;
  direction: MessageDirection;
  sender?: string;
  content: unknown;
  rawPayload: unknown;
  timestamp: number;
  status?: MessageStatus;
  protocolProfile?: string;
}
```

### src/types/auth.ts

```typescript
export type AuthMethod =
  | "bearer"
  | "headers"
  | "cookie"
  | "query"
  | "subprotocol"
  | "none";

export interface AuthConfig {
  token?: string;
  headers?: Record<string, string>;
  cookies?: string;
  queryParams?: Record<string, string>;
  subprotocol?: string;
}

export interface AuthStrategy {
  apply(
    url: string,
    headers?: Record<string, string>,
  ): { url: string; protocols?: string[]; headers?: Record<string, string> };
  maskCredentials(): string;
}
```

### src/types/protocol.ts

```typescript
export interface ProtocolMapping {
  sender?: string;
  recipient?: string;
  conversationId?: string;
  content?: string;
  messageId?: string;
  timestamp?: string;
  eventType?: string;
}

export interface ProtocolProfile {
  name: string;
  description?: string;
  mappings: ProtocolMapping;
  eventNames?: Record<string, string>;
}

export interface ProtocolAdapter {
  toBackend(input: ChatMessage): unknown;
  fromBackend(raw: unknown): ChatMessage | null;
  getEventName(type: string): string;
}
```

### src/types/transport.ts

```typescript
export interface TransportConfig {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  timeout: number;
}

export interface Transport {
  connect(config: TransportConfig): Promise<void>;
  send(data: string | object): void;
  disconnect(code?: number, reason?: string): void;
  getState(): ConnectionState;
  onMessage(cb: (data: unknown) => void): () => void;
  onClose(cb: (code: number, reason: string) => void): () => void;
  onError(cb: (error: Error) => void): () => void;
  onOpen(cb: () => void): () => void;
}
```

### src/types/inspector.ts

```typescript
export type InspectorEventType =
  | "connect"
  | "message-in"
  | "message-out"
  | "disconnect"
  | "error"
  | "reconnect";

export interface InspectorEntry {
  id: string;
  timestamp: number;
  clientId: string;
  eventType: InspectorEventType;
  summary: string;
  payload?: unknown;
  closeCode?: number;
  closeReason?: string;
}
```

### src/types/rest.ts

```typescript
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RestEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  bodyTemplate?: string;
  autoTrigger: "none" | "onConnect" | "manual";
  lastResponse?: unknown;
}
```

### src/types/index.ts

```typescript
export * from "./client";
export * from "./message";
export * from "./auth";
export * from "./protocol";
export * from "./transport";
export * from "./inspector";
export * from "./rest";
```

## Core Patterns

### State Machine (Connection)

```typescript
const VALID_TRANSITIONS: Record<ConnectionState, ConnectionState[]> = {
  disconnected: ["connecting"],
  connecting: ["connected", "error"],
  connected: ["disconnected", "reconnecting", "error"],
  reconnecting: ["connected", "error", "disconnected"],
  error: ["connecting", "disconnected"],
};

function isValidTransition(
  from: ConnectionState,
  to: ConnectionState,
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}
```

### Auth Strategy

```typescript
class BearerTokenAuth implements AuthStrategy {
  constructor(private token: string) {}
  apply(url: string) {
    return { url, headers: { Authorization: `Bearer ${this.token}` } };
  }
  maskCredentials() {
    const tail = this.token.slice(-4);
    return `Bearer ****${tail}`;
  }
}
```

### Protocol Adapter (JsonPath)

```typescript
class JsonPathAdapter implements ProtocolAdapter {
  constructor(private profile: ProtocolProfile) {}
  fromBackend(raw: unknown): ChatMessage | null {
    const m = this.profile.mappings;
    const get = (path?: string) =>
      path ? getNestedValue(raw, path) : undefined;
    const content = get(m.content);
    if (content === undefined) return null;
    return {
      id: get(m.messageId) ?? crypto.randomUUID(),
      clientId: "",
      direction: "incoming",
      sender: get(m.sender),
      content,
      rawPayload: raw,
      timestamp: get(m.timestamp) ?? Date.now(),
      conversationId: get(m.conversationId),
    };
  }
  toBackend(input: ChatMessage): unknown {
    const m = this.profile.mappings;
    const obj: Record<string, unknown> = {};
    if (m.sender) setNestedValue(obj, m.sender, input.sender);
    if (m.content) setNestedValue(obj, m.content, input.content);
    if (m.conversationId)
      setNestedValue(obj, m.conversationId, input.conversationId);
    if (m.messageId) setNestedValue(obj, m.messageId, input.id);
    if (m.timestamp) setNestedValue(obj, m.timestamp, input.timestamp);
    return obj;
  }
  getEventName(type: string) {
    return this.profile.eventNames?.[type] ?? type;
  }
}
```

### Transport (Browser)

```typescript
class BrowserTransport implements Transport {
  private ws: WebSocket | null = null;
  private state: ConnectionState = "disconnected";

  async connect(config: TransportConfig): Promise<void> {
    this.state = "connecting";
    const url = new URL(config.url);
    if (config.queryParams) {
      Object.entries(config.queryParams).forEach(([k, v]) =>
        url.searchParams.set(k, v),
      );
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        reject(new Error("Connection timeout"));
      }, config.timeout * 1000);
      this.ws = new WebSocket(url.toString(), config.protocols);
      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.state = "connected";
        resolve();
      };
      this.ws.onmessage = (e) => {
        try {
          this.messageHandlers.forEach((h) => h(JSON.parse(e.data)));
        } catch {
          this.messageHandlers.forEach((h) => h(e.data));
        }
      };
      this.ws.onclose = (e) => {
        this.state = "disconnected";
        this.closeHandlers.forEach((h) => h(e.code, e.reason));
      };
      this.ws.onerror = () => {
        this.state = "error";
        this.errorHandlers.forEach((h) => h(new Error("WebSocket error")));
      };
    });
  }
  send(data: string | object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
    }
  }
  disconnect(code = 1000, reason = "") {
    this.ws?.close(code, reason);
  }
  getState() {
    return this.state;
  }
  // onMessage, onClose, onError, onOpen return unsubscribe functions
}
```

### Zustand Store (Slice Pattern)

```typescript
// clientSlice.ts
interface ClientSlice {
  clients: Record<string, Client>;
  clientOrder: string[];
  addClient: (config: ClientConfig) => string;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  setConnectionState: (id: string, state: ConnectionState) => void;
}

const createClientSlice: StateCreator<AppState, [], [], ClientSlice> = (
  set,
  get,
) => ({
  clients: {},
  clientOrder: [],
  addClient: (config) => {
    const id = crypto.randomUUID();
    set((s) => ({
      clients: {
        ...s.clients,
        [id]: {
          ...config,
          id,
          connectionState: "disconnected",
          connectedAt: null,
          lastError: null,
        },
      },
      clientOrder: [...s.clientOrder, id],
    }));
    return id;
  },
  // ... other actions
});
```

## Implementation Order

Execute these steps in sequence. Each builds on the previous.

### Step 1: Project Scaffolding

**Files:** All config files listed above, directory structure.
Create Vite + React + TypeScript project. Install all dependencies. Set up ESLint, Prettier, Tailwind, Vitest. Create directory structure with .gitkeep files.
**Checkpoint:** `npm run dev` starts, `npm run build` succeeds, `npm test` runs (0 tests).

### Step 2: Core Domain Types

**Files:** `src/types/*.ts`
Define all types from the Core Type Definitions section above. Export from barrel file.
**Checkpoint:** `npx tsc --noEmit` passes.

### Step 3: Validation Utilities

**Files:** `src/utils/validation.ts`, `formatting.ts`, `jsonPath.ts`, `exportImport.ts`
Implement validators, formatters, JSON path resolver, export/import helpers. Write unit tests.
**Checkpoint:** `npm test` passes with utility tests.

### Step 4: EventBus Service

**Files:** `src/services/EventBus.ts`
Type-safe event emitter. Write tests.
**Checkpoint:** `npm test` passes.

### Step 5: Zustand Store — Client Slice

**Files:** `src/store/clientSlice.ts`
Client CRUD + connection state. State machine validation. Write tests.
**Checkpoint:** `npm test` passes.

### Step 6: Zustand Store — Message Slice

**Files:** `src/store/messageSlice.ts`
Message storage, conversation grouping, rotation. Write tests.
**Checkpoint:** `npm test` passes.

### Step 7: Zustand Store — Inspector Slice

**Files:** `src/store/inspectorSlice.ts`
Inspector log management, filtering, rotation. Write tests.
**Checkpoint:** `npm test` passes.

### Step 8: Zustand Store — Settings & Protocol Slices

**Files:** `src/store/settingsSlice.ts`, `protocolSlice.ts`, `index.ts`
Global settings, protocol profiles. Combined store export. Write tests.
**Checkpoint:** `npm test` passes. `npm run build` succeeds.

### Step 9: Auth Strategy Implementations

**Files:** `src/auth/*.ts`
All 6 auth strategies + factory. Mask credentials. Write tests.
**Checkpoint:** `npm test` passes.

### Step 10: Transport Interface & BrowserTransport

**Files:** `src/transport/Transport.ts`, `BrowserTransport.ts`, `TransportFactory.ts`
Native WebSocket wrapper. Query param injection. Unsubscribe functions. Write tests with mock WebSocket.
**Checkpoint:** `npm test` passes.

### Step 11: ConnectionManager

**Files:** `src/transport/ConnectionManager.ts`
State machine, timeout, auto-reconnect, manual reconnect, duration tracking. Write tests.
**Checkpoint:** `npm test` passes.

### Step 12: Protocol Adapter

**Files:** `src/protocol/*.ts`
JsonPathAdapter, ProfileManager. Export/import. Write tests.
**Checkpoint:** `npm test` passes.

### Step 13: Layout & Shared Components

**Files:** `src/components/layout/*`, `src/components/shared/*`
Three-panel resizable layout, responsive, dark mode. Shared UI primitives. Write component tests.
**Checkpoint:** `npm run dev` shows layout. `npm test` passes.

### Step 14: Client Management UI

**Files:** `src/components/client/*`, `src/hooks/useClient.ts`, `useConnection.ts`
Sidebar client list, config panel, status badges, connect/disconnect. Write tests.
**Checkpoint:** Can add/remove clients, connect to echo server.

### Step 15: Chat Interface

**Files:** `src/components/chat/*`, `src/hooks/useMessages.ts`
Message bubbles, composer, JSON mode, conversation selector, auto-scroll. Write tests.
**Checkpoint:** Can send/receive messages in chat UI.

### Step 16: WebSocket Inspector

**Files:** `src/components/inspector/*`, `src/hooks/useInspector.ts`, `src/services/InspectorService.ts`
Event logging, filtering, connection details, copy payload. Write tests.
**Checkpoint:** Inspector captures all WebSocket events.

### Step 17: Protocol Profile Editor

**Files:** `src/components/settings/ProtocolEditor.tsx`, `src/hooks/useProtocol.ts`
Field mapping UI, test parsing, export/import. Write tests.
**Checkpoint:** Can configure and test protocol profiles.

### Step 18: Global Settings & REST Config

**Files:** `src/components/settings/GlobalSettings.tsx`, `RestConfig.tsx`, `src/services/RestClient.ts`
Platform mode, theme, REST endpoints. Write tests.
**Checkpoint:** `npm test` passes. `npm run build` succeeds.

### Step 19: Wire Up App

**Files:** `src/App.tsx`
Connect all components. Client selection. Settings access. Inspector subscription. Integration test.
**Checkpoint:** Full app functional. `npm test` passes. `npm run build` succeeds.

### Step 20: Manual Testing

Test all scenarios with real WebSocket server (echo.websocket.org or local). Document in docs/TESTING.md. Fix bugs.

### Step 21: Docker & Deployment

**Files:** `docker/*`, `docker-compose.yml`, `.env.example`
Build Docker image, test compose up, verify health check.
**Checkpoint:** `docker compose up` works. App at localhost:3000.

### Step 22: Performance Optimization

Code splitting, lazy loading, memoization. Bundle <500KB gzipped.
**Checkpoint:** `npm run build` succeeds. Bundle size check.

### Step 23: Documentation

**Files:** `README.md`, `docs/ARCHITECTURE.md`, `docs/PROTOCOLS.md`
Setup instructions, architecture, protocol configuration guide.

### Step 24: Final Polish

Run all checks, fix issues, tag release.
**Checkpoint:** All tests pass, no TS errors, no lint errors, Docker works.

## Environment Variables

| Variable             | Required | Default | Description                           |
| -------------------- | -------- | ------- | ------------------------------------- |
| VITE_DEFAULT_WS_URL  | No       | ""      | Default WebSocket URL for new clients |
| VITE_DEFAULT_API_URL | No       | ""      | Default REST API base URL             |

## Testing Requirements

- Unit tests for all auth strategies, protocol adapters, utils, store slices
- Component tests for shared components, client list, message bubble, composer
- Integration test for app rendering
- Transport tests with mock WebSocket
- Run with: `npm test`
- Coverage target: 80%+ on business logic

## Quality Checks

After implementation, verify:

- [ ] `npm run lint` passes with 0 warnings
- [ ] `npm test` passes with 0 failures
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npm run build` produces production artifact
- [ ] `docker compose up` builds and runs
- [ ] App accessible at http://localhost:3000
- [ ] Health check passes
- [ ] All 15 test scenarios pass:
  1. Single WebSocket connection
  2. Multiple simultaneous connections
  3. Bidirectional messaging
  4. Multiple participants
  5. Invalid authentication
  6. Expired authentication
  7. Reconnection
  8. Server unavailable
  9. Invalid payloads
  10. Unexpected disconnects
  11. Message delivery between different clients
  12. Different authentication methods
  13. Different message protocols
  14. Conversation isolation
  15. High-volume message testing
- [ ] README has setup instructions, Docker instructions, env vars
