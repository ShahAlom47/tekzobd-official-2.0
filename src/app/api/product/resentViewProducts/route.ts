// /api/product/recentViewProducts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll("ids");

  if (!ids.length) {
    return NextResponse.json(
      { message: "No product IDs provided", success: false },
      { status: 400 }
    );
  }

  const productCollection = await getProductCollection();

  // MongoDB ObjectId ব্যবহার করা হলে:
  const objectIds = ids.map((id) => new ObjectId(id));
  const products = await productCollection
    .find({ _id: { $in: objectIds } })
    .toArray();

  return NextResponse.json({
    message: "Recent products retrieved",
    success: true,
    data: products,
  });
}
