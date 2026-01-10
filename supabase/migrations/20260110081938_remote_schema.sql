drop extension if exists "pg_net";


  create table "public"."books" (
    "id" uuid not null default gen_random_uuid(),
    "seller_id" uuid not null,
    "title" text not null,
    "author" text not null,
    "isbn" text,
    "description" text,
    "price" numeric(10,2) not null,
    "condition" text not null,
    "category" text not null,
    "images" text[] not null default '{}'::text[],
    "status" text not null default 'pending'::text,
    "rejection_reason" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."books" enable row level security;


  create table "public"."cart_items" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "book_id" uuid not null,
    "quantity" integer not null default 1,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."cart_items" enable row level security;


  create table "public"."moderation_logs" (
    "id" uuid not null default gen_random_uuid(),
    "moderator_id" uuid not null,
    "book_id" uuid not null,
    "action" text not null,
    "notes" text,
    "previous_status" text,
    "new_status" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."moderation_logs" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "buyer_id" uuid not null,
    "seller_id" uuid not null,
    "book_id" uuid not null,
    "status" character varying(50) not null default 'initiated'::character varying,
    "price" numeric(10,2) not null,
    "buyer_phone" character varying(20),
    "seller_phone" character varying(20),
    "notes" text,
    "buyer_confirmed_at" timestamp with time zone,
    "seller_confirmed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."orders" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "role" text not null default 'user'::text,
    "is_banned" boolean not null default false,
    "ban_reason" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "book_id" uuid not null,
    "reviewer_id" uuid not null,
    "seller_id" uuid not null,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."reviews" enable row level security;


  create table "public"."saved_books" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "book_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."saved_books" enable row level security;


  create table "public"."user_profiles" (
    "id" uuid not null,
    "email" text not null,
    "first_name" text,
    "last_name" text,
    "phone" text,
    "bio" text,
    "profile_image" text,
    "profile_completed" boolean default false,
    "rating" numeric default 0,
    "total_sales" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "role" character varying(20) default 'user'::character varying
      );


alter table "public"."user_profiles" enable row level security;

CREATE INDEX books_category_idx ON public.books USING btree (category);

CREATE INDEX books_condition_idx ON public.books USING btree (condition);

CREATE INDEX books_created_at_idx ON public.books USING btree (created_at DESC);

CREATE UNIQUE INDEX books_isbn_unique ON public.books USING btree (isbn) WHERE (isbn IS NOT NULL);

CREATE UNIQUE INDEX books_pkey ON public.books USING btree (id);

CREATE INDEX books_seller_idx ON public.books USING btree (seller_id);

CREATE INDEX books_status_idx ON public.books USING btree (status);

CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id);

CREATE UNIQUE INDEX cart_items_user_id_book_id_key ON public.cart_items USING btree (user_id, book_id);

CREATE INDEX idx_orders_buyer ON public.orders USING btree (buyer_id);

CREATE INDEX idx_orders_seller ON public.orders USING btree (seller_id);

CREATE INDEX idx_orders_status ON public.orders USING btree (status);

CREATE INDEX idx_user_profiles_email ON public.user_profiles USING btree (email);

CREATE INDEX moderation_logs_action_idx ON public.moderation_logs USING btree (action);

CREATE INDEX moderation_logs_book_idx ON public.moderation_logs USING btree (book_id);

CREATE INDEX moderation_logs_created_at_idx ON public.moderation_logs USING btree (created_at DESC);

CREATE INDEX moderation_logs_moderator_idx ON public.moderation_logs USING btree (moderator_id);

CREATE UNIQUE INDEX moderation_logs_pkey ON public.moderation_logs USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX profiles_role_idx ON public.profiles USING btree (role);

CREATE INDEX reviews_book_id_idx ON public.reviews USING btree (book_id);

CREATE UNIQUE INDEX reviews_book_id_reviewer_id_key ON public.reviews USING btree (book_id, reviewer_id);

CREATE INDEX reviews_created_at_idx ON public.reviews USING btree (created_at DESC);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE INDEX reviews_reviewer_id_idx ON public.reviews USING btree (reviewer_id);

CREATE INDEX reviews_seller_id_idx ON public.reviews USING btree (seller_id);

CREATE INDEX saved_books_book_idx ON public.saved_books USING btree (book_id);

CREATE UNIQUE INDEX saved_books_pkey ON public.saved_books USING btree (id);

CREATE UNIQUE INDEX saved_books_unique ON public.saved_books USING btree (user_id, book_id);

CREATE INDEX saved_books_user_idx ON public.saved_books USING btree (user_id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

alter table "public"."books" add constraint "books_pkey" PRIMARY KEY using index "books_pkey";

alter table "public"."cart_items" add constraint "cart_items_pkey" PRIMARY KEY using index "cart_items_pkey";

alter table "public"."moderation_logs" add constraint "moderation_logs_pkey" PRIMARY KEY using index "moderation_logs_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."saved_books" add constraint "saved_books_pkey" PRIMARY KEY using index "saved_books_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."books" add constraint "at_least_one_image" CHECK ((array_length(images, 1) > 0)) not valid;

alter table "public"."books" validate constraint "at_least_one_image";

alter table "public"."books" add constraint "books_category_check" CHECK ((category = ANY (ARRAY['academic'::text, 'competitive'::text, 'literature'::text, 'reference'::text]))) not valid;

alter table "public"."books" validate constraint "books_category_check";

alter table "public"."books" add constraint "books_condition_check" CHECK ((condition = ANY (ARRAY['new'::text, 'like_new'::text, 'good'::text, 'fair'::text]))) not valid;

alter table "public"."books" validate constraint "books_condition_check";

alter table "public"."books" add constraint "books_isbn_check" CHECK (((isbn IS NULL) OR (length(replace(isbn, '-'::text, ''::text)) = ANY (ARRAY[10, 13])))) not valid;

alter table "public"."books" validate constraint "books_isbn_check";

alter table "public"."books" add constraint "books_price_check" CHECK ((price > (0)::numeric)) not valid;

alter table "public"."books" validate constraint "books_price_check";

alter table "public"."books" add constraint "books_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."books" validate constraint "books_seller_id_fkey";

alter table "public"."books" add constraint "books_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'sold'::text]))) not valid;

alter table "public"."books" validate constraint "books_status_check";

alter table "public"."cart_items" add constraint "cart_items_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_book_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_user_id_book_id_key" UNIQUE using index "cart_items_user_id_book_id_key";

alter table "public"."cart_items" add constraint "cart_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_user_id_fkey";

alter table "public"."moderation_logs" add constraint "moderation_logs_action_check" CHECK ((action = ANY (ARRAY['approved'::text, 'rejected'::text, 'deleted'::text, 'user_banned'::text, 'user_unbanned'::text]))) not valid;

alter table "public"."moderation_logs" validate constraint "moderation_logs_action_check";

alter table "public"."moderation_logs" add constraint "moderation_logs_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE not valid;

alter table "public"."moderation_logs" validate constraint "moderation_logs_book_id_fkey";

alter table "public"."moderation_logs" add constraint "moderation_logs_moderator_id_fkey" FOREIGN KEY (moderator_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."moderation_logs" validate constraint "moderation_logs_moderator_id_fkey";

alter table "public"."orders" add constraint "orders_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) not valid;

alter table "public"."orders" validate constraint "orders_book_id_fkey";

alter table "public"."orders" add constraint "orders_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES auth.users(id) not valid;

alter table "public"."orders" validate constraint "orders_buyer_id_fkey";

alter table "public"."orders" add constraint "orders_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES auth.users(id) not valid;

alter table "public"."orders" validate constraint "orders_seller_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'moderator'::text, 'admin'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."reviews" add constraint "reviews_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_book_id_fkey";

alter table "public"."reviews" add constraint "reviews_book_id_reviewer_id_key" UNIQUE using index "reviews_book_id_reviewer_id_key";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."reviews" add constraint "reviews_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_reviewer_id_fkey";

alter table "public"."reviews" add constraint "reviews_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_seller_id_fkey";

alter table "public"."saved_books" add constraint "saved_books_book_id_fkey" FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE not valid;

alter table "public"."saved_books" validate constraint "saved_books_book_id_fkey";

alter table "public"."saved_books" add constraint "saved_books_unique" UNIQUE using index "saved_books_unique";

alter table "public"."saved_books" add constraint "saved_books_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."saved_books" validate constraint "saved_books_user_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

set check_function_bodies = off;

create or replace view "public"."books_with_seller" as  SELECT b.id,
    b.title,
    b.author,
    b.isbn,
    b.description,
    b.price,
    b.condition,
    b.category,
    b.images,
    b.status,
    b.created_at,
    b.updated_at,
    p.full_name AS seller_name,
    p.email AS seller_email,
    p.id AS seller_id
   FROM (public.books b
     LEFT JOIN public.profiles p ON ((b.seller_id = p.id)));


CREATE OR REPLACE FUNCTION public.cleanup_saved_books()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.status <> 'approved' THEN
    DELETE FROM saved_books WHERE book_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous'),
    'user' -- Default role
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_book_moderation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Safety: skip logging if not called via Supabase auth context
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO moderation_logs (
      moderator_id,
      book_id,
      action,
      previous_status,
      new_status,
      notes
    ) VALUES (
      auth.uid(),
      NEW.id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'approved'
        WHEN NEW.status = 'rejected' THEN 'rejected'
        ELSE 'deleted'
      END,
      OLD.status,
      NEW.status,
      NEW.rejection_reason
    );
  END IF;

  RETURN NEW;
END;
$function$
;

create or replace view "public"."moderation_queue" as  SELECT b.id,
    b.title,
    b.author,
    b.price,
    b.condition,
    b.category,
    b.images[1] AS cover_image,
    b.created_at,
    p.full_name AS seller_name,
    p.email AS seller_email
   FROM (public.books b
     LEFT JOIN public.profiles p ON ((b.seller_id = p.id)))
  WHERE (b.status = 'pending'::text)
  ORDER BY b.created_at;


create or replace view "public"."public_profiles" as  SELECT id,
    full_name
   FROM public.profiles;


create or replace view "public"."seller_books" as  SELECT id,
    seller_id,
    title,
    author,
    price,
    condition,
    category,
    status,
    rejection_reason,
    created_at,
    updated_at
   FROM public.books;


create or replace view "public"."seller_ratings" as  SELECT seller_id,
    count(*) AS total_reviews,
    round(avg(rating), 2) AS average_rating,
    sum(
        CASE
            WHEN (rating = 5) THEN 1
            ELSE 0
        END) AS five_star,
    sum(
        CASE
            WHEN (rating = 4) THEN 1
            ELSE 0
        END) AS four_star,
    sum(
        CASE
            WHEN (rating = 3) THEN 1
            ELSE 0
        END) AS three_star,
    sum(
        CASE
            WHEN (rating = 2) THEN 1
            ELSE 0
        END) AS two_star,
    sum(
        CASE
            WHEN (rating = 1) THEN 1
            ELSE 0
        END) AS one_star
   FROM public.reviews
  GROUP BY seller_id;


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."books" to "anon";

grant insert on table "public"."books" to "anon";

grant references on table "public"."books" to "anon";

grant select on table "public"."books" to "anon";

grant trigger on table "public"."books" to "anon";

grant truncate on table "public"."books" to "anon";

grant update on table "public"."books" to "anon";

grant delete on table "public"."books" to "authenticated";

grant insert on table "public"."books" to "authenticated";

grant references on table "public"."books" to "authenticated";

grant select on table "public"."books" to "authenticated";

grant trigger on table "public"."books" to "authenticated";

grant truncate on table "public"."books" to "authenticated";

grant update on table "public"."books" to "authenticated";

grant delete on table "public"."books" to "service_role";

grant insert on table "public"."books" to "service_role";

grant references on table "public"."books" to "service_role";

grant select on table "public"."books" to "service_role";

grant trigger on table "public"."books" to "service_role";

grant truncate on table "public"."books" to "service_role";

grant update on table "public"."books" to "service_role";

grant delete on table "public"."cart_items" to "anon";

grant insert on table "public"."cart_items" to "anon";

grant references on table "public"."cart_items" to "anon";

grant select on table "public"."cart_items" to "anon";

grant trigger on table "public"."cart_items" to "anon";

grant truncate on table "public"."cart_items" to "anon";

grant update on table "public"."cart_items" to "anon";

grant delete on table "public"."cart_items" to "authenticated";

grant insert on table "public"."cart_items" to "authenticated";

grant references on table "public"."cart_items" to "authenticated";

grant select on table "public"."cart_items" to "authenticated";

grant trigger on table "public"."cart_items" to "authenticated";

grant truncate on table "public"."cart_items" to "authenticated";

grant update on table "public"."cart_items" to "authenticated";

grant delete on table "public"."cart_items" to "service_role";

grant insert on table "public"."cart_items" to "service_role";

grant references on table "public"."cart_items" to "service_role";

grant select on table "public"."cart_items" to "service_role";

grant trigger on table "public"."cart_items" to "service_role";

grant truncate on table "public"."cart_items" to "service_role";

grant update on table "public"."cart_items" to "service_role";

grant delete on table "public"."moderation_logs" to "anon";

grant insert on table "public"."moderation_logs" to "anon";

grant references on table "public"."moderation_logs" to "anon";

grant select on table "public"."moderation_logs" to "anon";

grant trigger on table "public"."moderation_logs" to "anon";

grant truncate on table "public"."moderation_logs" to "anon";

grant update on table "public"."moderation_logs" to "anon";

grant delete on table "public"."moderation_logs" to "authenticated";

grant insert on table "public"."moderation_logs" to "authenticated";

grant references on table "public"."moderation_logs" to "authenticated";

grant select on table "public"."moderation_logs" to "authenticated";

grant trigger on table "public"."moderation_logs" to "authenticated";

grant truncate on table "public"."moderation_logs" to "authenticated";

grant update on table "public"."moderation_logs" to "authenticated";

grant delete on table "public"."moderation_logs" to "service_role";

grant insert on table "public"."moderation_logs" to "service_role";

grant references on table "public"."moderation_logs" to "service_role";

grant select on table "public"."moderation_logs" to "service_role";

grant trigger on table "public"."moderation_logs" to "service_role";

grant truncate on table "public"."moderation_logs" to "service_role";

grant update on table "public"."moderation_logs" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."saved_books" to "anon";

grant insert on table "public"."saved_books" to "anon";

grant references on table "public"."saved_books" to "anon";

grant select on table "public"."saved_books" to "anon";

grant trigger on table "public"."saved_books" to "anon";

grant truncate on table "public"."saved_books" to "anon";

grant update on table "public"."saved_books" to "anon";

grant delete on table "public"."saved_books" to "authenticated";

grant insert on table "public"."saved_books" to "authenticated";

grant references on table "public"."saved_books" to "authenticated";

grant select on table "public"."saved_books" to "authenticated";

grant trigger on table "public"."saved_books" to "authenticated";

grant truncate on table "public"."saved_books" to "authenticated";

grant update on table "public"."saved_books" to "authenticated";

grant delete on table "public"."saved_books" to "service_role";

grant insert on table "public"."saved_books" to "service_role";

grant references on table "public"."saved_books" to "service_role";

grant select on table "public"."saved_books" to "service_role";

grant trigger on table "public"."saved_books" to "service_role";

grant truncate on table "public"."saved_books" to "service_role";

grant update on table "public"."saved_books" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";


  create policy "Admins can update all books"
  on "public"."books"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



  create policy "Admins can view all books"
  on "public"."books"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



  create policy "Anyone can view approved books"
  on "public"."books"
  as permissive
  for select
  to public
using ((status = 'approved'::text));



  create policy "Moderators can delete books"
  on "public"."books"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text]))))));



  create policy "Moderators can update books"
  on "public"."books"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text]))))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text]))))));



  create policy "Moderators can view all books"
  on "public"."books"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text]))))));



  create policy "Sellers can create books"
  on "public"."books"
  as permissive
  for insert
  to public
