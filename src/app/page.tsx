

// import UnderConstructionBanner from "@/components/CommonComponents/UnderConstructionBanner";
import ActiveOfferProducts from "@/components/HomeComponent/ActiveOfferProducts";
import Banner from "@/components/HomeComponent/Banner";
import CategorySection from "@/components/HomeComponent/HomeCategorySection";
import TopRatedProducts from "@/components/HomeComponent/TopRatedProducts";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { ProductType } from "@/Interfaces/productInterfaces";
import { getHomeData } from "@/lib/allApiRequest/homeDataRequest/homeDataRequest";


interface HomeDataType {
  topRatedProducts: ProductType[];
  activeOfferProducts: ProductType[];
  bestSellingProducts: ProductType[];
  categories: CategoryType[];
}

const Home = async () => {
  let homeData: HomeDataType | null = null;

  try {
    const res = await getHomeData();
    homeData = res?.data as HomeDataType;
  } catch (error) {
    console.error("Home data fetch failed", error);
    // Optional: You can show a toast here or log to monitoring tools
  }

  const topRatedProducts = homeData?.topRatedProducts || [];
  const activeOfferProducts = homeData?.activeOfferProducts || [];
  const categories = homeData?.categories || [];
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen py-2">
      {/* <UnderConstructionBanner /> */}
      <Banner />
        {/* Only render if data is available, else skip section */}
      {categories.length > 0 && <CategorySection categories={categories} />}

       {activeOfferProducts.length > 0 && (
        <ActiveOfferProducts products={activeOfferProducts} />
      )}

      {topRatedProducts.length > 0 && (
        <TopRatedProducts products={topRatedProducts} />
      )}


    </div>  
  );
}


export default Home;