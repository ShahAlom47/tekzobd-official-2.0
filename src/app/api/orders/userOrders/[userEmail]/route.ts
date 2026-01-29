import { getOrderCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Main handler
const handler = async (
  req: NextRequest,
  context: { params: { userEmail: string } }
) => {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { userEmail } = context.params;
  const user = req.user as User;

  if (!userEmail || typeof userEmail !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing email parameter" },
      { status: 400 }
    );
  }

  if (!user?.email || user?.email !== userEmail) {
    return NextResponse.json(
      { message: "Forbidden: Cannot access others' orders" },
      { status: 403 }
    );
  }

  try {
    const orderCollection = await getOrderCollection();
    const orders = await orderCollection
      .find({ "meta.userEmail": userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        data: orders,
        message: "User Orders retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Export withAuth wrapped GET
export const GET = withAuth(handler, {
  allowedRoles: ["user"],
  matchUserParamEmail: true,
});
