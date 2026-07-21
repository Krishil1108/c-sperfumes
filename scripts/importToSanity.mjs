/**
 * Sanity Data Import Script — CNSS
 * =========================================
 * Pushes all products from mockProducts.json into Sanity CMS
 * 
 * Usage:
 *   node scripts/importToSanity.mjs
 *   node scripts/importToSanity.mjs --token=YOUR_TOKEN_HERE
 * 
 * Or set SANITY_API_TOKEN in .env.local
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CONFIG ──────────────────────────────────────────────────────────────────
const PROJECT_ID = '92sib1op';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

// Accept token from: CLI arg → env file → env var
function getToken() {
  // 1. From CLI arg: --token=sk...
  const cliArg = process.argv.find(a => a.startsWith('--token='));
  if (cliArg) return cliArg.split('=').slice(1).join('=');

  // 2. From .env.local file
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const match = envFile.match(/SANITY_API_TOKEN=(.+)/);
    if (match) return match[1].trim();
  } catch (_) {}

  // 3. From process env
  if (process.env.SANITY_API_TOKEN) return process.env.SANITY_API_TOKEN;

  return null;
}

const TOKEN = getToken();

if (!TOKEN) {
  console.error('\n❌ No Sanity API token found!');
  console.error('   Please add SANITY_API_TOKEN to .env.local or pass --token=sk...\n');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

// ── LOAD DATA ────────────────────────────────────────────────────────────────
const dataPath = join(__dirname, '..', 'data', 'mockProducts.json');
const products = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log(`\n✨ CNSS — Sanity Import Tool`);
console.log(`📦 Project: ${PROJECT_ID} | Dataset: ${DATASET}`);
console.log(`🔑 Token: ${TOKEN.substring(0, 10)}...${TOKEN.slice(-6)}`);
console.log(`🔢 Products to import: ${products.length}\n`);

// ── HELPERS ──────────────────────────────────────────────────────────────────
function buildSanityDoc(product) {
  return {
    _type: 'product',
    _id: `product-${product.id}`,
    title: product.title,
    slug: { _type: 'slug', current: product.slug },
    description: product.description || '',
    brand: product.brand || 'CNSS',
    category: product.category || 'Luxury Perfume',
    concentration: product.concentration || 'Eau De Parfum (EDP)',
    gender: product.gender || 'Unisex',
    notes: Array.isArray(product.notes) ? product.notes : [],
    price: Number(product.price) || 0,
    salePrice: Number(product.salePrice) || 0,
    discount: Number(product.discount) || 0,
    rating: Number(product.rating) || 4.5,
    reviewsCount: Number(product.reviewsCount) || 0,
    image: product.image || '',
    images: Array.isArray(product.images) ? product.images : [],
    inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
    isBestseller: Boolean(product.isBestseller),
    isNewArrival: Boolean(product.isNewArrival),
    hotspot: product.hotspot
      ? { x: Number(product.hotspot.x), y: Number(product.hotspot.y) }
      : { x: 50, y: 50 },
  };
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function importProducts() {
  // First verify connection
  console.log('🔗 Verifying Sanity connection...');
  try {
    await client.fetch('*[_type == "product"][0..0]');
    console.log('✅ Connection verified!\n');
  } catch (err) {
    if (err.statusCode === 401) {
      console.error('❌ Authentication failed — token is invalid or revoked.');
      console.error('   Generate a new token at: https://www.sanity.io/manage/personal/project/92sib1op/api#tokens');
      process.exit(1);
    }
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;
  const errors = [];
  const BATCH_SIZE = 25;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const transaction = client.transaction();

    for (const product of batch) {
      const doc = buildSanityDoc(product);
      transaction.createOrReplace(doc);
    }

    try {
      await transaction.commit();
      success += batch.length;
      const batchEnd = Math.min(i + BATCH_SIZE, products.length);
      console.log(`  ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: Imported products ${i + 1}–${batchEnd}`);
      // Log first few titles
      batch.slice(0, 3).forEach(p => console.log(`     → ${p.title}`));
      if (batch.length > 3) console.log(`     → ...and ${batch.length - 3} more`);
    } catch (err) {
      failed += batch.length;
      const errMsg = err.message || String(err);
      errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${errMsg}`);
      console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: ${errMsg}`);
    }

    if (i + BATCH_SIZE < products.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n${'─'.repeat(55)}`);
  if (success === products.length) {
    console.log(`🎉 All ${success} products imported successfully!`);
  } else {
    console.log(`📊 Import complete: ${success} succeeded, ${failed} failed`);
    errors.forEach(e => console.log(`   ❌ ${e}`));
  }
  console.log(`\n🔗 Sanity Studio: http://localhost:3000/studio`);
  console.log(`🔗 Sanity Manage: https://www.sanity.io/manage/personal/project/${PROJECT_ID}\n`);
}

importProducts().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
