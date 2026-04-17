"use client";

import { Calculator, Copy, ReceiptText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculatePromissoryInstallments,
  formatPromissoryValue,
} from "@/lib/promissory";

const EXAMPLE_TOTAL = "123";
const EXAMPLE_INSTALLMENTS = "6";

function sanitizeIntegerInput(value: string) {
  return value.replace(/\D+/g, "");
}

export function PromissoryCalculator() {
  const [totalAmount, setTotalAmount] = useState(EXAMPLE_TOTAL);
  const [installments, setInstallments] = useState(EXAMPLE_INSTALLMENTS);

  const parsedTotalAmount = Number(totalAmount);
  const parsedInstallments = Number(installments);

  let calculation:
    | ReturnType<typeof calculatePromissoryInstallments>
    | null = null;
  let errorMessage: string | null = null;

  if (totalAmount && installments) {
    try {
      calculation = calculatePromissoryInstallments(
        parsedTotalAmount,
        parsedInstallments,
      );
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Não foi possível calcular.";
    }
  }

  const copySummary = async () => {
    if (!calculation) {
      return;
    }

    const text = `${formatPromissoryValue(calculation.totalAmount)} em ${calculation.installments}x: ${calculation.summary}.`;

    await navigator.clipboard.writeText(text);
    toast.success("Resumo copiado.");
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Cálculo rápido
              </p>
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                Divisão inteira para promissórias
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Digite o valor total e a quantidade de promissórias. O sistema divide
                tudo em números inteiros, distribuindo a diferença de forma automática.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Valor total
                </label>
                <Input
                  inputMode="numeric"
                  placeholder="Ex.: 123"
                  value={totalAmount}
                  onChange={(event) => setTotalAmount(sanitizeIntegerInput(event.target.value))}
                />
                <p className="mt-2 text-xs text-slate-400">
                  Use apenas reais inteiros.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantidade de parcelas
                </label>
                <Input
                  inputMode="numeric"
                  placeholder="Ex.: 6"
                  value={installments}
                  onChange={(event) =>
                    setInstallments(sanitizeIntegerInput(event.target.value))
                  }
                />
                <p className="mt-2 text-xs text-slate-400">
                  Ex.: 6 para 6 promissórias.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setTotalAmount(EXAMPLE_TOTAL);
                  setInstallments(EXAMPLE_INSTALLMENTS);
                }}
              >
                <Calculator className="size-4" />
                Usar exemplo 123 em 6x
              </Button>
              {calculation ? (
                <Button variant="secondary" onClick={copySummary}>
                  <Copy className="size-4" />
                  Copiar resumo
                </Button>
              ) : null}
            </div>
          </div>

          <div className="surface-subtle space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ReceiptText className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Regra aplicada</p>
                <p className="text-sm text-slate-500">
                  As parcelas ficam com diferença máxima de 1 real.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[#d8c7b8] bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Exemplo
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                123 em 6x
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                3 parcelas de {formatPromissoryValue(21)} e 3 parcelas de{" "}
                {formatPromissoryValue(20)}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="surface-card border border-rose-200/70 p-6">
          <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>
        </section>
      ) : null}

      {calculation ? (
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card space-y-4 p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Resultado
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                {formatPromissoryValue(calculation.totalAmount)} em{" "}
                {calculation.installments}x
              </h3>
              <p className="text-sm leading-6 text-slate-500">{calculation.summary}.</p>
            </div>

            <div className="grid gap-3">
              {calculation.groups.map((group) => (
                <div key={`${group.amount}-${group.startInstallment}`} className="surface-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Parcelas {group.startInstallment} a {group.endInstallment}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {group.count} parcela(s) de {formatPromissoryValue(group.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Lista completa
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                Valor de cada promissória
              </h3>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {calculation.schedule.map((value, index) => (
                <div key={`${index + 1}-${value}`} className="surface-subtle p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Parcela {index + 1}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatPromissoryValue(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
