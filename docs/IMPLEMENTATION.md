# Universal WebSocket Chat Simulator — Implementation Plan

> Technical blueprint derived from SPECIFICATION.md. React + Vite + TypeScript SPA, no backend.

## 1. Tech Stack

### 1.1 Stack Summary

| Layer            | Technology                     | Version          | Rationale                                                                          |
| ---------------- | ------------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| Language         | TypeScript                     | 5.7+             | Type safety for complex state and protocol adapters (SPEC §3.4)                    |
| Runtime          | Node.js                        | 20 LTS           | Vite build tooling and dev server                                                  |
| Framework        | React                          | 19               | Component model suits multi-panel UI; large ecosystem for testing tools            |
| Build            | Vite                           | 6                | Fast HMR, native ESM, optimized production builds                                  |
| State Management | Zustand                        | 5                | Lightweight, no boilerplate, supports slices for client/message/inspector domains  |
| Styling          | Tailwind CSS                   | 4                | Utility-first, rapid prototyping, small bundle, dark mode support                  |
| WebSocket        | Native WebSocket API           | Browser built-in | No dependency; wrapped in abstraction layer for auth/protocol handling (SPEC §3.3) |
| Testing          | Vitest + React Testing Library | Latest           | Vite-native test runner, fast, React component testing                             |
| Linting          | ESLint + Prettier              | Latest           | Standard TS/React rules, auto-format                                               |
| Container        | nginx (alpine)                 | 1.27+            | Static file serving, gzip, reverse proxy support                                   |
| Orchestration    | Docker Compose                 | v2               | Single-command deployment per SPEC §9                                              |

### 1.2 Key Technical Decisions

#### Decision: Pure Frontend SPA (No Backend)

- **Context**: SPEC §4.3, §9.2 — simulator connects directly to target backends. No server-side logic needed.
- **Options Considered**:
  1. **Next.js full-stack**: Server components, API routes — unnecessary complexity, adds server runtime.
  2. **Vite + React SPA**: Pure client-side, static build, simplest deployment.
  3. **Vanilla JS**: No build step, but harder to maintain complex state.
- **Choice**: Vite + React SPA
- **Rationale**: No server-side requirements. Static build deployable via nginx. Fastest development iteration. Simplest Docker setup.
- **Consequences**: All logic runs in browser. CORS/WebSocket limitations inherent to browser platform.

#### Decision: Zustand over Redux/Context

- **Context**: SPEC §3.1, §3.5, §3.6 — multiple independent client states, messages, inspector logs, connection states.
- **Options Considered**:
  1. **Redux Toolkit**: Powerful but verbose for this use case; overkill.
  2. **React Context**: Prop drilling, re-render issues with frequent WebSocket updates.
  3. **Zustand**: Minimal boilerplate, slice-based stores, fine-grained subscriptions.
- **Choice**: Zustand with domain slices
- **Rationale**: WebSocket messages arrive frequently; fine-grained subscriptions prevent unnecessary re-renders. Slices map cleanly to domains (clients, messages, inspector, settings).
- **Consequences**: Less ecosystem tooling than Redux; acceptable for a developer tool.

#### Decision: Native WebSocket with Abstraction Layer

- **Context**: SPEC §3.3, §4.1 — browser cannot send custom headers; need platform-aware transport.
- **Options Considered**:
  1. **Socket.IO client**: Requires Socket.IO server; not backend-agnostic.
  2. **ws (Node library)**: Not browser-compatible.
  3. **Native WebSocket + abstraction**: Browser-compatible, configurable, no server dependency.
- **Choice**: Native WebSocket wrapped in configurable transport abstraction
- **Rationale**: Backend-agnostic requirement (SPEC §1.3). Abstraction allows auth method injection and platform-aware behavior documentation.
- **Consequences**: Custom headers (Electron/Flutter) cannot be tested in browser; documented as platform limitation.

#### Decision: Tailwind CSS over CSS Modules

- **Context**: SPEC §7.1 — modern, minimal, developer-oriented UI with dark mode.
- **Options Considered**:
  1. **CSS Modules**: Scoped styles, but slower iteration.
  2. **Styled Components**: Runtime overhead, larger bundle.
  3. **Tailwind CSS 4**: Utility-first, fast iteration, dark mode via classes, small production bundle.
