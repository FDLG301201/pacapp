// Seller layout — middleware ensures only authenticated sellers reach here.
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
