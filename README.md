# WatchYourSit

Real-time posture monitoring desktop app. Uses your webcam to detect bad posture (forward head, shoulder tilt, slouching) and alerts you before it becomes a habit.

Built with Svelte + TypeScript + Tauri + MediaPipe Pose Landmarker.

## Features

- **Real-time pose detection** via webcam using MediaPipe Pose Landmarker (lite model)
- **Calibration-based** — calibrate your "good posture" first, then monitors deviations
- **Camera position aware** — select front / left 45° / right 45° for optimized detection
- **Smart alerts** — only notifies on state changes, no spam
- **Chat log** — timestamped posture event history
- **Statistics** — per-issue breakdown (occurrence count, cumulative duration, percentage)
- **Audio alarm** — repeating beep when bad posture is detected
- **Pause/resume** — pause monitoring for stretching, etc.
- **Configurable interval** — continuous, 1s, 3s, 5s, 10s, 15s, 30s, 1min
- **System tray** — minimizes to tray, keeps monitoring in background
- **Monochrome dark UI** — minimal, distraction-free design

## Detection

| Issue | Front Camera | Side Camera (45°) |
|-------|-------------|-------------------|
| Forward head (turtle neck) | Ear-shoulder Y gap decrease | Ear-shoulder X offset increase |
| Shoulder tilt | Left/right shoulder Y difference | Left/right shoulder Y difference (relaxed threshold) |
| Head tilt | Left/right ear Y difference | Left/right ear Y difference (relaxed threshold) |
| Slouching | Ear-shoulder distance ratio change | Ear-shoulder Y gap decrease |
| Head drop | — | Nose-ear Y difference increase |

## Prerequisites

- [Bun](https://bun.sh/)
- [Rust](https://rustup.rs/) (for Tauri)

## Development

```bash
bun install
bun run dev          # web only
bun run tauri:dev    # desktop app (dev mode)
```

## Build

```bash
bun run tauri:build
```

Output: `src-tauri/target/release/bundle/macos/WatchYourSit.app`

## Tech Stack

- **Frontend**: Svelte 5 + TypeScript + Vite
- **Desktop**: Tauri 2 (Rust)
- **Pose Detection**: @mediapipe/tasks-vision (PoseLandmarker, lite model, GPU)
- **Audio**: Web Audio API (no external sound files)

## Project Structure

```
src/
├── lib/
│   ├── posture.ts      # Posture analysis (front & side algorithms)
│   ├── mediapipe.ts     # PoseLandmarker init & detection
│   └── sound.ts         # Alarm beep (Web Audio API)
├── components/
│   ├── Camera.svelte    # Webcam + landmark overlay
│   ├── ChatLog.svelte   # Alert message log
│   ├── Stats.svelte     # Posture statistics
│   └── Logo.svelte      # Brand logo SVG
├── App.svelte           # Main layout & state management
├── app.css              # Global styles
└── main.ts              # Entry point

src-tauri/
├── src/main.rs          # Tauri app (system tray, close-to-tray)
├── tauri.conf.json      # Tauri config
└── icons/               # App icons (all platforms)
```

## License

See [LICENSE](LICENSE) file.
