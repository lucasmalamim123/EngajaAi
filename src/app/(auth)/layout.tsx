import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Plataforma Jurídica</h1>
          <p className="text-sm text-gray-500 mt-1">Seu escritório digital</p>
        </div>
        {children}
      </div>
    </div>
  )
}
