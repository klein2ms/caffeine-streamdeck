# Sync Button State across all action instances

Caffeine is global system state — there is exactly one Caffeine Process (or none). All Stream Deck keys configured with this action always display the same Button State. We considered letting each button track state independently, but rejected it: independent state leads to buttons disagreeing about reality, which is confusing and incorrect. On any Toggle or state change, the plugin iterates all registered action instances and updates each one.
