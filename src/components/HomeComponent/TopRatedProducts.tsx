"use client";

import { ProductType } from "@/Interfaces/productInterfaces";
import { useRouter } from "next/navigation";
import HomeSecHeading from "../CommonComponents/HomeSecHeading";
import SafeImage from "../CommonComponents/SafeImage";

type Props = {
  products: ProductType[];
};

const TopRatedProducts = ({ products }: Props) => {
  const router = useRouter();
  // Filter and sort products by rating (descending), then by creation date (newest)
  const topRated = [...products]

    .sort((a, b) => {
      if (b.ratings.avg === a.ratings.avg) {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      return b.ratings.avg - a.ratings.avg;
    })
    .slice(0, 10); // Show max 10

  if (topRated.length === 0) {
    return (
      <section className="py-12 text-center text-gray-500">
        <p>No top rated products found.</p>
      </section>
    );
  }

  const handleCardClick = (slug:string) => {
    router.push(`/shop/${slug}`);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeSecHeading>Top Rated Products</HomeSecHeading>

        <div className="flex justify-center items-center my-5">
          <div
            className={`
              grid gap-6
              grid-cols-1
              justify-center
              sm:grid-cols-2
              md:grid-cols-${Math.min(topRated.length, 3)}
              lg:grid-cols-${Math.min(topRated.length, 4)}
              xl:grid-cols-${Math.min(topRated.length, 5)}
            `}
          >
            {topRated.map((product) => (
              <div
                onClick={()=>handleCardClick(product?.slug)}
                key={product._id.toString()}
                className="bg-white cursor-pointer rounded-sm shadow-md hover:shadow-xl transition-all duration-300 p-3 border border-brandPrimary hover:border-primary/40 group text-center"
              >
                <div className="relative overflow-hidden rounded-sm mb-3">
                  <SafeImage
                    src={product.media[0]?.url || "/placeholder.png"}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="object-contain mx-auto w-full h-[150px] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold mb-1 line-clamp-2 text-gray-800 group-hover:text-primary">
                  {product.title}
                </h3>
                <p className="text-sm text-yellow-500 font-bold">
                  ⭐ {product.ratings.avg.toFixed(1)} ({product.ratings.count})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedProducts;
