"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { UserProfile } from "../types"
import { AvatarSection } from "./AvatarSection"
import { FormMessage } from "./FormMessage"
import { ProfileFormFields } from "./ProfileFormFields"

const profileEditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional().or(z.literal("")),
})

export type ProfileEditFormData = z.infer<typeof profileEditSchema>

interface ProfileEditFormProps {
  user: UserProfile
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      image: user.image || "",
    },
  })

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            bio: data.bio || null,
            image: data.image || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      setSuccess(true)

      setTimeout(() => {
        router.push("/profile")
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Failed to update profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AvatarSection user={user} imageUrl={form.watch("image")} />

          <ProfileFormFields form={form} isLoading={isLoading} />

          <FormMessage error={error} success={success} />

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
