export default function PageHeader({
  title,
  crumb = "ARGP › Ar Rjum Gold Project › CDE",
  actions,
}: {
  title: string;
  crumb?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="bg-panel border-b border-line px-6 py-3 flex justify-between items-center sticky top-0 z-[5]">
      <div>
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="text-[11px] text-muted">{crumb}</div>
      </div>
      <div className="flex gap-2">{actions}</div>
    </header>
  );
}
