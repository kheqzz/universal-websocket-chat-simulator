# Universal WebSocket Chat Simulator — Tasks

> Ordered work breakdown derived from IMPLEMENTATION.md.
> Execute sequentially. Each task is completable in a single session.

## Summary

| Metric              | Value         |
| ------------------- | ------------- |
| Total Tasks         | 24            |
| Phases              | 7             |
| Estimated Effort    | 40-60 hours   |
| Foundation Complete | After Task 4  |
| MVP Complete        | After Task 18 |
| Full Release        | After Task 24 |

---

## Phase 1: Project Foundation

> Establishes project structure, core types, and infrastructure.
> After this phase: project compiles/runs, nothing functional yet.

### Task 1: Project Scaffolding

**Create the project skeleton with all config files and directory structure.**

**Files to create:**

- `package.json` — with all dependencies from IMPLEMENTATION.md §1.3
- `tsconfig.json` — strict mode, ES2022 target
- `tsconfig.node.json` — for Vite config
- `vite.config.ts` — React plugin, path aliases
- `tailwind.config.ts` — Tailwind 4 config
- `vitest.config.ts` — test runner config
- `.eslintrc.cjs` — ESLint rules
- `.prettierrc` — formatting rules
- `.gitignore` — node_modules, dist, .env
- `index.html` — Vite entry point
- `src/main.tsx` — React root render
- `src/App.tsx` — placeholder root component
- `src/index.css` — Tailwind imports
- All directories from IMPLEMENTATION.md §3.1 with `.gitkeep`

**Commands to run:**

```bash
npm create vite@latest . -- --template react-ts
npm install zustand tailwindcss @tailwindcss/vite lucide-react
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
```

**Acceptance Criteria:**

- [ ] `npm run dev` starts dev server without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] `npm test` runs (0 tests, 0 failures)
- [ ] All directories from IMPLEMENTATION.md §3.1 exist
- [ ] TypeScript strict mode enabled

**Dependencies:** None
**Effort:** 2-3 hours
**Refs:** IMPLEMENTATION.md §1, §3.1, §12

---

### Task 2: Core Domain Types

**Define all domain entities, interfaces, and shared types.**

**Files to create:**

- `src/types/client.ts` — Client, ClientConfig, ConnectionState types
- `src/types/message.ts` — Message, MessageDirection, MessageStatus types
- `src/types/protocol.ts` — ProtocolProfile, ProtocolMapping, ProtocolAdapter types
- `src/types/inspector.ts` — InspectorEntry, InspectorEventType types
- `src/types/auth.ts` — AuthMethod, AuthConfig, AuthStrategy types
- `src/types/transport.ts` — Transport, TransportConfig, ConnectionConfig types
- `src/types/rest.ts` — RestEndpoint, RestResponse types
- `src/types/index.ts` — barrel export

**Code requirements:**

- Every entity from SPECIFICATION.md §5.1 must have a corresponding type
- Use strict TypeScript (no `any`, prefer `unknown` for raw payloads)
- Export all types from barrel file
- Define ConnectionState as union type with valid transitions documented
- Define AuthMethod as union: 'bearer' | 'headers' | 'cookie' | 'query' | 'subprotocol' | 'none'

**Acceptance Criteria:**

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] All types from SPECIFICATION.md §5.1 are defined
- [ ] No `any` types used
- [ ] Types are importable from `@/types`

**Dependencies:** Task 1
**Effort:** 2-3 hours
**Refs:** SPECIFICATION.md §2, §5; IMPLEMENTATION.md §4.1

---

### Task 3: Validation Utilities

**Create validation functions for URLs, JSON, aliases, and numeric bounds.**

**Files to create:**

- `src/utils/validation.ts` — validateWsUrl, validateJson, validateAlias, validateRange
- `src/utils/formatting.ts` — formatTimestamp, formatDuration, formatBytes
- `src/utils/jsonPath.ts` — getNestedValue, setNestedValue (dot-notation path resolver)
- `src/utils/exportImport.ts` — exportProfiles, importProfiles, downloadJson
- `src/utils/index.ts` — barrel export

**Code requirements:**

