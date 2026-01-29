import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getReviewCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import authOptions from "../../auth/authOptions/authOptions";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;

    if (!session || !currentUserEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reviewId, comment, rating, updatedAt } = body;

    if (!reviewId || !comment || !rating) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const reviewCollection = await getReviewCollection();

    const existingReview = await reviewCollection.findOne({
      _id: new ObjectId(reviewId),
    });

    if (!existingReview) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    // ✅ Owner check
    if (existingReview.userEmail !== currentUserEmail) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // ✅ Update the review
    await reviewCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      {
        $set: {
          comment,
          rating,
          updatedAt: updatedAt || new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true, message: "Review updated successfully" });
  } catch (error) {
    console.error("Edit Review Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
