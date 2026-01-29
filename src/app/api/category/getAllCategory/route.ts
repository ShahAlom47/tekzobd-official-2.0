import { getCategoryCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";


// GET: Get all categories (with optional search and pagination)
export async function GET(req: NextRequest) {
  try {
    const collection = await getCategoryCollection();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim() || "";

    const filter = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { parentCategory: { $regex: search, $options: "i" } },
      ]
    } : {};

    const total = await collection.countDocuments(filter);
    const data = await collection.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch  {
    return NextResponse.json({
      message: "Failed to fetch categories",
      success: false,
    }, { status: 500 });
  }
}
