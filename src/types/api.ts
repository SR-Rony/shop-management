export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: string;
  cost: string;
  stockQty: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sales: number;
  };
}

export type SaleStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';

export interface SaleProductSummary {
  id: string;
  name: string;
  sku: string;
}

export interface SaleItemRecord {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  createdAt: string;
  product: SaleProductSummary;
}

export interface SalePaymentRecord {
  id: string;
  saleId: string;
  amount: string;
  method: PaymentMethod;
  reference: string | null;
  paidAt: string;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  invoiceNo: string;
  customerId: string;
  totalAmount: string;
  paidAmount: string;
  status: SaleStatus;
  createdAt: string;
  updatedAt: string;
  customer: CustomerItem;
  items: SaleItemRecord[];
  payments: SalePaymentRecord[];
}

export interface CreateSaleItemInput {
  productId: string;
  quantity: number;
}

export interface CreateSaleInput {
  customerId: string;
  items: CreateSaleItemInput[];
}
