'use client'

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-50 bg-white opacity-80 flex justify-center items-center">
      <div className="loading loading-dots loading-lg" />
    </div>
  )
}
