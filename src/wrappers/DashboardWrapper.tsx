// src/app/dashboard/AuthWrapper.tsx
"use client";

import React from "react";
import isAuth from "../../ProtectedRoute/isAuth";

const DashboardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default isAuth(DashboardWrapper, ["admin"]);