- `validateWsUrl`: accepts ws:// or wss://, returns { valid, error }
- `validateJson`: attempts JSON.parse, returns { valid, value, error }
- `validateAlias`: 1-30 chars, alphanumeric + hyphens/underscores, unique check
- `validateRange`: min/max bounds for numeric config values
- `jsonPath`: supports dot notation like "data.message.content", handles arrays

**Test requirements:**

- `tests/unit/utils/validation.test.ts` — test all validators with valid/invalid inputs
- `tests/unit/utils/jsonPath.test.ts` — test nested path resolution

**Acceptance Criteria:**

- [ ] All validation functions return structured results (not thrown errors)
- [ ] `npm test` passes with new tests
- [ ] Edge cases covered (empty strings, null, undefined, deeply nested)

**Dependencies:** Task 2
**Effort:** 2 hours
**Refs:** IMPLEMENTATION.md §8.1, §10.1

---

### Task 4: EventBus Service

**Create central event emitter for WebSocket event propagation.**

**Files to create:**

- `src/services/EventBus.ts` — EventBus class with emit/on/off
- `src/services/index.ts` — barrel export

**Code requirements:**

- Type-safe event emission with event name + payload
- Support multiple listeners per event type
- Return unsubscribe function from `on()`
- Support wildcard listeners (optional, for inspector)
- No memory leaks (proper cleanup)

**Code sketch:**

```typescript
type EventHandler<T = unknown> = (payload: T) => void;
class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();
  emit<T>(event: string, payload: T): void;
  on<T>(event: string, handler: EventHandler<T>): () => void;
  off(event: string, handler: EventHandler): void;
}
```

**Test requirements:**

- `tests/unit/services/EventBus.test.ts` — emit/on/off, multiple listeners, unsubscribe

**Acceptance Criteria:**

- [ ] Events are type-safe
- [ ] Multiple listeners receive same event
- [ ] Unsubscribe prevents further calls
- [ ] No memory leaks on repeated subscribe/unsubscribe
- [ ] `npm test` passes

**Dependencies:** Task 2
**Effort:** 1-2 hours
**Refs:** IMPLEMENTATION.md §2.5

---

## Phase 2: State Management

> Zustand store with domain slices.
> After this phase: state management works, testable without UI.

### Task 5: Zustand Store — Client Slice

**Implement client state management slice.**

**Files to create:**

- `src/store/clientSlice.ts` — ClientSlice with CRUD + connection state actions

**Code requirements:**

- State: clients (Record<string, Client>), clientOrder (string[])
- Actions: addClient, updateClient, removeClient, setConnectionState, setConnectedAt, setLastError
- addClient: generates UUID, validates alias uniqueness, returns clientId
- removeClient: removes from clients and clientOrder
- setConnectionState: validates transition via state machine
- Use immer-like immutable updates (Zustand supports set with partial)

**Test requirements:**

- `tests/unit/store/clientSlice.test.ts` — add, update, remove, state transitions, duplicate alias rejection

**Acceptance Criteria:**

- [ ] addClient returns unique ID
- [ ] Duplicate alias throws/returns error
- [ ] removeClient cleans up all references
- [ ] Connection state transitions validated
- [ ] `npm test` passes

**Dependencies:** Task 2, Task 4
**Effort:** 2-3 hours
**Refs:** IMPLEMENTATION.md §4.2, §2.4

---

### Task 6: Zustand Store — Message Slice

**Implement message storage and grouping slice.**

**Files to create:**

- `src/store/messageSlice.ts` — MessageSlice with add, clear, group by conversation

**Code requirements:**

- State: messages (Record<string, Message[]>), conversations (Record<string, string[]>)
- Actions: addMessage, clearMessages, clearClientMessages, getMessagesByConversation
- addMessage: appends to client's message array, auto-discovers conversation IDs
- Messages sorted by timestamp on insert
- Limit: 10,000 messages per client (rotate oldest)

**Test requirements:**

- `tests/unit/store/messageSlice.test.ts` — add, clear, conversation grouping, rotation

**Acceptance Criteria:**

- [ ] Messages stored per client
- [ ] Conversation IDs auto-discovered from incoming messages
- [ ] Message rotation at 10,000 limit
- [ ] `npm test` passes

