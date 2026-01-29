import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const PROPERTY_ID = process.env.NEXT_PUBLIC_GA4_PROPERTY_ID || "";
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

// const analyticsDataClient = new BetaAnalyticsDataClient({
//   keyFilename: path.join(
//     process.cwd(),
//     process.env.NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS || "/keys/service-account.json"
//   ),
// });


const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email:GOOGLE_CLIENT_EMAIL,
    private_key:GOOGLE_PRIVATE_KEY,
  },
});


// Helper function: filter → {startDate, endDate}
function getDateRangeFromFilter(filter:"today"| "week" | "month" | "year" | "all") {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
  const start = new Date(today);

  switch (filter) {
    case "today":
  start.setDate(today.getDate()); // আজকের দিন
  break;
    case "week":
      start.setDate(today.getDate() - 7);
      break;
    case "month":
      start.setMonth(today.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(today.getFullYear() - 1);
      break;
    case "all":
      // GA4 maximum 5 years back supported
      start.setFullYear(today.getFullYear() - 5);
      break;
    default:
      start.setDate(today.getDate() - 30); // fallback: last 30 days
  }

  const startDate = start.toISOString().split("T")[0];
  return { startDate, endDate };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") as "today"
  | "week" | "month" | "year" | "all") || "month";

    const { startDate, endDate } = getDateRangeFromFilter(filter);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "eventCount" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
      ],
      dimensions: [
        { name: "pagePath" },
        { name: "pageTitle" },
        { name: "eventName" },
        { name: "linkText" },
        { name: "date" },
      ],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    });

    return NextResponse.json({ success: true, data: response }, { status: 200 });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch GA4 data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
