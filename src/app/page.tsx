const plannedModules = [
  [
    'Products & Inventory',
    'Product catalogue, stock levels, movement history and low-stock alerts.',
  ],
  ['Purchases & Suppliers', 'Purchase records, supplier balances and supplier payment history.'],
  ['Customers & Sales POS', 'Customer profiles, quick sales, invoices, partial payments and dues.'],
  ['Returns & Refunds', 'Traceable sales returns, purchase returns and refund adjustments.'],
  [
    'Finance & Reports',
    'Income and expenses, cash/bank records, receivables, payables and reports.',
  ],
  ['Users & Permissions', 'Role-based access for the owner, cashier and other staff.'],
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
            Project Foundation
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Shop Management ERP
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            A planned workspace for managing retail products, stock, customers, sales and financial
            records.
          </p>
        </div>
        <span className="w-fit rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
          Foundation only
        </span>
      </header>

      <section className="py-8">
        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Welcome</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            This starter project establishes the application shell and engineering conventions. ERP
            modules shown below are planned features, not implemented functionality.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Default currency</p>
              <p className="mt-1 text-lg font-bold">BDT</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Default timezone</p>
              <p className="mt-1 text-lg font-bold">Asia/Dhaka</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Architecture</p>
              <p className="mt-1 text-lg font-bold">Modular monolith</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Planned modules</h2>
            <p className="mt-1 text-sm text-slate-500">
              For planning and discussion; not active features yet.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plannedModules.map(([title, description]) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-200 pt-5 text-sm text-slate-500">
        Development foundation • Review documentation before implementing each phase.
      </footer>
    </main>
  );
}