**Dependencies:** Task 2, Task 5
**Effort:** 2 hours
**Refs:** IMPLEMENTATION.md §4.2, SPECIFICATION.md §3.2.3

---

### Task 7: Zustand Store — Inspector Slice

**Implement inspector log management slice.**

**Files to create:**

- `src/store/inspectorSlice.ts` — InspectorSlice with add, clear, filter

**Code requirements:**

- State: inspectorLog (InspectorEntry[]), filters (clients[], eventTypes[])
- Actions: addEntry, clearLog, setFilters, getFilteredEntries
- addEntry: appends, rotates at 10,000 entries
- getFilteredEntries: filters by selected clients and event types
- Entries include timestamp (client time), clientId, eventType, summary, payload

**Test requirements:**

- `tests/unit/store/inspectorSlice.test.ts` — add, clear, filter, rotation

**Acceptance Criteria:**

- [ ] Entries rotate at 10,000 limit
- [ ] Filtering by client and event type works
- [ ] Clear removes all entries
- [ ] `npm test` passes

**Dependencies:** Task 2, Task 5
**Effort:** 2 hours
**Refs:** IMPLEMENTATION.md §4.2, SPECIFICATION.md §3.5.1

---

### Task 8: Zustand Store — Settings & Protocol Slices

**Implement global settings and protocol profile management slices.**

**Files to create:**

- `src/store/settingsSlice.ts` — SettingsSlice (platform mode, theme, defaults)
- `src/store/protocolSlice.ts` — ProtocolSlice (profiles CRUD, active per client)
- `src/store/index.ts` — combined store export

**Code requirements:**

- settingsSlice: platformMode, theme, defaultWsUrl, defaultApiUrl + setters
- protocolSlice: profiles (Record<string, ProtocolProfile>), activeProfilePerClient, addProfile, updateProfile, deleteProfile, setActiveProfile
- Combined store using Zustand slice pattern
- Persist theme to localStorage (exception to in-memory rule — UI preference only, no credentials)

**Test requirements:**

- `tests/unit/store/settingsSlice.test.ts` — settings CRUD
- `tests/unit/store/protocolSlice.test.ts` — profile CRUD, active assignment

**Acceptance Criteria:**

- [ ] Combined store exports useAppStore
- [ ] Theme persists to localStorage
- [ ] Protocol profiles can be added/updated/deleted
- [ ] Active profile per client tracked
- [ ] `npm test` passes

**Dependencies:** Task 2, Task 5
**Effort:** 2-3 hours
**Refs:** IMPLEMENTATION.md §4.2, §8.1

---

## Phase 3: Authentication

> Auth strategy implementations.
> After this phase: all auth methods work, testable in isolation.

### Task 9: Auth Strategy Implementations

**Implement all authentication strategy classes.**

**Files to create:**

- `src/auth/AuthStrategy.ts` — interface definition
- `src/auth/BearerTokenAuth.ts` — Bearer token (Authorization header)
- `src/auth/CustomHeadersAuth.ts` — arbitrary handshake headers
- `src/auth/CookieAuth.ts` — cookie-based (browser-managed)
- `src/auth/QueryParamAuth.ts` — query parameter auth
- `src/auth/SubprotocolAuth.ts` — WebSocket subprotocol auth
- `src/auth/NoneAuth.ts` — no authentication
- `src/auth/AuthFactory.ts` — create strategy from config
- `src/auth/index.ts` — barrel export

**Code requirements:**

