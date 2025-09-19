import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How It Works | SkyMarket",
  description: "Understand search, compare, book, and track flows across services.",
}

export default function HowItWorksPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">How It Works</h1>
      <p className="text-gray-600 mb-8">
        SkyMarket is a Detroit-first, multi-modal marketplace for food delivery, courier services, and aerial imaging.
        Compare providers on price, ETA, and rating, then book with escrow-backed payments and live tracking.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">The 60‑Second Booking Flow</h2>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Search", desc: "Enter Detroit Metro pickup/drop or mission location." },
            { step: "2", title: "Compare", desc: "Filter by price, ETA, rating, modality, availability." },
            { step: "3", title: "Book", desc: "Choose ASAP or schedule. We authorize funds in escrow." },
            { step: "4", title: "Track", desc: "Realtime updates; PoD photo or media on completion." },
          ].map((s) => (
            <li key={s.step} className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                {s.step}
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-600">{s.desc}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Request vs Instant Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Instant Book</h3>
            <p className="text-gray-700 text-sm">
              Provider auto-accepts if available. Best for urgent food/courier jobs. You’ll see the ETA and all-in price
              before confirming. Funds are authorized, not captured, until completion.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Request to Book</h3>
            <p className="text-gray-700 text-sm">
              Send a scoped request (time window, locations, special instructions). Providers accept within SLAs, or
              you can switch to another option. Your authorization holds the slot and protects against no-shows.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Scheduling & Availability</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>ASAP or scheduled windows with enforced buffers and capacity per time slot.</li>
          <li>Coverage limited to Detroit Metro at launch; we validate addresses and service radius.</li>
          <li>For drone missions: built-in airspace checks (LAANC), weather gating, and geofencing.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Payments, Escrow, and Tips</h2>
        <p className="text-gray-700">
          At checkout we authorize your card and hold funds in escrow. On completion (or customer acceptance for imaging
          deliverables), we capture and release payouts to providers. Add a tip at checkout or after completion.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Tracking & Proof of Delivery</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Live map tracking for couriers; mission checklist for drone jobs.</li>
          <li>PoD photo/signature for deliveries; media gallery upload for imaging jobs.</li>
          <li>Shareable status and completion links for recipients and stakeholders.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Ratings, Disputes, and Refunds</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Two-sided ratings after completion; performance badges for on-time, safety, and quality.</li>
          <li>Report issues from the order: request re-dispatch or partial refund with evidence.</li>
          <li>Clear cancellation and refund policies; see <Link className="text-primary hover:underline" href="/terms">Terms</Link>.</li>
        </ul>
      </section>

      <div className="mt-8">
        <Link href="/browse" className="text-primary hover:underline">Browse services →</Link>
      </div>
    </main>
  )
}


