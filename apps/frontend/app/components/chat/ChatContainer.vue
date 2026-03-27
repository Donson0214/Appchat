<template>
  <div class="flex h-screen overflow-hidden bg-white text-slate-800">
    <Sidebar />
    <WorkspaceSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <Header />
      <ChatContainer :messages="messages" />
    </div>
    <RightPanel />
  </div>
</template>

<script setup lang="ts">
defineProps<{ messages: any[] }>();
</script>
