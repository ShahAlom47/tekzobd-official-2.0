import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserCollection } from "@/lib/database/db_collections";
import { MongoServerError } from "mongodb";

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

    const { email, password, name, photoUrl } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password and name are required",
        },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const result = await usersCollection.insertOne({
      email,
      name,
      image: photoUrl || null,
      password: hashedPassword,
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to register user",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
};