import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import { cache } from "react";
import { buildMarket, type Market, type MarketInput } from "./markets";

// Created markets live in one JSON file in Vercel Blob, so they survive deploys.
// Without a Blob token (local dev) they go to .data/markets.json instead.
//
// Public pages read the file through the Blob CDN (free, fast, at most a minute
// behind a save). The admin page and saves read it from origin, so they are never stale.

const BLOB_PATH = "markets/markets.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", "markets.json");

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Reads the stored inputs. `fresh` skips the CDN and reads from origin. */
export async function readInputs(fresh = true): Promise<MarketInput[]> {
  if (!useBlob()) {
    try {
      return JSON.parse(await fs.readFile(LOCAL_PATH, "utf8"));
    } catch {
      return [];
    }
  }
  const res = await get(BLOB_PATH, { access: "public", useCache: !fresh });
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

/** Every market, newest first. Deduplicated within one request. */
export const getMarkets = cache(async (fresh = false): Promise<Market[]> => {
  const inputs = (await readInputs(fresh)).slice().sort((a, b) => b.createdAt - a.createdAt);
  return inputs.map((input) => buildMarket(input, inputs));
});

/**
 * Markets for a page that needs a specific one. If the CDN copy doesn't have it yet
 * (it was just created), read from origin instead of showing a 404.
 */
export async function getMarketsWith(has: (markets: Market[]) => boolean): Promise<Market[]> {
  const markets = await getMarkets();
  return has(markets) ? markets : getMarkets(true);
}
