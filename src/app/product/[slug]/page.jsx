import React from 'react';
import { getPerfumeBySlug, getPerfumes } from '../../../lib/sanity';
import ProductDetailView from '../../../components/ProductDetailView';
import { notFound } from 'next/navigation';

export const revalidate = 10;

// Generate static params for all products to enable instant load speeds
export async function generateStaticParams() {
  const products = await getPerfumes();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getPerfumeBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container section-padding">
      <ProductDetailView product={product} />
    </div>
  );
}
