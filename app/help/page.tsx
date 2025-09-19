import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center | SkyMarket",
  description: "FAQs and support resources for customers and providers.",
}

const faqs = [
  {
    q: "How do payments work?",
    a: "We authorize at booking and capture after completion/acceptance. Tips can be added at checkout or after.",
  },
  {
    q: "What if my provider is late?",
    a: "We monitor SLAs. If delayed, you’ll get updates and options for re-dispatch or partial refunds based on policy.",
  },
  {
    q: "Can I report a safety concern?",
    a: "Yes. See our Safety page and use in-app reporting. We triage and act quickly.",
  },
  {
    q: "Which areas are covered?",
    a: "Detroit Metro area at launch. We validate addresses and service radiuses per listing.",
  },
  {
    q: "Drone job compliance?",
    a: "FAA Part‑107 pilots, LAANC checks in applicable airspace, weather gating, and geofencing for Detroit Metro.",
  },
  {
    q: "Refunds and disputes?",
    a: "Start from your order. Provide details and media. We support re‑dispatch or partial refunds per Terms.",
  },
]

export default function HelpPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Help Center</h1>
      <p className="text-gray-600 mb-8">Find answers and get support.</p>

      <div className="space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold mb-1">{f.q}</h3>
            <p className="text-gray-700">{f.a}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-1">Account & Access</h4>
          <p className="text-sm text-gray-700">Sign up with email/phone. Manage notifications and data requests in settings.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-1">Orders & Scheduling</h4>
          <p className="text-sm text-gray-700">ASAP or scheduled windows with buffers. Capacity is enforced per listing.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-1">Safety & Reporting</h4>
          <p className="text-sm text-gray-700">Masked contact, moderated chat, PoD photos, and compliance gates for air ops.</p>
        </div>
      </section>

      <div className="mt-10 text-sm text-gray-600">
        Need more help? Visit <Link href="/safety" className="text-primary hover:underline">Safety</Link> or review our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy</Link>.
      </div>
    </main>
  )
}


