/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrderCollection } from "@/lib/database/db_collections";
// import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// import authOptions from "../../auth/authOptions/authOptions";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderCollection = await getOrderCollection();
    // const session = await getServerSession(authOptions);
    // const user = session?.user || null;

    // const isDashboard = req.headers.get("x-from-dashboard") === "true";
    // const isPublic = !isDashboard || !user;

    const currentPage = parseInt(
      url.searchParams.get("currentPage") || "1",
      10
    );
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const skip = (currentPage - 1) * pageSize;

    const search = url.searchParams.get("search")?.trim() || "";
    const sort = url.searchParams.get("sort") || "checkoutAt-desc";

    const orderStatus = url.searchParams.get("orderStatus");
    const paymentMethod = url.searchParams.get("paymentMethod");
    const paymentStatus = url.searchParams.get("paymentStatus");
    const deliveryMethod = url.searchParams.get("deliveryMethod");
    const city = url.searchParams.get("city");
    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");

    if (isNaN(currentPage) || isNaN(pageSize)) {
      return NextResponse.json(
        { message: "Invalid pagination params", success: false },
        { status: 400 }
      );
    }

    const filter: any = {};

    if (search) {
      filter.$or = [
        { "meta.userName": { $regex: search, $options: "i" } },
        { "meta.userEmail": { $regex: search, $options: "i" } },
        { "shippingInfo.name": { $regex: search, $options: "i" } },
        { "shippingInfo.phone": { $regex: search, $options: "i" } },
        { "cartProducts.productName": { $regex: search, $options: "i" } },
      ];
    }

    if (orderStatus) filter["meta.orderStatus"] = orderStatus;
    if (paymentMethod) filter["paymentInfo.method"] = paymentMethod;
    if (paymentStatus) filter["paymentInfo.paymentStatus"] = paymentStatus;
    if (deliveryMethod) filter["shippingInfo.deliveryMethod"] = deliveryMethod;
    if (city) filter["shippingInfo.city"] = { $regex: city, $options: "i" };

    // Date filtering with start/end of day
    if (fromDate || toDate) {
      const dateRange: any = {};

      if (fromDate) {
        dateRange.$gte = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      }

      if (toDate) {
        dateRange.$lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      }

      filter["meta.checkoutAt"] = dateRange;
    }

    const sortQuery: any = {};
    if (sort.includes("-")) {
      const [field, order] = sort.split("-");
      if (
        ["checkoutAt", "orderStatus", "userName", "userEmail"].includes(field)
      ) {
        sortQuery[`meta.${field}`] = order === "desc" ? -1 : 1;
      } else {
        sortQuery[field] = order === "desc" ? -1 : 1;
      }
    } else {
      sortQuery["meta.checkoutAt"] = -1;
    }

    const [data, total] = await Promise.all([
      orderCollection
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      orderCollection.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Orders retrieved successfully",
        data,
        totalData: total,
        currentPage,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/orders/getAllOrders Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve orders",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
