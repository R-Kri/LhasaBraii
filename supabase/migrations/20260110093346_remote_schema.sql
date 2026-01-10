
  create table "public"."wishlists" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "book_id" uuid not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."wishlists" enable row level security;

CREATE INDEX idx_wishlists_book_id ON public.wishlists USING btree (book_id);

CREATE INDEX idx_wishlists_user_id ON public.wishlists USING btree (user_id);

CREATE UNIQUE INDEX wishlists_pkey ON public.wishlists USING btree (id);

CREATE UNIQUE INDEX wishlists_user_id_book_id_key ON public.wishlists USING btree (user_id, book_id);

alter table "public"."wishlists" add constraint "wishlists_pkey" PRIMARY KEY using index "wishlists_pkey";

alter table "public"."wishlists" add constraint "wishlists_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE not valid;

alter table "public"."wishlists" validate constraint "wishlists_book_id_fkey";

alter table "public"."wishlists" add constraint "wishlists_user_id_book_id_key" UNIQUE using index "wishlists_user_id_book_id_key";

alter table "public"."wishlists" add constraint "wishlists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."wishlists" validate constraint "wishlists_user_id_fkey";

grant delete on table "public"."wishlists" to "anon";

grant insert on table "public"."wishlists" to "anon";

grant references on table "public"."wishlists" to "anon";

grant select on table "public"."wishlists" to "anon";

grant trigger on table "public"."wishlists" to "anon";

grant truncate on table "public"."wishlists" to "anon";

grant update on table "public"."wishlists" to "anon";

grant delete on table "public"."wishlists" to "authenticated";

grant insert on table "public"."wishlists" to "authenticated";

grant references on table "public"."wishlists" to "authenticated";

grant select on table "public"."wishlists" to "authenticated";

grant trigger on table "public"."wishlists" to "authenticated";

grant truncate on table "public"."wishlists" to "authenticated";

grant update on table "public"."wishlists" to "authenticated";

grant delete on table "public"."wishlists" to "service_role";

grant insert on table "public"."wishlists" to "service_role";

grant references on table "public"."wishlists" to "service_role";

grant select on table "public"."wishlists" to "service_role";

grant trigger on table "public"."wishlists" to "service_role";

grant truncate on table "public"."wishlists" to "service_role";

grant update on table "public"."wishlists" to "service_role";


  create policy "Users can add to own wishlist"
  on "public"."wishlists"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can remove from own wishlist"
  on "public"."wishlists"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can view own wishlist"
  on "public"."wishlists"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



