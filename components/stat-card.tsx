import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type React from "react"

interface StatCardProps {
  icon?: React.ReactNode
  label: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ icon, label, value, description, trend }: StatCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {trend && (
              <div
                className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          {icon && <div className="text-primary/70 flex-shrink-0">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
