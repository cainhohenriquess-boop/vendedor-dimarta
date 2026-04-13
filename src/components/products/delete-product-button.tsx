"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
  redirectTo?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
};

export function DeleteProductButton({
  productId,
  productName,
  redirectTo,
  variant = "ghost",
  size = "sm",
  label = "Excluir",
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={variant === "ghost" ? "text-rose-600 hover:bg-rose-50" : undefined}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
        {label}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="surface-card w-full max-w-md p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
                Confirmar exclusao
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Remover produto
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                O produto <strong>{productName}</strong> sera excluido com todas as
                variacoes de numeracao e estoque.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      const response = await fetch(`/api/products/${productId}`, {
                        method: "DELETE",
                      });

                      if (!response.ok) {
                        const payload = (await response.json().catch(() => null)) as
                          | { error?: string }
                          | null;
                        throw new Error(payload?.error ?? "Falha ao excluir o produto.");
                      }

                      toast.success("Produto excluido com sucesso.");
                      setOpen(false);

                      if (redirectTo) {
                        router.push(redirectTo);
                      } else {
                        router.refresh();
                      }
                    } catch (error) {
                      toast.error(getErrorMessage(error));
                    }
                  });
                }}
                disabled={isPending}
              >
                {isPending ? "Excluindo..." : "Excluir produto"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
