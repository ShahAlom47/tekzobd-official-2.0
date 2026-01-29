import { getWishlistCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, productIds,updatedAt } = body;

    if (!userEmail || !Array.isArray(productIds)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const wishlistCollection = await getWishlistCollection();

    const products = productIds.map((id: string) => ({
      productId: id,
      addedAt: new Date().toISOString(),
    }));

    const updatedWishlist = await wishlistCollection.findOneAndUpdate(
      { userEmail },
      {
        $set: {
          products,
          updatedAt:updatedAt|| new Date().toISOString(), // ✅ Properly set updatedAt
        },
      },
      {
        upsert: true,
        returnDocument: "after", // ✅ Ensures updated doc is returned
      }
    );

    return NextResponse.json({
      message: "Wishlist synced successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("Sync wishlist error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
