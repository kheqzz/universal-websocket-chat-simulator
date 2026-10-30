# Universal WebSocket Chat Simulator — Specification

> A backend-agnostic, developer-oriented tool for simulating multiple WebSocket chat participants, testing realtime messaging systems, and inspecting WebSocket traffic — without requiring an actual frontend application.

## 1. Overview

### 1.1 What Is Universal WebSocket Chat Simulator?

Universal WebSocket Chat Simulator is a web-based developer tool that simulates multiple independent chat participants over WebSocket connections. It allows developers to test realtime messaging backends by creating several virtual clients — each with distinct identities, roles, and authentication credentials — and exchanging messages between them through a modern chat interface.

The tool is completely backend-agnostic: it does not assume any particular backend framework, message schema, or authentication mechanism. Instead, it provides configurable adapters for message protocols, authentication methods, and transport implementations. This makes it reusable across any project that uses WebSocket-based realtime communication.

The application runs in a browser (or containerized via Docker Compose) and communicates directly with the target backend over WebSocket and optionally REST. It is a testing and debugging instrument, not a production chat application.

### 1.2 Target Audience

- Backend developers testing WebSocket chat endpoints during development.
- QA engineers validating realtime messaging behavior, authentication flows, and edge cases.
- Integration testers verifying multi-client message delivery, conversation isolation, and protocol compliance.
- DevOps/infrastructure engineers testing WebSocket proxy, reverse proxy, and load balancer configurations.

### 1.3 Key Differentiators

- **Backend-agnostic**: Works with any WebSocket backend regardless of framework, language, or message schema.
- **Multi-client in one window**: Simulate 2-10+ participants simultaneously without multiple browser tabs or devices.
- **Configurable protocol adapter**: Map any JSON message structure to chat fields without code changes.
- **Cross-platform auth awareness**: Documents and tests auth differences between browser (no custom headers), Electron (custom headers), and Flutter (custom headers).
- **Built-in inspector**: Real-time visibility into every WebSocket frame, connection event, and error with filtering and copy.

### 1.4 Competitive Landscape

| Feature                       | This Project | Browser DevTools WS Tab | Postman WS | wscat CLI    |
| ----------------------------- | ------------ | ----------------------- | ---------- | ------------ |
| Multi-client simulation       | ✅           | ❌                      | ❌         | ❌           |
| Chat UI                       | ✅           | ❌                      | ❌         | ❌           |
| Configurable protocol         | ✅           | ❌                      | ❌         | ❌           |
| Auth configuration per client | ✅           | ❌                      | ⚠️ Basic   | ⚠️ Basic     |
| WebSocket inspector           | ✅           | ✅                      | ✅         | ⚠️ Text only |
| Cross-platform auth awareness | ✅           | ❌                      | ❌         | ❌           |
| Docker deployment             | ✅           | N/A                     | N/A        | N/A          |

## 2. Core Concepts

| Concept              | Definition                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Client**           | A simulated WebSocket participant with its own identity, credentials, endpoint, and connection state. Each client operates independently.                                                         |
| **Session**          | The in-memory collection of all clients, conversations, and messages during a single use of the simulator. Nothing is persisted to a database.                                                    |
| **Message Adapter**  | A configurable mapping layer that translates between the simulator's internal chat representation and the backend's actual JSON message format. Users define field mappings without code changes. |
| **Transport**        | The WebSocket connection implementation. Browser uses native WebSocket API wrapped in an abstraction; Electron/Flutter use libraries that support custom handshake headers.                       |
| **Conversation**     | A logical grouping of messages identified by a conversation ID. The simulator displays messages grouped by conversation.                                                                          |
| **Inspector**        | A panel that logs all WebSocket lifecycle events, incoming/outgoing frames, errors, and connection metadata in real time.                                                                         |
| **Auth Method**      | A configurable authentication strategy (Bearer token, cookies, query params, subprotocol, custom headers) applied per client.                                                                     |
| **Connection State** | One of: `disconnected`, `connecting`, `connected`, `reconnecting`, `error`.                                                                                                                       |

