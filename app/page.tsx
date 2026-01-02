import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">bilel</div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-foreground text-sm">{user.email}</span>
                <Link href="/dashboard">
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
          The complete platform to <span className="text-primary">build your SaaS</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Everything you need to launch, scale, and manage your software business. Built for modern teams.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="rounded-full">
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="rounded-full bg-transparent">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Analytics", desc: "Track every metric that matters" },
            { title: "User Management", desc: "Control access and permissions" },
            { title: "Security", desc: "Enterprise-grade protection" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">Ready to build?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of teams using bilel</p>
        <Link href={user ? "/dashboard" : "/signup"}>
          <Button size="lg">{user ? "Go to Dashboard" : "Start Your Free Trial"}</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 bilel SaaS Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
