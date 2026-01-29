import { getProductCollection } from './../../../../lib/database/db_collections';
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const productCollection = await getProductCollection();
    const body = await req.json();
    const { wishListIds } = body;

    if (!wishListIds || wishListIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product Ids are required" },
        { status: 400 }
      );
    }

    // Convert string[] to ObjectId[]
    const objectIds = wishListIds.map((id: string) => new ObjectId(id));

    // Find products by _id
    const products = await productCollection.find({
      _id: { $in: objectIds }
    }).toArray();

    return NextResponse.json(
      { success: true, message: "Received wishlist ids", data: products },
      { status: 200 }
    );

  } catch (error) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
