# Caffeine Stream Deck

A Stream Deck plugin that lets users toggle system sleep prevention on macOS directly from a hardware button.

## Language

**Caffeine**:
The system state in which macOS is prevented from idle sleeping or dimming the display, achieved by a running `caffeinate` process.
_Avoid_: "keep awake", "wake lock", "sleep blocker"

**Toggle**:
A single button press that flips Caffeine from active to inactive, or inactive to active.
_Avoid_: "enable/disable", "turn on/off"

**Caffeine Process**:
The OS-level `caffeinate -d -i` subprocess that holds the sleep and display assertions. Caffeine is active if and only if a Caffeine Process is running.
_Avoid_: "caffeinate instance", "daemon"

**Adopt**:
The startup behavior where the plugin detects a pre-existing Caffeine Process (started by any app, including the plugin in a prior session) and takes ownership of it — storing its PID and treating Caffeine as active.
_Avoid_: "detect", "inherit"

**Button State**:
The visual representation of the current Caffeine state on a Stream Deck key — either the filled coffee cup image (active) or the empty coffee cup image (inactive).
_Avoid_: "icon", "image state"

## Relationships

- **Caffeine** is active if and only if a **Caffeine Process** is running
- A **Toggle** spawns a **Caffeine Process** (if inactive) or kills it (if active)
- On plugin startup, the plugin **Adopts** any existing **Caffeine Process**
- All **Button States** across all configured keys always reflect the same **Caffeine** state

## Example dialogue

> **Dev:** "Should we track whether *we* started the Caffeine Process?"
> **Domain expert:** "No — if caffeinate is running, Caffeine is active. We Adopt whatever's there and show the filled cup. The user can Toggle it off regardless of who started it."

## Flagged ambiguities

- "caffeine" could refer to the third-party Caffeine.app or the macOS `caffeinate` CLI — resolved: this plugin builds against the `caffeinate` CLI tool directly, not any third-party app.
