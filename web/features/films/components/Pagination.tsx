"use client"

import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/films",
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`${basePath}?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateToPage(1)}
        disabled={currentPage === 1}
        className="h-9 w-9"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => navigateToPage(pageNumber)}
              className={`h-9 min-w-9 ${isActive ? "pointer-events-none" : ""}`}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateToPage(totalPages)}
        disabled={currentPage === totalPages}
        className="h-9 w-9"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
