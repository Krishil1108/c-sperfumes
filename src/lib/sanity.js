import { createClient } from '@sanity/client';
import mockProducts from '../../data/mockProducts.json';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '92sib1op';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

let client = null;
let isDemoMode = true;

if (projectId && projectId !== 'mock_project_id') {
  try {
    client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
    isDemoMode = false;
  } catch (err) {
    console.warn('Failed to initialize Sanity Client, switching to Demo Mode.', err);
  }
}

export function getSanityStatus() {
  return { isDemoMode, projectId };
}

const PRODUCT_FIELDS = `
  "id": _id,
  title,
  "slug": slug.current,
  description,
  brand,
  category,
  concentration,
  gender,
  notes,
  price,
  salePrice,
  discount,
  rating,
  reviewsCount,
  image,
  images,
  inStock,
  isBestseller,
  isNewArrival,
  hotspot { x, y }
`;

export async function getPerfumes() {
  if (isDemoMode || !client) {
    console.log('Serving perfumes from Local Mock Database (Demo Mode)...');
    return mockProducts;
  }

  try {
    const query = `*[_type == "product"] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`;
    const data = await client.fetch(query);
    if (data && data.length > 0) {
      return data;
    }
    console.log('Sanity dataset is empty, falling back to Mock Database...');
    return mockProducts;
  } catch (err) {
    console.error('Sanity query failed, falling back to Mock Database:', err);
    return mockProducts;
  }
}

export async function getPerfumeBySlug(slug) {
  if (isDemoMode || !client) {
    return mockProducts.find(p => p.slug === slug) || null;
  }

  try {
    const query = `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`;
    const data = await client.fetch(query, { slug });
    return data || mockProducts.find(p => p.slug === slug) || null;
  } catch (err) {
    console.error(`Sanity query failed for slug ${slug}, falling back to Mock Database:`, err);
    return mockProducts.find(p => p.slug === slug) || null;
  }
}
