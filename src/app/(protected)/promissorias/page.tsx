import { PageHeader } from "@/components/layout/page-header";
import { PromissoryCalculator } from "@/components/promissory/promissory-calculator";

export default function PromissoriasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ferramenta"
        title="Calculadora de promissórias"
        description="Divida valores em promissórias com parcelas inteiras, prontas para anotar sem fazer conta manual no atendimento."
      />

      <PromissoryCalculator />
    </div>
  );
}
