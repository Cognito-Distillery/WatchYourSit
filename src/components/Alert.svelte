<script lang="ts">
  import type { PostureWarning } from "../lib/posture";

  interface Props {
    warnings: PostureWarning[];
    sustained: boolean;
  }

  let { warnings, sustained }: Props = $props();

  const isGood = $derived(warnings.length === 0 || !sustained);
</script>

<div class="alert-panel" class:good={isGood} class:bad={!isGood}>
  {#if isGood}
    <div class="status good-status">
      <span class="icon">&#10003;</span>
      <span>자세가 좋습니다</span>
    </div>
  {:else}
    <div class="status bad-status">
      <span class="icon">&#9888;</span>
      <span>자세를 교정해주세요</span>
    </div>
    <ul class="warning-list">
      {#each warnings as w}
        <li>
          <span class="warning-label">{w.label}</span>
          <div class="severity-bar">
            <div class="severity-fill" style="width: {w.severity * 100}%"></div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .alert-panel {
    width: 100%;
    max-width: 640px;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    transition: background-color 0.3s, border-color 0.3s;
    border: 2px solid;
  }
  .good {
    background: rgba(0, 200, 100, 0.1);
    border-color: #00c864;
  }
  .bad {
    background: rgba(255, 60, 60, 0.1);
    border-color: #ff3c3c;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .good-status { color: #00c864; }
  .bad-status { color: #ff3c3c; }
  .icon { font-size: 1.4rem; }
  .warning-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .warning-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .warning-label {
    min-width: 120px;
    font-size: 0.95rem;
  }
  .severity-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  .severity-fill {
    height: 100%;
    background: #ff3c3c;
    border-radius: 3px;
    transition: width 0.2s;
  }
</style>
