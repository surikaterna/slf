---
"slf": minor
"slf-sentry": patch
"slf-debug": patch
---

Move SLF state from being set globally to be a static property on the LoggerFactory. Update the warning about not having a logger factory to be scheduled, and cancelled if a factory is set.
