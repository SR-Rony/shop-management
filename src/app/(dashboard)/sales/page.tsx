'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Receipt, Search, RefreshCw, PlusCircle, Calendar, Filter } from 'lucide-react';
import { ApiResponse, SaleRecord } from '@/types/api';
import { SaleStatusBadge, formatMoney } from '@/components/ui/status-badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/feedback';

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadSales = useCallback(async () => {
    try {
      const res = await fetch('/api/sales');
      const json: ApiResponse<SaleRecord[]> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
      }
      setSales(json.data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch sales';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchInitial() {
      try {
        const res = await fetch('/api/sales');
        const json: ApiResponse<SaleRecord[]> = await res.json();
        if (ignore) return;
        if (!res.ok || !json.success) {
          throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
        }
        setSales(json.data);
        setError(null);
      } catch (err: unknown) {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch sales';
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
    await loadSales();
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const q = searchQuery.toLowerCase();
      const matchInvoice = sale.invoiceNo.toLowerCase().includes(q);
      const matchCustomer = sale.customer?.name.toLowerCase().includes(q) ?? false;
      const matchStatus = statusFilter === 'all' || sale.status === statusFilter;
      return (matchInvoice || matchCustomer) && matchStatus;
    });
  }, [sales, searchQuery, statusFilter]);

  // Aggregate stats
  const totals = useMemo(() => {
    let grandTotal = 0;
    let grandPaid = 0;
    for (const sale of sales) {
      grandTotal += parseFloat(sale.totalAmount) || 0;
      grandPaid += parseFloat(sale.paidAmount) || 0;
    }
    return {
      total: grandTotal,
      paid: grandPaid,
      due: Math.max(0, grandTotal - grandPaid),
    };
  }, [sales]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
            <Receipt className="h-4 w-4" />
            <span>Transactions</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sales & Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track sales invoices, payment allocations, customer balances, and statuses.
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
            <span>Create Sale</span>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      {!loading && !error && sales.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Invoiced
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {formatMoney(totals.total)}
            </div>
            <div className="mt-1 text-xs text-slate-500">Across {sales.length} orders</div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Total Collected
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-900">
              {formatMoney(totals.paid)}
            </div>
            <div className="mt-1 text-xs text-emerald-700">Settled payments</div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Outstanding Dues
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-900">{formatMoney(totals.due)}</div>
            <div className="mt-1 text-xs text-amber-700">Pending receivables</div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number or customer..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="all">All Statuses ({sales.length})</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching sales records..." />
      ) : error ? (
        <ErrorState title="Could not load sales" message={error} onRetry={handleRefresh} />
      ) : sales.length === 0 ? (
        <EmptyState
          title="No sales recorded"
          description="There are no sales transactions in the system yet."
          actionLabel="Create First Sale"
          actionHref="/sales/new"
        />
      ) : filteredSales.length === 0 ? (
        <EmptyState
          title="No matching sales"
          description={`No transactions matched your search criteria.`}
          actionLabel="Clear filter"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    Invoice No
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    Total
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    Paid
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <div className="font-mono font-semibold text-teal-800">{sale.invoiceNo}</div>
                      <div className="text-xs text-slate-400">
                        {sale.items?.length ?? 0} {sale.items?.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="font-medium text-slate-900">{sale.customer?.name}</div>
                      <div className="text-xs text-slate-500">{sale.customer?.phone}</div>
                    </td>
                    <td className="px-3 py-4 text-right font-semibold text-slate-900">
                      {formatMoney(sale.totalAmount)}
                    </td>
                    <td className="px-3 py-4 text-right text-emerald-700 font-medium">
                      {formatMoney(sale.paidAmount)}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <SaleStatusBadge status={sale.status} />
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right text-xs text-slate-500">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDate(sale.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
            Showing {filteredSales.length} of {sales.length} transactions
          </div>
        </div>
      )}
    </div>
  );
}
