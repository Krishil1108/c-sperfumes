import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixImages() {
  try {
    // Fetch siteSettings
    const settings = await client.fetch('*[_type == "siteSettings"][0]');
    
    if (!settings) {
      console.log('No siteSettings document found.');
      return;
    }

    if (!settings.scentCategories) {
      console.log('No scentCategories array found in siteSettings.');
      return;
    }

    let updated = false;
    const newCategories = settings.scentCategories.map(cat => {
      // Fix Floral Bouquet
      if (cat.imageUrl === 'https://images.unsplash.com/photo-1496062031256-47a19d8207e7?auto=format&fit=crop&w=600&q=80') {
        cat.imageUrl = 'https://images.unsplash.com/photo-1595425970377-c9703c48657a?auto=format&fit=crop&w=600&q=80';
        updated = true;
      }
      // Fix Amber & Musk
      if (cat.imageUrl === 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80') {
        cat.imageUrl = 'https://images.unsplash.com/photo-1594035910387-fea47714263f?auto=format&fit=crop&w=600&q=80';
        updated = true;
      }
      return cat;
    });

    if (updated) {
      console.log('Found broken URLs in Sanity! Patching document...');
      await client.patch(settings._id)
        .set({ scentCategories: newCategories })
        .commit();
      console.log('Successfully updated siteSettings in Sanity CMS.');
    } else {
      console.log('No matching broken URLs found in Sanity scentCategories.');
    }

  } catch (error) {
    console.error('Error fixing Sanity images:', error);
  }
}

fixImages();
