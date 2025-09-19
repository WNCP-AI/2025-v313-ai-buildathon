import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string }>
}) {
  const { listing } = await searchParams
  const listingId = listing ?? "prov_1"

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Confirm Your Booking</h1>
          <Link href={`/provider/${listingId}`} className="text-sm text-gray-600 hover:underline">Back to provider</Link>
        </div>
      </header>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Review and Confirm</CardTitle>
              <CardDescription>Your payment will be held securely until completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="font-medium mb-2">Service Details</div>
                <div className="text-sm text-gray-600">Mike&apos;s Delivery Service • Food Delivery • ASAP</div>
              </div>
              <div>
                <div className="font-medium mb-2">Price Breakdown</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Delivery Fee</span><span>$2.99</span></div>
                  <div className="flex justify-between"><span>Service Fee (10%)</span><span>$0.30</span></div>
                  <div className="flex justify-between"><span>Tip (20%)</span><span>$0.60</span></div>
                  <div className="border-t my-2" />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>$3.89</span></div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Link href={`/provider/${listing}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Link href={`/orders/ord_123`}> {/* placeholder order id */}
                  <Button className="">🔒 Confirm Booking</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


