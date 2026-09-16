#!/usr/bin/env node
/**
 * Rebuilds HimaRestaurant.json straight from Cloudinary.
 *
 * Written for DYNAMIC FOLDER MODE accounts (the default for any
 * Cloudinary account created since June 2024 — yours is one of these,
 * confirmed by the flat public_ids on your existing images). In this
 * mode, folders shown in the Console are NOT part of the public_id,
 * so we can't search by "prefix" — instead we:
 *   1. Ask Cloudinary what subfolders exist inside Hima_Menu2
 *      (each subfolder name = one menu category)
 *   2. Pull every asset directly inside each of those subfolders
 *
 * So: Hima_Menu2/Recomended -> category "Recomended", automatically,
 * the moment that folder has images in it. No code changes needed to
 * add a new category — just make the folder in Cloudinary and re-run
 * this script.
 *
 * Per-dish info comes straight from the Cloudinary Media Library:
 *
 *   Display name (the editable name at the top of the panel)
 *                        -> dish name, e.g. rename the asset to "Wagyu Steak"
 *   Description (alt)   -> short blurb, e.g. "Slow-braised, black pepper sauce"
 *   Price (custom field) -> just the number, e.g. 78000 -> shown as "Rp78.000"
 *
 * If you'd rather keep filenames as-is and give a separate display name,
 * you can also use the "Title (caption)" metadata field instead — it's
 * used as a fallback if you haven't renamed the asset.
 *
 * The "Price" field must be a Structured Metadata field you created in
 * Settings -> Metadata Fields — check its External ID matches the
 * PRICE_METADATA_FIELD_ID constant below (Cloudinary auto-generates this
 * ID from the field name, so double check it, don't assume).
 *
 * If you skip renaming the asset, the script guesses a name from the
 * filename. If you skip Description or Price, that part is just left
 * out of the "meta" line.
 *
 * ---- SETUP ----
 * 1. npm install cloudinary dotenv
 * 2. .env (next to this script, DO NOT commit it):
 *      CLOUDINARY_CLOUD_NAME=dimnv9sq5
 *      CLOUDINARY_API_KEY=your_api_key
 *      CLOUDINARY_API_SECRET=your_api_secret
 * 3. node generate-menu.js
 *    Overwrites OUTPUT_PATH below with the fresh menu.
 *
 * Never put your API_SECRET in front-end code — this script only
 * ever runs on your machine / in CI, never in the browser.
 */

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_FOLDER = "Hima_Menu2";
const OUTPUT_PATH = path.resolve(
  __dirname,
  "src/assets/json/HimaRestaurant.json" // <-- adjust if your repo layout differs
);

