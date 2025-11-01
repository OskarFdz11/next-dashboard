"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingStorefrontIcon,
  TagIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavLinksProps = {
  showTextOnAllSizes?: boolean; // ← muestra el texto también en mobile (para el drawer)
  onNavigate?: () => void; // ← cierra el drawer al hacer click
};

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Quotations",
    href: "/dashboard/quotations",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: BuildingStorefrontIcon,
  },
  { name: "Categories", href: "/dashboard/categories", icon: TagIcon },
  {
    name: "Billing Details",
    href: "/dashboard/billing-details",
    icon: BanknotesIcon,
  },
];

export default function NavLinks({
  showTextOnAllSizes = false,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const active = pathname === link.href;

        const baseClasses = clsx(
          "flex h-[48px] items-center gap-2 rounded-md text-sm font-medium transition-colors",
          active
            ? "bg-sky-100 text-blue-600"
            : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600",
          showTextOnAllSizes
            ? "w-full justify-start px-3"
            : "grow justify-center p-3 md:justify-start md:p-2 md:px-3"
        );

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onNavigate}
            className={baseClasses}
          >
            <LinkIcon className="w-6" />
            <p
              className={clsx(showTextOnAllSizes ? "block" : "hidden md:block")}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
