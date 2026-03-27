<script setup lang="ts">
if (process.client) {
  const raw = localStorage.getItem("appchat_workspace");
  if (!raw) {
    await navigateTo("/workspace/create", { replace: true });
  } else {
    const parsed = JSON.parse(raw) as { slug?: string };
    const slug = parsed?.slug || "acme";
    await navigateTo(`/workspace/${slug}/channel/general`, { replace: true });
  }
} else {
  await navigateTo("/workspace/acme/channel/general", { replace: true });
}
</script>
