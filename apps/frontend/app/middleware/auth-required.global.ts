import { clearAuthSession, getValidAccessToken } from "../utils/auth-session";

const PUBLIC_PATH_PREFIXES = ["/sign-in", "/sign-up", "/login", "/register"];

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;

  const isPublic = PUBLIC_PATH_PREFIXES.some((prefix) => to.path.startsWith(prefix));
  if (isPublic) return;

  const needsAuth =
    to.path.startsWith("/workspace") ||
    to.path.startsWith("/settings") ||
    to.path.startsWith("/admin") ||
    to.path === "/" ||
    to.path.startsWith("/app");

  if (!needsAuth) return;

  const token = getValidAccessToken();
  if (!token) {
    clearAuthSession();
    return navigateTo("/sign-in");
  }
});

