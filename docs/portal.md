# Portal

The portal is the home surface of Karnet.

It is the display the agent uses to interact with the user. It is shown on the
web and inside the Expo app through a WebView. It is not a chatbot and it is not
the source of truth of Karnet. It is a private, personal webpage authored by the
agent.

The user can interact with Karnet at any time through the core input. These
inputs become events in queues. The agent processes them when it is ready.

## Product model

The portal is a simple webpage, but it is agent-authored.

There is one private webpage per user. "One webpage" does not mean one screen:
the portal can have routes and multiple views. The routing system is authored by
the agent.

The portal should feel like Karnet's home:

- calm;
- useful;
- personal;
- non-chat;
- able to change over time;
- able to show what the agent thinks is relevant now.

The portal is not a generic dashboard querying tables. It is the visual output
of the agent's current understanding.

## Web and app display

The same portal webpage is used on:

- the web;
- the Expo app, through a WebView.

The Expo app is responsible for native platform concerns such as notifications,
location permissions, sharing, and the WebView container. The portal itself is
the same web experience.

## Core and portal

The page is split into two conceptual layers:

1. Core chrome
2. Agent-authored portal

The core chrome is always present and is not owned by the agent. It includes:

- account and profile;
- the universal input;
- queue/status UI;
- the protected runtime around the portal.

The agent-authored portal is the webpage content area. The agent can design it,
route inside it, change it, publish it, and make it personal.

The core is locked. The agent can read core code, but cannot modify it. During
build, the locked core is checked out/composed into the final app.

## Agent freedom

The agent is allowed to code React.

The agent can own the portal shell, layout, routes, views, sections, and
hardcoded content inside the portal area. Some parts of the React codebase are
locked and cannot be modified by the agent.

The agent can hardcode personal things into the page in v0. This is acceptable
because each portal is private and belongs to one user.

The non-negotiable boundary is that the agent cannot break the protected core:

- it cannot bypass permissions;
- it cannot modify locked code;
- it cannot make the core input disappear;
- it cannot make the core queue/status UI disappear;
- it cannot remove recovery and rollback behavior.

## V0 data model

For v0, there may be no backend behind the portal.

The agent can hardcode everything it wants to show into the webpage. The portal
is therefore closer to a compiled home than a database-backed dashboard.

Durable user intent still flows back to the agent through events. A click in the
portal may change local UI state, but durable actions such as "done", "forget",
"remind me", "correct this", or "prepare this" should be sent as events for the
agent to process.

## Events and queues

Events are how the user and the portal interact with the agent.

Events are not linked one-to-one with portal versions. Portal deployment and
event processing are separate lanes:

- portal lane: the agent edits code, previews, builds, and publishes;
- event lane: the user or app sends events, queues them, and the agent processes
  them.

There can be multiple queues. The initial queue classes are:

- interaction queue: user input and portal events;
- background queue: ingestion, scheduled checks, context work, memory cleanup;
- UI/build queue: portal edits, preview, build, and publish work.

The queue/status UI belongs to the core, not the agent-authored portal. The user
should always be able to see what Karnet is processing, independently of the
current portal page.

## Multiple agent runs

Karnet may run multiple agent jobs at the same time, for example:

- UI agent work;
- background agent work;
- interaction agent work.

These are the same Karnet agent identity, but they may have different tools.

The server/orchestrator should coordinate the queues and prevent conflicts. The
agent can be free inside its work, but orchestration, queue status, protected
core behavior, and publish safety should be deterministic.

## Hot reload, preview, and publish

The portal should be hot-reloadable for the agent while it is working.

The publishing flow is:

1. agent edits the portal;
2. preview/hot reload shows the draft;
3. build validates the draft;
4. publish updates the user's portal.

Failed drafts or failed builds must not replace the user's current portal. The
user should keep seeing the last good published version.

## Rollback and history

Portal versions can be kept for a while.

Rollback must be possible. Since the agent may hardcode private personal details
into the page, old portal versions should be treated as sensitive personal data.

Recent versions should remain recoverable so Karnet can return to a last good
state if the agent publishes something bad.

## Tools

The agent has access to portal tools:

- `karnet portal build` runs lint, checks, and build steps;
- `karnet portal preview` previews the portal page and returns a preview URL;
- `karnet portal publish` publishes the portal page to the user.

The agent can also use browser tools to inspect the page it is building.

## Open questions

Some architectural questions are intentionally unresolved:

- whether hardcoded portal content remains the long-term model or only the v0
  implementation;
- where the agent's durable memory lives before a backend exists;
- the exact resource locks owned by the orchestrator;
- how much of the portal should become runtime data once backend state exists.

The important product principle remains stable: the portal is the private home
surface authored by Karnet, while the core protects account, input, queues,
recovery, and trust.
