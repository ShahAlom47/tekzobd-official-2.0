// app/api/newsletter/updateStatus/[id]/route.ts

import { getNewsLetterCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    const newsLetterCollection = await getNewsLetterCollection();
    const {id} =await  params;
    const body = await req.json();
    const { newStatus, updatedAt } = body;

    const result = await newsLetterCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: newStatus, updatedAt } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Status not updated" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
