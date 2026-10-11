-- wave-rewrite-now-2026-10-08: 16 field(s) in one DO block, one UPDATE per column.
-- Each UPDATE must change exactly the number of rows it lists; if one does not, the whole block rolls back.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Guards: md5 of the current text; every literal is ASCII.
do $apply$
declare n int;
begin
  update venues v set why_its_here = d.val
  from (values
    ('amavi-canggu-bali', '50cd48dd5383873cb9a32ee010c95f4f', 'The menu at AMAVI goes from nasi goreng and sate ayam to Angus ribeye and pizza. It''s a restaurant and bar lounge on Jl. Pantai Berawa, run on a Mediterranean concept, with a pool and rice field views.'),
    ('cafe-coach', 'cfe84dc71a22ca59e87ad96ce3eda104', U&'On Jl. Nelayan in Canggu, Cafe Coach is an all-day caf\00E9 that doubles as a wellness-coaching space and hosts workshops. The large menu runs from breakfast to dinner (benedicts, poke bowls, burgers), with coffee and cocktails.'),
    ('mavammy', 'fdf285168b51f8c2b14c9dafbed58455', U&'Mavammy''s dessert counter is built on Belgian chocolate, and breakfast runs all day at this caf\00E9 and patisserie on Jl. Pantai Batu Bolong. The cakes include carrot cake with mango and passion fruit, and a Lotus cheesecake. The wifi is strong and there''s air conditioning.'),
    ('porch', 'b8d1ffe728d5732e450a536f498291d8', 'Thirteen kinds of cheesecake are the reason to come to Porch, a coffee shop on Jl. Raya Semat.'),
    ('pranava-yoga', '616eb34f2ed717b5db20fcb3e9d6c49b', 'Vicki and Yuni opened Pranava Yoga in April 2016, at the Matrabali guesthouse on Jl. Pantai Berawa. Rates sit below the premium Canggu studios so local residents can practise too, and classes suit every level.'),
    ('mamu-ubud-cafe-shisha-hookah', '1f0d9b93451d46fa908755cf1a4805d8', U&'Darkside, Musthave and Duft are on the shisha list at MAMU, a caf\00E9 and shisha lounge on Jl. Made Lebah in Mas. The food is bowls, roasted vegetables, warm dips and shawarma, and there is an air-conditioned lounge as well as a garden terrace.'),
    ('dewas-landing-cafe', 'd1f1a6b67218e41ca16454b40fad5aab', 'Dewas Landing Cafe, on Jl. Raya Uluwatu in Pecatu, is a local gathering point that runs football watch parties.'),
    ('humans-cafe', 'd83c14ea2575b8206e07f40d73bfdc7f', 'HUMANS CAFE, on Jl. Bali Cliff in Ungasan, serves Asian, Indonesian and European plates with specialty coffee. There''s a playground for children.'),
    ('lemanja-uluwatu', '067a541ccb10dbfd44fca01b15cd17ff', U&'Breakfast at Lemanj\00E1 Uluwatu starts at 07:30. It''s a caf\00E9, bar and coworking space with a pool on Jl. Labuansait. Plates start at 20,000 IDR, and the menu runs to pan-grilled prawns, tuna tataki, vegan quesadillas and plant-based pizza, with pastries alongside the cocktails.'),
    ('made-s-bakery-cafe-playground', '5e9ef531001fa1271d7c0c3d55903a3a', U&'Made\2019s Bakery Cafe Playground grew out of a small warung and has been a bakery and caf\00E9 on Jl. Dharmawangsa in Ungasan since 2025. Expect pastries, desserts and coffee, breakfast all day in large portions, and a playground that is free to use.'),
    ('ula-cafe', '78ab2473ceacbeff24c6bb5da311e92b', 'Chef Mags builds the menu from scratch at Ula Cafe on Jl. Pantai Balangan and keeps separate breakfast and mains lists. There are woven textures, ocean air and vinyl in the background, plus wifi and power outlets throughout.'),
    ('uluwatu-collective', 'cefc1ce4126de75fff703e5daa74a8b5', 'At Uluwatu Collective, CrossFit, Metcon, HIIT, weightlifting, functional training and yoga run as group classes. The gym is high-ceilinged and open-air, above Pepito Express on Jl. Raya Uluwatu. Access is sold daily, weekly, monthly or yearly, and a month is 1,450,000 IDR.'),
    ('de-maison-bali-restaurant-and-bar', 'c417ee6f620e9bd4740f213f761b4446', 'De Maison Bali Restaurant & Bar, in Renon, Denpasar, is a coffee shop on Jl. Tukad Badung.')
  ) as d(slug, old_md5, val)
  where v.slug = d.slug and v.status = 'active' and v.publication_status = 'published'
    and case when d.old_md5 is null then (v.why_its_here is null or length(trim(v.why_its_here)) = 0) else md5(v.why_its_here) = d.old_md5 end;
  get diagnostics n = row_count; if n <> 13 then raise exception 'wave-rewrite-now-2026-10-08 why_its_here: expected 13 rows, got %', n; end if;

  update venues v set best_for = d.val
  from (values
    ('cafe-coach', '8d3aff3a52385ac2968f05840848df0b', 'Breakfast, or dinner that runs into cocktails'),
    ('manga-madu', '07e031152c190c3e1eb2d5b43a850fa7', 'A budget meal of classic Indonesian comfort food close to central Ubud')
  ) as d(slug, old_md5, val)
  where v.slug = d.slug and v.status = 'active' and v.publication_status = 'published'
    and case when d.old_md5 is null then (v.best_for is null or length(trim(v.best_for)) = 0) else md5(v.best_for) = d.old_md5 end;
  get diagnostics n = row_count; if n <> 2 then raise exception 'wave-rewrite-now-2026-10-08 best_for: expected 2 rows, got %', n; end if;

  update venues v set not_for = d.val
  from (values
    ('manga-madu', '31d4a9892e1e389d4d43a2a8315e0512', 'A fine-dining atmosphere or an extensive wine list: this is a budget warung')
  ) as d(slug, old_md5, val)
  where v.slug = d.slug and v.status = 'active' and v.publication_status = 'published'
    and case when d.old_md5 is null then (v.not_for is null or length(trim(v.not_for)) = 0) else md5(v.not_for) = d.old_md5 end;
  get diagnostics n = row_count; if n <> 1 then raise exception 'wave-rewrite-now-2026-10-08 not_for: expected 1 rows, got %', n; end if;