- **Choice**: Tailwind CSS 4
- **Rationale**: Rapid UI development for developer tool. Dark mode essential for developer UX. PurgeCSS ensures small bundle.
- **Consequences**: Learning curve for utility classes; acceptable for targeted audience.

#### Decision: In-Memory State Only (No Persistence)

- **Context**: SPEC §5.3, §11.2 — testing tool, no persistent storage needed.
- **Options Considered**:
  1. **IndexedDB**: Persistent but adds complexity; credentials in browser storage is risky.
  2. **localStorage**: Simple but credential exposure risk.
  3. **In-memory only**: No persistence, credentials safe, simple.
- **Choice**: In-memory Zustand store, optional JSON export/import for profiles
- **Rationale**: SPEC explicitly states "No persistent storage." Credentials should not persist. Export/import for protocol profiles only.
- **Consequences**: Data lost on refresh; acceptable for testing tool.

### 1.3 Dependency Inventory

| Package                | Purpose            | License    | Justification                                        |
| ---------------------- | ------------------ | ---------- | ---------------------------------------------------- |
| react                  | UI framework       | MIT        | Industry standard, large ecosystem                   |
| react-dom              | React DOM renderer | MIT        | Required for web rendering                           |
| zustand                | State management   | MIT        | Lightweight, slice-based, fine-grained subscriptions |
| tailwindcss            | Utility CSS        | MIT        | Rapid styling, dark mode, small bundle               |
| @types/react           | TypeScript types   | MIT        | Type safety                                          |
| @types/react-dom       | TypeScript types   | MIT        | Type safety                                          |
| vite                   | Build tool         | MIT        | Fast HMR, native ESM                                 |
| @vitejs/plugin-react   | Vite React plugin  | MIT        | JSX/TSX support in Vite                              |
| typescript             | Type checking      | Apache-2.0 | Static type safety                                   |
| vitest                 | Test runner        | MIT        | Vite-native, fast                                    |
| @testing-library/react | Component testing  | MIT        | User-centric test utilities                          |
| eslint                 | Linting            | MIT        | Code quality                                         |
| prettier               | Formatting         | MIT        | Consistent code style                                |
| lucide-react           | Icons              | ISC        | Clean icon set, tree-shakeable                       |

Dependency philosophy: **Curated minimal** — fewer than 20 direct dependencies. No backend dependencies. No database drivers.

## 2. Design Patterns

### 2.1 Architectural Pattern: Layered Frontend (Container/Presentational + Hooks)

**Why:** SPEC §4.1 — separate UI, transport, auth, and state management. React's component model with custom hooks provides clean separation.

**Application:** UI components are purely presentational. Custom hooks (useWebSocket, useClient, useInspector) encapsulate logic. Zustand store holds global state.

**Code Sketch:**

```typescript
// Hook encapsulates WebSocket logic; component only renders
function useClientConnection(clientId: string) {
  const client = useClientStore((s) => s.clients[clientId]);
  const connect = useClientStore((s) => s.connectClient);
  const disconnect = useClientStore((s) => s.disconnectClient);
  return { client, connect, disconnect };
}
```

### 2.2 Strategy Pattern: Authentication Methods

**Why:** SPEC §3.3 — multiple auth methods (Bearer, headers, cookie, query, subprotocol) swappable per client.

**Application:** Each auth method implements a common interface that transforms connection parameters. The transport layer applies the selected strategy.

**Code Sketch:**

```typescript
interface AuthStrategy {
  apply(
    url: string,
    headers?: Record<string, string>,
  ): { url: string; protocols?: string[] };
  maskCredentials(): string;
}
class BearerTokenAuth implements AuthStrategy {
  /* ... */
}
class QueryParamAuth implements AuthStrategy {
  /* ... */
}
```

### 2.3 Strategy Pattern: Message Protocol Adapter

**Why:** SPEC §3.4 — configurable field mappings for any backend message format.

**Application:** Each protocol profile defines a mapping. The adapter transforms outgoing user input to backend format and parses incoming backend messages to internal format.

**Code Sketch:**

```typescript
interface ProtocolAdapter {
  toBackend(input: ChatMessage): unknown;
  fromBackend(raw: unknown): ChatMessage | null;
  getEventName(type: string): string;
}
```

### 2.4 State Machine: Connection Lifecycle

