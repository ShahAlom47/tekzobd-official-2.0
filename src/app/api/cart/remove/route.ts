import { NextResponse } from "next/server";
import { getCartCollection } from "@/lib/database/db_collections";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { productId, userEmail } = body;

    if (!productId || !userEmail) {
      return NextResponse.json(
        { message: "Missing productId or userEmail" },
        { status: 400 }
      );
    }

    const cartCollection = await getCartCollection();

    const result = await cartCollection.findOneAndUpdate(
      { userEmail },
      {
        $pull: {
          items: { productId },
        },
        $set: {
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { message: "Cart not found or item not removed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Item removed from cart successfully",
      data: result,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
