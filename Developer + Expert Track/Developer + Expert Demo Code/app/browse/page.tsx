import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Package, Camera, MapPin, ArrowRight } from "lucide-react"

const categories = [
  {
    title: "Food Delivery",
    description: "Fast & reliable food delivery",
    icon: Utensils,
    href: "/browse/food-delivery",
    price: "From $4.99",
  },
  {
    title: "Courier Service",
    description: "Same-day package delivery",
    icon: Package,
    href: "/browse/courier",
    price: "From $7.99",
  },
  {
    title: "Aerial Imaging",
    description: "Professional aerial photography",
    icon: Camera,
    href: "/browse/aerial-imaging",
    price: "From $149/hr",
  },
  {
    title: "Site Mapping",
    description: "Detailed site surveys",
    icon: MapPin,
    href: "/browse/site-mapping",
    price: "From $299",
  },
]

export default function BrowseIndexPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Browse Services</h1>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              Home <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <Icon className="w-10 h-10 mb-3 text-primary" />
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold">{category.price}</p>
                      <p className="text-sm text-primary mt-2">Browse →</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


