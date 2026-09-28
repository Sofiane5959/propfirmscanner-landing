-- =============================================================================
-- EARN2TRADE — fin de la mise en avant
-- =============================================================================
-- A EXECUTER LE 1er OCTOBRE 2026, avec le retour de la remise a 50 %.
--
-- Remet priority_tier a sa valeur d'avant la campagne. Par defaut, ce fichier
-- le remet a NULL, qui etait l'etat du 28 septembre. Si votre export « etat
-- avant » montrait une autre valeur, remplacez `null` ci-dessous par elle
-- AVANT d'executer.
--
-- 1. D'ABORD, executer SEUL ce select.
-- =============================================================================

select slug, priority_tier, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'earn2trade';


-- 2. Ensuite, executer le fichier entier.
begin;

update prop_firms set
  priority_tier = null,
  updated_at = now()
where slug = 'earn2trade';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.priority_tier is not null then
    raise exception 'Controle echoue : priority_tier n''a pas ete remis a null';
  end if;
end
$verif$;

commit;


-- 3. Etat apres (lecture seule).
select slug, priority_tier, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'earn2trade';
