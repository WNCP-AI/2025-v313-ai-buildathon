import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Package, Camera, MapPin, Utensils } from "lucide-react"

const categories = [
  {
    title: "Food Delivery",
    description: "Fast & reliable food delivery",
    icon: Utensils,
    href: "/browse/food-delivery",
    price: "From $4.99"
  },
  {
    title: "Courier Service",
    description: "Same-day package delivery",
    icon: Package,
    href: "/browse/courier",
    price: "From $7.99"
  },
  {
    title: "Aerial Imaging",
    description: "Professional aerial photography",
    icon: Camera,
    href: "/browse/aerial-imaging",
    price: "From $149/hr"
  },
  {
    title: "Site Mapping",
    description: "Detailed site surveys",
    icon: MapPin,
    href: "/browse/site-mapping",
    price: "From $299"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header is global via SiteHeader */}

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">
            Find trusted drone operators for any service
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified drone operators and couriers in the Detroit Metro area for fast, reliable service
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="gap-2 bg-[#BD1B04] hover:bg-[#BD1B04]/90">
                Browse Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/provider/apply">
              <Button size="lg" variant="outline" className="border-[#BD1B04] text-[#BD1B04] hover:bg-[#BD1B04]/10">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <Icon className="w-12 h-12 mb-4 text-primary" />
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-lg">{category.price}</p>
                      <p className="text-sm text-primary mt-2">Browse →</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Search", description: "Find services in your area" },
              { step: "2", title: "Compare", description: "View providers and prices" },
              { step: "3", title: "Book", description: "Secure payment and scheduling" },
              { step: "4", title: "Track", description: "Real-time updates" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#BD1B04] text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers in the Detroit Metro area
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">SkyMarket</h3>
              <p className="text-sm text-gray-600">
                Your trusted drone service marketplace in Detroit Metro
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/browse/food-delivery" className="hover:underline">Food Delivery</Link></li>
                <li><Link href="/browse/courier" className="hover:underline">Courier Service</Link></li>
                <li><Link href="/browse/aerial-imaging" className="hover:underline">Aerial Imaging</Link></li>
                <li><Link href="/browse/site-mapping" className="hover:underline">Site Mapping</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:underline">How It Works</Link></li>
                <li><Link href="/provider/apply" className="hover:underline">Become a Provider</Link></li>
                <li><Link href="/help" className="hover:underline">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/safety" className="hover:underline">Safety</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2024 SkyMarket. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}