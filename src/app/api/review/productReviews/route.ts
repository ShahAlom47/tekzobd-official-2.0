import { NextRequest, NextResponse } from "next/server";
import { getReviewCollection } from "@/lib/database/db_collections";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid productId", success: false },
        { status: 400 }
      );
    }

    const reviewCollection = await getReviewCollection();

    const reviews = await reviewCollection
      .find({ productId, isPublished: true })
      .sort({ createdAt: -1 }) // নতুন রিভিউ আগে দেখাবে
      .toArray();

    return NextResponse.json({
      message: "Reviews fetched successfully",
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("[GET_REVIEWS_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", success: false },
      { status: 500 }
    );
  }
}
