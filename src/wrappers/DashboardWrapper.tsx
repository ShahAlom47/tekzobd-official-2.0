// src/app/dashboard/AuthWrapper.tsx
"use client";

import isAuth from "@/ProtectedRoute/isAuth";
import React from "react";

const DashboardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default isAuth(DashboardWrapper, ["admin"]);
