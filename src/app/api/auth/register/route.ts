import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserCollection } from "@/lib/database/db_collections";
import { MongoServerError } from "mongodb";
import { generateRandomToken } from "@/utils/generateRandomToken";
import { sendEmail } from "@/utils/sendEmail";

interface RequestBody {
  email: string;
  password: string;
  name: string;
  photoUrl?: string | null;
}

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const usersCollection = await getUserCollection();
    const body: RequestBody = await req.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, password and name are required", success: false },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address", success: false },
        { status: 400 }
      );
    }

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        // Already verified user → cannot register again
        return NextResponse.json(
          { message: "Email already exists", success: false },
          { status: 409 }
        );
      } else {
        // User exists but NOT verified → regenerate token and resend verification email
        const emailVerificationToken = generateRandomToken(10);
        await usersCollection.updateOne(
          { email },
          {
            $set: { emailVerificationToken, updatedAt: new Date().toISOString() },
          }
        );

        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${emailVerificationToken}&userEmail=${email}`;
        const htmlContent = `
          <h3>Hello ${existingUser.name},</h3>
          <p>You have already registered but did not verify your email. Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#4caf50;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
          <p>If you did not create an account, you can ignore this email.</p>
        `;
        await sendEmail(email, "Verify your email", htmlContent);

        return NextResponse.json(
          {
            success: true,
            message: "You have already registered. Verification email resent. Please check your inbox.",
          },
          { status: 200 }
        );
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const emailVerificationToken = generateRandomToken(10);

    // Save user to DB
    const result = await usersCollection.insertOne({
      email,
      name,
      password: hashedPassword,
      role: "user",
      isActive: true,
      verified: false,
      emailVerificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Failed to register user" },
        { status: 500 }
      );
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${emailVerificationToken}&userEmail=${email}`;
    const htmlContent = `
      <h3>Hello ${name},</h3>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#4caf50;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>If you did not create an account, you can ignore this email.</p>
    `;
    await sendEmail(email, "Verify your email", htmlContent);

    return NextResponse.json(
      { success: true, message: "User registered successfully. Please check your email to verify." },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
};
