-- =============================================================================
-- ATTRIBUTION PAR CLICK_ID
-- =============================================================================
-- À passer dans l'éditeur SQL Supabase AVANT de déployer la route.
--
-- Ordre imposé : app/api/go/[slug]/route.ts sélectionne désormais
-- prop_firms.subid_param. Tant que la colonne n'existe pas, ce SELECT échoue,
-- la route part sur son repli « firme introuvable » et TOUS les liens
-- affiliés redirigent vers /compare. Migration d'abord, déploiement ensuite.
--
-- Idempotent : réexécutable sans effet de bord.
-- =============================================================================

-- L'identifiant d'un clic, transmis au partenaire et retrouvé dans son panneau.
alter table affiliate_clicks
  add column if not exists click_id text;

-- Index partiel : les lignes historiques restent à NULL et ne sont pas bloquées
-- par la contrainte d'unicité.
create unique index if not exists affiliate_clicks_click_id_key
  on affiliate_clicks (click_id)
  where click_id is not null;

-- Chaque firme déclare quel paramètre porte le sub-id.
-- NULL = le partenaire ne le supporte pas, on n'ajoute rien.
alter table prop_firms
  add column if not exists subid_param text;

-- Earn2Trade tourne sous Post Affiliate Pro : data1 est le champ de données
-- personnalisées, transféré jusqu'à la commission enregistrée.
-- Ne pas utiliser a_aid — c'est l'identifiant affilié, déjà occupé par a_pid.
update prop_firms
set subid_param = 'data1'
where slug = 'earn2trade';
