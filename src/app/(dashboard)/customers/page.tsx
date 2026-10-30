'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Users, Search, RefreshCw, PlusCircle, Mail, Phone, MapPin, Receipt } from 'lucide-react';
import { ApiResponse, CustomerItem } from '@/types/api';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/feedback';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = useCallback(async () => {
    try {
      const res = await fetch('/api/customers');
      const json: ApiResponse<CustomerItem[]> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
      }
      setCustomers(json.data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchInitial() {
      try {
        const res = await fetch('/api/customers');
        const json: ApiResponse<CustomerItem[]> = await res.json();
        if (ignore) return;
        if (!res.ok || !json.success) {
          throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
        }
        setCustomers(json.data);
        setError(null);
      } catch (err: unknown) {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch customers';
        setError(msg);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchInitial();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await loadCustomers();
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase();
      const matchName = cust.name.toLowerCase().includes(q);
      const matchPhone = cust.phone.toLowerCase().includes(q);
      const matchEmail = cust.email?.toLowerCase().includes(q) ?? false;
      return matchName || matchPhone || matchEmail;
    });
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
            <Users className="h-4 w-4" />
            <span>Parties</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Registered customer accounts, contact details, and sales history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-700' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/sales/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Sale</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching customer records..." />
      ) : error ? (
        <ErrorState title="Could not load customers" message={error} onRetry={handleRefresh} />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="There are currently no customer profiles registered."
        />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title="No matching customers"
          description={`No customer matched "${searchQuery}".`}
          actionLabel="Clear filter"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Phone
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Address
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-6 text-center">
                    Invoices
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800 text-xs">
                          {cust.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{cust.name}</div>
                          <div className="text-xs text-slate-400">ID: {cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-600">
                      {cust.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-slate-600">
                      {cust.address ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cust.address}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-6 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <Receipt className="h-3 w-3 text-slate-500" />
                        <span>{cust._count?.sales ?? 0}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      )}
    </div>
  );
}
