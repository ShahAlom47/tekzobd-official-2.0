import { getOrderCollection, getProductCollection } from "@/lib/database/db_collections";
import { withAuth } from "@/ProtectedRoute/withAuth";
import { ObjectId } from "mongodb";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { id } = context.params;
  const body = await req.json();
  const { status, updatedAt } = body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status) {
    return NextResponse.json(
      { message: "Status is required", success: false },
      { status: 400 }
    );
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { message: "Invalid status value", success: false },
      { status: 400 }
    );
  }

  const orderCollection = await getOrderCollection();
  const productCollection = await getProductCollection();

  const order = await orderCollection.findOne({ _id: new ObjectId(id) });

  if (!order) {
    return NextResponse.json(
      { message: "Order not found", success: false },
      { status: 404 }
    );
  }

  const user = req.user as User;

  if (
    user?.role === "user" &&
    (!order.meta?.userEmail || order?.meta?.userEmail !== user.email)
  ) {
    return NextResponse.json(
      { message: "Forbidden: cannot update others' orders", success: false },
      { status: 403 }
    );
  }

  const isUser = user?.role === "user";
  const isCancelling = status === "cancelled";
  const isAlreadyInProgress = order.meta.orderStatus !== "pending";

  if (isUser && isCancelling && isAlreadyInProgress) {
    return NextResponse.json(
      {
        message: "You can't cancel this order as it's already in progress.",
        success: false,
      },
      { status: 400 }
    );
  }

  // Prepare update object
  const updateData: Record<string, unknown> = {
    "meta.orderStatus": status,
    "meta.updatedAt": updatedAt || new Date().toISOString(),
  };

  if (isUser && isCancelling) {
    updateData["meta.cancelledByUser"] = true;
  }

  const result = await orderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { message: "Order not found", success: false },
      { status: 404 }
    );
  }

  // ⬇️ Stock restore if order is cancelled
if (isCancelling && order.cartProducts.length > 0) {
  const nowISO = new Date().toISOString();

  const bulkOps = order.cartProducts.map(item => ({
    updateOne: {
      filter: { _id: new ObjectId(item.productId) },
      update: {
        $inc: { stock: item.quantity }, // stock += quantity
        $set: { updatedAt: nowISO },    // updatedAt update
      },
    },
  }));

  await productCollection.bulkWrite(bulkOps);
}

  return NextResponse.json(
    { message: "Order status updated successfully", success: true },
    { status: 200 }
  );
};

export const PATCH = withAuth(handler, {
  allowedRoles: ["admin", "user"],
});