## 3. Functional Requirements

### 3.1 Multi-Client Simulation

#### 3.1.1 Client Creation and Management

**User Story:** As a developer, I want to create multiple independent WebSocket clients so that I can simulate conversations between different participants.

**Description:** Users can add, configure, and remove client sessions. Each client has independent configuration including identity, endpoint, auth, and message protocol. Clients can be connected/disconnected independently. The sidebar displays all clients with their connection status.

**Acceptance Criteria:**

- [ ] User can add a new client with a unique alias.
- [ ] User can configure each client's endpoint URL, identity (username, role, metadata), and auth method.
- [ ] User can connect and disconnect each client independently.
- [ ] Sidebar shows all clients with real-time connection status indicators.
- [ ] User can remove a client (disconnects first if connected).
- [ ] Minimum 2, maximum 20 clients per session.

**Edge Cases:**

- What happens when adding a client with a duplicate alias? → Reject with validation error.
- What happens when connecting a client with invalid endpoint URL? → Show error, remain disconnected.
- What happens when removing a connected client? → Disconnect gracefully, then remove.

**Constraints:**

- Client count limited to 20 to prevent browser resource exhaustion.
- Each client maintains its own WebSocket instance.

#### 3.1.2 Client Configuration

**User Story:** As a developer, I want to configure each client's identity and connection parameters independently.

**Description:** Each client has a configuration panel for endpoint URL, identity fields (username, user ID, role, custom metadata), auth method and credentials, message protocol adapter, and connection options (timeout, auto-reconnect).

**Acceptance Criteria:**

- [ ] Configuration panel is accessible per client.
- [ ] Changes to configuration while connected require reconnect to take effect (with confirmation).
- [ ] Identity fields are freeform (username, userId, role, and arbitrary key-value metadata).
- [ ] Endpoint URL supports ws:// and wss:// schemes.

**Edge Cases:**

- What happens when endpoint URL is changed while connected? → Prompt to reconnect.
- What happens when auth credentials are empty? → Allow connection attempt (backend decides).

### 3.2 Chat Interface

#### 3.2.1 Message Display

**User Story:** As a developer, I want a modern chat interface showing messages as bubbles so that I can visually verify message flow between participants.

**Description:** The main area displays a chat view for the selected client or conversation. Messages appear as bubbles (outgoing right-aligned, incoming left-aligned) with sender identity, timestamp, and message status. Unknown payloads render as formatted JSON.

**Acceptance Criteria:**

- [ ] Messages display as bubbles with sender name, timestamp, and content.
- [ ] Outgoing messages are visually distinct from incoming.
- [ ] JSON payloads render as formatted, syntax-highlighted code.
- [ ] Plain text payloads render as text.
- [ ] Messages appear in real time without refresh.
- [ ] Scrollable message history within the session.
- [ ] Auto-scroll to latest message (with manual scroll override).

**Edge Cases:**

- What happens when a payload is neither text nor valid JSON? → Display as raw string with "unknown format" indicator.
- What happens when message content is extremely long? → Truncate with expand option.
- What happens when timestamp is missing? → Use client receive time.

#### 3.2.2 Message Composition

**User Story:** As a developer, I want to compose and send messages from any client so that I can test bidirectional communication.

**Description:** Each client has an input area with text input, send button, and optional JSON editor mode. Users can send plain text or arbitrary JSON. A message adapter transforms the input into the backend's expected format before sending.

**Acceptance Criteria:**

- [ ] Text input with send button (Enter to send, Shift+Enter for newline).
- [ ] Toggle between plain text and raw JSON editor.
- [ ] JSON editor validates syntax before sending.
- [ ] Sent message appears immediately in the sender's chat view (optimistic).
- [ ] Message includes conversation ID if configured.

**Edge Cases:**

