import { getUserCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const handler = async (
  req: NextRequest,
  context: { params: { userEmail: string } }
) => {
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method Not Allowed", success: false }, { status: 405 });
  }

  const { userEmail } = context.params;
  const body = await req.json();
  const { newPassword, token } = body;


  if (!token || !newPassword ||!userEmail) {
    return NextResponse.json(
      { message: "❌ Token and new password and Email are required. (টোকেন এবং নতুন পাসওয়ার্ড প্রয়োজন)", success: false },
      { status: 400 }
    );
  }


  const usersCollection = await getUserCollection();

    const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json(
      { message: "❌ User not found. (ইউজার পাওয়া যায়নি)", success: false },
      { status: 404 }
    );
  }

  // Verify token
  if (token !== user?.emailVerificationToken) {
    return NextResponse.json(
      { message: "❌ Invalid or expired token. (ভুল বা সময়সীমা শেষ টোকেন)", success: false },
      { status: 400 }
    );
  }

  // Optional: check token expiry if you saved it
  if (user.tokenExpires && new Date() > new Date(user.tokenExpires)) {
    return NextResponse.json(
      { message: "❌ Token has expired. Please request a new link. (টোকেনের সময়সীমা শেষ হয়েছে)", success: false },
      { status: 400 }
    );
  }

  // Hash the new password
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password & remove reset token
  await usersCollection.updateOne(
    { email: userEmail },
    {
      $set: { password: hashedPassword },
      $unset: { emailVerificationToken: "", tokenExpires: "" }
    }
  );

  return NextResponse.json(
    { message: "✅ Password has been reset successfully. (পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে)", success: true },
    { status: 200 }
  );
};

// Protect route with withAuth
export const PATCH = withAuth(handler, {
  allowedRoles: ["admin", "user"],
});
