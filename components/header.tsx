"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create-product", label: "Products" },
  { href: "/reports", label: "Reports" },
  { href: "/stock", label: "Stock" },
  { href: "/stock-movement", label: "Stock Movements" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="header">
      <div className="headerContainer flex justify-between items-center px-10 py-3">
        <div className="headerLeft">
          <Link href="/" className="logo flex gap-4 items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2_61)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 15.2699C6.56217 15.2699 5.1566 14.8435 3.96107 14.0447C2.76556 13.2459 1.83376 12.1105 1.28352 10.7821C0.733283 9.45367 0.589313 7.99193 0.869823 6.58173C1.15033 5.1715 1.84272 3.87613 2.85943 2.85943C3.87613 1.84272 5.1715 1.15034 6.58173 0.869827C7.99193 0.589317 9.45367 0.733287 10.7821 1.28352C12.1105 1.83376 13.2459 2.76556 14.0447 3.9611C14.8435 5.1566 15.2699 6.56217 15.2699 8H8V15.2699Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_2_61">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span className="font-bold text-[18px]">StockOps</span>
          </Link>
        </div>
        <div className="headerRight flex">
          <nav id="menu" className="flex gap-8">
            <ul className="navLinksContainer flex gap-9 items-center">
              {navLinks.map(({ href, label }) => {
                // const isActive = pathname.startsWith(href);
                const isActive = pathname === href;
                return (
                  <li
                    key={href}
                    className={clsx("listLink font-medium text-[14px]", {
                      hidden: isActive,
                      block: !isActive,
                    })}
                  >
                    <Link href={href}>{label}</Link>
                  </li>
                );
              })}
            </ul>
            <div className="userIcon">
              <Link
                href="/user"
                className="cursor-pointer block userIconContainer max-w-10 max-h-10 bg-white rounded-full p-2"
              >
                <svg
                  className="userIconSvg w-full h-auto"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.3334 35V31.6667C33.3334 29.8986 32.631 28.2029 31.3808 26.9526C30.1305 25.7024 28.4349 25 26.6667 25H13.3334C11.5653 25 9.86961 25.7024 8.61937 26.9526C7.36913 28.2029 6.66675 29.8986 6.66675 31.6667V35M26.6667 11.6667C26.6667 15.3486 23.682 18.3333 20.0001 18.3333C16.3182 18.3333 13.3334 15.3486 13.3334 11.6667C13.3334 7.98477 16.3182 5 20.0001 5C23.682 5 26.6667 7.98477 26.6667 11.6667Z"
                    stroke="#1E1E1E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
