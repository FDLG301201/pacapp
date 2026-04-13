// Buyer layout — proxy ensures only authenticated buyers reach here.
import { Header } from '@/components/header'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
    </div>
  )
}
