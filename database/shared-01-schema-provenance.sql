-- =============================================================================
-- SCHEMA — colonnes de provenance et de cycle de vie des promotions
-- =============================================================================
-- Concerne TOUTE la table prop_firms, donc les 313 firmes. Rien de specifique
-- a une firme ici.
--
-- A passer en premier : les fichiers de mise a jour par firme ecrivent dans
-- ces colonnes. Idempotent, rejouable sans effet de bord.
-- =============================================================================


-- 1. Colonnes de cycle de vie des promotions et de provenance
-- -----------------------------------------------------------------------------
-- Le code lit deja discount_expires_at. Les trois autres rendent l'etat d'une
-- offre explicite au lieu d'etre deduit, et donnent une date de verification
-- affichable. Idempotent.
alter table prop_firms add column if not exists discount_starts_at  timestamptz;
alter table prop_firms add column if not exists discount_status     text;
alter table prop_firms add column if not exists data_verified_at    timestamptz;
alter table prop_firms add column if not exists data_verified_by    text;
alter table prop_firms add column if not exists source_url          text;
alter table prop_firms add column if not exists rating_checked_at   timestamptz;

comment on column prop_firms.rating_checked_at is
  'Date de releve de trustpilot_rating / trustpilot_reviews. La note appartient a Trustpilot, elle n est pas collectee par PropFirmScanner.';


-- -----------------------------------------------------------------------------


-- -----------------------------------------------------------------------------
-- Devise de facturation
-- -----------------------------------------------------------------------------
-- Toutes les firmes ne facturent pas en dollars : FTMO facture en euros.
-- Afficher 79 EUR comme "$79" est une erreur factuelle, et convertir serait
-- inventer un chiffre qui derive avec le taux. Le rendu suit ce champ.
-- USD par defaut : aucune firme existante ne change d affichage.
alter table prop_firms add column if not exists price_currency text default 'USD';

comment on column prop_firms.price_currency is
  'Devise de facturation de la firme. USD par defaut. Aucune conversion n est faite.';
