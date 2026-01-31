import HomePageProductFilter from "@/components/HomePageProductFilter";
import HomeSecHeading from "@/components/HomeSecHeading";
import MobileScreenFilteringSection from "@/components/MobileScreenFilteringSection";
import PageHeading from "@/components/PageHeading";
import ProductCountInfo from "@/components/ProductCountInfo";
import PublicPagePaginationButton from "@/components/PublicPagePaginationButton";
import RecentViewProducts from "@/components/RecentViewProducts";
import ShopFilterSidebar from "@/components/ShopFilterSidebar";
import ShopProductGrid from "@/components/ShopProductGrid";
import { SortOptions } from "@/Interfaces/productInterfaces";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  isHomePage?: boolean;
  searchParams?: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: string;
    brand?: string;
    rating?: string;
    sort?: SortOptions;
    searchTrim?: string;
    stock?: "in-stock" | "out-of-stock";
  }>;
}

export default async function ShopPage({ searchParams, isHomePage }: Props) {
  const params = await searchParams;

  // ✅ Constants
  const HOMEPAGE_PRODUCT_LIMIT = 12;
  const SHOPPAGE_PRODUCT_LIMIT = 12;
  const limit = isHomePage ? HOMEPAGE_PRODUCT_LIMIT : SHOPPAGE_PRODUCT_LIMIT;
  const currentPage = Number(params?.page) || 1;

  // ✅ Extract filters
  const filters = {
    sort: (params?.sort as SortOptions) ||(isHomePage ? "newest" : "asc"),
    minPrice: params?.minPrice,
    maxPrice: params?.maxPrice,
    category: params?.category,
    brand: params?.brand,
    rating: params?.rating,
    searchTrim: params?.searchTrim,
    stock: params?.stock,
  };

  // ✅ Data state
  let products = [];
  let total = 0;
  let totalPages = 0;
  let errorMessage = "";

  try {
    const response = await getAllProduct({
      currentPage,
      limit,
      ...filters,
    });

    if (!response.success) {
      throw new Error(response.message || "Something went wrong.");
    }

    products = Array.isArray(response.data) ? response.data : [];
    total = response.totalData || 0;
    totalPages = Math.ceil(total / limit);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
  }

  return (
    <section className="max-w  mx-auto md:p-6 p-2 py-7  relative md:space-y-8 space-y-2">
      {!isHomePage ? (
        <PageHeading title="Our Product" />
      ) : (
        <HomeSecHeading animation={true} className="my-5 ">
          Our Products
        </HomeSecHeading>
      )}

      {isHomePage ? (
        <HomePageProductFilter />
      ) : (
        <ProductCountInfo
          currentPage={currentPage}
          perPage={limit}
          total={total}
        />
      )}

      {!isHomePage && (
        <div className="md:hidden block">
          <MobileScreenFilteringSection />
        </div>
      )}

      <div
        className={`${
          isHomePage ? "" : "grid"
        } grid-cols-1 md:grid-cols-12 gap-6 my-6`}
      >
        <div className="md:col-span-9 space-y-6">
          {errorMessage ? (
            <div className="text-red-600 text-lg font-semibold">
              {errorMessage}
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-600 text-lg font-medium my-6">
              No products found matching your filters.
            </div>
          ) : (
            <>
              <Suspense fallback={<div>Loading products...</div>}>
                <ShopProductGrid products={products} />
              </Suspense>

              {isHomePage ? (
                <div className="flex items-center justify-center w-full">
                  <Link href="/shop" className="btn-bordered">
                    See More
                  </Link>
                </div>
              ) : (
                totalPages > 1 && (
                  <PublicPagePaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                )
              )}
            </>
          )}
        </div>

        {!isHomePage && (
          <div className="hidden md:block col-span-3 space-y-4">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ShopFilterSidebar />
            </Suspense>
          </div>
        )}
      </div>
      {!isHomePage && (
        <div className="block md:hidden">
          <RecentViewProducts />
        </div>
      )}
    </section>
  );
}
