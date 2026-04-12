import Link from 'next/link'
import { Shirt } from 'lucide-react'

interface LogoProps {
  className?: string
  showTagline?: boolean
}

export function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Shirt className="h-7 w-7 text-primary" />
        <span className="font-serif text-2xl font-bold text-primary">PACAPP</span>
      </div>
      {showTagline && (
        <span className="hidden lg:block text-sm text-muted-foreground">
          Tu próxima prenda favorita
        </span>
      )}
    </Link>
  )
}
