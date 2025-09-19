import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | SkyMarket",
  description: "Detroit-first marketplace connecting customers with vetted drone operators and couriers.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About SkyMarket</h1>
      <p className="text-gray-700 mb-4">
        We’re building the open marketplace for last-mile and aerial services in Detroit Metro—bringing together
        consumers, independent couriers, and licensed drone operators with transparent pricing, real ETAs, and compliant
        operations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">What We Value</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
            <li>Clarity: all-in prices, realistic ETAs, and upfront policies</li>
            <li>Trust: escrow-backed payments, reviews, and safety guardrails</li>
            <li>Compliance: FAA Part‑107, LAANC, weather gating, geofencing</li>
            <li>Choice: compare multiple providers and modalities</li>
          </ul>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Why Detroit First</h3>
          <p className="text-gray-700 text-sm">
            Detroit Metro is a perfect proving ground: dense corridors, varied weather, and strong local businesses. We
            focus on serving these neighborhoods exceptionally well before expanding.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">What We’re Building</h2>
      <p className="text-gray-700 mb-6">
        A unified platform with listings/catalog, pricing engine, scheduling, booking with escrow, messaging, live
        tracking, reviews, compliance checks, and payouts—designed for p95 performance under 300ms and 99.95% uptime.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Sustainability & Fairness</h2>
      <p className="text-gray-700">
        Transparent marketplace fees, clear provider earnings, and fast payouts. Two‑sided ratings drive quality. Safety
        and privacy are built in with masked contact details and media moderation.
      </p>
    </main>
  )
}


