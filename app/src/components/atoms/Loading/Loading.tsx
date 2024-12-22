'use client'

interface LoadingProps {
  className?: string
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div
      className={`absolute top-0 left-0 h-screen w-screen z-50 bg-white opacity-80 flex justify-center items-center ${className}`}
    >
      <div className="loading loading-dots loading-lg" />
    </div>
  )
}
