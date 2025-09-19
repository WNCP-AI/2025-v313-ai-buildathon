export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}


