import { Metadata } from "next";
import { getSingleProductBySlug } from "@/lib/allApiRequest/productRequest/productRequest";
import { ProductType } from "@/Interfaces/productInterfaces";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const response = await getSingleProductBySlug(slug);
  const product = response?.data as ProductType;

  if (!product) {
    return { title: "Product Not Found", description: "This product is not available." };
  }

  return {
    title: product.seo?.metaTitle || product.title,
    description: product.seo?.metaDescription || product.description,
    keywords: product.seo?.metaKeywords || [product.title, product.brand, ...(product.title.split(" ") || [])],
    alternates: { canonical: product.seo?.canonicalUrl || `https://www.tekzobd.com/portfolio/${product.slug}` },
    
    // 🔹 Add Open Graph
    openGraph: {
      title: product.seo?.metaTitle || product.title,
      description: product.seo?.metaDescription || product.description,
      url: product.seo?.canonicalUrl || `https://www.tekzobd.com/shop/${product.slug}`,
      type: "website",
      images: [
        {
          url: Array.isArray(product.media) && product.media.length ? product.media[0].url : "/default-logo.jpg",
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}
