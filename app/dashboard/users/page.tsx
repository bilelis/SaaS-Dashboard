"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, CheckCircle, Plus } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  status: "active" | "pending"
  joinedAt: string
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "owner",
      status: "active",
      joinedAt: "2025-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2025-01-20",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "member",
      status: "pending",
      joinedAt: "2026-01-02",
    },
  ])
  const [newEmail, setNewEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = async () => {
    if (!newEmail.trim()) {
      toast({ title: "Error", description: "Please enter an email address", variant: "destructive" })
      return
    }

    setIsInviting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({ title: "Success", description: `Invitation sent to ${newEmail}` })
      setNewEmail("")
      // Add pending member
      setMembers([
        ...members,
        {
          id: Date.now().toString(),
          name: newEmail.split("@")[0],
          email: newEmail,
          role: "member",
          status: "pending",
          joinedAt: new Date().toISOString().split("T")[0],
        },
      ])
    } catch (error) {
      toast({ title: "Error", description: "Failed to send invitation", variant: "destructive" })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
    toast({ title: "Success", description: "Member removed" })
  }

  const getRoleBadge = (role: string) => {
    const roleColors = {
      owner: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
      admin: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
      member: "bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-400",
    }
    return roleColors[role as keyof typeof roleColors] || roleColors.member
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Team Members</h1>
        <p className="text-muted-foreground">Invite and manage your team members</p>
      </div>

      {/* Invite Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>Send an invitation to add a new team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="name@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isInviting}
            />
            <Button onClick={handleInvite} disabled={isInviting} className="gap-2">
              <Plus className="w-4 h-4" />
              {isInviting ? "Sending..." : "Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/40 bg-secondary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{member.name}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{member.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadge(member.role)}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        }`}
                      >
                        {member.status === "active" && <CheckCircle className="w-3 h-3" />}
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm hidden md:table-cell">{member.joinedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
