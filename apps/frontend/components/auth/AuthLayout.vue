<template>
  <div class="auth-page">
    <button class="mode-button" type="button" aria-label="Toggle theme">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a.75.75 0 0 1 .77 1.1A7.5 7.5 0 0 0 19.9 12a.75.75 0 0 1 1.1.8z" />
      </svg>
    </button>

    <div class="auth-center">
      <div class="brand-wrap">
        <div class="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 6.75A2.75 2.75 0 0 1 8.75 4h6.5A2.75 2.75 0 0 1 18 6.75v4.5A2.75 2.75 0 0 1 15.25 14H12.4a.7.7 0 0 0-.5.2l-1.95 1.9a.9.9 0 0 1-1.53-.65V14H8.75A2.75 2.75 0 0 1 6 11.25z" />
            <path d="M9 9h6v1.5H9zm0 2.5h4v1.5H9z" fill="#eef2ff" />
          </svg>
        </div>
        <h1 class="brand-title">AppChat</h1>
        <p class="brand-subtitle">{{ subtitle }}</p>
      </div>

      <div class="auth-card">
        <slot />
      </div>

      <p class="bottom-text">
        {{ bottomText }}
        <NuxtLink class="bottom-link" :to="bottomLinkTo">{{ bottomLinkLabel }}</NuxtLink>
      </p>
      <p class="demo-text">Demo: enter any email &amp; password to continue</p>
    </div>

    <button class="help-button" type="button" aria-label="Help">?</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subtitle: string;
  bottomText: string;
  bottomLinkLabel: string;
  bottomLinkTo: string;
}>();
</script>
