import { getNewsLetterCollection } from "@/lib/database/db_collections";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || !body.email) {
      return NextResponse.json(
        { message: "Invalid request body", success: false },
        { status: 400 }
      );
    }

    const collection = await getNewsLetterCollection();

    const existing = await collection.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json(
        { message: "This email is already subscribed", success: false },
        { status: 400 }
      );
    }

    const newSubscriber = {
      email: body.email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
      ...body,
    };
    const result = await collection.insertOne(newSubscriber);
    // console.log(result);

    if (!result.acknowledged) {
      return NextResponse.json(
        { message: "Failed to subscribe", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Subscription successful",
        success: true,
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
