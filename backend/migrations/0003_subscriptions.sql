-- Users for authentication
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'READER', -- SUPER_ADMIN, PUBLISHER, READER
  full_name text,
  created_at timestamptz not null default now()
);

-- Add owner_id to publishers to link to a user login
alter table publishers add column if not exists owner_id uuid references users(id);

-- Subscription Plans (City-based)
create table if not exists plans (
  id uuid primary key default uuid_generate_v4(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null, -- e.g. "Monthly Access"
  description text,
  price_amount integer not null, -- in cents
  price_currency text not null default 'usd',
  interval text not null default 'month', -- month, year
  stripe_price_id text, -- Stored after creating in Stripe
  is_active boolean default true,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  plan_id uuid not null references plans(id),
  stripe_subscription_id text,
  stripe_customer_id text,
  status text not null, -- active, past_due, canceled, incomplete
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- Index for finding active subscriptions for a user
create index idx_subscriptions_user_status on subscriptions(user_id, status);
