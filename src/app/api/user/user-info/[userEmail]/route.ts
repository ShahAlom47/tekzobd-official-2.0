// app/api/user/info/[userEmail]/route.ts
import { getUserCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (
  req: NextRequest,
  context: { params: { userEmail: string } }
) => {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const { userEmail } = context.params;
    if (!userEmail) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }

    const userCollection = await getUserCollection();

    const userInfo = await userCollection.findOne(
      { email: userEmail },
      { projection: { password: 0 } } // hide password
    );

    if (!userInfo) {
      return NextResponse.json(
        { message: "User not found", data: {} },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User info fetched successfully",
      data: userInfo,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error },
      { status: 500 }
    );
  }
};

// Only allow user to fetch their own data (or admin)
export const GET = withAuth(handler, {
  allowedRoles: ["user", "admin"],
  matchUserParamEmail: true,
});
