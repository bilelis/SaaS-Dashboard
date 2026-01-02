"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: { name: string; included: boolean }[]
  cta: string
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for getting started",
    features: [
      { name: "Up to 10 projects", included: true },
      { name: "5GB storage", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "Advanced features", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "For growing teams",
    features: [
      { name: "Up to 100 projects", included: true },
      { name: "100GB storage", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: true },
      { name: "Team collaboration", included: false },
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "For large organizations",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "1TB storage", included: true },
      { name: "Real-time analytics", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "API access", included: true },
      { name: "Team collaboration", included: true },
    ],
    cta: "Contact Sales",
  },
]

const faqs = [
  {
    q: "Can I change plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, all plans come with a 14-day free trial. No credit card required to get started.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards through Stripe. Enterprise customers can arrange custom payment terms.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. You can cancel your subscription at any time. Your access continues until the end of your billing period.",
  },
  {
    q: "Is there an annual discount?",
    a: "Yes! Save 20% when you pay annually instead of monthly. Contact our sales team for custom pricing.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = "/signup"
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Success", description: "Subscription created successfully!" })
      window.location.href = "/dashboard"
    } catch (error) {
      toast({ title: "Error", description: "Failed to create subscription", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            bilel
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
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

      {/* Pricing Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
          Simple, transparent <span className="text-primary">pricing</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Choose the perfect plan for your needs. Always flexible to scale with your business.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`bg-card border-border p-8 rounded-lg relative transition-all flex flex-col ${
                plan.highlighted ? "ring-2 ring-primary shadow-xl md:scale-105" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>

                <Button
                  className="w-full mb-8"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : plan.cta}
                </Button>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground line-through"}`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Detailed Feature Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-4 px-4 font-semibold text-foreground">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Projects", "Storage", "Analytics", "Support", "API Access", "Team Collaboration", "Integrations"].map(
                (feature) => (
                  <tr key={feature} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4 text-foreground font-medium">{feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        <Check className="w-5 h-5 text-accent mx-auto" />
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.q} className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center border-t border-border">
        <h2 className="text-4xl font-bold text-foreground mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-8">14-day free trial. No credit card required.</p>
        <Link href={user ? "/dashboard" : "/signup"}>
          <Button size="lg">Start Your Free Trial</Button>
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
