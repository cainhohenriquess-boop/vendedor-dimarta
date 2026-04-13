import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { APP_NAME } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  const nextPath = readSingleValue(params.next);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card flex min-h-[620px] flex-col justify-between p-8 sm:p-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              Uso interno da loja
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                {APP_NAME} para vendedores consultarem preco e estoque sem perder
                tempo no balcao.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-500">
                Sistema web profissional para cadastrar, buscar e visualizar
                produtos de forma rapida durante o atendimento da loja de
                calcados.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-subtle p-5">
              <p className="text-3xl font-semibold text-slate-900">1</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Busca sempre visivel para encontrar produtos em segundos.
              </p>
            </div>
            <div className="surface-subtle p-5">
              <p className="text-3xl font-semibold text-slate-900">2</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preco e promocao em destaque para atendimento rapido.
              </p>
            </div>
            <div className="surface-subtle p-5">
              <p className="text-3xl font-semibold text-slate-900">3</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Cadastro organizado para crescer com a operacao da loja.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card flex items-center p-6 sm:p-8">
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Login do vendedor
              </p>
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                Acesse o painel
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Entre com a conta de vendedor para cadastrar, editar, pesquisar e
                consultar os produtos da loja.
              </p>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/90 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Credenciais de teste</p>
              <p className="mt-2">E-mail: vendedor@dimarta.com</p>
              <p>Senha: 12345678</p>
            </div>

            <LoginForm nextPath={nextPath} />
          </div>
        </section>
      </div>
    </main>
  );
}
