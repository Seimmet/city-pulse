create extension if not exists "uuid-ossp";

create table if not exists cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  country text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists publishers (
  id uuid primary key default uuid_generate_v4(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  license_status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (city_id)
);

create type user_role as enum ('SUPER_ADMIN','PUBLISHER','EDITOR','READER');

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  role user_role not null,
  city_id uuid references cities(id),
  created_at timestamptz not null default now(),
  check ((role = 'SUPER_ADMIN' and city_id is null) or (role != 'SUPER_ADMIN'))
);
