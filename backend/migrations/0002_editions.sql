
create table if not exists editions (
  id uuid primary key default uuid_generate_v4(),
  publisher_id uuid not null references publishers(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  pdf_url text not null,
  status text not null default 'draft', -- draft, published, archived
  publish_date timestamptz,
  created_at timestamptz not null default now()
);

-- Index for faster lookups by publisher
create index idx_editions_publisher on editions(publisher_id);
