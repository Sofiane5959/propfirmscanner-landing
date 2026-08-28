-- =============================================================================
-- INSTANT FUNDING — lien d'affiliation et code promo
-- =============================================================================
-- Source : panneau partenaire Instant Funding (partners.instantfunding.com),
-- releve du 28 aout 2026. Identifiant partenaire 8404.
--
-- ATTENTION : la valeur actuelle de affiliate_url en base est
--   https://instantfunding.com/?partner=6
-- soit un identifiant partenaire qui n'est pas le tien. Tant qu'elle est en
-- place, chaque clic sortant vers Instant Funding est attribue a quelqu'un
-- d'autre. Cela expliquerait les 0 commandes du panneau.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- ETAPE 0 — Constater l'existant avant d'ecrire. Garder cette sortie.
-- -----------------------------------------------------------------------------
select slug, affiliate_url, website_url, discount_code, discount_percent,
       discount_expires_at, subid_param
from prop_firms
where slug = 'instant-funding';


-- -----------------------------------------------------------------------------
-- ETAPE 1 — Correction
-- -----------------------------------------------------------------------------
update prop_firms set
  -- Identifiant 8404, releve dans "Invite traders" du panneau partenaire.
  affiliate_url    = 'https://instantfunding.com/?partner=8404',
  -- La firme opere sur .com : checkout, support@ et partners@ y sont tous.
  -- La base pointait sur instantfunding.io.
  website_url      = 'https://instantfunding.com',
  -- Code de marque, 10% dans le panneau. L'autre code, AFF8404, est le code
  -- generique du compte et remise identique : un seul suffit sur la page.
  discount_code    = 'SCANNED',
  discount_percent = 10,
  updated_at       = now()
where slug = 'instant-funding';

-- subid_param reste NULL volontairement : le panneau Instant Funding n'expose
-- aucun champ de sous-identifiant. Envoyer un parametre qu'un reseau ignore
-- donnerait l'illusion d'une attribution qu'on n'a pas. A revoir si le
-- partenaire confirme en supporter un.

-- has_discount n'est pas ecrit : aucune ligne de code ne le lit, et il ne
-- figure que dans un fichier de schema qui a derive du schema reel.


-- -----------------------------------------------------------------------------
-- ETAPE 2 — Verification
-- -----------------------------------------------------------------------------
select slug, affiliate_url, website_url, discount_code, discount_percent
from prop_firms
where slug = 'instant-funding';

-- Y a-t-il d'autres firmes avec un identifiant partenaire douteux ?
-- A parcourir : tout ce qui ressemble a un identifiant tres court ou a un
-- reliquat de test merite d'etre confronte au panneau du partenaire concerne.
select slug, name, affiliate_url
from prop_firms
where affiliate_url ~ '(partner|ref|aff|a_pid|afmc|sl)=[0-9]{1,3}([^0-9]|$)'
order by slug;
