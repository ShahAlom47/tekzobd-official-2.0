import { getUserCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";

interface VerifyEmailData {
  token: string;
  userEmail: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const body: VerifyEmailData = await req.json();
    const { token, userEmail } = body;

    if (!token || !userEmail) {
      return NextResponse.json({ message: "Token and userEmail are required", success: false }, { status: 400 });
    }

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }

    if (user.emailVerificationToken !== token) {
      return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 400 });
    }

    await usersCollection.updateOne(
      { email: userEmail },
      { $set: { verified: true }, $unset: { emailVerificationToken: "" } }
    );

    // Only response success, no JWT
    return NextResponse.json({ message: "Email verified successfully", success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Email verification error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: errorMessage }, { status: 500 });
  }
};
