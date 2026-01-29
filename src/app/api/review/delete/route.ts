import { NextRequest, NextResponse } from "next/server";
import { getReviewCollection, getProductCollection } from "@/lib/database/db_collections";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import authOptions from "../../auth/authOptions/authOptions";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;
    const currentUserRole = session?.user?.role;

    if (!session || !currentUserEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ success: false, message: "Missing reviewId" }, { status: 400 });
    }

    const reviewCollection = await getReviewCollection();
    const productCollection = await getProductCollection();

    // Step 1: Get the review
    const review = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    // Step 2: Check permission
    const isOwner = review.userEmail === currentUserEmail;
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const productId = review.productId;

    // Step 3: Delete the review
    await reviewCollection.deleteOne({ _id: new ObjectId(reviewId) });

    // Step 4: Recalculate avg & count for the product
    const allReviews = await reviewCollection
      .find({ productId, isPublished: true })
      .toArray();

    const totalCount = allReviews.length;
    const totalRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avgRating =
      totalCount > 0 ? parseFloat((totalRating / totalCount).toFixed(1)) : 0;

    await productCollection.updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          "ratings.avg": avgRating,
          "ratings.count": totalCount,
        },
      }
    );

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
