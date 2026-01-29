// /api/product/deleteproduct/[id]/route.ts
import { getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
 { params }: { params: Promise< { id: string }> }
) {
  try {
    const { id } = await params;
    const productCollection = await getProductCollection();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    // MongoDB এর ObjectId তে রূপান্তর
    const filter = { _id: new ObjectId(id) };
    const result = await productCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "product deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /product/deleteProduct/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
