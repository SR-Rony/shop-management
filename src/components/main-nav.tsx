'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Store,
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  UserCog,
  LogOut,
  LogIn,
  Shield,
} from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinks: Array<{
    name: string;
    href: Route;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Sales', href: '/sales', icon: Receipt },
  ];

  if (session?.user?.role === 'ADMIN') {
    navLinks.push({ name: 'Users', href: '/users' as Route, icon: UserCog });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 leading-none">Shop ERP</span>
              <span className="ml-1 text-xs text-teal-700 font-medium">Retail</span>
            </div>
          </Link>

          {/* Links when authenticated */}
          {status === 'authenticated' && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-teal-50 text-teal-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* User state / Auth actions */}
        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
          ) : status === 'authenticated' && session.user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  {session.user.name || 'User'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium justify-end">
                  <Shield className="h-3 w-3" />
                  <span>{session.user.role}</span>
                </span>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                {(session.user.name || 'U').slice(0, 2).toUpperCase()}
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainNav;
