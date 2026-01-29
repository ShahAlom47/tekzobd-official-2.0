import { getNotificationCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } =await params; 
    const notificationCollection = await getNotificationCollection();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required", success: false },
        { status: 400 }
      );
    }

    const filter = { _id: new ObjectId(id) };
    const result = await notificationCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Notification not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Notification:", error);
    return NextResponse.json(
      {
        message: "An error occurred while deleting the Notification",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
