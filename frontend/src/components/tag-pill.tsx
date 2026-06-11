

import { cn } from "../../../lib/utils"

interface TagPillProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function TagPill({ label, selected, onClick, className }: TagPillProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondary",
        className
      )}
    >
      {label}
    </button>
  )
}
