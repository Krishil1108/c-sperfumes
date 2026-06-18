import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Perfume Product',
  type: 'document',
  icon: () => '🌸',
  groups: [
    { name: 'identity', title: '📦 Identity & Pricing', default: true },
    { name: 'media', title: '🖼️ Media & Gallery' },
    { name: 'attributes', title: '🧪 Attributes & Notes' },
    { name: 'merchandising', title: '🏷️ Merchandising & Flags' },
    { name: 'stl', title: '📍 Shop The Look' },
  ],
  fields: [
    // ── IDENTITY & PRICING ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      group: 'identity',
      validation: Rule => Rule.required().min(3).max(200),
      description: 'Full display name of the product.',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title', maxLength: 120 },
      validation: Rule => Rule.required(),
      description: 'Auto-generated from title. Used in product URLs.',
    }),
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'text',
      group: 'identity',
      rows: 5,
      description: 'Full product description shown on the detail page.',
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      group: 'identity',
      description: 'Designer brand or house.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'identity',
      initialValue: 'Luxury Perfume',
      description: 'Internal category / fulfillment channel.',
    }),
    defineField({
      name: 'price',
      title: 'Original MRP (₹)',
      type: 'number',
      group: 'identity',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price (₹)',
      type: 'number',
      group: 'identity',
      validation: Rule => Rule.required().positive(),
    }),
    defineField({
      name: 'discount',
      title: 'Discount %',
      type: 'number',
      group: 'identity',
      initialValue: 0,
      validation: Rule => Rule.min(0).max(100),
    }),

    // ── MEDIA ──────────────────────────────────────────────────────────
    defineField({
      name: 'imageUpload',
      title: 'Primary Product Image Upload',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description: 'Upload primary display image. Recommended size: 1000x1000 px (1:1 square ratio).',
    }),
    defineField({
      name: 'image',
      title: 'Primary Product Image URL Fallback',
      type: 'url',
      group: 'media',
      description: 'Alternative: Paste external image URL (if not uploading a file).',
    }),
    defineField({
      name: 'imagesUploads',
      title: 'Gallery Images Uploads',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload additional gallery images. Recommended size: 1000x1000 px (1:1 square ratio).',
    }),
    defineField({
      name: 'images',
      title: 'Gallery Image URLs Fallback',
      type: 'array',
      group: 'media',
      of: [{ type: 'url' }],
      description: 'Alternative: Paste external gallery URLs.',
    }),

    // ── ATTRIBUTES & NOTES ─────────────────────────────────────────────
    defineField({
      name: 'concentration',
      title: 'Concentration',
      type: 'string',
      group: 'attributes',
      description: 'Perfume concentration type.',
    }),
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      group: 'attributes',
      options: {
        list: [
          { title: 'Men', value: 'Men' },
          { title: 'Women', value: 'Women' },
          { title: 'Unisex', value: 'Unisex' },
        ],
        layout: 'radio',
      },
      initialValue: 'Unisex',
    }),
    defineField({
      name: 'notes',
      title: 'Scent Notes / Accords',
      type: 'array',
      group: 'attributes',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Citrus', 'Bergamot', 'Mandarin', 'Lemon', 'Grapefruit',
          'Floral', 'Rose', 'Jasmine', 'Orchid', 'Lily', 'Violet',
          'Woody', 'Oud', 'Sandalwood', 'Cedarwood', 'Patchouli',
          'Sweet', 'Vanilla', 'Musk', 'Amber', 'Caramel',
          'Aquatic', 'Fresh', 'Sea Breeze',
          'Spicy', 'Pepper', 'Cardamom', 'Cinnamon', 'Saffron',
          'Earthy', 'Vetiver', 'Moss', 'Leather',
        ],
      },
      description: 'Top/heart/base note accords (select from list or type custom).',
    }),
    defineField({
      name: 'rating',
      title: 'Average Rating (0–5)',
      type: 'number',
      group: 'attributes',
      initialValue: 4.5,
      validation: Rule => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewsCount',
      title: 'Total Reviews Count',
      type: 'number',
      group: 'attributes',
      initialValue: 0,
      validation: Rule => Rule.min(0),
    }),

    // ── MERCHANDISING & FLAGS ──────────────────────────────────────────
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      group: 'merchandising',
      initialValue: true,
      description: 'Toggle to mark as sold out.',
    }),
    defineField({
      name: 'isBestseller',
      title: '🏆 Bestseller Badge',
      type: 'boolean',
      group: 'merchandising',
      initialValue: false,
      description: 'Show this in the Bestsellers tab on the homepage.',
    }),
    defineField({
      name: 'isNewArrival',
      title: '✨ New Arrival Badge',
      type: 'boolean',
      group: 'merchandising',
      initialValue: false,
      description: 'Show this in the New Arrivals tab on the homepage.',
    }),

    // ── SHOP THE LOOK ──────────────────────────────────────────────────
    defineField({
      name: 'hotspot',
      title: 'Shop-The-Look Hotspot Position',
      type: 'object',
      group: 'stl',
      description: 'Pin position on the lifestyle image (percentage from top-left).',
      fields: [
        defineField({ name: 'x', title: 'X Position % (left→right)', type: 'number', validation: Rule => Rule.min(0).max(100) }),
        defineField({ name: 'y', title: 'Y Position % (top→bottom)', type: 'number', validation: Rule => Rule.min(0).max(100) }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      brand: 'brand',
      media: 'image',
      inStock: 'inStock',
      isBestseller: 'isBestseller',
    },
    prepare({ title, brand, inStock, isBestseller }) {
      const flags = [
        !inStock ? '🔴 OOS' : '🟢 In Stock',
        isBestseller ? '🏆' : '',
      ].filter(Boolean).join(' ');
      return {
        title: title,
        subtitle: `${brand || 'Unknown Brand'} · ${flags}`,
      };
    },
  },

  orderings: [
    { title: 'Title A→Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Price: Low→High', name: 'priceLow', by: [{ field: 'salePrice', direction: 'asc' }] },
    { title: 'Price: High→Low', name: 'priceHigh', by: [{ field: 'salePrice', direction: 'desc' }] },
    { title: 'Top Rated', name: 'ratingDesc', by: [{ field: 'rating', direction: 'desc' }] },
  ],
});
