import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getProductCollection,
  getReviewCollection,
} from "@/lib/database/db_collections";
import { ReviewsType } from "@/Interfaces/reviewInterfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      productId,
      userEmail,
      userName,
      comment,
      rating,
      parentId = null,
      createdAt ,
      updatedAt
    } = body;
    // Basic validation
    if (!productId || !userEmail || typeof rating !== "number") {
      return NextResponse.json(
        { message: "Missing or invalid fields", success: false },
        { status: 400 }
      );
    }

    const reviewCollection = await getReviewCollection();
    const productCollection = await getProductCollection();

    const newReview: ReviewsType = {
      productId,
      userEmail,
      userName,
      comment,
      parentId,
      isPublished: true,
      rating,
      createdAt,
      updatedAt,
    };

    // Step 1: Insert review
    await reviewCollection.insertOne(newReview);

    // Step 2: Get all published reviews of this product
    const allReviews = await reviewCollection
      .find({ productId, isPublished: true })
      .toArray();

    const totalCount = allReviews.length;
    const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avgRating = totalCount > 0
      ? parseFloat((totalRating / totalCount).toFixed(1))
      : 0;

    // Step 3: Update product's ratings
    await productCollection.updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          "ratings.avg": avgRating,
          "ratings.count": totalCount,
        },
      }
    );

    return NextResponse.json({
      message: "Review added successfully",
      success: true,
    });
  } catch (error) {
    console.error("[ADD_REVIEW_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