- What happens when sending invalid JSON in JSON mode? → Block send, show validation error.
- What happens when WebSocket is disconnected? → Disable input, show "disconnected" state.

#### 3.2.3 Conversation Grouping

**User Story:** As a developer, I want to organize messages by conversation so that I can test conversation isolation.

**Description:** Messages are grouped by conversation ID. Users can select which conversation to view. Multiple conversations can be open simultaneously. A "All" view shows all messages across conversations.

**Acceptance Criteria:**

- [ ] Conversation selector/filter in the chat area.
- [ ] Messages grouped by conversation ID.
- [ ] "All conversations" view available.
- [ ] New conversation IDs discovered from incoming messages are auto-added to the selector.

**Edge Cases:**

- What happens when a message has no conversation ID? → Group under "default" or "uncategorized".

### 3.3 Authentication Configuration

#### 3.3.1 Auth Method Support

**User Story:** As a developer, I want to configure different authentication methods per client so that I can test various backend auth strategies.

**Description:** Each client can be configured with one of several auth methods: Bearer token, custom HTTP handshake headers, cookie-based, query parameter, WebSocket subprotocol, or none. The configuration is independent per client.

**Acceptance Criteria:**

- [ ] Dropdown to select auth method per client.
- [ ] Bearer token: input field for token value.
- [ ] Custom headers: key-value editor for handshake headers.
- [ ] Cookie: input for cookie string (documented as browser-managed in real scenarios).
- [ ] Query params: key-value editor for URL query parameters.
- [ ] Subprotocol: input for WebSocket subprotocol string.
- [ ] None: no auth.
- [ ] Credentials are masked by default (show/hide toggle).
- [ ] Credentials are never logged in the inspector.

**Edge Cases:**

- What happens when using Bearer token in browser mode? → Document that browser native WebSocket cannot send Authorization headers; recommend ticket/cookie alternative.
- What happens when query params contain sensitive tokens? → Warn user about security implications.

#### 3.3.2 Cross-Platform Auth Awareness

**User Story:** As a developer, I want the simulator to document and respect platform-specific WebSocket auth limitations so that my tests reflect real client behavior.

**Description:** The simulator provides a "platform mode" selector (Browser / Electron / Flutter) that adjusts available auth methods and shows documentation about what each platform supports. In Browser mode, custom header auth is disabled with explanation. In Electron/Flutter mode, all methods are available.

**Acceptance Criteria:**

- [ ] Platform mode selector in global settings.
- [ ] Browser mode: custom header auth disabled with tooltip explaining limitation.
- [ ] Electron/Flutter mode: all auth methods available.
- [ ] Documentation panel showing platform-specific auth capabilities.

**Edge Cases:**

- What happens when switching platform mode while clients are connected? → Show warning, require reconnect.

### 3.4 Configurable Message Protocol

#### 3.4.1 Protocol Adapter Configuration

**User Story:** As a developer, I want to configure field mappings so that the simulator can interpret any backend's JSON message format.

**Description:** Users define a message adapter by mapping the simulator's internal fields (sender, recipient, conversationId, content, messageId, timestamp, eventType) to the backend's actual JSON field names. The adapter is applied per client and can be saved as a named profile for reuse.

**Acceptance Criteria:**

- [ ] Configuration panel for field name mappings.
- [ ] Each internal field can be mapped to a backend field name (or left unmapped).
- [ ] Incoming messages are parsed using the adapter to extract chat-relevant fields.
- [ ] Outgoing messages are constructed using the adapter from user input.
- [ ] Unmapped fields are preserved in the raw payload view.
- [ ] Named profiles can be saved, loaded, and shared (export/import JSON).

**Edge Cases:**

- What happens when an incoming message doesn't match the adapter? → Display as raw JSON with "unmapped" indicator.
- What happens when a required field (e.g., content) is missing? → Show message with empty content and raw payload.

#### 3.4.2 Raw JSON Mode

**User Story:** As a developer, I want to send and receive arbitrary JSON messages without a predefined schema so that I can test any protocol.

