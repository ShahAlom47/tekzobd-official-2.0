// app/api/save-admin-token/route.ts (App Router)

import { NextRequest, NextResponse } from "next/server";
import { getAdminTokenCollection } from "@/lib/database/db_collections";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/authOptions/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { token, device } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  try {
    const adminTokenCollection = await getAdminTokenCollection();
    const email = session.user.email || "";

    // Find existing admin token doc
    const existingDoc = await adminTokenCollection.findOne({ email });

    const nowISOString = new Date().toISOString();

    if (!existingDoc) {
      // If no doc, create new
      const newDoc = {
        email,
        tokens: [{ token, device, createdAt: nowISOString }],
        createdAt: nowISOString,
        updatedAt: nowISOString,
      };
      await adminTokenCollection.insertOne(newDoc);
    } else {
      // If doc exists, check if token already present
      const tokens = existingDoc.tokens || [];
      const tokenExists = tokens.some((t: { token: string }) => t.token === token);

      if (!tokenExists) {
        // Add new token object to tokens array
        tokens.push({ token, device, createdAt: nowISOString });

        await adminTokenCollection.updateOne(
          { email },
          {
            $set: { tokens, updatedAt: nowISOString },
          }
        );
      } else {
        // Token already exists, update updatedAt only
        await adminTokenCollection.updateOne(
          { email },
          { $set: { updatedAt: nowISOString } }
        );
      }
    }

    return NextResponse.json({ message: "Token saved or updated" });
  } catch (error) {
    console.error("Error saving admin token:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
