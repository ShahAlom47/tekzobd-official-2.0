import React from "react";
import clsx from "clsx";
import Link from "next/link";

interface PrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  href?: string; 
  loading?: boolean;   // ✅ New
  disabled?: boolean;  // ✅ New
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  type = "button",
  onClick,
  href,
  loading = false,
  disabled = false,
}) => {
  const baseClass = clsx(
    "px-4 py-1 rounded-full font-medium flex gap-2 items-center text-normal",
    "transition-all duration-300 ease-in-out",
    "border border-brandPrimary text-brandNeutral",
    "hover:bg-brandPrimary hover:text-white",
    (disabled || loading) && "opacity-60 cursor-not-allowed hover:bg-transparent hover:text-brandNeutral",
    className
  );

  // ✅ যদি href থাকে
  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        )}
        {children}
      </Link>
    );
  }

  // ✅ default button
  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClass}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      )}
      {children}
    </button>
  );
};

export default PrimaryButton;
