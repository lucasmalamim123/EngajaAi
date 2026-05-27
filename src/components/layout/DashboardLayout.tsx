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
  Users, CreditCard, LogOut, Menu, X, Link2, ShieldCheck,
} from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import type { Profile } from '@/types/database'

export interface NavLabels {
  platform_name: string
  overview: string
  my_cases: string
  available_cases: string
  contracts: string
  documents: string
  tickets: string
  users: string
  cases: string
  payments: string
  referrals: string
  logout: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const roleLabels: Record<string, string> = {
  client:  'Cliente',
  lawyer:  'Advogado',
  engager: 'Engajador',
  admin:   'Administrador',
}

function buildNav(role: string, lang: string, t: NavLabels): NavItem[] {
  const p = `/${lang}`
  const nav: Record<string, NavItem[]> = {
    client: [
      { label: t.overview,   href: `${p}/cliente/dashboard`,             icon: <LayoutDashboard size={16} /> },
      { label: t.my_cases,   href: `${p}/cliente/dashboard/casos`,       icon: <FolderOpen size={16} /> },
      { label: t.contracts,  href: `${p}/cliente/dashboard/contratos`,   icon: <FileText size={16} /> },
      { label: t.documents,  href: `${p}/cliente/dashboard/documentos`,  icon: <FileText size={16} /> },
      { label: t.tickets,    href: `${p}/cliente/dashboard/tickets`,     icon: <MessageSquare size={16} /> },
    ],
    lawyer: [
      { label: t.overview,        href: `${p}/advogado/dashboard`,                       icon: <LayoutDashboard size={16} /> },
      { label: t.available_cases, href: `${p}/advogado/dashboard/casos-disponiveis`,     icon: <FolderOpen size={16} /> },
      { label: t.my_cases,        href: `${p}/advogado/dashboard/meus-casos`,            icon: <FileText size={16} /> },
      { label: t.documents,       href: `${p}/advogado/dashboard/documentos`,            icon: <FileText size={16} /> },
      { label: t.tickets,         href: `${p}/advogado/dashboard/tickets`,               icon: <MessageSquare size={16} /> },
    ],
    engager: [
      { label: t.overview,  href: `${p}/engajador/dashboard`,            icon: <LayoutDashboard size={16} /> },
      { label: t.referrals, href: `${p}/engajador/dashboard/indicacoes`, icon: <Link2 size={16} /> },
    ],
    admin: [
      { label: t.overview,  href: `${p}/admin/dashboard`,             icon: <LayoutDashboard size={16} /> },
      { label: t.users,     href: `${p}/admin/dashboard/usuarios`,    icon: <Users size={16} /> },
      { label: t.cases,     href: `${p}/admin/dashboard/casos`,       icon: <FolderOpen size={16} /> },
      { label: t.payments,  href: `${p}/admin/dashboard/pagamentos`,  icon: <CreditCard size={16} /> },
    ],
  }
  return nav[role] ?? []
}

export default function DashboardLayout({
  children,
  profile,
  lang,
  navLabels,
}: {
  children: React.ReactNode
  profile: Profile
  lang: string
  navLabels: NavLabels
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navItems = buildNav(profile.role, lang, navLabels)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${lang}/login`)
  }

  const initials = profile.full_name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative group',
              isActive
                ? 'bg-white/[0.14] text-white'
                : 'text-white/55 hover:text-white/90 hover:bg-white/[0.07]'
            )}
          >
            {/* Active left-border accent */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-white/70" />
            )}
            <span className={cn('shrink-0 transition-colors', isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70')}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      {/* Logo + Platform name */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.10]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.12] flex items-center justify-center shrink-0">
            <ShieldCheck size={15} className="text-white/80" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white leading-tight truncate">
              {navLabels.platform_name}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5 tracking-wide uppercase">
              {roleLabels[profile.role] ?? profile.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <NavLinks onClick={onNavClick} />

      {/* User + Logout */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.10] space-y-1">
        {/* User info */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-white/80 truncate leading-tight">
              {profile.full_name.split(' ')[0]}
            </p>
            <p className="text-[10px] text-white/35 truncate leading-tight">{profile.email}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-150 group"
        >
          <LogOut size={15} className="shrink-0 group-hover:text-white/60 transition-colors" />
          {navLabels.logout}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden md:flex flex-col w-60 fixed h-full z-10 shrink-0"
        style={{ background: 'var(--sidebar)' }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {open && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 h-full w-60 shadow-2xl flex flex-col"
            style={{ background: 'var(--sidebar)' }}
          >
            {/* Mobile close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavClick={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-w-0">

        {/* Top header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-foreground/70 hover:text-foreground transition-colors p-1 -ml-1 rounded-md hover:bg-muted"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Spacer on desktop */}
          <div className="hidden md:block" />

          {/* Right side: lang switcher + user */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher currentLang={lang} />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] bg-primary text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-[13px] font-medium text-foreground">
                  {profile.full_name.split(' ')[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                <div className="px-2.5 py-2 border-b border-border mb-1">
                  <p className="text-[13px] font-semibold text-foreground">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {roleLabels[profile.role] ?? profile.role}
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/5 gap-2"
                >
                  <LogOut size={13} />
                  {navLabels.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
