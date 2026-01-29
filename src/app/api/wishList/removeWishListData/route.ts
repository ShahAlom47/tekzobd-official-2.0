import { NextResponse } from "next/server";
import { getWishlistCollection } from "@/lib/database/db_collections";

// DELETE: Remove product from wishlist
export const DELETE = async (req: Request): Promise<NextResponse> => {
  try {
    const { userEmail, productId ,updatedAt} = await req.json();

    if (!userEmail || !productId) {
      return NextResponse.json(
        { success: false, message: "userEmail and productId are required" },
        { status: 400 }
      );
    }

    const wishlistCollection = await getWishlistCollection();

    // Pull the product by productId (as string)
    const updateRes = await wishlistCollection.updateOne(
      { userEmail },
      {
        $pull: { products: { productId } },
        $set: { updatedAt},
      }
    );

    if (updateRes.modifiedCount > 0) {
      return NextResponse.json(
        { success: true, message: "Removed from wishlist" },
        { status: 200 }
      );
    } else {
      // No document matched or product not found in wishlist
      return NextResponse.json(
        { success: false, message: "Product not found in wishlist" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
