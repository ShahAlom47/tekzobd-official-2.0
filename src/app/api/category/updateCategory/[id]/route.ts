import { getCategoryCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// ✅ Update a category by ID
export async function PATCH(
  req: NextRequest,
 { params }: { params:Promise< { id: string }> }
) {
  try {
    const {id} = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    const categoryCollection = await getCategoryCollection();

    const updateResult = await categoryCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No changes were made", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/category/[id]:", error);
    return NextResponse.json(
      {
        message: "Failed to update category",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
