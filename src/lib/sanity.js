import { dbService } from './db';

// Redirect all data query calls from Sanity to our new Firebase/LocalStorage database manager (dbService)
export function getSanityStatus() {
  return { isDemoMode: true, projectId: 'firebase' };
}

export async function getPerfumes() {
  return await dbService.getPerfumes();
}

export async function getPerfumeBySlug(slug) {
  return await dbService.getPerfumeBySlug(slug);
}

export async function getSiteSettings() {
  return await dbService.getSiteSettings();
}

export async function getOrders() {
  return await dbService.getOrders();
}
