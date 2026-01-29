import {
  getNotificationCollection,
  getAdminTokenCollection,
} from "@/lib/database/db_collections";
import admin from "@/lib/firebaseNotification/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and message are required.",
        },
        { status: 400 }
      );
    }

    // Get all admin docs with tokens
    const adminTokenCollection = await getAdminTokenCollection();
    const allAdminDocs = await adminTokenCollection.find().toArray();

    // Flatten all tokens from all admins into a single array
    const tokens = allAdminDocs.flatMap((adminDoc) =>
      Array.isArray(adminDoc.tokens)
        ? adminDoc.tokens.map((t: { token: string }) => t.token)
        : []
    );

    if (tokens.length === 0) {
      return NextResponse.json(
        { success: false, message: "No tokens found for any admin." },
        { status: 404 }
      );
    }

    // Optional: Store notification in DB
    const notificationCollection = await getNotificationCollection();
    await notificationCollection.insertOne({ isRead: false, ...body });

    // FCM multicast payload
    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      tokens,
    };

    // Send multicast notification
    const response = await admin
      .messaging()
      .sendEachForMulticast(messagePayload);

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent successfully.",
        fcmResponse: response,
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Notification send error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notification.",
        error: error?.message || error,
      },
      { status: 500 }
    );
  }
}
