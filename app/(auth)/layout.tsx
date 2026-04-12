// Auth layout — no header/footer, just the centered card shell.
// Logged-in users are redirected away by middleware before reaching here.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
