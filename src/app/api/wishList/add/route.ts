import { NextResponse } from "next/server";
import { getWishlistCollection } from "@/lib/database/db_collections";


interface RequestBody {
  userEmail: string;
  productId: string;
  addedAt: string;
  createdAt:string;
  updatedAt:string;
}

// ⏫ Helper to format response
const jsonResponse = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

// ✅ POST: Add Product to Wishlist
export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const wishlistCollection = await getWishlistCollection();
    const body: RequestBody = await req.json();
    const { userEmail, productId, addedAt , createdAt,
        updatedAt,} = body;

    if (!userEmail || !productId || !addedAt) {
      return jsonResponse(
        { success: false, message: "Missing required fields" },
        400
      );
    }

    // 🔍 Step 1: Check if user already has a wishlist
    const existingWishlist = await wishlistCollection.findOne({ userEmail });

    // 🟡 Step 2: If wishlist exists
    if (existingWishlist) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alreadyExists = existingWishlist.products?.some((p: any) => {
        const pid =
          typeof p.productId === "string" ? p.productId : p.productId?.toString();
        return pid === productId;
      });

      if (alreadyExists) {
        return jsonResponse(
          { success: false, message: "Product already in wishlist" },
          409
        );
      }

      // ✅ Update existing wishlist
      const updateRes = await wishlistCollection.updateOne(
        { userEmail },
        {
          $push: {
            products: { productId, addedAt },
          },
          $set: { updatedAt },
        }
      );

      if (updateRes.modifiedCount > 0) {
        return jsonResponse({
          success: true,
          message: "Product added to wishlist",
        });
      } else {
        return jsonResponse(
          { success: false, message: "Failed to update wishlist" },
          500
        );
      }
    }

    // 🔵 Step 3: No existing wishlist — create new one
    const newWishlist = {
      userEmail,
      products: [{ productId, addedAt }],
      createdAt,
      updatedAt
    };

    const insertRes = await wishlistCollection.insertOne(newWishlist);

    if (insertRes.insertedId) {
      return jsonResponse({
        success: true,
        message: "Wishlist created and product added",
      }, 201);
    } else {
      return jsonResponse(
        { success: false, message: "Failed to create wishlist" },
        500
      );
    }
  } catch (error) {
    console.error("❌ Add to wishlist error:", error);
    return jsonResponse(
      { success: false, message: "Internal server error" },
      500
    );
  }
};
