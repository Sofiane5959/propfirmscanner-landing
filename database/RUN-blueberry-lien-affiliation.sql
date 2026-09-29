-- =============================================================================
-- BLUEBERRY FUNDED — le lien d'affiliation (29 septembre 2026)
-- =============================================================================
-- Pourquoi : prop_firms.affiliate_url est NULL pour cette firme. Le tunnel
-- retombe donc sur website_url, c'est-a-dire blueberryfunded.com sans
-- identifiant : chaque clic part sans attribution, et aucune commission ne
-- peut remonter. La page annonce pourtant SCANNED -30 %.
--
-- Lien fourni par Sofiane le 29/09/2026, depuis le panneau d'affiliation
-- (« Direct Links », ligne HomePage) et teste le meme jour :
--   https://affiliates.blueberryfunded.com/Tracking/click/?affid=51735&campaign=11948&product_id=1&t_type=HomePage&t_lang=EN
-- Il redirige vers https://blueberryfunded.com/?ref=51735&t360_tracking=... et
-- pose les cookies t360_ref, t360_tracking et affwp_ref : l'attribution suit le
-- visiteur sur le reste de sa visite.
--
-- Pourquoi la ligne HomePage et non la ligne Checkout : le lien Checkout mene a
-- /checkout/?add-to-cart=400401, c'est-a-dire un panier deja rempli avec UN
-- produit precis (406 $). Il conviendrait a un bouton « acheter ce plan-la »,
-- pas a un lien de firme ou le visiteur choisit encore sa taille.
--
-- Ce que ce fichier ne fait PAS : appliquer le code au checkout. Aucun
-- parametre d'URL n'y parvient chez ce partenaire — coupon, coupon_code,
-- coupon-code, apply_coupon, discount et code ont tous ete essayes le 29/09,
-- le total reste inchange. Le visiteur doit saisir SCANNED lui-meme, et la
-- page le lui donne avec un bouton « Copy ».
--
-- Ne touche qu'une ligne, une colonne. Tout ou rien.
--
-- 1. D'ABORD, executer SEUL ce select et garder le resultat (retour arriere).
-- =============================================================================

select slug, affiliate_url, website_url, subid_param, discount_code, discount_percent
from prop_firms where slug = 'blueberry-funded';


-- 2. Ensuite, executer le fichier entier.
begin;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'blueberry-funded') then
    raise exception 'blueberry-funded : ligne introuvable, rien n''est modifie';
  end if;
  if exists (select 1 from prop_firms where slug = 'blueberry-funded'
             and affiliate_url is not null and affiliate_url <> '#') then
    raise exception 'blueberry-funded : affiliate_url est deja renseignee (%), '
      'rien n''est modifie — verifier avant d''ecraser',
      (select affiliate_url from prop_firms where slug = 'blueberry-funded');
  end if;
end
$ctrl$;

update prop_firms set
  affiliate_url = 'https://affiliates.blueberryfunded.com/Tracking/click/?affid=51735&campaign=11948&product_id=1&t_type=HomePage&t_lang=EN',
  updated_at = now()
where slug = 'blueberry-funded';

do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'blueberry-funded';
  if r.affiliate_url is null or r.affiliate_url not like 'https://affiliates.blueberryfunded.com/%' then
    raise exception 'blueberry-funded : affiliate_url non ecrite, annulation';
  end if;
end
$verif$;

commit;


-- 3. Controle final : la ligne doit afficher le lien de tracking.
select slug, affiliate_url, website_url, discount_code, discount_percent
from prop_firms where slug = 'blueberry-funded';
