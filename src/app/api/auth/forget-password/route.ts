import { getUserCollection } from "@/lib/database/db_collections";
import { sendResetPasswordEmail } from "@/utils/sendResetPasswordEmail";
import { NextResponse } from "next/server";

interface ForgotPasswordRequest {
  userEmail: string;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const body: ForgotPasswordRequest = await req.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { 
          success: false, 
          message: "❌ Email is required. (ইমেইল দেওয়া বাধ্যতামূলক)" 
        },
        { status: 400 }
      );
    }

    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "❌ Account not found for this email. (এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি)" 
        },
        { status: 404 }
      );
    }

    // Call utility function
    await sendResetPasswordEmail(userEmail, user.name || "User");

    return NextResponse.json(
      { 
        success: true, 
        message: "✅ Reset password link sent. Please check your email. (রিসেট লিঙ্ক পাঠানো হয়েছে, অনুগ্রহ করে আপনার ইমেইল চেক করুন)" 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Forgot password error:", errorMessage);

    return NextResponse.json(
      { 
        success: false, 
        message: "❌ Internal server error. Please try again later. (সার্ভার সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন)", 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
};
