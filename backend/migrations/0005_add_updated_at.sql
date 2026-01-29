alter table editions add column if not exists updated_at timestamptz default now();
