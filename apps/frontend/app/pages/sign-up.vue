<template>
  <AuthLayout
    subtitle="Create your account"
    bottom-text="Already have an account?"
    bottom-link-label="Sign in"
    bottom-link-to="/sign-in"
  >
    <button
      class="inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px"
      type="button"
      :disabled="googleLoading"
      @click="handleGoogleSignIn"
    >
      <span class="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
        <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.95 2.3-2.02 3.02l3.26 2.52c1.9-1.75 3-4.32 3-7.4 0-.72-.07-1.4-.2-2.05z"/>
          <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.26-2.52c-.9.6-2.05.97-3.37.97-2.6 0-4.8-1.75-5.58-4.1H3.06v2.58A10 10 0 0 0 12 22z"/>
          <path fill="#4A90E2" d="M6.42 13.9A6 6 0 0 1 6.1 12c0-.66.12-1.3.32-1.9V7.52H3.06A10 10 0 0 0 2 12c0 1.62.4 3.15 1.06 4.48z"/>
          <path fill="#FBBC05" d="M12 5.98c1.47 0 2.8.5 3.85 1.5l2.88-2.88C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.06 7.52l3.36 2.58C7.2 7.75 9.4 5.98 12 5.98z"/>
        </svg>
      </span>
      {{ googleLoading ? "Signing in..." : "Continue with Google" }}
    </button>

    <button
      class="inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px"
      type="button"
    >
      <span class="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
        <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24">
          <path fill="#24292F" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32a2.98 2.98 0 0 0-1.25-1.64c-1.02-.7.08-.68.08-.68a2.36 2.36 0 0 1 1.72 1.15 2.4 2.4 0 0 0 3.27.93 2.4 2.4 0 0 1 .7-1.52c-2.48-.28-5.08-1.24-5.08-5.53 0-1.23.44-2.24 1.16-3.04a4.09 4.09 0 0 1 .11-3s.94-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.07-1.16 3.07-1.16.42.97.46 2.06.11 3 .72.8 1.16 1.81 1.16 3.04 0 4.3-2.6 5.24-5.1 5.51.4.34.76 1.03.76 2.08v3.1c0 .3.2.65.78.53A11.2 11.2 0 0 0 12 .8"/>
        </svg>
      </span>
      Continue with GitHub
    </button>

    <p v-if="errorMessage" class="text-[13px] font-medium text-red-600">{{ errorMessage }}</p>

    <div class="my-4 flex w-full items-center gap-3 text-[14px] text-slate-400">
      <span class="h-px flex-1 bg-slate-300/60"></span>
      <span>or</span>
      <span class="h-px flex-1 bg-slate-300/60"></span>
    </div>

    <label class="mt-1 text-[15px] font-medium leading-tight text-slate-900">Full name</label>
    <input
      class="h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
      type="text"
      placeholder="Alex Morgan"
      v-model="fullName"
    />

    <label class="mt-1 text-[15px] font-medium leading-tight text-slate-900">Email</label>
    <input
      class="h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
      type="email"
      placeholder="you@company.com"
      v-model="email"
    />

    <label class="mt-1 text-[15px] font-medium leading-tight text-slate-900">Password</label>
    <input
      class="h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
      type="password"
      placeholder="••••••••"
      v-model="password"
    />

    <button
      class="mt-2 h-[40px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[16px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105 hover:shadow-[0_8px_16px_rgba(99,102,241,0.24)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(99,102,241,0.20)]"
      type="button"
      :disabled="submitLoading"
      @click="handleEmailRegister"
    >
      {{ submitLoading ? "Creating..." : "Create account" }}
    </button>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from "../components/auth/AuthLayout.vue";

const googleLoading = ref(false);
const submitLoading = ref(false);
const errorMessage = ref("");
const fullName = ref("");
const email = ref("");
const password = ref("");
const { signInWithGoogle } = useGoogleAuth();
const { registerWithEmail } = useAuthApi();

const handleGoogleSignIn = async () => {
  try {
    googleLoading.value = true;
    errorMessage.value = "";
    const { redirectTo } = await signInWithGoogle();
    await navigateTo(redirectTo);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google sign-in failed";
    errorMessage.value = message;
  } finally {
    googleLoading.value = false;
  }
};

const handleEmailRegister = async () => {
  try {
    submitLoading.value = true;
    errorMessage.value = "";

    await registerWithEmail({
      fullName: fullName.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
    });

    await navigateTo(await resolvePostAuthRedirectPath());
  } catch (error: any) {
    errorMessage.value = error?.data?.message ?? "Registration failed";
  } finally {
    submitLoading.value = false;
  }
};
</script>
