import { getNewsLetterCollection } from '@/lib/database/db_collections';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const newsLetterCollection = await getNewsLetterCollection();
    const { searchParams } = new URL(req.url);

    const currentPage = parseInt(searchParams.get("currentPage") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim() || "";

    const skip = (currentPage - 1) * limit;

    const filter = search
      ? {
          email: { $regex: search, $options: "i" }, // case-insensitive search
        }
      : {};

    // MongoDB query returns a cursor, so use toArray() to get array
    const [subscribers, total] = await Promise.all([
      newsLetterCollection.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray(),
      newsLetterCollection.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: subscribers,
    });
  } catch (error) {
    // Important: return the response!
    return NextResponse.json(
      { success: false, message: "Server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
