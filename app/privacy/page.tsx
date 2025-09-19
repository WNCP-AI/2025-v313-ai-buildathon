import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | SkyMarket",
  description: "How we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Effective: Jan 1, 2025</p>
      <div className="prose prose-neutral max-w-none">
        <h3>1. Information We Collect</h3>
        <ul>
          <li>Account: name, contact details, auth identifiers.</li>
          <li>Orders: addresses, instructions, scheduling windows, item/category metadata.</li>
          <li>Location: live updates for tracking (courier) or mission boundaries (drone) when applicable.</li>
          <li>Messages & Media: in‑app chat content, PoD photos, imaging deliverables.</li>
          <li>Technical: device info, logs, analytics events (e.g., search, booking, completion).</li>
        </ul>

        <h3>2. How We Use Information</h3>
        <ul>
          <li>Operate core features: listings, pricing, scheduling, booking, messaging, tracking, payouts.</li>
          <li>Safety & Compliance: KYC, fraud prevention, airspace/weather gating, content moderation.</li>
          <li>Product improvement: performance metrics (p95 latency), reliability, and UX analytics.</li>
          <li>Communications: notifications about status, delays, and receipts.</li>
        </ul>

        <h3>3. Sharing</h3>
        <ul>
          <li>Providers receive only necessary job details (addresses, notes, media scope).</li>
          <li>Vendors: payments (Stripe), messaging/notifications, mapping/geocoding, analytics.</li>
          <li>Legal: when required by law or to protect users, providers, and SkyMarket.</li>
        </ul>

        <h3>4. Data Retention</h3>
        <p>
          Retention periods vary by data type and legal requirements. GPS traces, media, and KYC artifacts may have
          shorter retention with deletion options upon request.
        </p>

        <h3>5. Your Choices & Rights</h3>
        <ul>
          <li>Access, correct, or delete your information, subject to legal and operational needs.</li>
          <li>Control notifications and communication preferences in settings.</li>
          <li>Request data export where available.</li>
        </ul>

        <h3>6. Security</h3>
        <p>
          We employ encryption in transit and at rest for sensitive data and follow least‑privilege access controls.
          Secrets are managed via environment variables. No method is 100% secure, but we work to protect your data.
        </p>

        <h3>7. Children</h3>
        <p>SkyMarket is not directed to children under 13 and does not knowingly collect their data.</p>

        <h3>8. Changes</h3>
        <p>We may update this policy. Material updates will be communicated in‑app or via email.</p>
      </div>
    </main>
  )
}


