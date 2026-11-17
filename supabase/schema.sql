-- ApnaKhata: run this entire script in Supabase SQL Editor.
-- No seed/demo records are inserted by this migration.

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  phone text check (phone is null or char_length(phone) <= 20),
  created_at timestamptz not null default now()
);

create index if not exists customers_user_name_idx
  on public.customers (user_id, lower(name));

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  type text not null check (type in ('credit', 'payment')),
  amount numeric(12,2) not null check (amount > 0),
  note text check (note is null or char_length(note) <= 250),
  transaction_date date not null default current_date,
  created_at timestamptz not null default now(),
  constraint transactions_customer_user_unique unique (id, customer_id, user_id)
);

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, transaction_date desc, created_at desc);
create index if not exists transactions_customer_date_idx
  on public.transactions (customer_id, transaction_date, created_at);

-- A transaction must belong to the same shopkeeper as its customer.
create or replace function public.ensure_transaction_customer_owner()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  available_balance numeric(12,2);
begin
  -- Lock the customer row so two simultaneous payment requests cannot both
  -- spend the same outstanding balance.
  perform 1
  from public.customers c
  where c.id = new.customer_id and c.user_id = new.user_id
  for update;

  if not found then
    raise exception 'Customer does not belong to this account';
  end if;

  if new.type = 'payment' then
    select coalesce(sum(case when t.type = 'credit' then t.amount else -t.amount end), 0)
      into available_balance
    from public.transactions t
    where t.customer_id = new.customer_id
      and t.user_id = new.user_id
      and t.transaction_date <= new.transaction_date
      and (tg_op <> 'UPDATE' or t.id <> new.id);

    if new.amount > available_balance then
      raise exception 'Payment exceeds the outstanding balance on this date';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists transactions_customer_owner_check on public.transactions;
create trigger transactions_customer_owner_check
before insert or update on public.transactions
for each row execute function public.ensure_transaction_customer_owner();

alter table public.customers enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Shopkeepers manage their own customers" on public.customers;
create policy "Shopkeepers manage their own customers"
on public.customers for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Shopkeepers manage their own transactions" on public.transactions;
create policy "Shopkeepers manage their own transactions"
on public.transactions for all
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.customers c
    where c.id = customer_id and c.user_id = (select auth.uid())
  )
);

grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
