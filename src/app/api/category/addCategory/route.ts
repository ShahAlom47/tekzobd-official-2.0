// File: /app/api/categories/route.ts

import { getCategoryCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

// POST: Add new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body", success: false }, { status: 400 });
    }

    const collection = await getCategoryCollection();
    const result = await collection.insertOne({
      ...body,
    });

    if (!result.acknowledged) {
      return NextResponse.json({ message: "Failed to add category", success: false }, { status: 500 });
    }

    return NextResponse.json({
      message: "Category added successfully",
      success: true,
      insertedId: result.insertedId,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
