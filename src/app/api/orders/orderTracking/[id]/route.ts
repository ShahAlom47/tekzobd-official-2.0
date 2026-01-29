import { getOrderCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { ObjectId } from "mongodb";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type TrackingData = {
  courierName: "steadfast" | "redx" | "pathao" | "express";
  courierOrderId: string;
  trackingUrl?: string;
};

const handler = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { id } = context.params;
  const body: TrackingData = await req.json();
  const { courierName, courierOrderId, trackingUrl } = body;

  if (!courierName || !courierOrderId) {
    return NextResponse.json(
      { message: "courierName and courierOrderId are required", success: false },
      { status: 400 }
    );
  }

  const orderCollection = await getOrderCollection();
  const order = await orderCollection.findOne({ _id: new ObjectId(id) });

  if (!order) {
    return NextResponse.json(
      { message: "Order not found", success: false },
      { status: 404 }
    );
  }

  const user = req.user as User;

  // Only admin can update
  if (user?.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: only admin can update tracking info", success: false },
      { status: 403 }
    );
  }

  // Update tracking info
  const updateData = {
    "shippingInfo.trackingInfo": {
      courierName,
      courierOrderId,
      trackingUrl: trackingUrl || "",
    },
    "meta.updatedAt": new Date().toISOString(),
  };

  const result = await orderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { message: "Tracking info not updated", success: false },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: order.shippingInfo?.trackingInfo
        ? "Tracking info updated successfully"
        : "Tracking info added successfully",
      success: true,
      trackingInfo: updateData["shippingInfo.trackingInfo"],
    },
    { status: 200 }
  );
};

export const PUT = withAuth(handler, {
  allowedRoles: ["admin"], // Only admin allowed now
});
// যদি ভবিষ্যতে অন্য role কে দিতে চাও, তাহলে এখানে add করো