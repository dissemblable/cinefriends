"use client"

import Container from "@/components/Container"
import { signOut, useSession } from "@/features/auth/utils"
import { useFriendRequestsCount } from "@/features/friends"
import { Film, LogOut, Sparkles, User, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const pendingRequestsCount = useFriendRequestsCount()

  const handleSignOut = async () => {
    await signOut()
    router.push("/signin")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Film className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CineFriends
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            {session?.user ? (
              <>
                <Link
                  href="/profile/films"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  My Films
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
                <Link
                  href="/friends"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group flex items-center gap-1"
                >
                  Friends
                  {pendingRequestsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 min-w-5 text-xs px-1"
                    >
                      {pendingRequestsCount}
                    </Badge>
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative flex items-center space-x-2 group">
                      <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                        <AvatarImage
                          src={session.user.image || undefined}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                          {session.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium group-hover:text-primary transition-colors">
                        {session.user.name?.split(" ")[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/friends"
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <div className="inline-flex items-center gap-2">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Friends</span>
                        </div>
                        {pendingRequestsCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-5 text-xs px-1"
                          >
                            {pendingRequestsCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                asChild
                className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}

export default Header
