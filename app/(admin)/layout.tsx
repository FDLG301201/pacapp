// Admin layout — middleware ensures only authenticated admins reach here.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