with check ((auth.uid() = seller_id));



  create policy "Sellers can update own pending books"
  on "public"."books"
  as permissive
  for update
  to public
using (((auth.uid() = seller_id) AND (status = 'pending'::text)))
with check (((auth.uid() = seller_id) AND (status = 'pending'::text)));



  create policy "Sellers can view own books"
  on "public"."books"
  as permissive
  for select
  to public
using ((auth.uid() = seller_id));



  create policy "Users can delete own cart items"
  on "public"."cart_items"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own cart items"
  on "public"."cart_items"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own cart items"
  on "public"."cart_items"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own cart items"
  on "public"."cart_items"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Moderators can create logs"
  on "public"."moderation_logs"
  as permissive
  for insert
  to public
with check (((auth.uid() = moderator_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text])))))));



  create policy "Moderators can view logs"
  on "public"."moderation_logs"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['moderator'::text, 'admin'::text]))))));



  create policy "Buyers can create orders"
  on "public"."orders"
  as permissive
  for insert
  to public
with check ((auth.uid() = buyer_id));



  create policy "Buyers can view own orders"
  on "public"."orders"
  as permissive
  for select
  to public
using ((auth.uid() = buyer_id));



  create policy "Order parties can update"
  on "public"."orders"
  as permissive
  for update
  to public
