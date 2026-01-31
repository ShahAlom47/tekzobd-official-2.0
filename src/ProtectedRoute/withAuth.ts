/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/withAuth.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface User {
  id: string;
  role: string;
  email: string;
  name?: string;
}

interface WithAuthOptions {
  allowedRoles?: string[];
  matchUserParamEmail?: boolean;
}

// Extend NextRequest to include user info
declare module "next/server" {
  interface NextRequest {
    user?: User;
  }
}

export function withAuth(
  handler: (req: NextRequest, context: { params: any }) => Promise<Response | NextResponse>,
  options: WithAuthOptions = {}
) {
  return async (req: NextRequest, context: { params: any }) => {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    // console.log("Token in withAuth:", token);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    const user = token as User;
    const { allowedRoles = [], matchUserParamEmail = false } = options;

    // Role-based check
    if (
      allowedRoles.length > 0 &&
      (!user.role || !allowedRoles.includes(user.role))
    ) {
      return NextResponse.json(
        { message: "Forbidden: Role not allowed" },
        { status: 403 }
      );
    }

    // Ownership check
    if (matchUserParamEmail && context.params.userEmail && user.role === "user") {
      if (user.email !== context.params.userEmail) {
        return NextResponse.json(
          { message: "Forbidden: Cannot access others' data" },
          { status: 403 }
        );
      }
    }

    // Attach user to request object
    req.user = user;

    return handler(req, context);
  };
}
