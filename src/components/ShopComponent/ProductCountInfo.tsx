"use client";

import React from "react";

type ProductCountInfoProps = {
  currentPage: number;
  perPage: number;
  total: number;
};

const ProductCountInfo: React.FC<ProductCountInfoProps> = ({
  currentPage,
  perPage,
  total,
}) => {
  if (total === 0) {
    return <p className="text-sm text-gray-600">No products found.</p>;
  }

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <p className="text-sm text-gray-600 mt-4 -mb-3">
      Showing <span className="font-medium">{start}</span>–
      <span className="font-medium">{end}</span> of{" "}
      <span className="font-medium">{total}</span> results
    </p>
  );
};

export default ProductCountInfo;
