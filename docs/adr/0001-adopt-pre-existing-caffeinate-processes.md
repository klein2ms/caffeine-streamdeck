# Adopt pre-existing caffeinate processes on startup

On plugin load, we detect any running `caffeinate` process via `pgrep caffeinate` and treat it as active — storing its PID and showing the filled cup Button State — regardless of whether the plugin started it. We considered ignoring foreign processes (only managing ones we spawned) and killing them (forcing a clean slate), but rejected both: the system is either keeping itself awake or it isn't, and the button should reflect that truth. Adopting means the plugin works correctly alongside other apps (e.g., Amphetamine, a script) that also manage `caffeinate`.

## Consequences

- We poll every 5 seconds for adopted processes (no exit event available for processes we didn't spawn) to detect unexpected exits and resync Button State.
- If multiple `caffeinate` processes are running, `pgrep` returns multiple PIDs; we store all of them and kill all on Toggle-off.
