import { ReactNode } from 'react';
import { DashboardNav } from '@/components/navigation/dashboard-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      {/* Navigation sidebar & mobile nav */}
      <DashboardNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          {children}
        </div>
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          Shop Management ERP • Active Foundation
        </footer>
      </main>
    </div>
  );
}

