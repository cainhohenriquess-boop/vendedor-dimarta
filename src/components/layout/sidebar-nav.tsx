"use client";

import { LayoutGrid, PackageSearch, PlusSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const icons = [LayoutGrid, PackageSearch, PlusSquare];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {NAV_ITEMS.map((item, index) => {
        const Icon = icons[index];
        const isActive =
          item.href === "/"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-slate-600 hover:bg-primary/10 hover:text-primary",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
