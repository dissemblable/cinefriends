import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren & {
  className?: string
}

const Page = ({ children, className }: Props) => {
  return <main className={cn("flex-1 w-full px-4", className)}>{children}</main>
}

export default Page
