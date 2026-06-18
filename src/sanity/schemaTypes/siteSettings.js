import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: '⚙️ Site Settings',
  type: 'document',
  fields: [
    // ── BRANDING ──────────────────────────────────────────────────────────
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'ISHAYA LUXURY',
      description: 'The main display text for the brand logo.',
    }),
    defineField({
      name: 'brandSubtitle',
      title: 'Brand Subtitle',
      type: 'string',
      initialValue: 'Perfumes',
      description: 'The secondary text under the logo.',
    }),
    defineField({
      name: 'logoUpload',
      title: 'Brand Logo Upload',
      type: 'image',
      description: 'Upload a brand logo file. Recommended size: height 58px (responsive auto width). Supports PNG, SVG, or JPG.',
    }),

    // ── HEADER ────────────────────────────────────────────────────────────
    defineField({
      name: 'announcements',
      title: 'Announcements Bar Rotation',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rotating promos showing at the top bar.',
    }),
    defineField({
      name: 'searchPlaceholders',
      title: 'Search Input Placeholders',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Typing effects shown in the search bar placeholder list.',
    }),

    // ── HERO BANNER ───────────────────────────────────────────────────────
    defineField({
      name: 'heroSlides',
      title: 'Home Page Hero Banners',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Hero Slide',
          fields: [
            { name: 'tagline', title: 'Tagline Overlay', type: 'string' },
            { name: 'title', title: 'Banner Title', type: 'string' },
            { name: 'desc', title: 'Short Description', type: 'text', rows: 3 },
            { name: 'link', title: 'CTA Link Target', type: 'string', description: 'e.g. /#bestsellers' },
            { name: 'btnText', title: 'CTA Button Text', type: 'string', description: 'e.g. Explore Collection' },
            { 
              name: 'imageUpload', 
              title: 'Slide Background Image Upload', 
              type: 'image',
              options: { hotspot: true },
              description: 'Banner cover background image. Recommended size: 1600x700 px (panoramic / landscape aspect ratio).' 
            },
            { 
              name: 'imageUrl', 
              title: 'Slide Background Image URL Fallback', 
              type: 'url',
              description: 'Alternative: Paste external image URL.'
            }
          ]
        }
      ]
    }),

    defineField({
      name: 'scentSubtitle',
      title: 'Scent Families Section Subtitle',
      type: 'string',
      initialValue: 'Find Your Signature',
    }),
    defineField({
      name: 'scentTitle',
      title: 'Scent Families Section Title',
      type: 'string',
      initialValue: 'Shop By Fragrance Family',
    }),
    defineField({
      name: 'scentDescription',
      title: 'Scent Families Section Description',
      type: 'text',
      rows: 2,
      initialValue: 'Each scent family tells a different story. Discover yours.',
    }),

    // ── SCENT CATEGORIES ──────────────────────────────────────────────────
    defineField({
      name: 'scentCategories',
      title: 'Home Page Scent Families',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Scent Family',
          fields: [
            { name: 'name', title: 'Family Name', type: 'string' },
            { name: 'description', title: 'Count/Sub-description', type: 'string', description: 'e.g. 12 fragrances' },
            { name: 'emoji', title: 'Icon Emoji', type: 'string', description: 'e.g. 🌳, 🌸, 🌊' },
            { 
              name: 'imageUpload', 
              title: 'Category Card Image Upload', 
              type: 'image',
              options: { hotspot: true },
              description: 'Category card showcase image. Recommended size: 600x800 px (3:4 portrait aspect ratio).' 
            },
            { 
              name: 'imageUrl', 
              title: 'Category Card Image URL Fallback', 
              type: 'url',
              description: 'Alternative: Paste external image URL.'
            },
            { name: 'href', title: 'Navigation Link', type: 'string', description: 'e.g. /shop?scent=woody-oud' },
            { name: 'tagline', title: 'CTA Tagline', type: 'string', description: 'e.g. Deep. Earthy. Timeless.' }
          ]
        }
      ]
    }),

    // ── TRUST / WHY CHOOSE US ─────────────────────────────────────────────
    defineField({
      name: 'whyChooseUs',
      title: 'Home Page Why Choose Us',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Trust Highlight Card',
          fields: [
            {
              name: 'iconType',
              title: 'Premium Icon Selection',
              type: 'string',
              description: 'Select a premium vector icon to display (e.g. Crown, Flask, Gift Box, Shield, Leaf, Sparkles).',
              options: {
                list: [
                  { title: 'Crown (Luxury)', value: 'crown' },
                  { title: 'Flask (Botanical Formulas)', value: 'flask' },
                  { title: 'Gift Box (Royal Packaging)', value: 'gift' },
                  { title: 'Shield (Trust & Quality)', value: 'shield' },
                  { title: 'Leaf (Organic & Clean)', value: 'leaf' },
                  { title: 'Sparkles (Premium Essence)', value: 'sparkles' },
                  { title: 'Legacy / None (Uses Emoji)', value: 'legacy' }
                ],
                layout: 'dropdown'
              },
              initialValue: 'legacy'
            },
            {
              name: 'iconUpload',
              title: 'Custom Vector / Image Icon',
              type: 'image',
              options: { hotspot: true },
              description: 'Optional: Upload a custom premium SVG or PNG icon to override standard selectors.'
            },
            {
              name: 'emoji',
              title: 'Legacy Emoji',
              type: 'string',
              description: 'Used as fallback if no Premium Icon is selected or custom icon is uploaded (e.g. 👑, 🧪, 📦).'
            },
            { name: 'title', title: 'Highlight Title', type: 'string' },
            { name: 'desc', title: 'Detailed Explanation', type: 'text', rows: 2 }
          ]
        }
      ]
    }),

    // ── SHOP THE LOOK ─────────────────────────────────────────────────────
    defineField({
      name: 'shopTheLookImageUpload',
      title: 'Shop-The-Look Flatlay Image Upload',
      type: 'image',
      options: { hotspot: true },
      description: 'The background image for the visual hotspot finder. Recommended size: 1200x750 px (16:10 aspect ratio).'
    }),
    defineField({
      name: 'shopTheLookImageUrl',
      title: 'Shop-The-Look Flatlay Image URL Fallback',
      type: 'url',
      description: 'Alternative: Paste external image URL.'
    }),

    // ── TESTIMONIALS ──────────────────────────────────────────────────────
    defineField({
      name: 'testimonials',
      title: 'Home Page Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Customer Quote',
          fields: [
            { name: 'text', title: 'Quote Message', type: 'text', rows: 3 },
            { name: 'author', title: 'Customer Name / Title', type: 'string' }
          ]
        }
      ]
    }),

    // ── SHOP PAGE ──────────────────────────────────────────────────────────
    defineField({
      name: 'shopSubtitle',
      title: 'Shop Page Category Label',
      type: 'string',
      initialValue: 'Explore Ishaya Catalog',
    }),
    defineField({
      name: 'shopTitle',
      title: 'Shop Page Title',
      type: 'string',
      initialValue: 'The Fragrance Chamber',
    }),

    // ── FOOTER ────────────────────────────────────────────────────────────
    defineField({
      name: 'footerDesc',
      title: 'Footer Brand Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'footerInstagram',
      title: 'Footer Social Link (Instagram)',
      type: 'url',
    }),
    defineField({
      name: 'footerFacebook',
      title: 'Footer Social Link (Facebook)',
      type: 'url',
    }),
    defineField({
      name: 'footerYoutube',
      title: 'Footer Social Link (Youtube)',
      type: 'url',
    }),
    defineField({
      name: 'footerTwitter',
      title: 'Footer Social Link (Twitter)',
      type: 'url',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Footer Copyright Notice Text',
      type: 'string',
    }),
    defineField({
      name: 'footerTrustItems',
      title: 'Footer Trust Badges Checkmarks',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Checkmarks listed right above the footer copyright info.',
    }),

    // ── WHATSAPP INTEGRATION ──────────────────────────────────────────────
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Contact Number',
      type: 'string',
      initialValue: '+919876543210',
      description: 'WhatsApp number of the administrator (with country code, e.g., +919876543210).',
    }),
    defineField({
      name: 'whatsappWelcome',
      title: 'WhatsApp Welcome Greeting',
      type: 'string',
      initialValue: 'Hello! Welcome to Ishaya Luxury Perfumes. How can we assist you today?',
      description: 'The greeting text displayed inside the chat popup.',
    }),
    defineField({
      name: 'whatsappQuestions',
      title: 'WhatsApp Predefined Questions',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'Help me find the right fragrance for me!',
        'Is cash on delivery (COD) available?',
        'How can I track my perfume order?',
        'Are your perfumes long-lasting?'
      ],
      description: 'Quick clickable options for the user to prefill their chat message (3-4 questions).',
    }),
  ],
});
