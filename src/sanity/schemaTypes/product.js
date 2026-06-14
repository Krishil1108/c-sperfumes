export const productType = {
  name: 'product',
  title: 'Perfume Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Luxury Perfume',
    },
    {
      name: 'notes',
      title: 'Scent Notes',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'price',
      title: 'Base Price (Original)',
      type: 'number',
      validation: Rule => Rule.required(),
    },
    {
      name: 'salePrice',
      title: 'Sale Price',
      type: 'number',
      validation: Rule => Rule.required(),
    },
    {
      name: 'discount',
      title: 'Discount Percentage',
      type: 'number',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 4.5,
    },
    {
      name: 'reviewsCount',
      title: 'Reviews Count',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'image',
      title: 'Primary Product Image URL',
      type: 'url',
      description: 'URL to primary product card image (external or local fallback)',
    },
    {
      name: 'images',
      title: 'Gallery Image URLs',
      type: 'array',
      of: [{ type: 'url' }],
    },
    {
      name: 'isBestseller',
      title: 'Bestseller Badge',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isNewArrival',
      title: 'New Arrival Badge',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'hotspot',
      title: 'Shop The Look Hotspot Coordinate',
      type: 'object',
      fields: [
        { name: 'x', title: 'X Coordinate % (0-100)', type: 'number' },
        { name: 'y', title: 'Y Coordinate % (0-100)', type: 'number' }
      ]
    }
  ]
};
