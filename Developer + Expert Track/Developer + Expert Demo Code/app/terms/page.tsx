import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | SkyMarket",
  description: "The terms that govern your use of SkyMarket.",
}

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Effective: Jan 1, 2025</p>
      <div className="prose prose-neutral max-w-none">
        <h3>1. Marketplace Role</h3>
        <p>
          SkyMarket provides a marketplace connecting customers with independent providers for ground courier, food
          delivery, and aerial imaging services. SkyMarket does not provide the services directly. Providers are
          independent contractors and are solely responsible for compliance and execution.
        </p>

        <h3>2. Accounts & Eligibility</h3>
        <ul>
          <li>You must provide accurate information and keep your account secure.</li>
          <li>Providers must satisfy applicable legal and safety requirements (e.g., FAA Part‑107 for drone operations).</li>
        </ul>

        <h3>3. Listings, Scheduling, and Availability</h3>
        <ul>
          <li>Bookings may be ASAP or scheduled in defined time windows with enforced buffers.</li>
          <li>Coverage is focused on the Detroit Metro area; addresses may be validated for serviceability.</li>
          <li>Providers manage capacity; acceptance is subject to SLA timers for request-based bookings.</li>
        </ul>

        <h3>4. Payments, Escrow, and Tips</h3>
        <ul>
          <li>At checkout, we authorize the total amount and hold funds in escrow.</li>
          <li>We capture on completion or, for imaging, on customer acceptance of deliverables.</li>
          <li>Tips are optional and can be added at checkout or post-completion.</li>
          <li>Stripe processes payments; additional terms may apply.</li>
        </ul>

        <h3>5. Provider Responsibilities</h3>
        <ul>
          <li>Comply with all laws and platform policies, including prohibited items and safe operations.</li>
          <li>For drone jobs: maintain current FAA Part‑107 certification, follow LAANC/airspace rules, VLOS, ≤400&apos; AGL, and weather/geo gating.</li>
          <li>Provide Proof of Delivery (PoD) or required media deliverables as specified.</li>
        </ul>

        <h3>6. Cancellations, No‑Shows, and Refunds</h3>
        <ul>
          <li>Customer cancellations may incur fees per listing policy and timing.</li>
          <li>Provider no‑shows or material delays may qualify for re‑dispatch or partial refunds.</li>
          <li>Weather/airspace lockouts for drone jobs may trigger free cancellations or rescheduling.</li>
        </ul>

        <h3>7. Ratings, Reviews, and Conduct</h3>
        <ul>
          <li>Two‑sided ratings are available after completion; anti‑retaliation measures may apply.</li>
          <li>Harassment, spam, or abusive behavior is prohibited; accounts may be suspended.</li>
        </ul>

        <h3>8. Safety and Prohibited Uses</h3>
        <ul>
          <li>No illegal items, dangerous goods without proper handling, or unlawful surveillance.</li>
          <li>Operations must respect local laws, privacy, and property rights; content is moderated.</li>
        </ul>

        <h3>9. Disputes</h3>
        <p>
          Report issues from the order details with evidence. We aim for fair resolution via re‑dispatch or partial
          refund per policy. Chargebacks may impact account status.
        </p>

        <h3>10. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, SkyMarket is not liable for indirect, incidental, or consequential
          damages, or for provider actions, beyond amounts paid for the impacted order.
        </p>

        <h3>11. Changes</h3>
        <p>
          We may update these terms. Continued use after changes constitutes acceptance. Material updates will be
          communicated via the app or email.
        </p>
      </div>
    </main>
  )
}


