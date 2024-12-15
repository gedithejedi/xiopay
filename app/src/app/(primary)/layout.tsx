export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex justify-center w-full min-h-screen bg-base-200 font-[family-name:var(--font-geist-sans)] p-4">
      <div className="flex items-center flex-col w-full min-h-full max-w-[1024px] py-4">
        <header className="flex w-full">
          <span className="text-3xl font-bold">XioPay</span>
        </header>
        <div className="py-8 flex-1 w-full h-full">{children}</div>
        <footer className="text-center">
          <p>Built with 💚 for Xion Believathon</p>
        </footer>
      </div>
    </div>
  )
}
