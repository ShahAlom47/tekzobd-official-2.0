import { getWishlistCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }

    const wishlistCollection = await getWishlistCollection();

    const userWishlist = await wishlistCollection.findOne({ userEmail });

    if (!userWishlist) {
      return NextResponse.json(
        { message: "No wishlist found", products: {} },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: "Wishlist fetched successfully",
      data: userWishlist ||{},
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
