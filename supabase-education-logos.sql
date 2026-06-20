alter table public.education
add column if not exists logo_url text;

insert into storage.buckets (id, name, public)
values ('education-logos', 'education-logos', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow public read education logos" on storage.objects;
create policy "Allow public read education logos"
on storage.objects
for select
using (bucket_id = 'education-logos');

drop policy if exists "Allow authenticated users to upload education logos" on storage.objects;
create policy "Allow authenticated users to upload education logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'education-logos');

drop policy if exists "Allow authenticated users to update education logos" on storage.objects;
create policy "Allow authenticated users to update education logos"
on storage.objects
for update
to authenticated
using (bucket_id = 'education-logos')
with check (bucket_id = 'education-logos');

drop policy if exists "Allow authenticated users to delete education logos" on storage.objects;
create policy "Allow authenticated users to delete education logos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'education-logos');
