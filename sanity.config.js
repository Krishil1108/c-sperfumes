import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './src/sanity/schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '92sib1op';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  basePath: '/studio',
  name: 'ishaya_luxury_studio',
  title: '✨ Ishaya Luxury — Admin Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Ishaya Luxury CMS')
          .items([
            S.listItem()
              .title('⚙️ Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
            S.divider(),
            S.listItem()
              .title('🌸 All Products')
              .schemaType('product')
              .child(
                S.documentList()
                  .title('All Products')
                  .filter('_type == "product"')
              ),
            S.divider(),
            S.listItem()
              .title('🏆 Bestsellers')
              .child(
                S.documentList()
                  .title('Bestsellers')
                  .filter('_type == "product" && isBestseller == true')
              ),
            S.listItem()
              .title('✨ New Arrivals')
              .child(
                S.documentList()
                  .title('New Arrivals')
                  .filter('_type == "product" && isNewArrival == true')
              ),
            S.listItem()
              .title('🔴 Out of Stock')
              .child(
                S.documentList()
                  .title('Out of Stock')
                  .filter('_type == "product" && inStock == false')
              ),
            S.listItem()
              .title('🟢 In Stock')
              .child(
                S.documentList()
                  .title('In Stock')
                  .filter('_type == "product" && inStock == true')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema,
});
