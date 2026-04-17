"use client";

import { Calculator, LayoutGrid, PackageSearch, PlusSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const icons = [LayoutGrid, PackageSearch, Calculator, PlusSquare];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <div className="surface-card grid grid-cols-4 p-2">
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
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-semibold transition",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
