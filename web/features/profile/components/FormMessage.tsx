import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormMessageProps {
  error: string | null
  success: boolean
}

export function FormMessage({ error, success }: FormMessageProps) {
  if (!error && !success) return null

  return (
    <>
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Success
            </p>
            <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
              Profile updated successfully! Redirecting...
            </p>
          </div>
        </div>
      )}
    </>
  )
}
