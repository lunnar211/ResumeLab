"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] })

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const supabase = createClient()
  const [profileMsg, setProfileMsg] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [plan] = useState("free")

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileValues) => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: data.full_name, avatar_url: data.avatar_url },
    })
    setProfileMsg(error ? error.message : "Profile updated!")
  }

  const onPasswordSubmit = async (data: PasswordValues) => {
    const { error } = await supabase.auth.updateUser({ password: data.password })
    setPasswordMsg(error ? error.message : "Password updated!")
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Profile Information</h2>
            {profileMsg && (
              <div className="mb-4 rounded-md bg-muted px-4 py-3 text-sm">{profileMsg}</div>
            )}
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...profileForm.register("full_name")} placeholder="John Doe" />
                {profileForm.formState.errors.full_name && (
                  <p className="text-xs text-destructive">{profileForm.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input id="avatar_url" {...profileForm.register("avatar_url")} placeholder="https://..." />
              </div>
              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 font-semibold">Your Plan</h2>
            <div className="mb-6 flex items-center gap-3">
              <Badge variant={plan === "pro" ? "default" : "secondary"} className="text-base px-3 py-1">
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </Badge>
              {plan === "free" && <span className="text-sm text-muted-foreground">5 AI credits/day</span>}
            </div>
            {plan === "free" && (
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                <h3 className="font-semibold mb-2">Upgrade to Pro — $9/mo</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>✓ Unlimited CVs</li>
                  <li>✓ 100 AI credits/day</li>
                  <li>✓ All premium templates</li>
                  <li>✓ PDF & DOCX export</li>
                </ul>
                <Button>Upgrade to Pro</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border p-6">
              <h2 className="mb-4 font-semibold">Change Password</h2>
              {passwordMsg && (
                <div className="mb-4 rounded-md bg-muted px-4 py-3 text-sm">{passwordMsg}</div>
              )}
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" {...passwordForm.register("password")} />
                  {passwordForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" {...passwordForm.register("confirm")} />
                  {passwordForm.formState.errors.confirm && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.confirm.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </div>

            <div className="rounded-xl border border-destructive/30 p-6">
              <h2 className="mb-2 font-semibold text-destructive">Danger Zone</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Permanently delete your account and all CVs. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
