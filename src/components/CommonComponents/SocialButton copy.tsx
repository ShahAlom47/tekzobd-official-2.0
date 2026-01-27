"use client";

import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";

type SocialLink = {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const socialLinks: SocialLink[] = [
  {
    href: "https://www.facebook.com/profile.php?id=61579126510916",
    Icon: FaFacebookF,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/tekzobd/",
    Icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@tekzobd_official",
    Icon: FaTiktok,
    label: "TikTok",
  },
  {
    href: "https://www.youtube.com/@yourChannel",
    Icon: FaYoutube,
    label: "YouTube",
  },
];

type IconSize = "sm" | "md" | "lg" | "xl" | "2xl";

const iconSizeClasses: Record<IconSize, string> = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-base",
  xl: "text-base",
  "2xl": "text-xl",
};

export default function SocialButtons({
  className = "",
  iconSize = "xl",
}: {
  className?: string;
  iconSize?: IconSize;
}) {
  const iconClass = iconSizeClasses[iconSize] || "text-sm";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map(({ href, Icon, label }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-600 hover:text-blue-600 transition"
        >
          <Icon className={iconClass} />
        </Link>
      ))}
    </div>
  );
}
