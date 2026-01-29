import { getCategoryCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params:Promise< { id: string }> }
) {
  try {
    const categoryCollection = await getCategoryCollection();
    const { id } =await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    const category = await categoryCollection.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category fetched successfully", success: true, data: category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/category/[id]:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the category",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
