import Page from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Film, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <Page className="flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Film className="h-64 w-64 text-primary" />
          </div>
          <div className="relative space-y-4">
            <h1 className="text-9xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              404
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <h2 className="text-3xl font-bold text-foreground">
                Scene Not Found
              </h2>
            </div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! This page seems to have been cut from the final edit. The
          content you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </Page>
  )
}