**Description:** Users can bypass the protocol adapter and send raw JSON. Incoming messages that don't match any adapter are displayed as raw JSON in the inspector and optionally in the chat view.

**Acceptance Criteria:**

- [ ] "Raw JSON" toggle in message composer.
- [ ] JSON editor with syntax validation.
- [ ] Raw messages appear in inspector always.
- [ ] Raw messages appear in chat as formatted JSON if adapter cannot parse them.

### 3.5 WebSocket Inspector

#### 3.5.1 Event Logging

**User Story:** As a developer, I want to see all WebSocket activity in real time so that I can debug connection and message issues.

**Description:** The inspector panel logs every WebSocket event: connection opened, message received, message sent, connection closed, errors. Each entry includes timestamp, client alias, event type, and payload. Entries are filterable by client and event type.

**Acceptance Criteria:**

- [ ] Real-time log of all WebSocket events.
- [ ] Each entry shows: timestamp, client alias, event type, payload preview.
- [ ] Click to expand full payload.
- [ ] Copy payload to clipboard.
- [ ] Clear all logs button.
- [ ] Filter by client (multi-select).
- [ ] Filter by event type (connect, message-in, message-out, disconnect, error).
- [ ] Auto-scroll with pause option.

**Edge Cases:**

- What happens when log buffer exceeds 10,000 entries? → Rotate oldest entries, show "truncated" indicator.
- What happens when payload is binary? → Show hex dump or "[binary data: N bytes]".

#### 3.5.2 Connection Details

**User Story:** As a developer, I want to see connection metadata so that I can verify handshake and connection parameters.

**Description:** For each client, display connection metadata: endpoint URL, connection state, connected duration, close code/reason (if disconnected), and last error.

**Acceptance Criteria:**

- [ ] Connection details panel per client.
- [ ] Shows: URL, state, duration, close code, close reason, last error.
- [ ] Updates in real time.

### 3.6 Connection Management

#### 3.6.1 Connection Lifecycle

**User Story:** As a developer, I want to control connection lifecycle so that I can test connection scenarios.

**Description:** Each client supports connect, disconnect, and manual reconnect. Optional auto-reconnect with configurable interval and max attempts. Connection timeout is configurable.

**Acceptance Criteria:**

- [ ] Connect button (disabled when connected/connecting).
- [ ] Disconnect button (disabled when disconnected).
- [ ] Reconnect button (always available when not connected).
- [ ] Auto-reconnect toggle with interval (1-60s) and max attempts (1-10 or unlimited).
- [ ] Connection timeout (5-60s, default 10s).
- [ ] Status indicator: color-coded (green=connected, yellow=connecting, red=error, gray=disconnected).

**Edge Cases:**

- What happens when auto-reconnect fails max attempts? → Stop reconnecting, show error, allow manual reconnect.
- What happens when server is unreachable? → Show timeout error after configured timeout.

#### 3.6.2 Connection Duration Tracking

**User Story:** As a developer, I want to see how long each client has been connected so that I can measure connection stability.

**Description:** Each connected client displays a live connection duration timer.

**Acceptance Criteria:**

- [ ] Duration displayed in HH:MM:SS format.
- [ ] Updates every second.
- [ ] Resets on disconnect/reconnect.

### 3.7 REST Integration (Optional)

#### 3.7.1 REST Endpoint Configuration

**User Story:** As a developer, I want to optionally configure REST endpoints for supporting operations so that I can fetch tokens, conversation lists, or message history.

**Description:** Users can define named REST endpoints (method, URL, headers, body template) that can be triggered manually or auto-triggered on client connect. Results are displayed in a panel. REST is entirely optional.

**Acceptance Criteria:**

- [ ] REST endpoint configuration panel.
- [ ] Support GET, POST, PUT, PATCH, DELETE.
- [ ] Custom headers per endpoint.
- [ ] Body template with variable substitution (e.g., {{clientId}}, {{token}}).
- [ ] Manual trigger button per endpoint.
- [ ] Optional auto-trigger on client connect.
- [ ] Response displayed in formatted JSON panel.

