-- =============================================================================
-- MARQUAGE DES CLICS DE PRECHARGEMENT
-- =============================================================================
-- A passer dans l'editeur SQL Supabase AVANT de deployer.
--
-- Ordre impose : la route /api/go ecrit desormais is_prefetch dans son insert.
-- Tant que la colonne n'existe pas, l'insert echoue. Il est fire-and-forget,
-- donc les visiteurs continueraient d'etre rediriges, mais PLUS AUCUN clic ne
-- serait enregistre. Migration d'abord, deploiement ensuite.
--
-- Aucune ligne existante n'est modifiee ni supprimee : l'historique est la
-- preuve du probleme et sert a en mesurer l'ampleur.
-- Idempotent.
-- =============================================================================

alter table affiliate_clicks
  add column if not exists is_prefetch boolean default false;

-- Les lignes historiques passent a false par defaut, ce qui ne veut PAS dire
-- qu'elles sont fiables : elles sont anterieures au filtre. C'est click_id
-- (NULL avant le correctif) qui separe les deux periodes.
comment on column affiliate_clicks.is_prefetch is
  'true = requete speculative du navigateur, pas un clic humain. Les lignes ou click_id est NULL sont anterieures au filtre et a l identifiant : leur valeur false n est pas une garantie.';

-- Le dashboard filtre sur cette colonne ; sans index il scanne toute la table.
create index if not exists affiliate_clicks_is_prefetch_idx
  on affiliate_clicks (is_prefetch)
  where is_prefetch = false;
