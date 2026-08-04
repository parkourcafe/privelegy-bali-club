-- Перки BPC: заголовок только «15% discount», без упоминания карты.
-- Решение основателя, 2026-08-04. Условия (terms) очищаются.
-- Провенанс (источник, дата съёма) остаётся в docs/DATA_OPS_BPC_RESTAURANTS_2026-08-04.md

update perks
set title = regexp_replace(title, '^(\d+)%.*$', '\1% discount'),
    terms = null
where verified_at = '2026-08-04T00:00:00Z';

-- проверка
select title, count(*) from perks
where verified_at = '2026-08-04T00:00:00Z'
group by title order by 1;