**Why:** SPEC §3.6 — connection has well-defined states with controlled transitions (disconnected → connecting → connected → reconnecting → error).

**Application:** Connection state transitions are explicit. Invalid transitions are ignored. Auto-reconnect logic hooks into state changes.

**Code Sketch:**

```typescript
type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";
const VALID_TRANSITIONS: Record<ConnectionState, ConnectionState[]> = {
  disconnected: ["connecting"],
  connecting: ["connected", "error"],
  connected: ["disconnected", "reconnecting", "error"],
  reconnecting: ["connected", "error", "disconnected"],
  error: ["connecting", "disconnected"],
};
```

### 2.5 Observer Pattern: Inspector Service

**Why:** SPEC §3.5 — inspector must capture all WebSocket events without coupling to transport implementation.

**Application:** Transport emits events to a central event bus. Inspector service subscribes and logs. UI subscribes to inspector store for display.

**Code Sketch:**

```typescript
type WsEvent = {
  clientId: string;
  type: string;
  payload: unknown;
  timestamp: number;
};
class EventBus {
  private listeners = new Map<string, Set<(e: WsEvent) => void>>();
  emit(event: WsEvent) {
    this.listeners.get(event.type)?.forEach((fn) => fn(event));
  }
  on(type: string, fn: (e: WsEvent) => void) {
    /* subscribe */
  }
}
```

### 2.6 Adapter Pattern: Transport Abstraction

**Why:** SPEC §4.1 — transport must be swappable and testable independently of native WebSocket.

**Application:** Define a Transport interface. BrowserTransport implements it using native WebSocket. Future ElectronTransport could use `ws` library. Tests use MockTransport.

**Code Sketch:**

```typescript
interface Transport {
  connect(config: ConnectionConfig): Promise<void>;
  send(data: unknown): void;
  disconnect(code?: number, reason?: string): void;
  onMessage(handler: (data: unknown) => void): void;
  onClose(handler: (code: number, reason: string) => void): void;
  onError(handler: (error: Error) => void): void;
}
```

## 3. Project Structure

### 3.1 Directory Layout

