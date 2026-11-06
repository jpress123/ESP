# Encrypted progress sync

The learning UI remains on GitHub Pages. A Sites Worker at https://elia-progress-sync.jpress1.chatgpt.site stores encrypted per-device snapshots in its private R2 binding. The authoritative Worker deployment source is the Sites repository for project appgprj_6aeda01b9848819196f4ac9de1d3d4fd; this directory mirrors its runtime source and manifest. GitHub Pages does not execute this Worker.

Users generate a 256-bit private pairing link in their browser. The URL fragment never goes to the web server. HKDF derives separate AES-GCM encryption and API authorization keys. Never place pairing keys or authorization tokens in source, logs, analytics or URLs sent to a server. Anyone holding the private pairing link can read and change that profile.

Each device has a separate encrypted snapshot and monotonically increasing revision. R2 conditional writes reject stale updates. Clients merge per-question records and checkbox changes by latest timestamp, retain mission accomplishments, and reconcile review queues. Device clocks should be correct; this is not a collaborative real-time exam system. Devices poll every 30 seconds while visible and push changes after a short debounce. Offline writes persist locally and are re-uploaded on reopen.

Offline caching covers the geometry module and its own scripts, styles and local home page, not every legacy subject. Open online once and wait for the offline-ready indicator before travelling. The private pairing link is the recovery mechanism if browser storage is lost.

Tests: `node tests/geometry-learning.cjs` and `node tests/progress-sync.cjs`. Optional live integration: set SYNC_TEST_URL to the service /v1/progress URL; it uses an isolated random synthetic profile and does not access a learner profile.
