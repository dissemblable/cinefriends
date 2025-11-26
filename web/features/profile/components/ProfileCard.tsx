"use client";

import { useSession } from "@/features/auth/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, User } from "lucide-react";

export function ProfileCard() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Not authenticated</CardTitle>
          <CardDescription>
            Please sign in to view your profile
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const user = session.user;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Initiales pour l'avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              {user.emailVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              Member since {memberSince}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations de contact */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Contact Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>ID: {user.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Joined on{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats basiques */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Films Watched</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
