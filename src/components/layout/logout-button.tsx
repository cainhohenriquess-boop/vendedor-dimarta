"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full justify-center"
      variant="outline"
      onClick={() => {
        startTransition(async () => {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
          });

          if (!response.ok) {
            toast.error("Nao foi possivel encerrar a sessao.");
            return;
          }

          router.replace("/login");
          router.refresh();
        });
      }}
      disabled={isPending}
    >
      <LogOut className="size-4" />
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
