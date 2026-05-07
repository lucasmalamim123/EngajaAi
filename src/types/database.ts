export type UserRole = 'client' | 'lawyer' | 'engager' | 'admin'
export type CaseStatus = 'pending' | 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ContractStatus = 'pending' | 'sent' | 'signed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type LawyerStatus = 'pending' | 'active' | 'suspended'
export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type DocumentStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  phone: string | null
  cpf: string | null
  created_at: string
  updated_at: string
}

export interface Lawyer {
  id: string
  profile_id: string
  oab_number: string
  oab_state: string
  specialties: string[]
  bio: string | null
  status: LawyerStatus
  created_at: string
}

export interface Engager {
  id: string
  profile_id: string
  referral_code: string
  commission_rate: number
  status: 'active' | 'suspended'
  created_at: string
}

export interface ServiceType {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  active: boolean
  created_at: string
}

export interface Case {
  id: string
  client_id: string
  service_type_id: string
  title: string
  description: string | null
  status: CaseStatus
  engager_id: string | null
  created_at: string
  updated_at: string
}

export interface CaseWithRelations extends Case {
  profiles: Profile
  service_types: ServiceType
  case_assignments?: CaseAssignment[]
  payments?: Payment[]
  contracts?: Contract[]
}

export interface CaseAssignment {
  id: string
  case_id: string
  lawyer_id: string
  status: 'accepted' | 'released'
  accepted_at: string
  released_at: string | null
}

export interface Contract {
  id: string
  case_id: string
  file_url: string | null
  status: ContractStatus
  signed_at: string | null
  created_at: string
}

export interface Payment {
  id: string
  case_id: string
  amount: number
  status: PaymentStatus
  stripe_payment_id: string | null
  stripe_session_id: string | null
  method: string | null
  paid_at: string | null
  created_at: string
}

export interface Document {
  id: string
  case_id: string
  uploaded_by: string
  file_url: string
  file_name: string
  file_size: number | null
  mime_type: string | null
  type: string | null
  status: DocumentStatus
  created_at: string
}

export interface Ticket {
  id: string
  case_id: string
  subject: string
  status: TicketStatus
  created_by: string
  created_at: string
  updated_at: string
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender_id: string
  message: string
  created_at: string
}

// Supabase Database generic type
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      lawyers: { Row: Lawyer; Insert: Omit<Lawyer, 'id' | 'created_at'>; Update: Partial<Lawyer> }
      engagers: { Row: Engager; Insert: Omit<Engager, 'id' | 'created_at'>; Update: Partial<Engager> }
      service_types: { Row: ServiceType; Insert: Omit<ServiceType, 'id' | 'created_at'>; Update: Partial<ServiceType> }
      cases: { Row: Case; Insert: Omit<Case, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Case> }
      case_assignments: { Row: CaseAssignment; Insert: Omit<CaseAssignment, 'id' | 'accepted_at'>; Update: Partial<CaseAssignment> }
      contracts: { Row: Contract; Insert: Omit<Contract, 'id' | 'created_at'>; Update: Partial<Contract> }
      payments: { Row: Payment; Insert: Omit<Payment, 'id' | 'created_at'>; Update: Partial<Payment> }
      documents: { Row: Document; Insert: Omit<Document, 'id' | 'created_at'>; Update: Partial<Document> }
      tickets: { Row: Ticket; Insert: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Ticket> }
      ticket_messages: { Row: TicketMessage; Insert: Omit<TicketMessage, 'id' | 'created_at'>; Update: Partial<TicketMessage> }
    }
    Functions: {
      get_user_role: { Args: Record<never, never>; Returns: string }
    }
  }
}
