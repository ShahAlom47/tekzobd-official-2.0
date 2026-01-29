// app/api/notification/route.ts

import { getNotificationCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  try {
    const notificationCollection = await getNotificationCollection();

    // Pagination parameters from query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pagination parameters",
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const total = await notificationCollection.countDocuments();

    const notifications = await notificationCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Count unread notifications
    const unreadCount = await notificationCollection.countDocuments({
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
        unreadCount, // ✅ return actual unread count from DB
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
};

// Admin only access
export const GET = withAuth(handler, {
  allowedRoles: ["admin"],
});
