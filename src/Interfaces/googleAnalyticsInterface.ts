// types.ts

// Table Row Type
export interface TrafficRow {
  pagePath: string;
  pageTitle: string;
  eventName: string;
  linkText: string;
  date: string; // formatted date string
  eventCount: string; // আসছে string হিসেবে (GA data)
  totalUsers: string;
  pageViews: string;
}

// Summary Metrics
export interface SummaryMetrics {
  totalUsers: number;
  pageViews: number;
  events: number;
}

// Extra Metrics
export interface ExtraMetrics {
  homeViews: number;
  shopViews: number;
  productViews: number;
  addToCart: number;
  checkout: number;
}

// API Response Row Shape (GA থেকে আসা raw data)
export interface ApiDimensionValue {
  value: string;
}

export interface ApiMetricValue {
  value: string;
}

export interface ApiRow {
  dimensionValues: ApiDimensionValue[];
  metricValues: ApiMetricValue[];
}

export interface TrafficApiResponse {
  rows: ApiRow[];
}
