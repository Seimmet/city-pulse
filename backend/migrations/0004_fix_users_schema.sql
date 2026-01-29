-- Fix users table schema from conflicting 0001 and 0003 migrations
DO $$
BEGIN
    -- Add password_hash if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash text;
    END IF;

    -- Add full_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name text;
    END IF;
END $$;

-- Ensure publishers has owner_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='publishers' AND column_name='owner_id') THEN
        ALTER TABLE publishers ADD COLUMN owner_id uuid REFERENCES users(id);
    END IF;
END $$;
