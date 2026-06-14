import React from 'react';
import { getPerfumes } from '../../lib/sanity';
import ShopPageView from '../../components/ShopPageView';

export const revalidate = 10;

export default async function ShopPage() {
  const products = await getPerfumes();

  return (
    <div className="container section-padding">
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: '600', letterSpacing: '0.2em' }}>
          Explore Aura Catalog
        </span>
        <h1 style={{ fontSize: '38px', marginTop: '8px' }}>The Fragrance Chamber</h1>
      </div>
      <ShopPageView products={products} />
    </div>
  );
}
