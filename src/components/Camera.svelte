<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initPoseLandmarker, detectPose, drawLandmarks } from "../lib/mediapipe";
  import { computeMetrics, type PostureMetrics, type CameraPosition } from "../lib/posture";
  import type { PoseLandmarkerResult } from "@mediapipe/tasks-vision";

  interface Props {
    running: boolean;
    checkIntervalSec: number;
    cameraPosition: CameraPosition;
    postureStatus?: "neutral" | "warning" | "good";
    onMetrics?: (metrics: PostureMetrics) => void;
    onReady?: () => void;
    onError?: (msg: string) => void;
  }

  let { running, checkIntervalSec, cameraPosition, postureStatus = "neutral", onMetrics, onReady, onError }: Props = $props();

  let videoEl: HTMLVideoElement;
  let canvasEl: HTMLCanvasElement;
  let animFrameId: number = 0;
  let detectIntervalId: ReturnType<typeof setInterval> | null = null;
  let lastResult: PoseLandmarkerResult | null = null;
  let lastCheckTime = 0;

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      videoEl.srcObject = stream;
      await videoEl.play();

      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;

      await initPoseLandmarker();
      onReady?.();
    } catch (e: any) {
      onError?.(e.message || "카메라를 사용할 수 없습니다.");
    }
  }

  // Detection loop: runs via setInterval so it works in background
  function startDetectLoop() {
    if (detectIntervalId) return;
    detectIntervalId = setInterval(() => {
      if (!videoEl || videoEl.readyState < 2) return;

      const now = performance.now();
      const result = detectPose(videoEl, now);
      if (result) {
        lastResult = result;

        if (running && result.landmarks.length > 0) {
          const intervalMs = checkIntervalSec * 1000;
          const shouldCheck = intervalMs <= 0 || now - lastCheckTime >= intervalMs;
          if (shouldCheck) {
            const m = computeMetrics(result.landmarks[0], cameraPosition);
            if (m) {
              onMetrics?.(m);
              lastCheckTime = now;
            }
          }
        }
      }
    }, 100); // 10fps detection is sufficient
  }

  function stopDetectLoop() {
    if (detectIntervalId) {
      clearInterval(detectIntervalId);
      detectIntervalId = null;
    }
  }

  // Render loop: only runs when window is visible (rAF)
  function renderLoop() {
    if (lastResult) {
      drawLandmarks(canvasEl, lastResult, postureStatus);
    }
    animFrameId = requestAnimationFrame(renderLoop);
  }

  export function resetCheckTimer() {
    lastCheckTime = 0;
  }

  onMount(() => {
    startCamera().then(() => {
      startDetectLoop();
      animFrameId = requestAnimationFrame(renderLoop);
    });
  });

  onDestroy(() => {
    stopDetectLoop();
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (videoEl?.srcObject) {
      (videoEl.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
  });
</script>

<div class="camera-container">
  <video bind:this={videoEl} playsinline muted></video>
  <canvas bind:this={canvasEl}></canvas>
</div>

<style>
  .camera-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
  }
  video {
    width: 100%;
    display: block;
    transform: scaleX(-1);
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleX(-1);
  }
</style>
