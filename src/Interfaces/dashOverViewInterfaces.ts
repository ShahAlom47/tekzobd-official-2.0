export interface DashboardOverviewData {
  users: {
    totalUsers: number;
    newUsers: number;
  };
  orders: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  sales: {
    totalSalesAmount: number;
  };
  products: {
    totalProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
  };
  categories: {
    totalCategories: number;
  };
}
