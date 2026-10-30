'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Package, Search, RefreshCw, PlusCircle, Tag } from 'lucide-react';
import { ApiResponse, ProductItem } from '@/types/api';
import { StockBadge, formatMoney } from '@/components/ui/status-badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/feedback';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const json: ApiResponse<ProductItem[]> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
      }
      setProducts(json.data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchInitial() {
      try {
        const res = await fetch('/api/products');
        const json: ApiResponse<ProductItem[]> = await res.json();
        if (ignore) return;
        if (!res.ok || !json.success) {
          throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
        }
        setProducts(json.data);
        setError(null);
      } catch (err: unknown) {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch products';
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
    await loadProducts();
  };

  // Extract unique category names for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
            <Package className="h-4 w-4" />
            <span>Catalogue</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View active stock levels, pricing, SKU codes, and categories.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Fetching product inventory..." />
      ) : error ? (
        <ErrorState title="Could not load products" message={error} onRetry={handleRefresh} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="The product catalog is currently empty."
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No matching products"
          description={`No products matched "${searchQuery}".`}
          actionLabel="Clear filter"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    SKU
                  </th>
                  <th scope="col" className="px-3 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right">
                    Price
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-6 text-center">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-400">ID: {product.id}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-mono text-xs rounded bg-slate-100 px-2 py-1 text-slate-700">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-700/10">
                        {product.category?.name ?? 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right font-medium text-slate-900">
                      {formatMoney(product.price)}
                    </td>
                    <td className="py-4 pl-3 pr-6 text-center">
                      <StockBadge quantity={product.stockQty} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      )}
    </div>
  );
}