**Edge Cases:**

- What happens when REST endpoint fails? → Show error in response panel, don't affect WebSocket connection.
- What happens when variable substitution fails? → Show error, block request.

### 3.8 UI Layout

#### 3.8.1 Desktop-First Layout

**User Story:** As a developer, I want a clean, desktop-optimized layout so that I can efficiently debug multiple clients.

**Description:** The application uses a three-panel layout: sidebar (client list), main area (chat), and secondary panel (inspector). A top toolbar provides global settings. Responsive breakpoints collapse panels on smaller screens.

**Acceptance Criteria:**

- [ ] Sidebar: client list with status indicators, add/remove buttons.
- [ ] Main area: chat view with conversation selector and message composer.
- [ ] Secondary panel: WebSocket inspector with filters.
- [ ] Toolbar: global settings (platform mode, theme, endpoint defaults).
- [ ] Panels are resizable.
- [ ] Responsive: collapse sidebar/inspector on narrow screens.

**Edge Cases:**

- What happens on mobile-width screens? → Stack panels vertically, show one at a time with tab navigation.

## 4. Architecture Overview

### 4.1 System Components

1. **UI Layer (React)**: Renders all visual components — sidebar, chat, inspector, configuration panels. Manages user interactions and display state.
2. **State Management (Zustand)**: Central store for clients, messages, connections, inspector logs, and configuration. All components read from and write to this store.
3. **WebSocket Transport (Abstraction Layer)**: Wraps native WebSocket API in a configurable interface. Handles connection lifecycle, auth injection (where supported), message sending/receiving, and reconnection logic.
4. **Message Adapter (Protocol Mapper)**: Transforms between internal chat message format and backend-specific JSON. Configurable per client with named profiles.
5. **Auth Manager**: Applies configured auth method to connection parameters. Handles token masking, credential validation, and platform compatibility warnings.
6. **REST Client (Optional)**: Executes configured REST requests with variable substitution. Independent of WebSocket transport.
7. **Inspector Service**: Captures all WebSocket events and connection metadata. Provides filtering, search, and export.

### 4.2 Component Interactions

```
User Input → UI Components → Zustand Store → Transport Layer → WebSocket → Backend
Backend → WebSocket → Transport Layer → Message Adapter → Zustand Store → UI Components
                                    ↓
                              Inspector Service (logs all traffic)
```

- UI components dispatch actions to the store.
- Store triggers transport operations (connect, send, disconnect).
- Transport emits events (onMessage, onClose, onError) that update the store.
- Inspector service subscribes to all transport events for logging.
- Message adapter is invoked by transport on send/receive to transform payloads.

### 4.3 External Integrations

- **Target WebSocket Backend**: The system under test. Connection URL, protocol, and auth are fully configurable. No assumptions about backend implementation.
- **Target REST Backend (optional)**: For supporting operations. Fully configurable endpoints.
- **Browser WebSocket API**: Native browser API for WebSocket connections. Limitation: no custom handshake headers.
- **Docker / Reverse Proxy**: Deployment environment. Application must work behind Traefik, nginx, or similar proxies.

## 5. Data Model

### 5.1 Core Entities

#### Client