```
universal-websocket-chat-simulator/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component with layout
│   ├── index.css                   # Tailwind imports + global styles
│   ├── types/
│   │   ├── client.ts               # Client entity + config types
│   │   ├── message.ts              # Message entity types
│   │   ├── protocol.ts             # Protocol profile + adapter types
│   │   ├── inspector.ts            # Inspector entry types
│   │   ├── auth.ts                 # Auth method + strategy types
│   │   ├── transport.ts            # Transport interface + config
│   │   └── rest.ts                 # REST endpoint types
│   ├── store/
│   │   ├── index.ts                # Combined store export
│   │   ├── clientSlice.ts          # Client CRUD + connection state
│   │   ├── messageSlice.ts         # Message storage + grouping
│   │   ├── inspectorSlice.ts      # Inspector log management
│   │   ├── settingsSlice.ts       # Global settings (platform, theme)
│   │   └── protocolSlice.ts       # Protocol profile management
│   ├── transport/
│   │   ├── Transport.ts            # Transport interface definition
│   │   ├── BrowserTransport.ts     # Native WebSocket implementation
│   │   ├── TransportFactory.ts     # Creates transport by platform
│   │   └── ConnectionManager.ts    # Reconnection, timeout, state machine
│   ├── auth/
│   │   ├── AuthStrategy.ts         # Auth strategy interface
│   │   ├── BearerTokenAuth.ts      # Bearer token implementation
│   │   ├── CustomHeadersAuth.ts    # Custom handshake headers
│   │   ├── CookieAuth.ts           # Cookie-based auth
│   │   ├── QueryParamAuth.ts       # Query parameter auth
│   │   ├── SubprotocolAuth.ts      # WebSocket subprotocol auth
│   │   └── NoneAuth.ts             # No authentication
│   ├── protocol/
│   │   ├── ProtocolAdapter.ts      # Adapter interface
│   │   ├── JsonPathAdapter.ts      # Dot-notation field mapping
│   │   └── ProfileManager.ts       # Save/load/import/export profiles
│   ├── services/
│   │   ├── InspectorService.ts     # Event capture + filtering
│   │   ├── EventBus.ts             # Central event emitter
│   │   └── RestClient.ts           # Optional REST request executor
│   ├── hooks/
│   │   ├── useClient.ts            # Client state + actions hook
│   │   ├── useConnection.ts        # Connection lifecycle hook
│   │   ├── useMessages.ts          # Message list + send hook
│   │   ├── useInspector.ts         # Inspector filter + display hook
│   │   └── useProtocol.ts          # Protocol profile hook
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Three-panel resizable layout
│   │   │   ├── Sidebar.tsx         # Client list + add button
│   │   │   ├── MainPanel.tsx       # Chat view container
│   │   │   └── InspectorPanel.tsx  # Inspector container
│   │   ├── client/
│   │   │   ├── ClientList.tsx      # Sidebar client list
│   │   │   ├── ClientItem.tsx      # Single client with status
│   │   │   ├── ClientConfig.tsx    # Configuration form
│   │   │   └── ConnectionBadge.tsx # Status indicator
│   │   ├── chat/
│   │   │   ├── ChatView.tsx        # Message list + composer
│   │   │   ├── MessageBubble.tsx   # Single message bubble
│   │   │   ├── MessageComposer.tsx # Input + send + JSON toggle
│   │   │   ├── ConversationSelector.tsx # Conversation filter
│   │   │   └── JsonViewer.tsx      # Syntax-highlighted JSON display
│   │   ├── inspector/
│   │   │   ├── InspectorLog.tsx    # Log list with filters
│   │   │   ├── InspectorEntry.tsx  # Single log entry
│   │   │   ├── FilterBar.tsx       # Client + event type filters
│   │   │   └── ConnectionDetails.tsx # Connection metadata panel
│   │   ├── settings/
│   │   │   ├── GlobalSettings.tsx  # Platform mode, theme, defaults
│   │   │   ├── ProtocolEditor.tsx  # Protocol profile editor
│   │   │   └── RestConfig.tsx      # REST endpoint configuration
│   │   └── shared/
│   │       ├── Button.tsx          # Reusable button
│   │       ├── Input.tsx           # Reusable input
│   │       ├── Modal.tsx           # Reusable modal
│   │       ├── Tooltip.tsx         # Reusable tooltip
│   │       └── MaskedInput.tsx     # Credential input with mask toggle
│   └── utils/
│       ├── validation.ts           # URL, JSON, alias validation
│       ├── formatting.ts           # Timestamp, duration formatting
│       ├── jsonPath.ts             # Dot-notation path resolver
│       └── exportImport.ts         # Profile export/import
├── tests/
│   ├── setup.ts                    # Test setup (jsdom, etc.)
│   ├── unit/
│   │   ├── protocol/               # Protocol adapter tests
│   │   ├── auth/                   # Auth strategy tests
│   │   ├── transport/              # Transport tests (mocked)
│   │   └── store/                  # Zustand slice tests
│   └── components/                 # Component tests
├── docker/
│   ├── Dockerfile                  # Multi-stage build
│   └── nginx.conf                  # Nginx configuration
├── docker-compose.yml              # Orchestration
├── .env.example                    # Environment variable template
├── .eslintrc.cjs                   # ESLint config
├── .prettierrc                     # Prettier config
├── index.html                      # Vite entry HTML
├── package.json                    # Dependencies + scripts
├── tsconfig.json                   # TypeScript config
├── tsconfig.node.json              # Node-side TS config
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind configuration
├── vitest.config.ts                # Vitest configuration
└── README.md                       # Usage documentation
```

### 3.2 Module Breakdown

#### Module: types/

- **Path**: `src/types/`
- **Responsibility**: All TypeScript type definitions and interfaces.
- **Exports**: Client, Message, ProtocolProfile, AuthConfig, Transport, ConnectionState, etc.
- **Imports**: None (leaf module)
- **Key Files**: All type definition files listed above.

#### Module: store/

- **Path**: `src/store/`
- **Responsibility**: Global state management via Zustand slices.
- **Exports**: useAppStore (combined), individual slice hooks.
- **Imports**: types/, services/
- **Key Files**: clientSlice.ts, messageSlice.ts, inspectorSlice.ts, settingsSlice.ts, protocolSlice.ts

#### Module: transport/

