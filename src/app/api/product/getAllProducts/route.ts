/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCategoryCollection,
  getProductCollection,
} from "@/lib/database/db_collections";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/authOptions/authOptions";
import { SortOptions } from "@/Interfaces/productInterfaces";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productCollection = await getProductCollection();
    const session = await getServerSession(authOptions);
    const user = session?.user || null;
    const isDashboard = req.headers.get("x-from-dashboard") === "true";
    const isPublic = !isDashboard || !user;

    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    );
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    const searchTrim =
      url.searchParams.get("searchTrim")?.trim().toLowerCase() || "";
    const sort =
      (url.searchParams.get("sort") as SortOptions | "offer") || "asc";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const categorySlug = url.searchParams.get("category"); // এখানে slug আসবে
    const brand = url.searchParams.get("brand");
    const rating = url.searchParams.get("rating");
    const offerOnly = url.searchParams.get("offerOnly") === "true";

    const stockParam = url.searchParams.get("stock"); // "in-stock", "out-of-stock", or null

//     productCollection.updateMany(
//   { price: { $type: "string" } },
//   [
//     {
//       $set: {
//         price: { $toDouble: "$price" }
//       }
//     }
//   ]
// );


    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { message: "Invalid query parameters", success: false },
        { status: 400 }
      );
    }

    // 🗂 Get category ID from slug, if categorySlug exists
    let categoryId: string | null = null;
    if (categorySlug) {
      const categoryCollection = await getCategoryCollection();
      const categoryDoc = await categoryCollection.findOne({
        slug: categorySlug,
      });

      if (categoryDoc) {
        if (typeof categoryDoc._id === "string") {
          categoryId = categoryDoc._id;
        } else {
          categoryId = categoryDoc?._id.toString();
        }
      }
    }

    const filter: any = {};

    // Public users only see published products
    if (isPublic) {
      filter.isPublished = true;
    }

    // Search filter


if (searchTrim) {
  const orConditions: any[] = [
    { title: { $regex: searchTrim, $options: "i" } },
    { slug: { $regex: searchTrim, $options: "i" } },
    { description: { $regex: searchTrim, $options: "i" } },
    { "sourceInfo.supplierName": { $regex: searchTrim, $options: "i" } },
    { "sourceInfo.productSourceLink": { $regex: searchTrim, $options: "i" } },
    { "sourceInfo.supplierProductId": { $regex: searchTrim, $options: "i" } },
    { "sourceInfo.returnPolicy": { $regex: searchTrim, $options: "i" } },
    { "sourceInfo.deliveryTime": { $regex: searchTrim, $options: "i" } },
  ];

  // ObjectId হিসেবে search
  try {
    const id = new ObjectId(searchTrim);
    orConditions.push({ _id: id });
  } catch  {
    // invalid ObjectId ignore
  }

  filter.$or = orConditions;
}


    // Price filter

    if (minPrice || maxPrice) {
  filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
}


    // Stock filter
    if (stockParam === "in-stock") {
      filter.stock = { $gt: 0 };
    } else if (stockParam === "out-of-stock") {
      filter.stock = { $lte: 0 };
    } else if (stockParam && !isNaN(Number(stockParam))) {
      // যদি stockParam একটা সংখ্যা হয়
      const numericStock = Number(stockParam);
      filter.stock = { $gte: numericStock };
    }
    // Important: filter by categoryId instead of slug
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (brand && brand !== "All Brands") {
      const brandTrim = brand.trim().toLowerCase();
      const brandRegex = { $regex: brandTrim, $options: "i" };

      // Inject brand search into the existing $or OR create new $or
      const brandSearchConditions = [
        { title: brandRegex },
        { description: brandRegex },
        { "sourceInfo.supplierName": brandRegex },
      ];

      if (filter.$or && Array.isArray(filter.$or)) {
        filter.$or.push(...brandSearchConditions);
      } else {
        filter.$or = brandSearchConditions;
      }
    }
    if (rating) filter["ratings.avg"] = { $gte: Number(rating) };

    // Offer logic
    const now = new Date();
    const isoNow = now.toISOString();

    if (offerOnly || sort === "offer") {
      filter["offer.isActive"] = true;
      filter["offer.startDate"] = { $lte: isoNow };
      filter["offer.endDate"] = { $gte: isoNow };
    }

    // Sorting logic
    const sortQuery: any = {};
    if (isDashboard) sortQuery.createdAt = -1;
    else if (sort === "asc") sortQuery.price = 1;
    else if (sort === "desc") sortQuery.price = -1;
    else if (sort === "newest") sortQuery.createdAt = -1;
    else if (sort === "popular") sortQuery["ratings.count"] = -1;
   
    if (offerOnly || sort === "offer") {
      filter["offer.isActive"] = true;
      filter["offer.startDate"] = { $lte: isoNow };
      filter["offer.endDate"] = { $gte: isoNow };
    }

    const [data, total] = await Promise.all([
      productCollection
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      productCollection.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Products retrieved successfully",
        data,
        totalData: total,
        currentPage,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
