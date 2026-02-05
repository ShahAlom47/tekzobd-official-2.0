

// import UnderConstructionBanner from "@/components/CommonComponents/UnderConstructionBanner";
import Banner from "@/components/home/Banner";
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

    </div>  
  );
}


export default Home;