import { NextRequest, NextResponse } from "next/server";
import { getProductCollection } from "@/lib/database/db_collections";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");



  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required", success: false },
      { status: 400 }
    );
  }

  const productCollection = await getProductCollection();

  const mainProduct = await productCollection.findOne({
    _id: new ObjectId(productId),
  });

  if (!mainProduct) {
    return NextResponse.json(
      { message: "Main product not found", success: false },
      { status: 404 }
    );
  }

  const titleKeywords = mainProduct.title.split(" ").filter((word) => word.length > 2);
  const regexTitle = titleKeywords.map((word) => new RegExp(word, "i")); // case-insensitive

  const relatedProducts = await productCollection
    .find({
      _id: { $ne: new ObjectId(productId) },
      isPublished: true,
      stock: { $gt: 0 },
      $or: [
        { categoryId: mainProduct.categoryId },
        { brand: mainProduct.brand },
        { title: { $in: regexTitle } },
        { description: { $in: regexTitle } },
      ],
    })
    .limit(10)
    .toArray();

  return NextResponse.json({
    message: "Smart related products retrieved",
    success: true,
    data: relatedProducts,
  });
}
