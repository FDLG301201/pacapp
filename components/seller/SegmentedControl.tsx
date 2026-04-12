'use client'

import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: string
  description?: string
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
  columns?: number
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  columns,
}: SegmentedControlProps<T>) {
  const gridCols =
    columns === 2 ? 'grid-cols-2'
    : columns === 3 ? 'grid-cols-3'
    : columns === 4 ? 'grid-cols-4'
    : columns === 5 ? 'grid-cols-5'
    : options.length <= 4 ? `grid-cols-${options.length}`
    : 'grid-cols-3 sm:grid-cols-4'

  return (
    <div className={cn('grid gap-2', gridCols, className)}>
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-lg border px-3 py-2 text-sm font-medium transition-colors text-center',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted'
            )}
          >
            <span className="block">{opt.label}</span>
            {opt.description && (
              <span className={cn('mt-0.5 block text-xs font-normal', selected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                {opt.description}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
