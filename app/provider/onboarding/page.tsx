import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProviderOnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Provider Onboarding</h1>
        <p className="text-muted-foreground">
          You don&apos;t have a provider profile yet. Complete onboarding to start accepting jobs.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard/consumer"><Button variant="outline">Use as Consumer</Button></Link>
          <Link href="/provider/apply"><Button>Start Onboarding</Button></Link>
        </div>
      </div>
    </div>
  )
}


