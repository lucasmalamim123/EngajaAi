-- ============================================================
-- PLATAFORMA JURÍDICA — SCHEMA INICIAL (ETAPA 1)
-- ============================================================

-- Habilitar extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- Estende auth.users com dados do perfil e role
-- ============================================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('client', 'lawyer', 'engager', 'admin')),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  cpf         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- LAWYERS
-- Dados específicos do advogado
-- ============================================================
CREATE TABLE lawyers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  oab_number   TEXT NOT NULL,
  oab_state    TEXT NOT NULL DEFAULT 'SP',
  specialties  TEXT[] DEFAULT '{}',
  bio          TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ENGAGERS
-- Dados do engajador (captador/indicador)
-- ============================================================
CREATE TABLE engagers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  referral_code   TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)),
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SERVICE_TYPES
-- Catálogo de serviços jurídicos disponíveis
-- ============================================================
CREATE TABLE service_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  category    TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CASES
-- Unidade central de trabalho (um serviço contratado)
-- ============================================================
CREATE TABLE cases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES profiles(id),
  service_type_id UUID NOT NULL REFERENCES service_types(id),
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'open', 'in_progress', 'completed', 'cancelled')),
  engager_id      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CASE_ASSIGNMENTS
-- Aceite de casos por advogados (primeiro a aceitar fica com o caso)
-- ============================================================
CREATE TABLE case_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id   UUID NOT NULL REFERENCES profiles(id),
  status      TEXT NOT NULL DEFAULT 'accepted'
                CHECK (status IN ('accepted', 'released')),
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  UNIQUE (case_id, lawyer_id)
);

-- ============================================================
-- CONTRACTS
-- Contrato gerado após pagamento
-- ============================================================
CREATE TABLE contracts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE UNIQUE,
  file_url   TEXT,
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'sent', 'signed', 'cancelled')),
  signed_at  TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- Pagamentos via Stripe
-- ============================================================
CREATE TABLE payments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id            UUID NOT NULL REFERENCES cases(id),
  amount             DECIMAL(10,2) NOT NULL,
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_id  TEXT,
  stripe_session_id  TEXT UNIQUE,
  method             TEXT,
  paid_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS
-- Documentos enviados por cliente ou advogado
-- ============================================================
CREATE TABLE documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  uploaded_by  UUID NOT NULL REFERENCES profiles(id),
  file_url     TEXT NOT NULL,
  file_name    TEXT NOT NULL,
  file_size    BIGINT,
  mime_type    TEXT,
  type         TEXT DEFAULT 'other',
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TICKETS
-- Canal de comunicação entre cliente e advogado
-- ============================================================
CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'closed')),
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TICKET_MESSAGES
-- Mensagens dentro de um ticket
-- ============================================================
CREATE TABLE ticket_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES profiles(id),
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases            ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages  ENABLE ROW LEVEL SECURITY;

-- Helper: retorna o role do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ---- PROFILES ----
CREATE POLICY "Usuário vê seu próprio perfil"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin vê todos os perfis"
  ON profiles FOR SELECT USING (get_user_role() = 'admin');

CREATE POLICY "Usuário atualiza seu próprio perfil"
  ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Inserção pelo próprio auth"
  ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ---- LAWYERS ----
CREATE POLICY "Advogado vê seus próprios dados"
  ON lawyers FOR SELECT USING (
    profile_id = auth.uid() OR get_user_role() = 'admin'
  );

CREATE POLICY "Advogado gerencia seus próprios dados"
  ON lawyers FOR ALL USING (profile_id = auth.uid());

-- ---- ENGAGERS ----
CREATE POLICY "Engajador vê seus próprios dados"
  ON engagers FOR SELECT USING (
    profile_id = auth.uid() OR get_user_role() = 'admin'
  );

CREATE POLICY "Engajador gerencia seus próprios dados"
  ON engagers FOR ALL USING (profile_id = auth.uid());

-- ---- SERVICE_TYPES ----
CREATE POLICY "Qualquer pessoa pode ver serviços ativos"
  ON service_types FOR SELECT USING (active = TRUE OR get_user_role() = 'admin');

CREATE POLICY "Admin gerencia serviços"
  ON service_types FOR ALL USING (get_user_role() = 'admin');

