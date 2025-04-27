// app/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const nav = [
  { label: "home", href: "/" },
  { label: "breaking news", href: "/news" },
  { label: "jury duty", href: "/courtroom" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="
      absolute top-4 left-4 z-50
      flex gap-5 flex-col
      px-2 py-1 rounded-md
      font-mono text-lg
      select-none
    "
    >
      {nav.map(({ label, href }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`
              ${
                active
                  ? "underline decoration-wavy decoration-purple-700 font-extrabold text-purple-700 opacity-100"
                  : "font-normal text-gray-900 opacity-70"
              }

              underline-offset-2
            `}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
