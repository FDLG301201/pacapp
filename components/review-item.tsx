import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ReviewItemProps {
  rating: number
  comment: string | null
  buyerName: string
  buyerAvatar: string | null
  date: string
}

export function ReviewItem({ rating, comment, buyerName, buyerAvatar, date }: ReviewItemProps) {
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={buyerAvatar ?? undefined} alt={buyerName} />
          <AvatarFallback>{buyerName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm">{buyerName}</h4>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <div className="mt-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
          {comment && <p className="mt-2 text-sm text-muted-foreground">{comment}</p>}
        </div>
      </div>
    </div>
  )
}
