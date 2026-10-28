"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, isAdmin, logIn, logOut } from "@/lib/auth";
import { CATEGORIES, DEFAULT_END_DATE, DEFAULT_SUBHEAD, slugify, type MarketInput } from "@/lib/markets";
import { MARKETS_TAG, readInputs, writeInputs } from "@/lib/store";

export type FormState = { error?: string; created?: string };

/** Paths the site already uses, so a market can't take them over. */
const RESERVED = new Set(["admin", "api", "icon", "_next"]);

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function refresh() {
  revalidateTag(MARKETS_TAG);
  revalidatePath("/", "layout");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "That password isn’t right." };
  await logIn();
  redirect("/admin");
}

export async function logout() {
  await logOut();
  redirect("/admin");
}

export async function createMarket(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "Your session ended. Reload and log in again." };

  const title = text(form, "title", 120);
  const headline = text(form, "headline", 160);
  const optionA = text(form, "optionA", 40);
  const optionB = text(form, "optionB", 40);
  if (!title || !headline || !optionA || !optionB) {
    return { error: "Market name, headline, and both options are required." };
  }
  const categoryInput = text(form, "category", 40);
  const category = (CATEGORIES as readonly string[]).includes(categoryInput) ? categoryInput : "Politics";
  const chance = Number(form.get("chanceA"));
  const chanceA = Number.isFinite(chance) && chance >= 1 && chance <= 99 ? Math.round(chance) : 50;

  const inputs = await readInputs();
  const base = slugify(text(form, "slug", 60) || title) || "market";
  let slug = base;
  for (let n = 2; RESERVED.has(slug) || inputs.some((m) => m.slug === slug); n++) slug = `${base}-${n}`;

  const market: MarketInput = {
    slug,
    title,
    headline,
    optionA,
    optionB,
    category,
    chanceA,
    subhead: text(form, "subhead", 240) || DEFAULT_SUBHEAD,
    endDate: text(form, "endDate", 40) || DEFAULT_END_DATE,
    createdAt: Date.now(),
  };
  await writeInputs([...inputs, market]);
  refresh();
  return { created: slug };
}

export async function deleteMarket(form: FormData) {
  if (!(await isAdmin())) return;
  const slug = String(form.get("slug") ?? "");
  const inputs = await readInputs();
  await writeInputs(inputs.filter((m) => m.slug !== slug));
  refresh();
}
