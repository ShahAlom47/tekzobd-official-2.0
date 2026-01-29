import { getNotificationCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params:Promise< { id: string }> }
) {
  const { id } =await params;

  try {
    const notificationCollection = await getNotificationCollection();

    const result = await notificationCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Notification not found or already marked as read",success:false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification marked as read" ,success:true},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Internal Server Error",success:false },
      { status: 500 }
    );
  }
}
