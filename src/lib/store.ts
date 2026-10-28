import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
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
  // Read from origin, not the CDN: the CDN can serve the file as it was before the
  // last save for up to a minute, which hid new markets and could drop them on the next save.
  const res = await get(BLOB_PATH, { access: "public", useCache: false });
  if (!res || res.statusCode !== 200) return [];
  return new Response(res.stream).json();
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
