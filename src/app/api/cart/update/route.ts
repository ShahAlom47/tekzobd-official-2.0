import { getCartCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, userEmail } = body;

    if (!productId || !userEmail || typeof quantity !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cartCollection = await getCartCollection();

    const result = await cartCollection.updateOne(
      { userEmail, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Quantity updated successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "No matching cart item found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
