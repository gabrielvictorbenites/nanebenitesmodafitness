
-- Enum de roles
create type public.app_role as enum ('admin');

-- Tabela de roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "user_roles self select"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tabela products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category text not null default '',
  brand text not null default '',
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  on_sale boolean not null default false,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  image text not null default '',
  gallery text[] not null default '{}',
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  stock integer not null default 0,
  sku text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

-- Público lê tudo
create policy "products public read"
on public.products for select to anon, authenticated
using (true);

-- Só admin escreve
create policy "products admin insert"
on public.products for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "products admin update"
on public.products for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "products admin delete"
on public.products for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create index products_category_idx on public.products(category);
create index products_slug_idx on public.products(slug);
create index products_sort_idx on public.products(sort_order);
