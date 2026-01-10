
  create table "public"."contact_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "subject" text,
    "message" text not null,
    "feedback_type" text,
    "rating" integer,
    "user_id" uuid,
    "status" text default 'new'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."contact_submissions" enable row level security;

CREATE UNIQUE INDEX contact_submissions_pkey ON public.contact_submissions USING btree (id);

CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions USING btree (created_at DESC);

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status);

alter table "public"."contact_submissions" add constraint "contact_submissions_pkey" PRIMARY KEY using index "contact_submissions_pkey";

alter table "public"."contact_submissions" add constraint "contact_submissions_feedback_type_check" CHECK ((feedback_type = ANY (ARRAY['general'::text, 'bug'::text, 'feature'::text, 'feedback'::text]))) not valid;

alter table "public"."contact_submissions" validate constraint "contact_submissions_feedback_type_check";

alter table "public"."contact_submissions" add constraint "contact_submissions_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."contact_submissions" validate constraint "contact_submissions_rating_check";

alter table "public"."contact_submissions" add constraint "contact_submissions_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text, 'archived'::text]))) not valid;

alter table "public"."contact_submissions" validate constraint "contact_submissions_status_check";

alter table "public"."contact_submissions" add constraint "contact_submissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."contact_submissions" validate constraint "contact_submissions_user_id_fkey";

grant delete on table "public"."contact_submissions" to "anon";

grant insert on table "public"."contact_submissions" to "anon";

grant references on table "public"."contact_submissions" to "anon";

grant select on table "public"."contact_submissions" to "anon";

grant trigger on table "public"."contact_submissions" to "anon";

grant truncate on table "public"."contact_submissions" to "anon";

grant update on table "public"."contact_submissions" to "anon";

grant delete on table "public"."contact_submissions" to "authenticated";

grant insert on table "public"."contact_submissions" to "authenticated";

grant references on table "public"."contact_submissions" to "authenticated";

grant select on table "public"."contact_submissions" to "authenticated";

grant trigger on table "public"."contact_submissions" to "authenticated";

grant truncate on table "public"."contact_submissions" to "authenticated";

grant update on table "public"."contact_submissions" to "authenticated";

grant delete on table "public"."contact_submissions" to "service_role";

grant insert on table "public"."contact_submissions" to "service_role";

grant references on table "public"."contact_submissions" to "service_role";

grant select on table "public"."contact_submissions" to "service_role";

grant trigger on table "public"."contact_submissions" to "service_role";

grant truncate on table "public"."contact_submissions" to "service_role";

grant update on table "public"."contact_submissions" to "service_role";


  create policy "Admins can update submissions"
  on "public"."contact_submissions"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



  create policy "Admins can view all submissions"
  on "public"."contact_submissions"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));



  create policy "Anyone can submit contact form"
  on "public"."contact_submissions"
  as permissive
  for insert
  to public
with check (true);



