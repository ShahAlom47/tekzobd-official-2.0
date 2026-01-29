// app/api/cart/user-cart/route.ts
import { getCartCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ message: "Missing userEmail" }, { status: 400 });
    }

    const cartCollection = await getCartCollection();

    const userCart = await cartCollection.findOne({ userEmail });

    if (!userCart) {
      return NextResponse.json({ message: "Cart not found", cart: null }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart fetched successfully", data: userCart });
  } catch (error) {
    console.error("Get user cart error:", error);
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}
