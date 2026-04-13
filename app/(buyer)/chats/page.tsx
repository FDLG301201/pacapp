import { Suspense } from 'react'
import BuyerChatsPage from './buyer-chats-page'

export default function ChatsPage() {
  return (
    <Suspense fallback={null}>
      <BuyerChatsPage />
    </Suspense>
  )
}
