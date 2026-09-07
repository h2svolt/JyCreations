-- JY Creations product catalog — run this once in the Supabase SQL editor
-- (Project → SQL Editor → New query → paste → Run) before the migration
-- script or the admin portal are used.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  name text not null,
  slug text not null,
  price numeric not null,
  images text[] not null default '{}',
  image_labels text[],
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists products_category_slug_idx
  on products (category_id, slug);

create index if not exists products_category_sort_idx
  on products (category_id, sort_order);

-- Row Level Security: the storefront and admin portal both read/write through
-- server-side code using the service_role key, which bypasses RLS entirely.
-- Enabling RLS with no public policies means the anon/public key (if it were
-- ever exposed) grants no access at all.
alter table products enable row level security;

-- Storage bucket for product photos, served over a public CDN URL after
-- upload — matches how the current build-time asset images are already
-- publicly served.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read for product images'
  ) then
    create policy "Public read for product images"
      on storage.objects for select
      using (bucket_id = 'product-images');
  end if;
end $$;