// The External ID of your custom "Price" structured metadata field.
// Check it in Cloudinary Console -> Settings -> Metadata -> click "Price"
// -> the External ID field. If it's not exactly "price", change this.
const PRICE_METADATA_FIELD_ID = "Price";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function titleCaseFromPublicId(publicId) {
  const base = publicId.split("/").pop();
  return base
    .replace(/_[a-z0-9]{5,}$/i, "") // strip Cloudinary's random upload suffix
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrice(raw) {
  if (raw === undefined || raw === null || raw === "") return null;
  const str = String(raw).trim();
  // Strip any currency symbol/prefix and thousand separators so values typed
  // as "$3", "7$", or "Rp 78.000" all parse as plain numbers.
  const cleaned = str.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const num = Number(cleaned);
  if (Number.isNaN(num) || cleaned === "") return str; // truly unparseable, use as-is

  // Format using whatever currency the value was actually typed in, instead
  // of assuming IDR — e.g. "$3" or "7$" -> USD, otherwise default to IDR.
  if (/\$/.test(str)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  }
  // Formats as Indonesian Rupiah, e.g. 78000 -> "Rp78.000".
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

function getFieldCaseInsensitive(obj = {}, fieldName) {
  const target = fieldName.toLowerCase();
  const matchKey = Object.keys(obj).find((k) => k.toLowerCase() === target);
  return matchKey ? obj[matchKey] : undefined;
}

function getPrice(ctx = {}, metadata = {}) {
  // Price might live in either system depending on how it was entered in
  // Cloudinary's UI:
  //  - Structured metadata (Settings -> Metadata Fields) -> `metadata` object
  //  - Contextual metadata / custom context (the ad-hoc Key/Value rows in
  //    the same panel as Title/Description) -> `context.custom` object
  // Check both, case-insensitively, since either can be capitalized
  // differently than PRICE_METADATA_FIELD_ID.
  const structuredPrice = getFieldCaseInsensitive(metadata, PRICE_METADATA_FIELD_ID);
  const contextPrice = getFieldCaseInsensitive(ctx, PRICE_METADATA_FIELD_ID);
  const priceRaw = structuredPrice ?? contextPrice;
  return formatPrice(priceRaw); // formatted string, or null if no price set anywhere
}

function buildMetaString(ctx = {}) {
  // "meta" is now description-only — price is its own top-level field
  // (see getPrice) so the front-end can style/position it separately.
  return ctx.alt || ctx.desc || ctx.description || "";
}

async function getCategoryFolders() {
  const res = await cloudinary.api.sub_folders(ROOT_FOLDER);
  return res.folders.map((f) => f.path); // e.g. "Hima_Menu2/Recomended"
}

async function fetchResourcesInFolder(assetFolder, resourceType) {
  let resources = [];
  let nextCursor;
  do {
    const res = await cloudinary.api.resources_by_asset_folder(assetFolder, {
      resource_type: resourceType, // Admin API defaults to "image" only — must ask for "video" separately
      context: true,
      metadata: true, // needed to get structured metadata fields like "Price"
      max_results: 500,
      next_cursor: nextCursor,
    });
    resources = resources.concat(res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return resources;
}

// resources_by_asset_folder (the newer dynamic-folder listing call) doesn't
// always return structured metadata even when metadata: true is passed —
// the single-resource lookup below is more reliable for that. Only call it
// for resources that came back with no metadata, to keep this cheap.
async function fillMissingMetadata(resource) {
  if (resource.metadata && Object.keys(resource.metadata).length) {
    return resource;
  }
  try {
    const detail = await cloudinary.api.resource(resource.public_id, {
      resource_type: resource.resource_type,
      type: resource.type,
      context: true,
      metadata: true,
    });
    return {
      ...resource,
      metadata: detail.metadata || resource.metadata,
      context: detail.context || resource.context,
    };
  } catch (err) {
    console.warn(
      `  ! Couldn't fetch metadata detail for "${resource.public_id}": ${err.message}`
    );
    return resource;
  }
}

async function main() {
  console.log(`Looking up category folders inside "${ROOT_FOLDER}"...`);
  const categoryFolders = await getCategoryFolders();

  if (categoryFolders.length === 0) {
    console.warn(
      `No subfolders found inside "${ROOT_FOLDER}". Create a subfolder per category (e.g. Hima_Menu2/Mains) and upload images into it.`
    );
  }

  const menu = [];
  for (const folderPath of categoryFolders) {
    const category = folderPath.split("/").pop(); // last segment = category name
    console.log(`  -> ${folderPath}`);
    // Cloudinary's resources_by_asset_folder doesn't reliably filter by
    // resource_type, so combining an "image" call and a "video" call can
    // return overlapping/duplicate results. Dedupe by asset_id, which is
    // unique per asset regardless of which call returned it.
    const [imageResources, videoResources] = await Promise.all([
      fetchResourcesInFolder(folderPath, "image"),
      fetchResourcesInFolder(folderPath, "video"),
    ]);
    const byAssetId = new Map();
    for (const r of [...imageResources, ...videoResources]) {
      byAssetId.set(r.asset_id, r);
    }
    let resources = [...byAssetId.values()];
    resources = await Promise.all(resources.map(fillMissingMetadata));

    for (const r of resources) {
      const ctx = r.context?.custom || {};
      const metadata = r.metadata || {};
      // Prefer the asset's display name (the editable name shown at the top
      // of the panel in Media Library, e.g. "Steak") — just rename the file
      // itself to the dish name, no extra field needed. "Title (caption)"
      // only kicks in if you want a fancier name that differs from the
      // display name (e.g. display name "Steak" but caption "Wagyu Steak").
      const name = r.display_name || ctx.caption || titleCaseFromPublicId(r.public_id);

      const meta = buildMetaString(ctx);
      const price = getPrice(ctx, metadata);

      if (!price) {
        console.warn(
          `  ! "${name}" has no price. context=${JSON.stringify(ctx)} metadata=${JSON.stringify(metadata)}`
        );
      }

      menu.push({
        category,
        name,
        meta,
        price, // formatted price string, e.g. "Rp3.000" — null if none set
        img: r.secure_url,
        type: r.resource_type, // "image" or "video" — tells the front-end how to render it
      });
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(menu, null, 2));

  const categories = new Set(menu.map((m) => m.category));
  console.log(
    `Wrote ${menu.length} items across ${categories.size} categories (${[...categories].join(", ")}) to:\n  ${OUTPUT_PATH}`
  );
}

main().catch((err) => {
  console.error("Failed to regenerate menu:", err);
  process.exit(1);
});