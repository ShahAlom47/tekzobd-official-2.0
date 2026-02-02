
import Loading from "@/app/loading";
import PageHeading from "@/components/CommonComponents/PageHeading";
import MobileScreenFilteringSection from "@/components/ShopComponent/MobileScreenFilteringSection";
import ProductCountInfo from "@/components/ShopComponent/ProductCountInfo";
import PublicPagePaginationButton from "@/components/ShopComponent/PublicPagePaginationButton";
import RecentViewProducts from "@/components/ShopComponent/RecentViewProducts";
import ShopFilterSidebar from "@/components/ShopComponent/ShopFilterSidebar";
import ShopProductGrid from "@/components/ShopComponent/ShopProductGrid";
import { SortOptions } from "@/Interfaces/productInterfaces";
import { getAllProduct } from "@/lib/allApiRequest/productRequest/productRequest";
import { Suspense } from "react";

interface Props {
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

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  // ✅ Constants
  const PRODUCT_LIMIT = 12;
  const currentPage = Number(params?.page) || 1;

  // ✅ Filters
  const filters = {
    sort: (params?.sort as SortOptions) || "asc",
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
      limit: PRODUCT_LIMIT,
      ...filters,
    });

    if (!response.success) {
      throw new Error(response.message || "Something went wrong.");
    }

    products = Array.isArray(response.data) ? response.data : [];
    total = response.totalData || 0;
    totalPages = Math.ceil(total / PRODUCT_LIMIT);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
  }

  return (
    <section className="max-w mx-auto md:p-6 p-2 py-7 md:space-y-8 space-y-2">
      {/* ✅ Page Heading */}
      <PageHeading title="Our Product" />

      {/* ✅ Product count */}
      <ProductCountInfo
        currentPage={currentPage}
        perPage={PRODUCT_LIMIT}
        total={total}
      />

      {/* ✅ Mobile filter */}
      <div className="md:hidden block">
        <MobileScreenFilteringSection />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
        {/* ✅ Products */}
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
              <Suspense fallback={<div className="text-center py-10"><Loading></Loading> Loading products...</div>}>
                <ShopProductGrid products={products} />
              </Suspense>

              {totalPages > 1 && (
                <PublicPagePaginationButton
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </div>

        {/* ✅ Desktop sidebar */}
        <div className="hidden md:block col-span-3 space-y-4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopFilterSidebar />
          </Suspense>
        </div>
      </div>

      {/* ✅ Recent viewed (mobile) */}
      <div className="block md:hidden">
        <RecentViewProducts />
      </div>
    </section>
  );
}
