import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Safety | SkyMarket",
  description: "Safety practices, compliance, and reporting across ground and air operations.",
}

export default function SafetyPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Safety</h1>
      <p className="text-gray-700 mb-6">
        Safety is foundational. For couriers and licensed drone operators, we combine training, verification, and
        real‑time controls to keep people and property safe, with a focus on Detroit Metro operations.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Ground & Air Safety</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>FAA Part‑107 verification for drone operators; SOPs and checklists for all missions</li>
        <li>LAANC airspace checks, weather gating, geofencing, ≤400&apos; AGL, and VLOS attestations</li>
        <li>Prohibited items and clear drop‑photo policies for ground deliveries</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Privacy & Communications</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Masked phone numbers and in‑app chat with harassment/spam filtering</li>
        <li>Neighbor opt‑out and media moderation for imaging deliverables</li>
        <li>PII minimization and short‑lived tracking links</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">Incident Reporting</h2>
      <p className="text-gray-700">
        If you experience an incident, report from your order or visit the <Link className="text-primary hover:underline" href="/help">Help Center</Link>. Share time, location, and any photos.
        We triage quickly with evidence collection and audit logs.
      </p>

      <div className="mt-8 text-sm text-gray-600">
        Learn more in <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy</Link>.
      </div>
    </main>
  )
}


