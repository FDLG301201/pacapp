import Image from 'next/image'
import { Star } from 'lucide-react'
import { type Review } from '@/lib/mock-data'

interface ReviewItemProps {
  review: Review
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={review.userAvatar}
            alt={review.userName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm">{review.userName}</h4>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          <div className="mt-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
