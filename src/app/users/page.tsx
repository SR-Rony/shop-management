'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/app/(dashboard)/layout';
import {
  UserCog,
  PlusCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { ApiResponse, UserItem, UserRole } from '@/types/api';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/feedback';

export default function UsersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiForbidden, setApiForbidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived authorization check from session or API status
  const isForbidden = apiForbidden || (Boolean(session?.user) && session?.user?.role !== 'ADMIN');

  // Create User modal / form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CASHIER');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 403) {
        setApiForbidden(true);
        setLoading(false);
        return;
      }
      if (res.status === 401) {
        router.push('/login?redirectTo=/users' as Route);
        return;
      }

      const json: ApiResponse<UserItem[]> = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
      }

      setUsers(json.data);
      setError(null);
      setApiForbidden(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;

    async function initialLoad() {
      try {
        const res = await fetch('/api/users');
        if (ignore) return;

        if (res.status === 403) {
          setApiForbidden(true);
          setLoading(false);
          return;
        }
        if (res.status === 401) {
          router.push('/login?redirectTo=/users' as Route);
          return;
        }

        const json: ApiResponse<UserItem[]> = await res.json();
        if (ignore) return;

        if (!res.ok || !json.success) {
          throw new Error(json.success === false ? json.error : `HTTP ${res.status}`);
        }

        setUsers(json.data);
        setError(null);
        setApiForbidden(false);
      } catch (err: unknown) {
        if (ignore) return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(msg);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchUsers();
  };

  const handleOpenModal = () => {
    setName('');
    setPhone('');
    setPassword('');
    setRole('CASHIER');
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          password,
          role,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Error ${res.status}`);
      }

      // Success
      setFormSuccess(`User "${name.trim()}" created successfully!`);
      setName('');
      setPhone('');
      setPassword('');
      setRole('CASHIER');
      await fetchUsers();

      // Automatically close modal after brief delay
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      const matchRole = u.role.toLowerCase().includes(q);
      return matchName || matchPhone || matchRole;
    });
  }, [users, searchQuery]);

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

  const renderRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
            <Shield className="h-3 w-3" />
            ADMIN
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
            <Shield className="h-3 w-3" />
            MANAGER
          </span>
        );
      case 'CASHIER':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
            <Shield className="h-3 w-3" />
            CASHIER
          </span>
        );
    }
  };

  // If forbidden
  if (isForbidden) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4 shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Permission Denied</h1>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            You do not have permission to view this page. This section is restricted to
            administrators only.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
              <UserCog className="h-4 w-4" />
              <span>Administration</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage system access, roles, and staff login accounts.
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
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create User</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or role..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingState message="Fetching system users..." />
        ) : error ? (
          <ErrorState title="Could not load users" message={error} onRetry={handleRefresh} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="There are currently no staff accounts registered."
            actionLabel="Create First User"
            onAction={handleOpenModal}
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No matching users"
            description={`No user matched "${searchQuery}".`}
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center">
                      Active
                    </th>
                    <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800 text-xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-400">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4">{renderRoleBadge(u.role)}</td>
                      <td className="px-3 py-4 text-center">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-800">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right text-xs text-slate-500">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(u.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Create New User</h2>
                    <p className="text-xs text-slate-500">
                      Add a staff member account with credentials
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariqul Islam"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="userPhone"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Phone (Login ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userPhone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801700000001"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Hint: E.164 format with country code (e.g. +8801700000000)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="userPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="userPassword"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <p className="mt-1 text-xs text-slate-400">Must be at least 8 characters</p>
                </div>

                <div>
                  <label
                    htmlFor="userRole"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="userRole"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="CASHIER">CASHIER (POS & Sales only)</option>
                    <option value="MANAGER">MANAGER (Operations & Inventory)</option>
                    <option value="ADMIN">ADMIN (Full access including users)</option>
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50 transition"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating User...</span>
                      </>
                    ) : (
                      <span>Create User</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
