<template>
  <div style="min-height:100vh;display:grid;place-items:center;font-family:'DM Sans',Arial,sans-serif;">
    <div style="text-align:center;">
      <h1 style="margin:0 0 8px;font-size:24px;">Something went wrong</h1>
      <p style="margin:0 0 16px;color:#64748b;">Please try again.</p>
      <button style="height:40px;padding:0 16px;border-radius:8px;border:1px solid #d5d9e1;background:#fff;cursor:pointer;" @click="handleError">Back to app</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleError = () => clearError({ redirect: "/" });
</script>
