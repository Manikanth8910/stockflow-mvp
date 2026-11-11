export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
  organizationName?: string | null;
  defaultLowStockThreshold?: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  organizationId?: string | null;
  iat?: number;
  exp?: number;
}

export interface ProductItem {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: number | null;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
  effectiveThreshold: number;
  isLowStock: boolean;
  lastUpdatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  metrics: {
    totalProducts: number;
    totalQuantityOnHand: number;
    totalLowStockItems: number;
    totalInventoryValuation: number;
  };
  lowStockProducts: ProductItem[];
  organization: {
    id: string;
    name: string;
    defaultLowStockThreshold: number;
  };
}
