// app/api/order/add/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getOrderCollection,
  getProductCollection,
} from "@/lib/database/db_collections";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutDataType;
    const productCollection = await getProductCollection();

    if (
      !body?.cartProducts?.length ||
      !body?.shippingInfo ||
      !body?.pricing ||
      !body?.paymentInfo
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields." },
        { status: 400 }
      );
    }

    // Add checkout timestamp if missing
    if (!body.meta.checkoutAt) {
      body.meta.checkoutAt = new Date().toISOString();
    }

    const orderCollection = await getOrderCollection();
    const result = await orderCollection.insertOne(body);

    if (result.insertedId) {
      const bulkOperations = body.cartProducts.map((item) => {
        const quantity = Number(item.quantity);
        return {
          updateOne: {
            filter: { _id: new ObjectId(item.productId) },
            update: {
              $inc: {
                stock: -quantity,
                soldCount: quantity,
              },
            },
          },
        };
      });

      if (bulkOperations.length > 0) {
        await productCollection.bulkWrite(bulkOperations);
      }

      return NextResponse.json(
        {
          success: true,
          insId: result.insertedId.toString(),
          message: "Order created successfully.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Order creation failed." },
      { status: 500 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[ORDER_CREATE_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
