import { APP_NAME } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { LogoutButton } from "@/components/layout/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";

type AppShellProps = {
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 md:px-6 md:py-6">
        <aside className="hidden md:flex md:w-[280px] md:flex-col md:gap-6">
          <div className="surface-card space-y-5 p-6">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
                Loja de calçados
              </span>
              <div>
                <h1 className="font-display text-3xl font-semibold">{APP_NAME}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Consulta rápida de preço, estoque e cadastro para vendedores em
                  atendimento.
                </p>
              </div>
            </div>

            <SidebarNav />
          </div>

          <div className="surface-card space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="surface-card sticky top-4 z-30 mb-6 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Atendimento ágil
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Preço e estoque na mão
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Busque por marca, modelo, cor, categoria ou código interno sem
                  depender da memória do vendedor.
                </p>
              </div>
              <div className="surface-subtle min-w-48 px-4 py-3 text-sm text-slate-600">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Hoje
                </span>
                <span className="mt-1 block font-medium">{today}</span>
              </div>
            </div>
          </header>

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
