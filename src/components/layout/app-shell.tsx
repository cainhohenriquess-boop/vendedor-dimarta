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

        <main className="min-w-0 flex-1 space-y-6">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
