// app/portfolio/[slug]/page.tsx --> ✅ Server Component

import React from "react";
import { notFound } from "next/navigation";
import { getSingleProductBySlug } from "@/lib/allApiRequest/productRequest/productRequest";
import { ProductType } from "@/Interfaces/productInterfaces";

import { generateMetadata as getProductMetadata } from "@/utils/seo/getMetaData";
import PageHeading from "@/components/CommonComponents/PageHeading";
import ProductDetailsContent from "@/components/ShopComponent/ProductDetailsContent";
import ReviewContent from "@/components/ShopComponent/ReviewContent";
import RelatedProducts from "@/components/ShopComponent/RelatedProducts";


export { getProductMetadata as generateMetadata };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getSingleProductBySlug(slug);
  const product = response?.data as ProductType;

  if (!product) {
    notFound();
  }

  return (
    <section className="max-w mx-auto p-2 pt-5">
      {/* ✅ Page Heading */}
      <PageHeading
        title="Details"
        isDetailsPage={true}
        subTitle={product?.title}
      />

      {/* ✅ JSON-LD Structured Data for SEO */}
     <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.title,
      image: Array.isArray(product.media)
        ? product.media.map((m) => m.url)
        : [],
      description: product.description,
      sku: product._id,
      brand: { "@type": "Brand", name: product.brand },
      offers: {
        "@type": "Offer",
        url: `https://www.tekzobd.com/portfolio/${product.slug}`,
        priceCurrency: "BDT",
        price: product.price,
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratings?.avg || 0,
        reviewCount: product.ratings?.count || 0,
      },
    }),
  }}
/>


      {/* ✅ Product Details */}
      <ProductDetailsContent product={product} />
      <ReviewContent product={product} />

      {/* ✅ Related Products */}
      <RelatedProducts
        productId={product?._id ? product._id.toString() : ""}
      />
    </section>
  );
}
