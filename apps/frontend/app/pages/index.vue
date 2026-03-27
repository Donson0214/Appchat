<script setup lang="ts">
if (process.client) {
  const token = localStorage.getItem("appchat_access_token");
  if (!token) {
    await navigateTo("/sign-in", { replace: true });
  } else {
    const workspaceRaw = localStorage.getItem("appchat_workspace");
    if (!workspaceRaw) {
      await navigateTo("/workspace/create", { replace: true });
    } else {
      const parsed = JSON.parse(workspaceRaw) as { slug?: string };
      const slug = parsed?.slug || "acme";
      await navigateTo(`/workspace/${slug}/channel/general`, { replace: true });
    }
  }
} else {
  await navigateTo("/sign-in", { replace: true });
}
</script>
