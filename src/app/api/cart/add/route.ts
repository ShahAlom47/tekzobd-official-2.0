// app/api/cart/add/route.ts
import { getCartCollection } from "@/lib/database/db_collections";
import { NextResponse } from "next/server";
import { CartItem, RequestBody } from "@/Interfaces/cartInterface";

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { productId, quantity, color, userEmail, createdAt, updatedAt } =
      body;
    // console.log(color, "color in route");
    if (!userEmail || !productId || !quantity || quantity < 1) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cartCollection = await getCartCollection();

    const existingCart = await cartCollection.findOne({ userEmail });

    if (existingCart) {
      // Check if product already exists in cart

      const existingItemIndex = existingCart.items.findIndex(
        (item: CartItem) =>
          item.productId === productId && item.color === (color || null)
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        existingCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.items.push({
          productId,
          quantity,
          color: color || null,
          addedAt: new Date().toISOString(),
        });
      }

      // Update cart in DB
      // const updatedCart = await cartCollection.findOneAndUpdate(
      //   { userEmail },
      //   { $set: { items: existingCart.items, updatedAt: new Date().toISOString() } },
      //   { returnDocument: "after" }
      // );
      const updatedCart = await cartCollection.findOneAndUpdate(
        { userEmail },
        {
          $set: {
            items: existingCart.items,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      );
      return NextResponse.json({
        message: "Cart updated successfully",
        cart: updatedCart,
      });
    } else {
      // No cart exists, create new one
      const newCart = {
        userEmail,
        items: [
          {
            productId,
            quantity,
            color: color || null,
            addedAt: new Date().toISOString(),
          },
        ],
        createdAt,
        updatedAt,
      };

      const insertedCart = await cartCollection.insertOne(newCart);

      return NextResponse.json({
        message: "Cart created successfully",
        cart: insertedCart,
      });
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
