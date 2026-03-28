<script setup lang="ts">
if (process.client) {
  const token = localStorage.getItem("appchat_access_token");
  if (!token) {
    await navigateTo("/sign-in", { replace: true });
  } else {
    await navigateTo(await resolvePostAuthRedirectPath(), { replace: true });
  }
} else {
  await navigateTo("/sign-in", { replace: true });
}
</script>
