import {
  getSession,
  updateSession,
  clearSession,
  type SessionConfig,
} from "@tanstack/react-start/server";

/**
 * Server-only admin session helpers, built on TanStack Start's sealed
 * (encrypted + signed) cookie session — no database session table needed.
 * Only ever call these from inside a createServerFn handler.
 */

interface AdminSessionData {
  authenticated: boolean;
}

function sessionConfig(): SessionConfig {
  const password = process.env["SESSION_SECRET"];
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET is not configured (must be at least 32 characters).");
  }

  return {
    password,
    name: "jy-admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      path: "/",
    },
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSession<AdminSessionData>(sessionConfig());
  return session.data.authenticated === true;
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }
  if (password !== expected) return false;

  await updateSession<AdminSessionData>(sessionConfig(), { authenticated: true });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  await clearSession(sessionConfig());
}
