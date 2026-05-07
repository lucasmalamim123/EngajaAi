import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function caseStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Aguardando pagamento',
    open: 'Aberto',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  }
  return labels[status] ?? status
}

export function ticketStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Aberto',
    in_progress: 'Em andamento',
    closed: 'Encerrado',
  }
  return labels[status] ?? status
}

export function documentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Aguardando análise',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  }
  return labels[status] ?? status
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}
