import 'server-only'

export { locales, type Locale, defaultLocale, hasLocale } from './locales'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'pt-PT': () => import('@/messages/pt-PT.json').then(m => m.default as Dictionary),
  'pt-BR': () => import('@/messages/pt-BR.json').then(m => m.default as Dictionary),
  'en':    () => import('@/messages/en.json').then(m => m.default as Dictionary),
  'es':    () => import('@/messages/es.json').then(m => m.default as Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

export function localHref(lang: string, path: string): string {
  return `/${lang}${path}`
}

// ─── Dictionary shape ───────────────────────────────────────────────
export interface Dictionary {
  common: {
    platform_name: string
    back: string
    save: string
    cancel: string
    loading: string
    error: string
    see_all: string
    no_data: string
    date: string
    status: string
    actions: string
    copy: string
    copied: string
    id: string
  }
  nav: {
    dashboard: string
    my_cases: string
    available_cases: string
    contracts: string
    documents: string
    tickets: string
    users: string
    cases: string
    payments: string
    referrals: string
    overview: string
    logout: string
  }
  auth: {
    login: {
      title: string
      description: string
      email: string
      password: string
      submit: string
      submitting: string
      forgot_password: string
      no_account: string
      register_link: string
      error: string
    }
    register: {
      title: string
      description: string
      account_type: string
      full_name: string
      email: string
      phone: string
      id_number: string
      oab_number: string
      oab_state: string
      password: string
      confirm_password: string
      submit: string
      submitting: string
      already_account: string
      login_link: string
      roles: { client: string; lawyer: string; engager: string }
    }
    forgot_password: {
      title: string
      description: string
      email: string
      submit: string
      submitting: string
      success: string
      back_to_login: string
    }
  }
  status: {
    case: Record<string, string>
    ticket: Record<string, string>
    document: Record<string, string>
    payment: Record<string, string>
  }
  landing: {
    hero_title: string
    hero_subtitle: string
    cta_primary: string
    cta_secondary: string
    features_title: string
    cta_section_title: string
    cta_section_text: string
    nav_services: string
    nav_login: string
    nav_register: string
    footer: string
  }
  services: {
    title: string
    subtitle: string
    hire_button: string
    no_services: string
    category: string
  }
  client: {
    dashboard: {
      title: string
      total_cases: string
      open_tickets: string
      pending_payment: string
      documents: string
      recent_cases: string
      no_cases: string
      hire_service: string
    }
    cases: { title: string; no_cases: string; hire_service: string; new_case: string; waiting_lawyer: string }
    contracts: { title: string; download: string; no_contracts: string; upload_signed: string; uploading: string; status: Record<string, string> }
    documents: { title: string; upload: string; no_documents: string; select_file: string; uploading: string; case_label: string }
    tickets: { title: string; new_ticket: string; no_tickets: string; reply: string; case_label: string; subject_label: string; subject_placeholder: string; open_button: string; opening: string }
  }
  lawyer: {
    dashboard: {
      title: string
      available_cases: string
      in_progress: string
      completed: string
      tickets: string
    }
    available_cases: {
      title: string
      subtitle: string
      accept: string
      accepting: string
      no_cases: string
    }
    my_cases: { title: string; no_cases: string; see_available: string; accepted_at: string; client_label: string }
    documents: { title: string; received: string; no_documents: string }
    tickets: { title: string; no_tickets: string }
  }
  admin: {
    dashboard: {
      title: string
      total_revenue: string
      total_users: string
      active_cases: string
      pending_lawyers: string
      open_cases: string
      confirmed_payments: string
      recent_cases: string
      users_by_type: string
    }
    users: {
      title: string
      name: string
      email: string
      role: string
      registered: string
      roles: Record<string, string>
    }
    cases: { title: string; client: string; service: string; value: string }
    payments: {
      title: string
      total_received: string
      transactions: string
      all_transactions: string
      case: string
      client: string
      amount: string
    }
  }
  engager: {
    dashboard: {
      title: string
      estimated_commission: string
      referral_link: string
      referral_code: string
      referrals: string
      recent_referrals: string
      no_referrals: string
      commission_info: string
      total: string
      converted: string
      rate: string
    }
    referrals: {
      title: string
      total_commission: string
      total: string
      converted: string
      rate: string
      history: string
      no_referrals: string
      id: string
      case: string
      client: string
      service: string
      commission: string
      pending_commission: string
    }
  }
  hire: {
    title: string
    case_title: string
    description: string
    submit: string
    submitting: string
  }
}
