
"use client";

import React from "react";
import isAuth from "../../ProtectedRoute/isAuth";

const UserLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default isAuth(UserLayoutWrapper, ["admin","user"]);
// src/app/user/layout.tsx