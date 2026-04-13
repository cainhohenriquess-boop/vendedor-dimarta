import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await requireUser();

  return (
    <AppShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
