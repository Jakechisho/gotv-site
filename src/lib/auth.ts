import "server-only";

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// The admin page has one password, set as ADMIN_PASSWORD in Vercel. Logging in stores
// a hash of it in an httpOnly cookie, so changing the password logs everyone out.

const COOKIE = "gotv_admin";

function token(password: string) {
  return createHash("sha256").update(`gotv-admin:${password}`).digest("hex");
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && same(token(password), token(expected!));
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && same(value!, token(expected));
}

export async function logIn() {
  (await cookies()).set(COOKIE, token(process.env.ADMIN_PASSWORD!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function logOut() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
