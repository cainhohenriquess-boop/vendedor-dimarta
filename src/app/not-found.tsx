import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface-card max-w-xl space-y-4 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Nao encontrado
        </p>
        <h1 className="font-display text-4xl font-semibold text-slate-900">
          O recurso solicitado nao existe.
        </h1>
        <p className="text-sm leading-7 text-slate-500">
          Volte para o dashboard ou para a listagem de produtos para continuar o
          atendimento.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "primary" })}>
            Ir para dashboard
          </Link>
          <Link href="/products" className={buttonVariants({ variant: "outline" })}>
            Ver produtos
          </Link>
        </div>
      </div>
    </main>
  );
}
