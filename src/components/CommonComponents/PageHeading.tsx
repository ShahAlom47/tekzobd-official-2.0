"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const PageHeading = ({ title, isDetailsPage, subTitle }: { title?: string; isDetailsPage?: boolean; subTitle?: string }) => {
  const pathname = usePathname() || "/";
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastIndex = pathSegments.length - 1;

  const currentPage = isDetailsPage
    ? title || "Details"
    : pathSegments[lastIndex] || "Home";

  return (
    <div className="text-grayDeep border-b border-brandNeutral pb-4">
      <h1 className="text-brandNeutral text-xl font-semibold capitalize">
        {currentPage.replace(/-/g, " ")}
        {isDetailsPage && subTitle && (
          <>
            {" "}
            / <span className="text-gray-600 font-normal capitalize  ">{subTitle.slice(0, 15)}....</span>
          </>
        )}
      </h1>
      <nav className="text-sm mt-1">
        <Link href="/" className="text-gray-500 hover:text-brandPrimary">
          Home
        </Link>
        {pathSegments.map((segment, index) => {
            if (segment === "user") return null; // Skip 'user'
          const isCurrent =
            (lastIndex === index && !isDetailsPage) ||
            (lastIndex === index && isDetailsPage);

          const segmentText =
            index === lastIndex && isDetailsPage
              ? title
              :segment.replace(/-/g, " ");

          const segmentHref = `/${pathSegments.slice(0, index + 1).join("/")}`;

          return isCurrent ? (
            <span
              key={index}
              className="text-brandPrimary font-medium capitalize"
            >
              {" "}
              / {segmentText}
            </span>
          ) : (
            <span key={index}>
              {" "}
              /{" "}
              <Link
                href={segmentHref}
                className="text-gray-500 hover:text-brandPrimary capitalize"
              >
                {segmentText}
              </Link>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default PageHeading;
