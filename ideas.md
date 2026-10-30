# Project: Universal WebSocket Chat Simulator

## Project Overview

Build a general-purpose, backend-agnostic WebSocket Chat Simulator.

The application is a developer tool designed to simulate multiple chat participants and test realtime messaging systems without requiring an actual frontend application.

It should work with different backend technologies, authentication systems, WebSocket implementations, and message protocols.

The application must be deployable using Docker Compose.

## Core Objectives

1. Simulate multiple independent WebSocket clients.
2. Provide a visual chat interface for testing conversations.
3. Support configurable authentication mechanisms.
4. Inspect incoming and outgoing WebSocket messages.
5. Support different backend message formats and event protocols.
6. Test connection lifecycle and failure scenarios.
7. Work independently of any particular backend framework or application.

## Core Features

### 1. Multi-Client Simulation

- Create multiple independent client sessions.
- Configure individual identity, username, role, and metadata.
- Configure different WebSocket endpoints.
- Assign different authentication credentials per client.
- Connect and disconnect clients independently.
- Support multiple simultaneous connections.

### 2. Chat Interface

- Modern messaging-style interface.
- Separate chat identity for each client.
- Message bubbles for incoming and outgoing messages.
- Timestamps.
- Conversation grouping.
- Message history within the testing session.
- Support text and JSON payloads.
- Display unknown payload formats as raw data.
- Real-time message updates.

### 3. Authentication Configuration

Support configurable authentication methods:

- Bearer Token.
- Custom HTTP handshake headers.
- Cookie-based authentication.
- Query parameter authentication.
- WebSocket subprotocol configuration.
- Other custom authentication mechanisms where supported.

Requirements:

- Authentication configuration must be independent for each client.
- Mask sensitive credentials by default.
- Avoid exposing credentials in logs.
- Do not persist credentials without explicit user consent.
- Clearly document transport limitations.

### 4. Cross-Platform Compatibility

The simulator must account for differences between:

- Web Browser.
- Desktop applications using Electron.
- Mobile applications using Flutter.

Do not assume all platforms have identical WebSocket APIs.

Select suitable transport implementations for each environment.

Browser-native WebSocket does not support arbitrary custom handshake headers. Provide browser-compatible alternatives, including cookie authentication or short-lived connection tickets.

Use appropriate WebSocket libraries for environments requiring custom handshake headers.

### 5. Configurable Message Protocol

Do not hardcode a particular chat message structure.

Provide a configurable message adapter that allows users to define:

- Message event names.
- Sender identification fields.
- Recipient identification fields.
- Conversation ID fields.
- Message content fields.
- Message ID fields.
- Timestamp fields.
- Event type fields.

Support common JSON payloads and provide raw JSON editing.

Users should be able to send arbitrary JSON messages without requiring a predefined chat schema.

### 6. WebSocket Inspector

Provide detailed connection and message inspection:

- Connection established.
- Incoming messages.
- Outgoing messages.
- Connection closed.
- Errors and exceptions.
- Timestamps.
- Raw payloads.
- Close codes and reasons.
- Filtering by client and event type.
- Payload copy functionality.

### 7. Connection Management

- Connect/disconnect.
- Manual reconnect.
- Optional automatic reconnect.
- Connection timeout.
- Connection status.
- Multiple independent connections.
- Connection duration.
- Error reporting.

### 8. REST Integration (Optional)

Allow users to configure REST endpoints for supporting operations such as:

- Authentication.
- Token acquisition.
- Fetching conversation lists.
- Fetching message history.
- Other backend-specific setup operations.

REST integration must remain optional.

Do not assume a particular REST API structure.

### 9. Testing Scenarios

Include support for testing:

1. Single WebSocket connection.
2. Multiple simultaneous connections.
3. Bidirectional messaging.
4. Multiple participants.
5. Invalid authentication.
6. Expired authentication.
7. Reconnection.
8. Server unavailable.
9. Invalid payloads.
10. Unexpected disconnects.
11. Message delivery between different clients.
12. Different authentication methods.
13. Different message protocols.
14. Conversation isolation.
15. High-volume message testing.

### 10. UI/UX

Create a modern, minimal, developer-oriented interface.

Suggested layout:

- Sidebar: client/session management.
- Main area: chat interface.
- Secondary panel: WebSocket inspector.
- Toolbar: endpoint and connection configuration.

Prioritize desktop usability while maintaining responsive behavior.

Avoid unnecessary dashboard complexity.

### 11. Docker & Deployment

- Dockerfile.
- Docker Compose.
- Environment configuration.
- Health checks.
- Persistent storage only when necessary.
- No mandatory paid cloud services.
- Support deployment behind reverse proxies.
- Document localhost and container networking considerations.

### 12. Architecture Principles

- Backend agnostic.
- Authentication agnostic.
- Configurable message protocols.
- Modular transport implementation.
- Separate UI, transport, authentication, and message adapters.
- No embedded backend business logic.
- No dependency on a particular application.
- Avoid overengineering.
- Prioritize debugging and testing experience.

### 13. Scope Boundaries

IN SCOPE:

- WebSocket simulation.
- Multi-client testing.
- Chat interface.
- Authentication configuration.
- Message protocol configuration.
- WebSocket inspection.
- REST integration.
- Docker deployment.

OUT OF SCOPE:

- Building a production chat backend.
- User registration systems.
- Persistent messaging infrastructure.
- Application-specific business logic.
- Payment systems.
- Push notification services.

### 14. Project Architect Workflow

Use the installed `project-architect` skill.

Follow its planning workflow:

1. Requirement discovery.
2. Generate `SPECIFICATION.md`.
3. Generate `IMPLEMENTATION.md`.
4. Generate `TASKS.md`.
5. Generate `BRANDING.md` if appropriate.
6. Generate `PROMPT.md`.

Do not start implementation before planning is completed and approved.

During discovery:

- Ask about unresolved architectural decisions.
- Evaluate suitable frontend and transport technologies.
- Evaluate authentication and protocol configuration strategies.
- Identify security considerations.
- Avoid asking questions already answered in this specification.

Do not arbitrarily select technologies without architectural justification.

### 15. Definition of Done

The project is complete when:

- It runs using Docker Compose.
- Multiple independent clients can connect simultaneously.
- Each client can have separate authentication credentials.
- Messages can be sent and received in real time.
- The chat interface works.
- Raw WebSocket traffic can be inspected.
- Different message formats can be configured.
- Authentication failures can be tested.
- Connection lifecycle can be tested.
- The application does not depend on any specific backend implementation.
- Documentation is available.

The primary objective is to build a reusable developer tool for testing realtime messaging systems, not merely a visual chat application.
