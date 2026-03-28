<script setup lang="ts">
if (process.client) {
  await navigateTo(await resolvePostAuthRedirectPath(), { replace: true });
} else {
  await navigateTo("/workspace/create", { replace: true });
}
</script>
