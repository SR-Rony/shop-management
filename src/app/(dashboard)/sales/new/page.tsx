'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  User,
  ShoppingBag,
} from 'lucide-react';
import { ApiResponse, CustomerItem, ProductItem, CreateSaleInput, SaleRecord } from '@/types/api';
import { formatMoney } from '@/components/ui/status-badge';
import { LoadingState, ErrorState } from '@/components/ui/feedback';

interface FormLineItem {
  key: string;
  productId: string;
  quantity: number;
}

export default function NewSalePage() {
  // Reference data
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<string | null>(null);

  // Form State
  const [customerId, setCustomerId] = useState<string>('');
  const [items, setItems] = useState<FormLineItem[]>([
    { key: 'item-1', productId: '', quantity: 1 },
  ]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdSale, setCreatedSale] = useState<SaleRecord | null>(null);

  // Fetch customers and products
  const loadPrerequisites = useCallback(async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/products'),
      ]);

      const custJson: ApiResponse<CustomerItem[]> = await custRes.json();
      const prodJson: ApiResponse<ProductItem[]> = await prodRes.json();

      if (!custRes.ok || !custJson.success) {
        throw new Error(custJson.success === false ? custJson.error : 'Failed to fetch customers');
      }
      if (!prodRes.ok || !prodJson.success) {
        throw new Error(prodJson.success === false ? prodJson.error : 'Failed to fetch products');
      }

      setCustomers(custJson.data);
      setProducts(prodJson.data);
      setInitialError(null);

      // Default to first customer if available and none selected
      if (custJson.data.length > 0) {
        setCustomerId((prev) => (prev ? prev : custJson.data[0].id));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load form dependencies';
      setInitialError(msg);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchInitial() {
      try {
        const [custRes, prodRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/products'),
        ]);

        const custJson: ApiResponse<CustomerItem[]> = await custRes.json();
        const prodJson: ApiResponse<ProductItem[]> = await prodRes.json();

        if (ignore) return;

        if (!custRes.ok || !custJson.success) {
          throw new Error(
            custJson.success === false ? custJson.error : 'Failed to fetch customers',
          );
        }
        if (!prodRes.ok || !prodJson.success) {
          throw new Error(prodJson.success === false ? prodJson.error : 'Failed to fetch products');
        }

        setCustomers(custJson.data);
        setProducts(prodJson.data);
        setInitialError(null);

        if (custJson.data.length > 0) {
          setCustomerId(custJson.data[0].id);
        }
      } catch (err: unknown) {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : 'Failed to load form dependencies';
        setInitialError(msg);
      } finally {
        if (!ignore) {
          setInitialLoading(false);
        }
      }
    }

    fetchInitial();

    return () => {
      ignore = true;
    };
  }, []);

  // Map products by ID for fast lookup
  const productMap = useMemo(() => {
    const map = new Map<string, ProductItem>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  // Add line item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId: '',
        quantity: 1,
      },
    ]);
  };

  // Remove line item
  const handleRemoveItem = (keyToRemove: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.key !== keyToRemove));
  };

  // Update item product
  const handleProductChange = (key: string, newProductId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, productId: newProductId } : item)),
    );
  };

  // Update item quantity
  const handleQuantityChange = (key: string, qty: number) => {
    const validQty = Math.max(1, isNaN(qty) ? 1 : Math.floor(qty));
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: validQty } : item)),
    );
  };

  // Calculations
  const calculatedSummary = useMemo(() => {
    let grandTotal = 0;
    let totalQuantity = 0;
    let hasInvalidItem = false;
    let stockWarning: string | null = null;

    // Track total requested per product to prevent over-allocation across rows
    const requestedPerProduct = new Map<string, number>();

    for (const item of items) {
      if (!item.productId) {
        hasInvalidItem = true;
        continue;
      }
      const product = productMap.get(item.productId);
      if (!product) {
        hasInvalidItem = true;
        continue;
      }

      const unitPrice = parseFloat(product.price) || 0;
      const lineTotal = unitPrice * item.quantity;
      grandTotal += lineTotal;
      totalQuantity += item.quantity;

      const currentRequested = (requestedPerProduct.get(item.productId) ?? 0) + item.quantity;
      requestedPerProduct.set(item.productId, currentRequested);

      if (currentRequested > product.stockQty) {
        stockWarning = `Requested quantity for "${product.name}" (${currentRequested}) exceeds available stock (${product.stockQty}).`;
      }
    }

    return {
      grandTotal,
      totalQuantity,
      hasInvalidItem,
      stockWarning,
    };
  }, [items, productMap]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerId) {
      setSubmitError('Please select a customer.');
      return;
    }

    if (items.length === 0) {
      setSubmitError('Please add at least one line item.');
      return;
    }

    const unselected = items.some((item) => !item.productId);
    if (unselected) {
      setSubmitError('Please select a product for each line item.');
      return;
    }

    const payload: CreateSaleInput = {
      customerId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json: ApiResponse<SaleRecord> = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.success === false ? json.error : `HTTP error ${res.status}`);
      }

      setCreatedSale(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record sale';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setCreatedSale(null);
    setSubmitError(null);
    setItems([{ key: `item-${Date.now()}`, productId: '', quantity: 1 }]);
    setInitialLoading(true);
    loadPrerequisites();
  };

  if (initialLoading) {
    return <LoadingState message="Loading customers and inventory catalogue..." />;
  }

  if (initialError) {
    return (
      <ErrorState
        title="Could not prepare sale form"
        message={initialError}
        onRetry={() => {
          setInitialLoading(true);
          loadPrerequisites();
        }}
      />
    );
  }

  // Success view when sale has been created
  if (createdSale) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Sale Created Successfully</h1>
              <p className="text-sm text-slate-500">
                Invoice{' '}
                <span className="font-mono font-semibold text-teal-800">
                  {createdSale.invoiceNo}
                </span>{' '}
                has been posted.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice Number</span>
              <span className="font-mono font-bold text-slate-900">{createdSale.invoiceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-semibold text-slate-900">{createdSale.customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Items Sold</span>
              <span className="font-medium text-slate-700">
                {createdSale.items?.length ?? 0}{' '}
                {createdSale.items?.length === 1 ? 'line item' : 'line items'}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
              <span className="text-slate-900">Total Invoiced</span>
              <span className="text-teal-800">{formatMoney(createdSale.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Status</span>
              <span className="font-semibold text-sky-700">{createdSale.status}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sales"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
            >
              <Receipt className="h-4 w-4" />
              <span>View All Sales</span>
            </Link>
            <button
              type="button"
              onClick={handleResetForAnother}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Another Sale</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          href="/sales"
          className="inline-flex items-center gap-1 hover:text-teal-700 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sales</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
          <Receipt className="h-4 w-4" />
          <span>POS / Sales Invoice</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create New Sale
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a customer, add products with quantities, and post a new sales invoice.
        </p>
      </div>

      {/* Error alert if submission failed */}
      {submitError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to record sale</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Warning if stock exceeded */}
      {calculatedSummary.stockWarning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">Stock Warning</p>
            <p className="mt-0.5">{calculatedSummary.stockWarning}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
            <User className="h-5 w-5 text-teal-700" />
            <h2>1. Customer Information</h2>
          </div>

          <div className="max-w-md">
            <label
              htmlFor="customerSelect"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Select Customer <span className="text-rose-500">*</span>
            </label>
            <select
              id="customerSelect"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="" disabled>
                -- Select a customer --
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">Only registered customers can be billed.</p>
          </div>
        </div>

        {/* Product Items Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <ShoppingBag className="h-5 w-5 text-teal-700" />
              <h2>2. Line Items</h2>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const selectedProduct = productMap.get(item.productId);
              const unitPrice = selectedProduct ? parseFloat(selectedProduct.price) || 0 : 0;
              const lineTotal = unitPrice * item.quantity;
              const isOverStock = selectedProduct && item.quantity > selectedProduct.stockQty;

              return (
                <div
                  key={item.key}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Product #{index + 1}
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(item.key, e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    >
                      <option value="">-- Choose product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.stockQty <= 0}>
                          {p.name} — {p.sku} ({formatMoney(p.price)}){' '}
                          {p.stockQty <= 0 ? '[OUT OF STOCK]' : `[Stock: ${p.stockQty}]`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedProduct ? selectedProduct.stockQty : 9999}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.key, parseInt(e.target.value, 10))}
                      required
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none ${
                        isOverStock
                          ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                          : 'border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                      }`}
                    />
                  </div>

                  <div className="w-28 text-right">
                    <span className="block text-xs font-medium text-slate-500 mb-1">
                      Line Total
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatMoney(lineTotal)}
                    </span>
                  </div>

                  <div className="flex items-center sm:pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.key)}
                      disabled={items.length <= 1}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another product</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Submit Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Estimated Grand Total
              </div>
              <div className="mt-1 text-3xl font-extrabold text-teal-900">
                {formatMoney(calculatedSummary.grandTotal)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {calculatedSummary.totalQuantity} total units across {items.length} line item(s)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/sales"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || calculatedSummary.hasInvalidItem}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting Sale...</span>
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4" />
                    <span>Post & Record Sale</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