- **Path**: `src/transport/`
- **Responsibility**: WebSocket connection abstraction, lifecycle management, reconnection.
- **Exports**: Transport interface, BrowserTransport, ConnectionManager, TransportFactory.
- **Imports**: types/, auth/, services/EventBus, store/
- **Key Files**: Transport.ts, BrowserTransport.ts, ConnectionManager.ts, TransportFactory.ts

#### Module: auth/

- **Path**: `src/auth/`
- **Responsibility**: Authentication strategy implementations.
- **Exports**: AuthStrategy interface, all auth implementations, AuthFactory.
- **Imports**: types/
- **Key Files**: AuthStrategy.ts, BearerTokenAuth.ts, etc.

#### Module: protocol/

- **Path**: `src/protocol/`
- **Responsibility**: Message protocol adapter, field mapping, profile management.
- **Exports**: ProtocolAdapter, JsonPathAdapter, ProfileManager.
- **Imports**: types/, utils/jsonPath
- **Key Files**: ProtocolAdapter.ts, JsonPathAdapter.ts, ProfileManager.ts

#### Module: services/

- **Path**: `src/services/`
- **Responsibility**: Cross-cutting services (inspector, event bus, REST client).
- **Exports**: InspectorService, EventBus, RestClient.
- **Imports**: types/, store/
- **Key Files**: InspectorService.ts, EventBus.ts, RestClient.ts

#### Module: hooks/

- **Path**: `src/hooks/`
- **Responsibility**: React hooks bridging store and components.
- **Exports**: useClient, useConnection, useMessages, useInspector, useProtocol.
- **Imports**: store/, transport/, protocol/
- **Key Files**: All hook files listed above.

#### Module: components/

- **Path**: `src/components/`
- **Responsibility**: UI rendering (presentational + container components).
- **Exports**: All React components.
- **Imports**: hooks/, types/, shared/
- **Key Files**: All component files listed above.

### 3.3 Module Dependency Graph

```
components/ → hooks/ → store/ → services/
                          ↓
                    transport/ → auth/
                          ↓
                    protocol/
                          ↓
                    types/ (leaf — no dependencies)
```

- `types/` is the leaf module — no imports from other src modules.
- `transport/` depends on `auth/` and `services/EventBus`.
- `store/` depends on `services/` and `transport/` (via actions).
- `hooks/` bridge `store/` and `transport/` to `components/`.
- `components/` only import from `hooks/` and `shared/`.

## 4. Data Layer

No database. All state is in-memory via Zustand. Protocol profiles can be exported/imported as JSON.

### 4.1 In-Memory State Shape

```typescript
interface AppState {
  // Client domain
  clients: Record<string, Client>;
  clientOrder: string[]; // ordered list of client IDs for sidebar

  // Message domain
  messages: Record<string, Message[]>; // keyed by clientId
  conversations: Record<string, string[]>; // clientId → conversationIds

  // Inspector domain
  inspectorLog: InspectorEntry[];
  inspectorFilters: { clients: string[]; eventTypes: string[] };

  // Protocol domain
  protocolProfiles: Record<string, ProtocolProfile>;
  activeProfilePerClient: Record<string, string>;

  // Settings domain
  settings: {
    platformMode: "browser" | "electron" | "flutter";
    theme: "light" | "dark";
    defaultWsUrl: string;
    defaultApiUrl: string;
  };

  // REST domain
  restEndpoints: RestEndpoint[];
}
```

### 4.2 State Slices

Each domain is a Zustand slice with actions:

```typescript
// clientSlice.ts
interface ClientSlice {
  clients: Record<string, Client>;
  addClient: (config: ClientConfig) => string; // returns clientId
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  setConnectionState: (id: string, state: ConnectionState) => void;
  setConnectedAt: (id: string, timestamp: number | null) => void;
  setLastError: (id: string, error: string | null) => void;
}
```

## 5. Transport Implementation

### 5.1 Transport Interface

```typescript
// src/transport/Transport.ts
interface TransportConfig {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>; // Documented; only sent in non-browser
  queryParams?: Record<string, string>;
  cookies?: string; // Browser-managed; documented
  timeout: number;
}

interface Transport {
  connect(config: TransportConfig): Promise<void>;
  send(data: string | object): void;
  disconnect(code?: number, reason?: string): void;
  getState(): ConnectionState;
  onMessage(cb: (data: unknown) => void): () => void; // returns unsubscribe
  onClose(cb: (code: number, reason: string) => void): () => void;
  onError(cb: (error: Error) => void): () => void;
  onOpen(cb: () => void): () => void;
}
```