- All implement AuthStrategy interface: apply(url, headers?) → { url, protocols? }
- BearerTokenAuth: adds `Authorization: Bearer <token>` to headers (documented; browser won't send)
- CookieAuth: documents that browser manages cookies; no header injection
- QueryParamAuth: appends token to URL query string with warning
- SubprotocolAuth: sets WebSocket protocols array
- Each has maskCredentials() returning masked string (e.g., "Bearer \*\*\*\*abcd")
- AuthFactory creates correct strategy from AuthConfig

**Test requirements:**

- `tests/unit/auth/AuthStrategy.test.ts` — each strategy's apply() and maskCredentials()

**Acceptance Criteria:**

- [ ] All 6 auth methods implemented
- [ ] maskCredentials never reveals full token
- [ ] AuthFactory creates correct strategy for each method
- [ ] QueryParamAuth includes security warning in config
- [ ] `npm test` passes

**Dependencies:** Task 2
**Effort:** 2-3 hours
**Refs:** IMPLEMENTATION.md §2.2, SPECIFICATION.md §3.3

---

## Phase 4: Transport Layer

> WebSocket transport abstraction, connection management, reconnection.
> After this phase: can connect to real WebSocket servers.

### Task 10: Transport Interface & BrowserTransport

**Implement WebSocket transport abstraction and browser implementation.**

**Files to create:**

- `src/transport/Transport.ts` — Transport interface + TransportConfig
- `src/transport/BrowserTransport.ts` — native WebSocket implementation
- `src/transport/TransportFactory.ts` — create transport by platform
- `src/transport/index.ts` — barrel export

**Code requirements:**

- Transport interface as defined in IMPLEMENTATION.md §5.1
- BrowserTransport wraps native WebSocket
- buildUrl: appends query params from auth strategy
- onopen/onmessage/onclose/onerror handlers
- Message parsing: try JSON, fallback to string
- Unsubscribe functions returned from onMessage/onClose/onError/onOpen
- TransportFactory: returns BrowserTransport for all platforms (documented limitation for headers)

**Test requirements:**

- `tests/unit/transport/BrowserTransport.test.ts` — mock WebSocket, test connect/send/disconnect/events

**Acceptance Criteria:**

- [ ] Transport interface fully implemented
- [ ] WebSocket events properly proxied
- [ ] Query params appended to URL
- [ ] Unsubscribe functions work
- [ ] `npm test` passes

**Dependencies:** Task 2, Task 9
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §5.1, §5.2

---

### Task 11: ConnectionManager

**Implement connection lifecycle management with reconnection and timeout.**

**Files to create:**

- `src/transport/ConnectionManager.ts` — reconnection, timeout, state machine

**Code requirements:**

- Connection state machine with valid transitions (IMPLEMENTATION.md §2.4)
- Connection timeout (configurable, default 10s)
- Auto-reconnect with configurable interval and max attempts
- Manual reconnect method
- Clean disconnect (close code 1000, reason)
- Track connection duration (start time on connect)
- Emit events to EventBus for inspector logging

**Test requirements:**

- `tests/unit/transport/ConnectionManager.test.ts` — state transitions, timeout, reconnect logic, max attempts

**Acceptance Criteria:**

- [ ] State transitions validated (invalid transitions ignored)
- [ ] Timeout fires after configured duration
- [ ] Auto-reconnect respects max attempts
- [ ] Manual reconnect works
- [ ] Connection duration tracked
- [ ] `npm test` passes

**Dependencies:** Task 4, Task 10
**Effort:** 3 hours
**Refs:** IMPLEMENTATION.md §5.3, SPECIFICATION.md §3.6

---

## Phase 5: Protocol Adapter

> Message protocol mapping for backend-agnostic message handling.
> After this phase: can parse/send messages in any JSON format.

### Task 12: Protocol Adapter & JsonPath

**Implement configurable message protocol adapter.**

**Files to create:**

- `src/protocol/ProtocolAdapter.ts` — adapter interface
- `src/protocol/JsonPathAdapter.ts` — dot-notation field mapping implementation
- `src/protocol/ProfileManager.ts` — save/load/import/export profiles
- `src/protocol/index.ts` — barrel export

**Code requirements:**

- ProtocolAdapter interface: toBackend(input) → unknown, fromBackend(raw) → ChatMessage | null, getEventName(type) → string
- JsonPathAdapter: uses jsonPath utility for field extraction
- Field mappings: sender, recipient, conversationId, content, messageId, timestamp, eventType
- Event name mappings: message, typing, read, etc.
- fromBackend: extracts fields using mappings; returns null if content field missing (logs warning)
- toBackend: constructs JSON object from internal message using reverse mappings
- ProfileManager: CRUD for named profiles, export to JSON file, import from JSON file

**Test requirements:**

- `tests/unit/protocol/JsonPathAdapter.test.ts` — parse various JSON shapes, construct outgoing messages
- `tests/unit/protocol/ProfileManager.test.ts` — save/load/import/export

**Acceptance Criteria:**

- [ ] Can parse nested JSON payloads (e.g., data.message.content)
- [ ] Outgoing messages constructed correctly from mappings
- [ ] Unmapped fields preserved in rawPayload
- [ ] Profile export/import round-trips correctly
- [ ] `npm test` passes

**Dependencies:** Task 3, Task 2
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §2.3, SPECIFICATION.md §3.4

---

## Phase 6: UI Components

> React components for all screens.
> After this phase: full visual interface, functional end-to-end.

### Task 13: Layout & Shared Components

**Implement app layout and reusable UI primitives.**

**Files to create:**

- `src/components/layout/AppLayout.tsx` — three-panel resizable layout
- `src/components/layout/Sidebar.tsx` — sidebar container
- `src/components/layout/MainPanel.tsx` — main panel container
- `src/components/layout/InspectorPanel.tsx` — inspector container
- `src/components/shared/Button.tsx` — reusable button
- `src/components/shared/Input.tsx` — reusable input
- `src/components/shared/Modal.tsx` — reusable modal
- `src/components/shared/Tooltip.tsx` — reusable tooltip
- `src/components/shared/MaskedInput.tsx` — credential input with mask toggle
- `src/components/shared/JsonViewer.tsx` — syntax-highlighted JSON display

**Code requirements:**

- AppLayout: resizable panels using CSS resize or a lightweight library
- Responsive: collapse sidebar/inspector on narrow screens
- Dark mode support via Tailwind dark: prefix
- MaskedInput: show/hide toggle, never logs value
- JsonViewer: syntax highlighting, copy button, collapsible

**Test requirements:**

- `tests/components/shared/MaskedInput.test.tsx` — mask toggle works
- `tests/components/shared/JsonViewer.test.tsx` — renders JSON, handles invalid input

**Acceptance Criteria:**

- [ ] Three-panel layout renders correctly
- [ ] Panels are resizable on desktop
- [ ] Responsive breakpoints work (tablet/mobile)
- [ ] Dark mode toggles correctly
- [ ] `npm test` passes

**Dependencies:** Task 1, Task 8
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §6.1, SPECIFICATION.md §7.3

---

### Task 14: Client Management UI

**Implement sidebar client list and client configuration panel.**

**Files to create:**

- `src/components/client/ClientList.tsx` — sidebar client list with add button
- `src/components/client/ClientItem.tsx` — single client with status badge
- `src/components/client/ClientConfig.tsx` — configuration form panel
- `src/components/client/ConnectionBadge.tsx` — status indicator (color-coded)
- `src/hooks/useClient.ts` — client state + actions hook
- `src/hooks/useConnection.ts` — connection lifecycle hook

**Code requirements:**

- ClientList: displays all clients, add button, remove on swipe/right-click
- ClientItem: alias, status badge, click to select, connection duration
- ClientConfig: form for endpoint, identity, auth method, protocol profile, connection options
- ConnectionBadge: green/yellow/red/gray with tooltip
- useClient: CRUD operations bridging store
- useConnection: connect/disconnect/reconnect bridging ConnectionManager

**Test requirements:**

- `tests/components/client/ClientList.test.tsx` — renders list, add/remove
- `tests/components/client/ClientConfig.test.tsx` — form validation, save

**Acceptance Criteria:**

- [ ] Can add/remove clients from sidebar
- [ ] Status badges update in real time
- [ ] Configuration form validates inputs
- [ ] Connect/disconnect buttons work
- [ ] `npm test` passes

**Dependencies:** Task 5, Task 10, Task 11, Task 13
**Effort:** 4-5 hours
**Refs:** IMPLEMENTATION.md §6.1, SPECIFICATION.md §3.1, §3.6

---

### Task 15: Chat Interface

**Implement chat view with message bubbles, composer, and conversation selector.**

**Files to create:**

- `src/components/chat/ChatView.tsx` — message list + composer container
- `src/components/chat/MessageBubble.tsx` — single message bubble
- `src/components/chat/MessageComposer.tsx` — input + send + JSON toggle
- `src/components/chat/ConversationSelector.tsx` — conversation filter dropdown
- `src/hooks/useMessages.ts` — message list + send hook

**Code requirements:**

- ChatView: scrollable message list, auto-scroll to bottom, manual scroll override
- MessageBubble: sender name, timestamp, content, direction styling (left/right)
- JSON content rendered via JsonViewer; text content as paragraph
- MessageComposer: text input, Enter to send, Shift+Enter newline, JSON toggle
- JSON mode: syntax validation before send, send button disabled on invalid
- ConversationSelector: dropdown of conversation IDs, "All" option, auto-populate from messages
- useMessages: send message (applies protocol adapter), receive messages, optimistic update

**Test requirements:**

- `tests/components/chat/MessageBubble.test.tsx` — renders text/JSON, direction styling
- `tests/components/chat/MessageComposer.test.tsx` — send, JSON validation, disabled when disconnected

**Acceptance Criteria:**

- [ ] Messages display as bubbles with sender, timestamp, content
- [ ] JSON payloads render as formatted code
- [ ] Send works for text and JSON
- [ ] Auto-scroll with manual override
- [ ] Conversation filtering works
- [ ] `npm test` passes

**Dependencies:** Task 6, Task 12, Task 13, Task 14
**Effort:** 4-5 hours
**Refs:** IMPLEMENTATION.md §6.1, SPECIFICATION.md §3.2

---

### Task 16: WebSocket Inspector

**Implement inspector panel with event logging, filtering, and connection details.**

**Files to create:**

- `src/components/inspector/InspectorLog.tsx` — log list with filters
- `src/components/inspector/InspectorEntry.tsx` — single log entry with expand
- `src/components/inspector/FilterBar.tsx` — client + event type filters
- `src/components/inspector/ConnectionDetails.tsx` — connection metadata panel
- `src/hooks/useInspector.ts` — inspector filter + display hook
- `src/services/InspectorService.ts` — event capture + log formatting

**Code requirements:**

- InspectorLog: real-time log, auto-scroll with pause, clear button
- InspectorEntry: timestamp, client alias, event type badge, payload preview, click to expand
- FilterBar: multi-select client filter, event type checkboxes
- ConnectionDetails: URL, state, duration, close code/reason, last error, masked auth
- InspectorService: subscribes to EventBus, formats entries, applies filters
- Copy payload to clipboard button on each entry

**Test requirements:**

- `tests/components/inspector/InspectorLog.test.tsx` — renders entries, filter, clear
- `tests/components/inspector/FilterBar.test.tsx` — filter selection

**Acceptance Criteria:**

- [ ] All WebSocket events logged in real time
- [ ] Filtering by client and event type works
- [ ] Copy payload works
- [ ] Clear logs works
- [ ] Connection details show metadata
- [ ] `npm test` passes

**Dependencies:** Task 7, Task 11, Task 13, Task 14
**Effort:** 4 hours
**Refs:** IMPLEMENTATION.md §2.5, SPECIFICATION.md §3.5

---

### Task 17: Protocol Profile Editor

**Implement UI for creating/editing message protocol profiles.**

**Files to create:**

- `src/components/settings/ProtocolEditor.tsx` — profile editor with field mapping table
- `src/hooks/useProtocol.ts` — protocol profile hook

**Code requirements:**

- Field mapping table: internal field → backend field name (text input)
- Event name mapping: event type → backend event name
- Test parsing: input sample JSON, see parsed result
- Save/load/delete profiles
- Export/import profiles as JSON
- Assign profile to client

**Test requirements:**

- `tests/components/settings/ProtocolEditor.test.tsx` — renders, save, test parsing

**Acceptance Criteria:**

- [ ] Can create/edit/delete profiles
- [ ] Field mappings save correctly
- [ ] Test parsing shows extracted fields
- [ ] Export/import round-trips
- [ ] `npm test` passes

**Dependencies:** Task 8, Task 12, Task 13
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §2.3, SPECIFICATION.md §3.4.1

---

### Task 18: Global Settings & REST Config

**Implement global settings panel and REST endpoint configuration.**

**Files to create:**

- `src/components/settings/GlobalSettings.tsx` — platform mode, theme, defaults
- `src/components/settings/RestConfig.tsx` — REST endpoint configuration
- `src/services/RestClient.ts` — REST request executor

**Code requirements:**

- GlobalSettings: platform mode selector, theme toggle, default WS/API URL inputs
- Platform mode: shows auth capability documentation
- RestConfig: CRUD for REST endpoints (method, URL, headers, body template)
- RestClient: execute configured requests with variable substitution ({{clientId}}, {{token}})
- Auto-trigger on client connect (optional per endpoint)
- Response displayed in formatted JSON panel

**Test requirements:**

- `tests/components/settings/GlobalSettings.test.tsx` — platform mode, theme
- `tests/services/RestClient.test.ts` — request execution, variable substitution

**Acceptance Criteria:**

- [ ] Platform mode switches correctly
- [ ] Theme persists
- [ ] REST endpoints can be configured and executed
- [ ] Variable substitution works
- [ ] `npm test` passes

**Dependencies:** Task 8, Task 13
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §6.1, SPECIFICATION.md §3.7

---

## Phase 7: Integration, Docker & Release

> Wire everything together, containerize, document.
> After this phase: production-ready release.

### Task 19: Wire Up App & Integration

**Connect all components in App.tsx with proper state flow.**

**Files to modify:**

- `src/App.tsx` — full layout with all panels wired
- `src/main.tsx` — ensure proper providers

**Code requirements:**

- AppLayout with Sidebar, MainPanel, InspectorPanel
- Client selection state (which client's chat is shown)
- Global settings accessible from toolbar
- Inspector service initialized and subscribed to EventBus
- All slices connected and functional

**Test requirements:**

- `tests/integration/app.test.tsx` — renders without crash, basic interaction

**Acceptance Criteria:**

- [ ] App renders all panels
- [ ] Client selection switches chat view
- [ ] Settings panel opens/closes
- [ ] Inspector logs events from connections
- [ ] `npm test` passes
- [ ] `npm run build` succeeds

**Dependencies:** Task 14, Task 15, Task 16, Task 17, Task 18
**Effort:** 3-4 hours
**Refs:** IMPLEMENTATION.md §6.1

---

### Task 20: End-to-End Manual Testing

**Manual testing with a real WebSocket backend.**

**Files to create:**

- `docs/TESTING.md` — manual test scenarios and instructions

**Activities:**

- Set up a simple WebSocket echo server (or use wss://echo.websocket.org)
- Test all 15 scenarios from SPECIFICATION.md §3.9
- Document results and any issues found
- Fix bugs discovered during testing

**Acceptance Criteria:**

- [ ] All 15 test scenarios pass
- [ ] No console errors during normal operation
- [ ] Connection lifecycle works (connect, disconnect, reconnect)
- [ ] Multi-client messaging works
- [ ] Inspector captures all events

**Dependencies:** Task 19
**Effort:** 3-4 hours
**Refs:** SPECIFICATION.md §7 (Testing Requirements in ideas.md)

---

### Task 21: Docker & Deployment

**Create production Docker setup.**

**Files to create:**

- `docker/Dockerfile` — multi-stage build
- `docker/nginx.conf` — nginx configuration
- `docker-compose.yml` — orchestration
- `.env.example` — environment variable template
- `docker/.dockerignore` — build exclusions

**Code requirements:**

- Multi-stage build (node build → nginx serve)
- Health check endpoint
- Environment variable support (VITE_DEFAULT_WS_URL, VITE_DEFAULT_API_URL)
- Gzip compression
- Security headers
- SPA fallback routing

**Acceptance Criteria:**

- [ ] `docker compose up` builds and runs successfully
- [ ] App accessible at http://localhost:3000
- [ ] Health check passes
- [ ] Environment variables work
- [ ] Image size < 50MB

**Dependencies:** Task 19
**Effort:** 2-3 hours
**Refs:** IMPLEMENTATION.md §11

---

### Task 22: Performance & Bundle Optimization

**Optimize bundle size and runtime performance.**

**Files to modify:**

- `vite.config.ts` — code splitting, chunk optimization
- `src/components/*` — lazy loading for panels

**Code requirements:**

- Code splitting: lazy load inspector, settings, protocol editor
- Bundle analysis: ensure <500KB gzipped
- Virtual scrolling for message list (if needed for 10k+ messages)
- Memoize expensive components (React.memo, useMemo)
- Debounce inspector filter updates

**Acceptance Criteria:**

- [ ] Initial bundle <500KB gzipped
- [ ] Lighthouse performance score >90
- [ ] No jank with 100 messages/second
- [ ] `npm run build` succeeds

**Dependencies:** Task 19
**Effort:** 2-3 hours
**Refs:** SPECIFICATION.md §10

---

### Task 23: Documentation

**Create comprehensive usage documentation.**

**Files to create:**

- `README.md` — project overview, setup, usage, Docker deployment
- `docs/ARCHITECTURE.md` — architecture overview for contributors
- `docs/PROTOCOLS.md` — how to configure message protocol adapters

**Code requirements:**

- README: quick start, features, Docker instructions, screenshots placeholder
- ARCHITECTURE: component overview, state flow, transport abstraction
- PROTOCOLS: step-by-step guide to configuring protocol profiles with examples

**Acceptance Criteria:**

- [ ] README has clear setup instructions
- [ ] Docker instructions work when followed
- [ ] Protocol configuration guide has working examples
- [ ] All docs are accurate (verified against implementation)

**Dependencies:** Task 20, Task 21
**Effort:** 2-3 hours
**Refs:** SPECIFICATION.md §13

---

### Task 24: Final Polish & Release

**Final quality pass and release preparation.**

**Activities:**

- Run full test suite: `npm test`
- Run type check: `npx tsc --noEmit`
- Run lint: `npm run lint`
- Run build: `npm run build`
- Docker build and smoke test
- Fix all remaining issues
- Tag release v1.0.0

**Acceptance Criteria:**

- [ ] All tests pass (0 failures)
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Docker build succeeds
- [ ] App runs correctly in Docker
- [ ] All 15 test scenarios from SPECIFICATION.md §3.9 pass

**Dependencies:** Task 20, Task 21, Task 22, Task 23
**Effort:** 2-3 hours
**Refs:** SPECIFICATION.md §13 (Definition of Done)

---

## Milestones

| Milestone       | After Task | What's Achieved                                | Demo-able?         |
| --------------- | ---------- | ---------------------------------------------- | ------------------ |
| Foundation      | Task 4     | Project builds, types defined, event bus works | Smoke test         |
| State Layer     | Task 8     | Zustand store fully functional                 | Unit tests         |
| Transport Ready | Task 11    | Can connect to real WebSocket servers          | Live connection    |
| Protocol Ready  | Task 12    | Can parse/send any JSON message format         | Message round-trip |
| MVP             | Task 18    | Full UI with chat, inspector, settings         | Full demo          |
| Integration     | Task 19    | All components wired end-to-end                | Complete app       |
| Release         | Task 24    | Production-ready, Dockerized, documented       | Ship it            |

---

## Dependency Graph

```
T1 → T2 → T3 → T5 → T6 → T7 → T8
     ↓         ↓
     T4 → T9 → T10 → T11
              ↓
     T12 ← T3
       ↓
T13 ← T8
  ↓
T14 ← T5, T10, T11
  ↓
T15 ← T6, T12, T13, T14
  ↓
T16 ← T7, T11, T13, T14
  ↓
T17 ← T8, T12, T13
  ↓
T18 ← T8, T13
  ↓
T19 ← T14, T15, T16, T17, T18
  ↓
T20 ← T19
T21 ← T19
T22 ← T19
T23 ← T20, T21
  ↓
T24 ← T20, T21, T22, T23
```

---

## Quality Checklist

- [ ] Task 1 starts from blank project
- [ ] Tasks are in executable order — no forward dependencies
- [ ] Every specification feature appears in at least one task
- [ ] Every implementation module is covered
- [ ] Acceptance criteria are verifiable in every task
- [ ] Files to create/modify are listed in every task
- [ ] Effort estimates total to reasonable timeline (40-60 hours)
- [ ] Milestones are demo-able
- [ ] Final task produces a releasable artifact
- [ ] No task exceeds 8 hours without subtask breakdown
