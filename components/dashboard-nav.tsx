"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, Settings, LogOut, Users } from "lucide-react"

export function DashboardNav() {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          bilel
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant={isActive("/dashboard/users") ? "default" : "ghost"} size="sm" className="gap-2">
                <Users className="w-4 h-4" />
                Users
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant={isActive("/settings") ? "default" : "ghost"} size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
