-- Create ENUM type for row_status
DO
$$
BEGIN
    CREATE TYPE db_row_status AS ENUM ('enabled', 'disabled', 'archived', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END
$$;

-- Create domains table
CREATE TABLE IF NOT EXISTS domains
(
  key VARCHAR(64) PRIMARY KEY,
  --
  name VARCHAR(256) NOT NULL,
  --
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  row_status db_row_status NOT NULL DEFAULT 'enabled'
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles
(
  key VARCHAR(64) PRIMARY KEY,
  --
  name VARCHAR(256) NOT NULL,
  --
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  row_status db_row_status NOT NULL DEFAULT 'enabled'
);

-- Create users table
CREATE TABLE IF NOT EXISTS users
(
  id UUID PRIMARY KEY,
  --
  email VARCHAR(256) NOT NULL,
  --
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  row_status db_row_status NOT NULL DEFAULT 'enabled'
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles
(
  PRIMARY KEY (domain_key, user_id),
  --
  domain_key VARCHAR(64) NOT NULL REFERENCES domains (key) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role_key VARCHAR(64) NOT NULL REFERENCES roles (key) ON DELETE CASCADE,
  --
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  row_status db_row_status NOT NULL DEFAULT 'enabled'
);
