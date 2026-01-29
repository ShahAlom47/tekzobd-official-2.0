import { getProductCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) ) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const productIdsObject = productIds.map((productId: string) => new ObjectId(productId));

    const productCollection = await getProductCollection();

    const products = await productCollection
      .find({ _id: { $in: productIdsObject } })
      .toArray();

    return NextResponse.json({
      message: "Cart products fetched",
      data:products,
    });
  } catch (error) {
    console.error("Cart product fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
