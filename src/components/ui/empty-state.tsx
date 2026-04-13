type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-start gap-4 p-8">
      <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
        Sem resultados
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-2xl font-semibold">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
