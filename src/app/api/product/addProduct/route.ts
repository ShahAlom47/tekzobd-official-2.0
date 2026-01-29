import { getProductCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    // 🔁 List of fields that must be numbers
    const numericFields = ["price", "stock", "discount","soldCount"];

    for (const field of numericFields) {
      if (body[field] !== undefined) {
        const parsedValue = Number(body[field]);
        if (isNaN(parsedValue)) {
          return NextResponse.json(
            { message: `Invalid ${field} format`, success: false },
            { status: 400 }
          );
        }
        body[field] = parsedValue;
      }
    }

    const productCollection = await getProductCollection();
    const addResult = await productCollection.insertOne(body);

    if (!addResult.acknowledged) {
      return NextResponse.json(
        { message: "Failed to add product", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Product added successfully",
        success: true,
        insertedId: addResult.insertedId,
      },
      { status: 201 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in POST /api/product:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const duplicateValue = error.keyValue?.[duplicateField];
      return NextResponse.json(
        {
          message: `A product with the same ${duplicateField} "${duplicateValue}" already exists.`,
          success: false,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "An error occurred while adding the product",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
