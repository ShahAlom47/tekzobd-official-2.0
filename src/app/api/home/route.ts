// app/api/home/route.ts

import {
  getCategoryCollection,
  getProductCollection,
} from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoryCollection = await getCategoryCollection();
    const productCollection = await getProductCollection();

    const categories = await categoryCollection.find({}).limit(1000).toArray();

    // ২. টপ রেটেড প্রোডাক্ট (rating.avg DESC, limit 5)
    const topRatedProducts = await productCollection
      .find({ isPublished: true, "ratings.avg": { $gte: 3 } })
      .sort({ "ratings.avg": -1 })
      .limit(5)
      .toArray();



    const activeOfferProducts = await productCollection
      .find({
        isPublished: true,
        "offer.isActive": true,
        discount: { $gt: 0 },
        // "offer.startDate": { $lte: now },
        // "offer.endDate": { $gte: now },
      })
      .sort({ createdAt: -1 })
      // .limit(5)
      .toArray();

    // ৪. Best Selling Products (soldCount DESC, limit 5)
    const bestSellingProducts = await productCollection
      .find({ isPublished: true, soldCount: { $exists: true } })
      //   .sort({ soldCount: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      data: {
        categories,
        topRatedProducts,
        activeOfferProducts,
        bestSellingProducts,
      },
      message: "Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
