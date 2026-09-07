import { createServerFn } from "@tanstack/react-start";
import { isAdminAuthenticated, loginAdmin, logoutAdmin } from "@/lib/admin-session.server";

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  return { authenticated: await isAdminAuthenticated() };
});

export const login = createServerFn({ method: "POST" })
  .validator((password: unknown) => {
    if (typeof password !== "string" || !password) {
      throw new Error("Password is required.");
    }
    return password;
  })
  .handler(async ({ data: password }) => {
    const ok = await loginAdmin(password);
    if (!ok) throw new Error("Incorrect password.");
    return { success: true as const };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await logoutAdmin();
  return { success: true as const };
});
