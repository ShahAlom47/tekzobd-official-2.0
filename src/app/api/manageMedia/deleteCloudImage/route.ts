/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductCollection, getUserCollection } from "@/lib/database/db_collections";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const productCollection = await getProductCollection();
  const userCollection = await getUserCollection();

  try {
    const { publicId, dataId, mediaCategory } = await req.json();

    if (!publicId || !mediaCategory) {
      return NextResponse.json(
        { success: false, message: "publicId and mediaCategory are required" },
        { status: 400 }
      );
    }

    let dbDeleted = false;
    let cloudDeleted = false;
    let cloudinaryResult: any = null;

    // ✅ STEP 1: Try DB delete if dataId is present
    if (dataId) {
      const filter = { _id: new ObjectId(dataId) };
      const update = {
        $pull: { media: { publicId } },
      };

      if (mediaCategory === "productMedia") {
        const result = await productCollection.updateOne(filter, update);
        if (result.modifiedCount > 0) {
          dbDeleted = true;
        }
      } else if (mediaCategory === "userMedia") {
        const result = await userCollection.updateOne(filter, update);
        if (result.modifiedCount > 0) {
          dbDeleted = true;
        }
      }
    }

    // ✅ STEP 2: Try Cloudinary delete
    try {
      cloudinaryResult = await cloudinary.uploader.destroy(publicId);
      if (cloudinaryResult.result === "ok" || cloudinaryResult.result === "not found") {
        cloudDeleted = true;
      }
    } catch (err) {
      console.error("Cloudinary delete error", err);
    }

    // ✅ Final response message
    const messageParts = [];
    if (dbDeleted) messageParts.push("Deleted from database");
    if (cloudDeleted) messageParts.push("Deleted from Cloudinary");

    const success = dbDeleted || cloudDeleted;

    return NextResponse.json({
      success,
      message: messageParts.length > 0 ? messageParts.join(" and ") : "Nothing was deleted",
      dbDeleted,
      cloudDeleted,
      cloudinaryResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
