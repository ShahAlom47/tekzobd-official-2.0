// app/api/newsletter/subscriber/[id]/route.ts

import { getNewsLetterCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params:Promise< { id: string }> }) {
  try {
    const newsLetterCollection = await getNewsLetterCollection();
    const {id} = await params;

    const result = await newsLetterCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
