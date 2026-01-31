
"use client";

import isAuth from "@/ProtectedRoute/isAuth";
import React from "react";

const UserLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default isAuth(UserLayoutWrapper, ["admin","user"]);
// src/app/user/layout.tsx