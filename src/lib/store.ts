import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { buildMarket, type Market, type MarketInput } from "./markets";

// Created markets live in one JSON file in Vercel Blob, so they survive deploys.
// Without a Blob token (local dev) they go to .data/markets.json instead.

const BLOB_PATH = "markets/markets.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", "markets.json");
export const MARKETS_TAG = "markets";

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Reads the stored inputs straight from storage, skipping every cache. */
export async function readInputs(): Promise<MarketInput[]> {
  if (!useBlob()) {
    try {
      return JSON.parse(await fs.readFile(LOCAL_PATH, "utf8"));
    } catch {
      return [];
    }
  }
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATH);
  if (!blob) return [];
  // The version query skips the CDN copy left over from the previous write.
  const res = await fetch(`${blob.url}?v=${new Date(blob.uploadedAt).getTime()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not read markets (${res.status})`);
  return res.json();
}

export async function writeInputs(inputs: MarketInput[]) {
  const body = JSON.stringify(inputs, null, 2);
  if (!useBlob()) {
    await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
    await fs.writeFile(LOCAL_PATH, body);
    return;
  }
  await put(BLOB_PATH, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

/** Cached until the admin page saves a change (it revalidates MARKETS_TAG). */
const cachedInputs = unstable_cache(readInputs, ["market-inputs"], { tags: [MARKETS_TAG] });

/** Every market, newest first. */
export async function getMarkets(): Promise<Market[]> {
  const inputs = (await cachedInputs()).slice().sort((a, b) => b.createdAt - a.createdAt);
  return inputs.map((input) => buildMarket(input, inputs));
}

export async function getMarket(slug: string): Promise<Market | undefined> {
  return (await getMarkets()).find((m) => m.slug === slug);
}
