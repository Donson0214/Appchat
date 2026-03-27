<template>
  <AuthLayout
    subtitle="Sign in to your workspace"
    bottom-text="Don't have an account?"
    bottom-link-label="Sign up"
    bottom-link-to="/sign-up"
  >
    <button class="social-btn" type="button">
      <span class="social-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.95 2.3-2.02 3.02l3.26 2.52c1.9-1.75 3-4.32 3-7.4 0-.72-.07-1.4-.2-2.05z"/>
          <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.26-2.52c-.9.6-2.05.97-3.37.97-2.6 0-4.8-1.75-5.58-4.1H3.06v2.58A10 10 0 0 0 12 22z"/>
          <path fill="#4A90E2" d="M6.42 13.9A6 6 0 0 1 6.1 12c0-.66.12-1.3.32-1.9V7.52H3.06A10 10 0 0 0 2 12c0 1.62.4 3.15 1.06 4.48z"/>
          <path fill="#FBBC05" d="M12 5.98c1.47 0 2.8.5 3.85 1.5l2.88-2.88C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.06 7.52l3.36 2.58C7.2 7.75 9.4 5.98 12 5.98z"/>
        </svg>
      </span>
      Continue with Google
    </button>

    <button class="social-btn" type="button">
      <span class="social-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path fill="#24292F" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32a2.98 2.98 0 0 0-1.25-1.64c-1.02-.7.08-.68.08-.68a2.36 2.36 0 0 1 1.72 1.15 2.4 2.4 0 0 0 3.27.93 2.4 2.4 0 0 1 .7-1.52c-2.48-.28-5.08-1.24-5.08-5.53 0-1.23.44-2.24 1.16-3.04a4.09 4.09 0 0 1 .11-3s.94-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.07-1.16 3.07-1.16.42.97.46 2.06.11 3 .72.8 1.16 1.81 1.16 3.04 0 4.3-2.6 5.24-5.1 5.51.4.34.76 1.03.76 2.08v3.1c0 .3.2.65.78.53A11.2 11.2 0 0 0 12 .8"/>
        </svg>
      </span>
      Continue with GitHub
    </button>

    <div class="divider"><span>or</span></div>

    <label class="field-label">Email</label>
    <div class="input-wrap">
      <span class="input-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M3.75 6A2.25 2.25 0 0 0 1.5 8.25v7.5A2.25 2.25 0 0 0 3.75 18h16.5a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 20.25 6zm0 1.5h16.5c.2 0 .4.08.53.22L12 13.2 3.22 7.72a.75.75 0 0 1 .53-.22z"/></svg>
      </span>
      <input class="field-input" type="email" placeholder="you@company.com" />
    </div>

    <div class="label-row">
      <label class="field-label">Password</label>
      <a class="forgot-link" href="#">Forgot password?</a>
    </div>
    <div class="input-wrap">
      <span class="input-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M7.5 10V8a4.5 4.5 0 1 1 9 0v2h.75a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 17.25 22h-10.5A2.25 2.25 0 0 1 4.5 19.75v-7.5A2.25 2.25 0 0 1 6.75 10zm1.5 0h6V8a3 3 0 1 0-6 0z"/></svg>
      </span>
      <input class="field-input" type="password" placeholder="••••••••" />
    </div>

    <button class="primary-btn" type="button">Sign in</button>
  </AuthLayout>
</template>
