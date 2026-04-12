import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, BadgeCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type Store } from '@/lib/mock-data'

interface StoreCardProps {
  store: Store
  showDistance?: boolean
  distance?: string
}

export function StoreCard({ store, showDistance = false, distance }: StoreCardProps) {
  return (
    <Link href={`/tiendas/${store.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow min-w-[200px]">
        <div className="relative h-24 bg-muted">
          <Image
            src={store.coverImage}
            alt={store.name}
            fill
            className="object-cover"
          />
          <div className="absolute -bottom-6 left-3">
            <div className="relative h-12 w-12 rounded-full border-2 border-card overflow-hidden bg-card">
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <CardContent className="pt-8 pb-4 px-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {store.name}
                </h3>
                {store.verified && (
                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{store.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{store.rating}</span>
            </div>
          </div>
          {showDistance && distance && (
            <Badge variant="secondary" className="mt-2 text-xs">
              {distance}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
