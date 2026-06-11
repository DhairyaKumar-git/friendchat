# Design Brief

## Direction

Dark Editorial Chat — refined, content-focused messaging interface for private one-on-one conversations.

## Tone

Minimal, focused, intimate; dark background creates conversation-friendly environment without visual noise or distraction.

## Differentiation

Clean split-view layout with prominent friends sidebar and conversation threads; teal accent sparingly used for interactive elements and user actions.

## Color Palette

| Token      | OKLCH           | Role                          |
| ---------- | --------------- | ----------------------------- |
| background | 0.145 0.014 260 | Primary surface               |
| foreground | 0.95 0.01 260   | Text, maximum contrast        |
| card       | 0.18 0.014 260  | Message bubbles, containers   |
| primary    | 0.75 0.15 190   | Teal accent, CTAs, highlights |
| accent     | 0.75 0.15 190   | Accent, selected state        |
| muted      | 0.22 0.02 260   | Inactive text, secondary UI   |
| border     | 0.28 0.02 260   | Dividers, input borders       |

## Typography

- Display: Space Grotesk — clean, modern headings and friend names
- Body: DM Sans — readable message text and UI labels
- Scale: h2 `text-lg font-semibold`, label `text-xs font-medium uppercase`, body `text-base`

## Elevation & Depth

Subtle card layering via background color shifts (card vs. background); minimal shadows for clarity on message threads.

## Structural Zones

| Zone        | Background  | Border   | Notes                                  |
| ----------- | ----------- | -------- | -------------------------------------- |
| Header      | 0.18 0 0    | border-b | App title and logo                     |
| Sidebar     | 0.18 0 0    | border-r | Friends list, active friend highlight |
| Content     | 0.145 0 0   | —        | Message thread, alternates card/bg    |
| Compose box | 0.18 0 0    | border-t | Input field, send button               |

## Spacing & Rhythm

Spacer gutters 1.5rem between sections; message groups 1rem apart; inline padding 0.75rem for card content.

## Component Patterns

- Buttons: 6px radius, teal background, uppercase label, hover brightness increase
- Cards: 6px radius, card background, no shadow (flat)
- Friend list items: full-width with hover state (background lightens), active state teal accent left border
- Messages: sender-specific styling, timestamp gray text below, auto-layout flex column

## Motion

- Entrance: new messages fade in (opacity 0→1, 200ms ease-out)
- Hover: interactive elements brighten; friend list items shift background
- Decorative: none

## Constraints

- No group chats, message search, user avatars, typing indicators, read receipts, message editing, or file sharing in v1
- Favor density for messaging; spacious for friend list
- All text must meet AA+ contrast on dark backgrounds

## Signature Detail

Clean horizontal scroll divider between send button and text input — a subtle visual cue signifying message composition boundary.
