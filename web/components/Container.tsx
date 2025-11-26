import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

interface ContainerProps extends PropsWithChildren {
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const Container = ({ children, className, size = "lg" }: ContainerProps) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  }

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Container
