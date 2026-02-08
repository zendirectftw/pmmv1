// We are defining these manually to prevent build-time errors 
// when Prisma hasn't generated its types yet.

export type Role = "USER" | "ADMIN" | string;
export type MetalType = "GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM" | string;
export type ListingCondition = "NEW" | "USED" | "BULLION" | "PROOF" | string;
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "DISPUTED" | string;

// This ensures any file importing from here stays happy
export type { Role as PrismaRole, MetalType as PrismaMetal, ListingCondition as PrismaCondition, OrderStatus as PrismaStatus };
