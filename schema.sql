-- ============================================================
-- ALON HISTORYVERSE 24
-- SECURE OWNER ADMIN DATABASE SCHEMA
--
-- File:
-- security-backend/schema.sql
--
-- Database:
-- Cloudflare D1 / SQLite
-- ============================================================


PRAGMA foreign_keys = ON;


-- ============================================================
-- 1. AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    event TEXT NOT NULL,

    actor TEXT,

    success INTEGER NOT NULL DEFAULT 1,

    ip_address TEXT,

    user_agent TEXT,

    details TEXT,

    created_at TEXT NOT NULL
);


-- ============================================================
-- AUDIT LOG INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_audit_logs_created_at
ON audit_logs(created_at);


CREATE INDEX IF NOT EXISTS
idx_audit_logs_event
ON audit_logs(event);


CREATE INDEX IF NOT EXISTS
idx_audit_logs_actor
ON audit_logs(actor);


CREATE INDEX IF NOT EXISTS
idx_audit_logs_ip
ON audit_logs(ip_address);


-- ============================================================
-- 2. SECURITY EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    event TEXT NOT NULL,

    severity TEXT NOT NULL DEFAULT 'medium',

    ip_address TEXT,

    user_agent TEXT,

    details TEXT,

    created_at TEXT NOT NULL
);


-- ============================================================
-- SECURITY EVENT INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_security_events_created_at
ON security_events(created_at);


CREATE INDEX IF NOT EXISTS
idx_security_events_event
ON security_events(event);


CREATE INDEX IF NOT EXISTS
idx_security_events_severity
ON security_events(severity);


CREATE INDEX IF NOT EXISTS
idx_security_events_ip
ON security_events(ip_address);


-- ============================================================
-- 3. LOGIN ATTEMPTS
-- ============================================================

CREATE TABLE IF NOT EXISTS login_attempts (
    ip_address TEXT PRIMARY KEY,

    attempts INTEGER NOT NULL DEFAULT 0,

    locked_until TEXT,

    updated_at TEXT NOT NULL
);


-- ============================================================
-- LOGIN ATTEMPT INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_login_attempts_locked_until
ON login_attempts(locked_until);


CREATE INDEX IF NOT EXISTS
idx_login_attempts_updated_at
ON login_attempts(updated_at);


-- ============================================================
-- 4. ADMIN SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_sessions (
    session_id TEXT PRIMARY KEY,

    token_hash TEXT NOT NULL UNIQUE,

    owner_email TEXT NOT NULL,

    ip_address TEXT,

    user_agent TEXT,

    expires_at TEXT NOT NULL,

    revoked INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL,

    last_seen_at TEXT NOT NULL
);


-- ============================================================
-- ADMIN SESSION INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
idx_admin_sessions_token_hash
ON admin_sessions(token_hash);


CREATE INDEX IF NOT EXISTS
idx_admin_sessions_owner_email
ON admin_sessions(owner_email);


CREATE INDEX IF NOT EXISTS
idx_admin_sessions_expires_at
ON admin_sessions(expires_at);


CREATE INDEX IF NOT EXISTS
idx_admin_sessions_revoked
ON admin_sessions(revoked);


CREATE INDEX IF NOT EXISTS
idx_admin_sessions_last_seen
ON admin_sessions(last_seen_at);


-- ============================================================
-- 5. SECURITY STATE
-- ============================================================

CREATE TABLE IF NOT EXISTS security_state (
    state_key TEXT PRIMARY KEY,

    state_value TEXT NOT NULL,

    updated_at TEXT NOT NULL
);


-- ============================================================
-- INITIAL SECURITY STATE
-- ============================================================

INSERT INTO security_state
(
    state_key,
    state_value,
    updated_at
)
VALUES
(
    'EMERGENCY_LOCKDOWN',
    'INACTIVE',
    datetime('now')
)
ON CONFLICT(state_key)
DO NOTHING;


-- ============================================================
-- END OF ALON HISTORYVERSE 24 SECURITY SCHEMA
-- ============================================================