-- ---- CASES ----
CREATE POLICY "Cliente vê seus próprios casos"
  ON cases FOR SELECT USING (
    client_id = auth.uid()
    OR get_user_role() IN ('admin', 'lawyer', 'engager')
  );

CREATE POLICY "Cliente cria casos"
  ON cases FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admin e cliente atualizam casos"
  ON cases FOR UPDATE USING (
    client_id = auth.uid() OR get_user_role() = 'admin'
  );

-- ---- CASE_ASSIGNMENTS ----
CREATE POLICY "Advogado vê suas atribuições"
  ON case_assignments FOR SELECT USING (
    lawyer_id = auth.uid() OR get_user_role() IN ('admin', 'client')
  );

CREATE POLICY "Advogado aceita casos"
  ON case_assignments FOR INSERT WITH CHECK (
    lawyer_id = auth.uid() AND get_user_role() = 'lawyer'
  );

-- ---- CONTRACTS ----
CREATE POLICY "Partes envolvidas veem o contrato"
  ON contracts FOR SELECT USING (
    get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = contracts.case_id
        AND (cases.client_id = auth.uid()
             OR EXISTS (SELECT 1 FROM case_assignments ca
                        WHERE ca.case_id = cases.id AND ca.lawyer_id = auth.uid()))
    )
  );

-- ---- PAYMENTS ----
CREATE POLICY "Cliente vê seus pagamentos"
  ON payments FOR SELECT USING (
    get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM cases WHERE cases.id = payments.case_id AND cases.client_id = auth.uid()
    )
  );

-- ---- DOCUMENTS ----
CREATE POLICY "Partes do caso veem documentos"
  ON documents FOR SELECT USING (
    uploaded_by = auth.uid()
    OR get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = documents.case_id
        AND (cases.client_id = auth.uid()
             OR EXISTS (SELECT 1 FROM case_assignments ca
                        WHERE ca.case_id = cases.id AND ca.lawyer_id = auth.uid()))
    )
  );

CREATE POLICY "Autenticado faz upload"
  ON documents FOR INSERT WITH CHECK (uploaded_by = auth.uid());

-- ---- TICKETS ----
CREATE POLICY "Partes do caso veem tickets"
  ON tickets FOR SELECT USING (
    created_by = auth.uid()
    OR get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = tickets.case_id
        AND (cases.client_id = auth.uid()
             OR EXISTS (SELECT 1 FROM case_assignments ca
                        WHERE ca.case_id = cases.id AND ca.lawyer_id = auth.uid()))
    )
  );

CREATE POLICY "Autenticado cria tickets"
  ON tickets FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Criador e admin atualizam ticket"
  ON tickets FOR UPDATE USING (created_by = auth.uid() OR get_user_role() = 'admin');

-- ---- TICKET_MESSAGES ----
CREATE POLICY "Partes do caso veem mensagens"
  ON ticket_messages FOR SELECT USING (
    sender_id = auth.uid()
    OR get_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM tickets t
      JOIN cases c ON c.id = t.case_id
      WHERE t.id = ticket_messages.ticket_id
        AND (c.client_id = auth.uid()
             OR EXISTS (SELECT 1 FROM case_assignments ca
                        WHERE ca.case_id = c.id AND ca.lawyer_id = auth.uid()))
    )
  );

CREATE POLICY "Autenticado envia mensagem"
  ON ticket_messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ============================================================
-- FUNÇÃO: criar perfil automaticamente ao cadastrar usuário
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
<<<<<<< HEAD
  INSERT INTO public.profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
=======
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
    NEW.email
  );
  RETURN NEW;
END;
<<<<<<< HEAD
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
=======
$$ LANGUAGE plpgsql SECURITY DEFINER;
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_cases_client_id       ON cases(client_id);
CREATE INDEX idx_cases_status          ON cases(status);
CREATE INDEX idx_case_assignments_case ON case_assignments(case_id);
CREATE INDEX idx_case_assignments_lawyer ON case_assignments(lawyer_id);
CREATE INDEX idx_documents_case_id     ON documents(case_id);
CREATE INDEX idx_tickets_case_id       ON tickets(case_id);
CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX idx_payments_case_id      ON payments(case_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
