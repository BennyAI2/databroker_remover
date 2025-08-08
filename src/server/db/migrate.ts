import { db } from './sqlite';

// Run basic schema migrations. This function is run on server start via import side effects.
db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS brokers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  legal_entity TEXT,
  privacy_policy_url TEXT,
  contact_email TEXT,
  contact_portal_url TEXT,
  requires_id_proof INTEGER,
  notes TEXT,
  source_url TEXT,
  last_verified_at DATETIME
);

CREATE TABLE IF NOT EXISTS sent_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_id TEXT,
  to_address TEXT,
  reply_to TEXT,
  subject TEXT,
  body TEXT,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  message_id TEXT,
  FOREIGN KEY(broker_id) REFERENCES brokers(id)
);

CREATE TABLE IF NOT EXISTS replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sent_email_id INTEGER,
  from_address TEXT,
  subject TEXT,
  body TEXT,
  received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  summary TEXT,
  status TEXT,
  FOREIGN KEY(sent_email_id) REFERENCES sent_emails(id)
);
`);