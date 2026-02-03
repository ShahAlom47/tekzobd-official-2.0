"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";

interface PublicPagePaginationButtonProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function PublicPagePaginationButton({
  currentPage,
  totalPages,
  basePath = "",
}: PublicPagePaginationButtonProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString()); // ✅ শুধু page পরিবর্তন হবে, বাকি সব থাকবে
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-8 gap-2 flex-wrap items-center">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={createPageLink(currentPage - 1)}
               className="border border-blue-700 rounded-sm rounded-l-full px-1 py-[2px]  ml-1 hover:bg-blue-600 hover:text-indigo-50"
        >
        <MdArrowBackIos className="" />
        </Link>
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        return (
          <Link
            key={pageNum}
            href={createPageLink(pageNum)}
            className={`border border-blue-700 rounded-sm px-2 py- text-sm  ${
              pageNum === currentPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-600 hover:bg-blue-100"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={createPageLink(currentPage + 1)}
          className="border border-blue-700 rounded-sm rounded-r-full px-1 py-[2px] hover:bg-blue-600 hover:text-indigo-50"
        >
          <MdArrowBackIos className="rotate-180  " />
        </Link>
      )}
    </div>
  );
}
