"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Generate page title from pathname
  const getPageTitle = () => {
    if (!pathname) return "Dashboard";

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const lastSegment = segments[segments.length - 1];

    // Capitalize and format
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
        </div>
      </div>
    </header>
  );
}