end $apply$;

-- Check: expect 0 rows.
select d.slug, d.field
from (values
  ('amavi-canggu-bali', 'why_its_here', '7f5a3bfda76d8776fd9a3b474d394b2e'),
  ('cafe-coach', 'why_its_here', 'f685718444da7aaac96d12e6fdd4176f'),
  ('cafe-coach', 'best_for', 'd5ce955599499215a341fed75f004c32'),
  ('mavammy', 'why_its_here', 'aa2cd5cdedc8715ac11c7ed6a7fc6ed0'),
  ('porch', 'why_its_here', 'd258f4330152e6bbc5b1352c2c60a552'),
  ('pranava-yoga', 'why_its_here', '4625f88c88a8fdbfd443adef6cbeacfa'),
  ('mamu-ubud-cafe-shisha-hookah', 'why_its_here', 'cb48c0302a9e71dc8b269f7d1ed94c86'),
  ('dewas-landing-cafe', 'why_its_here', '5eb5e9f15acb84ca4d78df17cccfe70e'),
  ('humans-cafe', 'why_its_here', '5418c57a43dda63f02a510ee166e3dc5'),
  ('lemanja-uluwatu', 'why_its_here', 'aefe4776afe6d8fc1eab214088937596'),
  ('made-s-bakery-cafe-playground', 'why_its_here', '307eb62569708f96c27d7dbb8cff2245'),
  ('ula-cafe', 'why_its_here', '42e1693929d2cbe8d0f56f5a7cab09e8'),
  ('uluwatu-collective', 'why_its_here', '4bb1d36c6f1b2d999ac5695fb58e9111'),
  ('de-maison-bali-restaurant-and-bar', 'why_its_here', 'bbf44041c2fdd3f3f0634322b263e63d'),
  ('manga-madu', 'best_for', '330d67255f856f7c6548c7e2b85fd3fe'),
  ('manga-madu', 'not_for', '99c41b7e415dc118a6f4eba705426a4c')
) as d(slug, field, want)
left join venues v on v.slug = d.slug
where v.slug is null or case d.field when 'why_its_here' then md5(v.why_its_here) when 'best_for' then md5(v.best_for) when 'not_for' then md5(v.not_for) when 'price_anchor' then md5(v.price_anchor) when 'what_to_order' then md5(v.what_to_order) end is distinct from d.want
order by 1, 2;
