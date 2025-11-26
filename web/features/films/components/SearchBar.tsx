"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  )

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim())
      params.delete("page")
    } else {
      params.delete("query")
      params.delete("page")
    }

    router.push(`/films?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("query")
    params.delete("page")
    router.push(`/films?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg" className="h-12 px-6">
          Search
        </Button>
      </div>
    </form>
  )
}
