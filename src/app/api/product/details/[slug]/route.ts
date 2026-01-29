// /api/product/getSingleproduct/[id]/route.ts


import { getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise< { slug: string }> }) {

  try {
    const { slug } = await params;

    if (!slug ) {
      return NextResponse.json(
        { message: "Invalid or missing ID", success: false },
        { status: 400 }
      );
    }

    const productCollection = await getProductCollection();
    const filter = { slug: slug };
    const result = await productCollection.findOne(filter);

    if (!result) {
      return NextResponse.json(
        { message: "product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "product retrieved successfully", success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /product/details/[slug]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while retrieving the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}



// update product 
export async function PATCH(
  req: NextRequest,
  { params }: { params:Promise< { id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid or missing ID", success: false },
        { status: 400 }
      );
    }
     if ("_id" in body) {
      delete body._id;
    }

    const productCollection = await getProductCollection();
    const filter = { _id: new ObjectId(id) };

    const result = await productCollection.updateOne(filter, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "product updated successfully", success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /product/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