### 5.2 BrowserTransport Implementation

```typescript
// src/transport/BrowserTransport.ts
class BrowserTransport implements Transport {
  private ws: WebSocket | null = null;
  private config: TransportConfig;
  private state: ConnectionState = "disconnected";
  private messageHandlers = new Set<(data: unknown) => void>();
  private closeHandlers = new Set<(code: number, reason: string) => void>();
  private errorHandlers = new Set<(error: Error) => void>();
  private openHandlers = new Set<() => void>();

  async connect(config: TransportConfig): Promise<void> {
    this.config = config;
    this.state = "connecting";
    const url = this.buildUrl(config); // appends query params
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        reject(new Error("Connection timeout"));
      }, config.timeout * 1000);

      this.ws = new WebSocket(url, config.protocols);
      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.state = "connected";
        this.openHandlers.forEach((h) => h());
        resolve();
      };
      this.ws.onmessage = (e) => {
        /* parse + emit to handlers */
      };
      this.ws.onclose = (e) => {
        this.state = "disconnected";
        this.closeHandlers.forEach((h) => h(e.code, e.reason));
      };
      this.ws.onerror = (e) => {
        this.state = "error";
        this.errorHandlers.forEach((h) => h(new Error("WebSocket error")));
      };
    });
  }
  // ... send, disconnect, etc.
}
```

### 5.3 ConnectionManager (Reconnection + Timeout)

```typescript
// src/transport/ConnectionManager.ts
class ConnectionManager {
  private transport: Transport;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private config: {
      autoReconnect: boolean;
      interval: number;
      maxAttempts: number;
    },
  ) {}

  async connectWithRetry(
    transport: Transport,
    config: TransportConfig,
  ): Promise<void> {
    try {
      await transport.connect(config);
      this.reconnectAttempts = 0;
    } catch (err) {
      if (
        this.config.autoReconnect &&
        this.reconnectAttempts < this.config.maxAttempts
      ) {
        this.reconnectAttempts++;
        this.scheduleReconnect(transport, config);
      } else {
        throw err;
      }
    }
  }

  private scheduleReconnect(transport: Transport, config: TransportConfig) {
    this.reconnectTimer = setTimeout(() => {
      transport
        .connect(config)
        .catch(() => this.handleReconnectFailure(transport, config));
    }, this.config.interval * 1000);
  }
}
```

## 6. Frontend Implementation

### 6.1 Component Architecture

- **Container components** (in pages/layout): Connect to Zustand store via hooks, pass data to presentational components.
- **Presentational components**: Receive props, render UI, emit events via callbacks.
- **Custom hooks**: Encapsulate store interactions and side effects (useClient, useConnection, etc.).
- **Shared components**: Reusable UI primitives (Button, Input, Modal, etc.).

### 6.2 State Management

- Zustand store with 5 slices: clientSlice, messageSlice, inspectorSlice, settingsSlice, protocolSlice.
- Slices are combined using Zustand's slice pattern.
- Components subscribe to specific slices via selectors to minimize re-renders.
- WebSocket events update store via transport callbacks → store actions.

### 6.3 Routing

No router needed. Single-page application with panel-based navigation. State determines which panel is active (mobile) or all panels visible (desktop).

### 6.4 Styling

- Tailwind CSS 4 with `@tailwindcss/vite` plugin.
- Dark mode via `dark:` prefix, toggled by class on `<html>`.
- CSS variables for theme colors (defined in index.css).
- Responsive breakpoints: sm (640), md (768), lg (1024), xl (1280).

## 7. Error Handling Strategy

### 7.1 Error Classification

| Category   | Example                   | User Sees                    | Logged As         |
| ---------- | ------------------------- | ---------------------------- | ----------------- |
| Connection | Timeout, refused          | "Connection failed: timeout" | Error (inspector) |
| Auth       | 401, invalid token        | "Authentication failed"      | Warn (inspector)  |
| Protocol   | Invalid JSON, parse error | "Message parse error"        | Warn (inspector)  |
| Validation | Bad URL, duplicate alias  | Inline field error           | Debug (console)   |
| Transport  | WebSocket error event     | "WebSocket error"            | Error (inspector) |