| Field                | Type      | Required | Description                                      | Constraints                                              |
| -------------------- | --------- | -------- | ------------------------------------------------ | -------------------------------------------------------- |
| id                   | UUID      | Yes      | Unique client identifier                         | Auto-generated                                           |
| alias                | string    | Yes      | Display name for the client                      | 1-30 chars, unique per session                           |
| endpoint             | string    | Yes      | WebSocket URL (ws:// or wss://)                  | Must be valid URL                                        |
| identity             | object    | Yes      | User identity (username, userId, role, metadata) | At least username required                               |
| authMethod           | enum      | Yes      | Authentication method                            | bearer, headers, cookie, query, subprotocol, none        |
| authConfig           | object    | Yes      | Auth-specific configuration                      | Shape depends on authMethod                              |
| protocolProfile      | string    | No       | Named message adapter profile                    | References saved profile                                 |
| protocolMapping      | object    | No       | Field name mappings                              | Internal → backend field names                           |
| connectionState      | enum      | Yes      | Current connection state                         | disconnected, connecting, connected, reconnecting, error |
| autoReconnect        | boolean   | Yes      | Enable auto-reconnect                            | Default false                                            |
| reconnectInterval    | number    | No       | Reconnect interval in seconds                    | 1-60, default 5                                          |
| reconnectMaxAttempts | number    | No       | Max reconnect attempts                           | 1-10 or 0 (unlimited), default 3                         |
| connectionTimeout    | number    | No       | Connection timeout in seconds                    | 5-60, default 10                                         |
| connectedAt          | timestamp | No       | Connection start time                            | Set on connect                                           |
| lastError            | string    | No       | Last error message                               | Cleared on successful connect                            |

#### Message

| Field           | Type          | Required | Description                   | Constraints                         |
| --------------- | ------------- | -------- | ----------------------------- | ----------------------------------- |
| id              | string        | Yes      | Unique message identifier     | Auto-generated or from backend      |
| clientId        | UUID          | Yes      | Sending/receiving client      | References Client.id                |
| conversationId  | string        | No       | Conversation grouping key     | Freeform string                     |
| direction       | enum          | Yes      | Message direction             | incoming, outgoing                  |
| sender          | string        | No       | Sender identity               | From adapter or raw                 |
| content         | any           | No       | Message content               | Text, JSON, or raw                  |
| rawPayload      | object/string | Yes      | Original WebSocket frame data | Preserved as-is                     |
| timestamp       | timestamp     | Yes      | Message timestamp             | From backend or client receive time |
| status          | enum          | No       | Delivery status               | sent, delivered, read, failed       |
| protocolProfile | string        | No       | Adapter used to parse         | References profile name             |

#### InspectorEntry

| Field       | Type      | Required | Description             | Constraints                                                    |
| ----------- | --------- | -------- | ----------------------- | -------------------------------------------------------------- |
| id          | UUID      | Yes      | Unique entry identifier | Auto-generated                                                 |
| timestamp   | timestamp | Yes      | Event time              | Client time                                                    |
| clientId    | UUID      | Yes      | Associated client       | References Client.id                                           |
| eventType   | enum      | Yes      | Event type              | connect, message-in, message-out, disconnect, error, reconnect |
| summary     | string    | Yes      | One-line description    | Auto-generated                                                 |
| payload     | any       | No       | Full event data         | JSON-serializable                                              |
| closeCode   | number    | No       | WebSocket close code    | Only for disconnect events                                     |
| closeReason | string    | No       | Close reason text       | Only for disconnect events                                     |

#### ProtocolProfile

| Field       | Type   | Required | Description                      | Constraints                                              |
| ----------- | ------ | -------- | -------------------------------- | -------------------------------------------------------- |
| name        | string | Yes      | Profile name                     | Unique per session                                       |
| description | string | No       | Human-readable description       | Freeform                                                 |
| mappings    | object | Yes      | Field name mappings              | Internal field → backend field name                      |
| eventNames  | object | No       | Event type to backend event name | e.g., { message: "chat:message", typing: "chat:typing" } |

#### RestEndpoint

| Field        | Type   | Required | Description                | Constraints                    |
| ------------ | ------ | -------- | -------------------------- | ------------------------------ |
| id           | UUID   | Yes      | Unique endpoint identifier | Auto-generated                 |
| name         | string | Yes      | Display name               | Freeform                       |
| method       | enum   | Yes      | HTTP method                | GET, POST, PUT, PATCH, DELETE  |
| url          | string | Yes      | Endpoint URL               | Supports variable substitution |
| headers      | object | No       | Request headers            | Key-value pairs                |
| bodyTemplate | string | No       | Request body template      | Supports variable substitution |
| autoTrigger  | enum   | No       | Auto-trigger condition     | none, onConnect, manual        |
| lastResponse | object | No       | Last response data         | Cached for display             |

### 5.2 Relationships

- Client → has many → Messages (one-to-many, in-memory)
- Client → has many → InspectorEntries (one-to-many, in-memory)
- Client → uses one → ProtocolProfile (many-to-one, by name reference)
- RestEndpoint → independent (no foreign keys)

### 5.3 Data Lifecycle

- All data is in-memory. No persistence layer.
- Session data is lost on page refresh (by design — testing tool, not production app).
- Protocol profiles can be exported/imported as JSON files for reuse across sessions.
- Credentials are never written to disk unless user explicitly exports configuration.

## 6. API Surface

The simulator has no backend API of its own. It is a pure frontend application. It consumes:

- WebSocket connections to user-configured backend URLs.
- Optional REST endpoints to user-configured backend URLs.

No API is exposed by the simulator itself.

## 7. User Interface

### 7.1 Interface Type

Web UI (browser-based SPA). Desktop-first responsive design.

### 7.2 Key Screens

1. **Main Workspace**
   - **Purpose:** Primary testing interface.
   - **Key elements:** Resizable three-panel layout (sidebar, chat, inspector).
   - **Primary actions:** Add/remove clients, connect/disconnect, send messages, inspect traffic.
   - **Navigation:** Entry point after app load.

2. **Client Configuration Panel**
   - **Purpose:** Configure a selected client's identity, endpoint, auth, and protocol.
   - **Key elements:** Form fields for all client properties, auth method selector, protocol profile selector.
   - **Primary actions:** Save config, test connection.
   - **Navigation:** Opens from sidebar client item or "Add Client" flow.

3. **Protocol Profile Editor**
   - **Purpose:** Create/edit message adapter profiles.
   - **Key elements:** Field mapping table, event name mapping, JSON preview.
   - **Primary actions:** Save profile, test parsing with sample payload.
   - **Navigation:** Accessible from settings or client config.

4. **Global Settings**
   - **Purpose:** Platform mode, theme, default endpoints, REST endpoint configuration.
   - **Key elements:** Platform selector, theme toggle, default URL inputs, REST endpoint list.
   - **Primary actions:** Apply settings.
   - **Navigation:** Toolbar gear icon.

5. **Connection Details Modal**
   - **Purpose:** Detailed connection metadata for a client.
   - **Key elements:** URL, state, duration, close code/reason, last error, auth summary (masked).
   - **Primary actions:** Copy details.
   - **Navigation:** Click on client status indicator.

### 7.3 Responsive Requirements

- **Desktop (≥1024px):** Three-panel layout, all panels visible, resizable.
- **Tablet (768-1023px):** Sidebar collapsible, inspector as slide-over panel.
- **Mobile (<768px):** Single panel view with bottom tab navigation (Clients / Chat / Inspector).
- **Accessibility:** Keyboard navigation for all interactive elements, ARIA labels, focus management. WCAG 2.1 AA target.

## 8. Security Model

### 8.1 Authentication

The simulator does not authenticate users. It tests backend authentication by allowing users to input credentials for simulated clients. Credentials are:

- Masked by default in the UI.
- Never included in inspector logs.
- Never persisted to disk without explicit user export.
- Stored only in browser memory (Zustand store).

### 8.2 Authorization

No authorization model. The simulator is a single-user developer tool.

### 8.3 Data Protection

- All data is in-memory. No database.
- Credentials are masked in UI by default.
- Exported configuration files may contain credentials — user is warned.
- No telemetry or analytics.

### 8.4 Input Validation

- Endpoint URLs validated for ws:// or wss:// scheme.
- JSON payloads validated before sending.
- Client alias uniqueness enforced.
- Numeric configuration values bounded (timeouts, intervals, counts).

## 9. Deployment Model

### 9.1 Target Environments

- Development: local browser via Vite dev server.
- Production: Docker container serving static build.
- Testing: Docker Compose with configurable backend URL.

### 9.2 Distribution Method

Docker container (nginx serving static build) + Docker Compose for orchestration. Also runnable via `npm run dev` for development.

### 9.3 Configuration

- Environment variables: `VITE_DEFAULT_WS_URL`, `VITE_DEFAULT_API_URL` (optional defaults).
- Runtime configuration via UI (endpoint URLs, auth, protocols).
- No config files required — all configuration is in-memory/UI-driven.

### 9.4 System Requirements

- Docker Engine 20.10+ and Docker Compose v2+ (for containerized deployment).
- Node.js 20+ and npm 10+ (for development).
- Modern browser: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+.

## 10. Performance Requirements

### 10.1 Response Time Targets

- UI interaction response: <100ms for all user actions.
- Message display latency: <50ms from WebSocket frame receipt to UI render.
- Inspector log append: <10ms per entry.

### 10.2 Throughput Targets

- Support 20 simultaneous WebSocket connections.
- Handle 100+ messages per second across all clients without UI degradation.
- Inspector log buffer: 10,000 entries with rotation.

### 10.3 Resource Limits

- Browser memory: <200MB for 20 clients with 10,000 messages.
- Bundle size: <500KB gzipped for initial load.

## 11. Constraints & Non-Goals

### 11.1 Technical Constraints

- Browser native WebSocket cannot send custom handshake headers (fundamental browser limitation).
- No server-side component — pure frontend SPA.
- No persistent storage — all data in memory.
- Single-user tool — no multi-user collaboration.

### 11.2 Non-Goals

- **Production chat application**: This is a testing tool, not a user-facing chat product.
- **Backend implementation**: No backend code is included. The simulator connects to existing backends.
- **User registration/auth system**: The simulator does not manage user accounts.
- **Persistent message storage**: Messages exist only in the current session.
- **Push notifications**: No notification system.
- **Payment integration**: Not applicable.
- **Custom WebSocket server**: The simulator is a client only.
- **Multi-user collaboration**: Single developer at a time.

### 11.3 Assumptions

- Target backends support standard WebSocket protocol (RFC 6455).
- Users have network access to the backend WebSocket endpoint.
- Backend message format is JSON (text frames). Binary frames are logged but not parsed as chat.
- Browser supports modern ES2022 features.

### 11.4 Open Questions

- **[TBD: Message adapter complexity]**: Should the adapter support nested field paths (e.g., "data.message.content") or only top-level fields? Leaning toward: nested paths via dot notation for flexibility.
- **[TBD: Binary frame handling]**: Should binary WebSocket frames be displayed as hex or base64? Leaning toward: base64 with size indicator.
- **[TBD: Export format]**: Should session export include messages, inspector logs, or both? Leaning toward: both, as separate JSON arrays.

## 12. Future Considerations

- **v1.1**: WebSocket frame recording and replay for regression testing.
- **v1.1**: Pre-built protocol profiles for common frameworks (Socket.IO, Phoenix Channels, etc.).
- **v1.1**: Automated test scenario runner with assertions.
- **v2.0**: Electron wrapper for true custom-header testing.
- **v2.0**: Collaborative multi-user testing (shared session).

## 13. Definition of Done

The project is complete when:

- It runs using Docker Compose.
- Multiple independent clients can connect simultaneously.
- Each client can have separate authentication credentials.
- Messages can be sent and received in real time.
- The chat interface works with text and JSON payloads.
- Raw WebSocket traffic can be inspected with filtering.
- Different message formats can be configured via protocol adapter.
- Authentication failures can be tested.
- Connection lifecycle (connect, disconnect, reconnect) can be tested.
- The application does not depend on any specific backend implementation.
- Documentation is available.
- All core features from Section 3 are implemented and functional.
