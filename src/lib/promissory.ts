import { formatNumber } from "@/lib/utils";

export type PromissoryGroup = {
  amount: number;
  count: number;
  startInstallment: number;
  endInstallment: number;
};

export type PromissoryCalculation = {
  totalAmount: number;
  installments: number;
  groups: PromissoryGroup[];
  schedule: number[];
  summary: string;
};

export function formatPromissoryValue(value: number) {
  return `R$ ${formatNumber(value)}`;
}

export function calculatePromissoryInstallments(
  totalAmount: number,
  installments: number,
): PromissoryCalculation {
  if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
    throw new Error("Informe um valor total inteiro maior que zero.");
  }

  if (!Number.isInteger(installments) || installments <= 0) {
    throw new Error("Informe uma quantidade de parcelas inteira maior que zero.");
  }

  if (installments > totalAmount) {
    throw new Error(
      "A quantidade de parcelas não pode ser maior que o valor total em reais inteiros.",
    );
  }

  const baseAmount = Math.floor(totalAmount / installments);
  const remainder = totalAmount % installments;
  const schedule = Array.from({ length: installments }, (_, index) =>
    index < remainder ? baseAmount + 1 : baseAmount,
  );

  const groups: PromissoryGroup[] = [];
  let currentStart = 1;

  if (remainder > 0) {
    groups.push({
      amount: baseAmount + 1,
      count: remainder,
      startInstallment: currentStart,
      endInstallment: currentStart + remainder - 1,
    });
    currentStart += remainder;
  }

  if (installments - remainder > 0) {
    groups.push({
      amount: baseAmount,
      count: installments - remainder,
      startInstallment: currentStart,
      endInstallment: installments,
    });
  }

  const summary = groups
    .map((group) => `${group.count} parcela(s) de ${formatPromissoryValue(group.amount)}`)
    .join(" e ");

  return {
    totalAmount,
    installments,
    groups,
    schedule,
    summary,
  };
}