### 7.2 Error Propagation

```
Transport error → ConnectionManager → store.setLastError() → UI displays
Transport message parse error → ProtocolAdapter → store.addMessage(raw) + inspector.warn()
Validation error → component local state → inline error display
```

## 8. Configuration

### 8.1 Config Sources

1. Defaults (hardcoded in settingsSlice).
2. Environment variables (VITE_DEFAULT_WS_URL, VITE_DEFAULT_API_URL) — optional.
3. UI configuration (overrides all).

### 8.2 Config Schema

| Key                 | Type   | Default | Env Var              | Description                              |
| ------------------- | ------ | ------- | -------------------- | ---------------------------------------- |
| defaultWsUrl        | string | ""      | VITE_DEFAULT_WS_URL  | Default WebSocket URL for new clients    |
| defaultApiUrl       | string | ""      | VITE_DEFAULT_API_URL | Default REST API base URL                |
| platformMode        | enum   | browser | —                    | Platform mode (browser/electron/flutter) |
| theme               | enum   | dark    | —                    | UI theme (light/dark)                    |
| maxClients          | number | 20      | —                    | Maximum simultaneous clients             |
| maxInspectorEntries | number | 10000   | —                    | Inspector log buffer size                |
| connectionTimeout   | number | 10      | —                    | Default connection timeout (seconds)     |

## 9. Testing Strategy

### 9.1 Test Pyramid

| Level       | Tool         | Scope                                                   | Target                    |
| ----------- | ------------ | ------------------------------------------------------- | ------------------------- |
| Unit        | Vitest       | Auth strategies, protocol adapters, utils, store slices | 80%+ coverage on logic    |
| Component   | Vitest + RTL | UI components in isolation                              | Key interactions          |
| Integration | Vitest       | Transport + store + protocol integration                | Connection + message flow |

### 9.2 Test Patterns

- **MockTransport**: Implements Transport interface for testing without real WebSocket.
- **Factory functions**: Create valid Client, Message, ProtocolProfile with sensible defaults + overrides.
- **Store testing**: Direct slice action testing without React rendering.

### 9.3 CI Pipeline

```
Push/PR → Lint (eslint) → Type Check (tsc) → Unit Tests (vitest) → Build (vite build)
```

No deployment pipeline initially — manual Docker build.

## 10. Security Implementation

### 10.1 Input Sanitization Points

- Endpoint URLs: validated for ws:// or wss:// scheme (utils/validation.ts).
- JSON payloads: validated via JSON.parse before sending.
- Client aliases: validated for uniqueness and length (1-30 chars).
- Numeric configs: bounded to valid ranges.

### 10.2 Secret Management

- Credentials stored in Zustand (in-memory only).
- Masked in UI by default (MaskedInput component).
- Never logged in inspector.
- Export warning when credentials are included in profile export.

### 10.3 Security Headers (nginx)

- Content-Security-Policy: restrict script/style sources.
- X-Frame-Options: DENY.
- X-Content-Type-Options: nosniff.
- Referrer-Policy: strict-origin-when-cross-origin.

## 11. Deployment

### 11.1 Build Command

```bash
npm run build  # tsc + vite build → dist/
```

### 11.2 Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
```

### 11.3 Docker Compose

```yaml
version: "3.8"
services:
  simulator:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_DEFAULT_WS_URL=${VITE_DEFAULT_WS_URL:-}
      - VITE_DEFAULT_API_URL=${VITE_DEFAULT_API_URL:-}
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://localhost:80/",
        ]
      interval: 30s
      timeout: 3s
      retries: 3
```

### 11.4 Nginx Configuration

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

## 12. Development Workflow

### 12.1 Local Setup

```bash
git clone <repo>
cd universal-websocket-chat-simulator
npm install
cp .env.example .env
npm run dev  # http://localhost:5173
```

### 12.2 Code Standards

- ESLint: `@typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- Prettier: 2-space indent, single quotes, trailing commas, 100-char line width.
- Commit convention: Conventional Commits (feat:, fix:, docs:, etc.).
- Pre-commit: lint-staged (eslint --fix + prettier --write).

### 12.3 Git Workflow

- Main branch: `main` (protected).
- Feature branches: `feat/description`.
- PR required for merge.
- Squash merge preferred.
