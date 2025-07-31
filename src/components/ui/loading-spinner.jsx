import { cn } from "@/lib/utils"

const LoadingSpinner = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        className
      )}
      {...props}
    />
  )
}

export { LoadingSpinner }