using (((auth.uid() = buyer_id) OR (auth.uid() = seller_id)));



  create policy "Sellers can view orders for their books"
  on "public"."orders"
  as permissive
  for select
  to public
using ((auth.uid() = seller_id));



  create policy "Public can view limited profile info"
  on "public"."profiles"
  as permissive
  for select
  to public
using (((id = auth.uid()) OR (role IS NOT NULL)));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id))
with check (((auth.uid() = id) AND (role = ( SELECT profiles_1.role
   FROM public.profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))));



  create policy "Anyone can read reviews"
  on "public"."reviews"
  as permissive
  for select
  to public
using (true);



  create policy "Users can create reviews"
  on "public"."reviews"
  as permissive
  for insert
  to public
with check ((auth.uid() = reviewer_id));



  create policy "Users can delete own reviews"
  on "public"."reviews"
  as permissive
  for delete
  to public
using ((auth.uid() = reviewer_id));



  create policy "Users can update own reviews"
  on "public"."reviews"
  as permissive
  for update
  to public
using ((auth.uid() = reviewer_id))
with check ((auth.uid() = reviewer_id));



  create policy "Users can delete own saved books"
  on "public"."saved_books"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can save approved books"
  on "public"."saved_books"
  as permissive
  for insert
  to public
with check (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM public.books
  WHERE ((books.id = saved_books.book_id) AND (books.status = 'approved'::text))))));



  create policy "Users can view own saved books"
  on "public"."saved_books"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own profile"
  on "public"."user_profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."user_profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."user_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));


CREATE TRIGGER cleanup_saved_books_on_status_change AFTER UPDATE OF status ON public.books FOR EACH ROW EXECUTE FUNCTION public.cleanup_saved_books();

CREATE TRIGGER log_books_moderation AFTER UPDATE OF status ON public.books FOR EACH ROW WHEN ((old.status IS DISTINCT FROM new.status)) EXECUTE FUNCTION public.log_book_moderation();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


