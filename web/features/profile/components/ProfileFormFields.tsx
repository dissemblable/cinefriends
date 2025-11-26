import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Image, Mail, User } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import type { ProfileEditFormData } from "./ProfileEditForm"

interface ProfileFormFieldsProps {
  form: UseFormReturn<ProfileEditFormData>
  isLoading: boolean
}

export function ProfileFormFields({ form, isLoading }: ProfileFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Display Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          {...register("name")}
          disabled={isLoading}
          className="transition-all"
        />
        {errors.name && (
          <p className="text-sm text-destructive flex items-center gap-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself and your favorite movies..."
          {...register("bio")}
          disabled={isLoading}
          rows={4}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Share your passion for cinema
          </p>
          <p className="text-xs text-muted-foreground">
            {form.watch("bio")?.length || 0}/500
          </p>
        </div>
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          Profile Image URL
        </Label>
        <Input
          id="image"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          {...register("image")}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Enter a URL to your profile picture
        </p>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        )}
      </div>
    </div>
  )
}
