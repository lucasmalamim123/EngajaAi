'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  Users, CreditCard, LogOut, Menu, X, Link2,
} from 'lucide-react'
import type { Profile } from '@/types/database'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navByRole: Record<string, NavItem[]> = {
  client: [
    { label: 'Visão Geral', href: '/cliente/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Meus Casos', href: '/cliente/dashboard/casos', icon: <FolderOpen size={18} /> },
    { label: 'Contratos', href: '/cliente/dashboard/contratos', icon: <FileText size={18} /> },
    { label: 'Documentos', href: '/cliente/dashboard/documentos', icon: <FileText size={18} /> },
    { label: 'Tickets', href: '/cliente/dashboard/tickets', icon: <MessageSquare size={18} /> },
  ],
  lawyer: [
    { label: 'Visão Geral', href: '/advogado/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Casos Disponíveis', href: '/advogado/dashboard/casos-disponiveis', icon: <FolderOpen size={18} /> },
    { label: 'Meus Casos', href: '/advogado/dashboard/meus-casos', icon: <FileText size={18} /> },
    { label: 'Documentos', href: '/advogado/dashboard/documentos', icon: <FileText size={18} /> },
    { label: 'Tickets', href: '/advogado/dashboard/tickets', icon: <MessageSquare size={18} /> },
  ],
  engager: [
    { label: 'Visão Geral', href: '/engajador/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Indicações', href: '/engajador/dashboard/indicacoes', icon: <Link2 size={18} /> },
  ],
  admin: [
    { label: 'Visão Geral', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Usuários', href: '/admin/dashboard/usuarios', icon: <Users size={18} /> },
    { label: 'Casos', href: '/admin/dashboard/casos', icon: <FolderOpen size={18} /> },
    { label: 'Pagamentos', href: '/admin/dashboard/pagamentos', icon: <CreditCard size={18} /> },
  ],
}

export default function DashboardLayout({
  children,
  profile,
}: {
  children: React.ReactNode
  profile: Profile
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navItems = navByRole[profile.role] ?? []

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = profile.full_name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-bold text-lg text-gray-900">Plataforma Jurídica</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
              <h1 className="font-bold text-gray-900">Plataforma Jurídica</h1>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="md:hidden" />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {profile.full_name.split(' ')[0]}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{profile.full_name}</p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut size={14} className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
