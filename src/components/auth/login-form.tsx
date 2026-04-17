"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

type LoginFormProps = {
  nextPath?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-500">{message}</p>;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => {
        startTransition(async () => {
          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });

            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as
                | { error?: string }
                | null;
              throw new Error(payload?.error ?? "Falha ao entrar.");
            }

            toast.success("Login realizado com sucesso.");
            router.replace(nextPath || "/");
            router.refresh();
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        });
      })}
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
          E-mail
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="pl-11"
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
          Senha
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="pl-11"
            {...register("password")}
          />
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar no sistema"
        )}
      </Button>
    </form>
  );
}
