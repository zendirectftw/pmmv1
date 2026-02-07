import type { Role, MetalType, ListingCondition, OrderStatus } from "@prisma/client";

export type { Role, MetalType, ListingCondition, OrderStatus };

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
