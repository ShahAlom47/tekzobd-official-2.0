// app/api/user/info/[userEmail]/route.ts
import { getNewsLetterCollection, getUserCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest, context: { params: { userEmail: string } }) => {
  try {
    if (req.method !== "PATCH") {
      return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }

    const { userEmail } = context.params;
    const body = await req.json();

    if (!userEmail) {
      return NextResponse.json({ message: "User email is required" }, { status: 400 });
    }

    const userCollection = await getUserCollection();
    const newsLetterCollection = await getNewsLetterCollection();

    const userInfo = await userCollection.findOne({ email: userEmail });
    if (!userInfo) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 🔹 Remove any sensitive fields from body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeBody } = body;

    // ✅ Update only safe fields
    const updatedUser = await userCollection.findOneAndUpdate(
      { email: userEmail },
      { $set: safeBody },
      { returnDocument: "after" }
    );

    // ✅ Newsletter toggle
    if (body.hasOwnProperty("isNewsletter")) {
      if (body.isNewsletter === true) {
        await newsLetterCollection.updateOne(
          { email: userEmail },
          { $set: { email: userEmail, subscribedAt: new Date().toISOString(), isActive: true } },
          { upsert: true }
        );
      } else if (body.isNewsletter === false) {
        await newsLetterCollection.deleteOne({ email: userEmail });
      }
    }

    // 🔹 Prepare safe return data (exclude sensitive info)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...returnUser } = updatedUser || {};

    return NextResponse.json({
      success: true,
      message: "User info updated successfully",
      data: returnUser,userEmail,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Only allow user to update their own data (or admin)
export const PATCH = withAuth(handler, {
  allowedRoles: ["user", "admin"],
  matchUserParamEmail: true,
});
