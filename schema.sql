
-- ============================================================
-- ALON HISTORYVERSE 24
-- SECURE OWNER ADMIN DATABASE SCHEMA
-- File: schema.sql
-- Database: Cloudflare D1 / SQLite
-- Version: SECURITY + ADMIN CONTENT V1
--
-- IMPORTANT:
-- Existing security tables are preserved.
-- Articles, drafts and trash are stored server-side.
-- Run this schema against the intended D1 database.
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

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event
ON audit_logs(event);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
ON audit_logs(actor);

CREATE INDEX IF NOT EXISTS idx_audit_logs_ip
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

CREATE INDEX IF NOT EXISTS idx_security_events_created_at
ON security_events(created_at);

CREATE INDEX IF NOT EXISTS idx_security_events_event
ON security_events(event);

CREATE INDEX IF NOT EXISTS idx_security_events_severity
ON security_events(severity);

CREATE INDEX IF NOT EXISTS idx_security_events_ip
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

CREATE INDEX IF NOT EXISTS idx_login_attempts_locked_until
ON login_attempts(locked_until);

CREATE INDEX IF NOT EXISTS idx_login_attempts_updated_at
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

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash
ON admin_sessions(token_hash);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_owner_email
ON admin_sessions(owner_email);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
ON admin_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_revoked
ON admin_sessions(revoked);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_last_seen
ON admin_sessions(last_seen_at);

-- ============================================================
-- 5. SECURITY STATE
-- ============================================================

CREATE TABLE IF NOT EXISTS security_state (
    state_key TEXT PRIMARY KEY,
    state_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

INSERT INTO security_state (
    state_key,
    state_value,
    updated_at
)
VALUES (
    'EMERGENCY_LOCKDOWN',
    'INACTIVE',
    datetime('now')
)
ON CONFLICT(state_key) DO NOTHING;

-- ============================================================
-- 6. ADMIN ARTICLES
-- Published articles are stored here.
-- An owner can access only rows matching their owner_email.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_articles (
    id TEXT PRIMARY KEY,
    owner_email TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'History',
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    sources TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'published'
        CHECK (status IN ('published', 'draft')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_articles_owner
ON admin_articles(owner_email);

CREATE INDEX IF NOT EXISTS idx_admin_articles_owner_status
ON admin_articles(owner_email, status);

CREATE INDEX IF NOT EXISTS idx_admin_articles_updated
ON admin_articles(updated_at);

-- ============================================================
-- 7. ADMIN ARTICLE DRAFTS
-- Drafts remain separate from published articles.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_article_drafts (
    id TEXT PRIMARY KEY,
    owner_email TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'History',
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    sources TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_drafts_owner
ON admin_article_drafts(owner_email);

CREATE INDEX IF NOT EXISTS idx_admin_drafts_updated
ON admin_article_drafts(updated_at);

-- ============================================================
-- 8. ADMIN ARTICLE TRASH
-- Deleted articles are recoverable until permanently removed.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_article_trash (
    id TEXT PRIMARY KEY,
    owner_email TEXT NOT NULL,
    original_article_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'History',
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    sources TEXT NOT NULL DEFAULT '[]',
    original_status TEXT NOT NULL DEFAULT 'published'
        CHECK (original_status IN ('published', 'draft')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_trash_owner
ON admin_article_trash(owner_email);

CREATE INDEX IF NOT EXISTS idx_admin_trash_deleted
ON admin_article_trash(deleted_at);

CREATE INDEX IF NOT EXISTS idx_admin_trash_original_id
ON admin_article_trash(original_article_id);

-- ============================================================
-- END OF ALON HISTORYVERSE 24 SCHEMA
-- ============================================================
