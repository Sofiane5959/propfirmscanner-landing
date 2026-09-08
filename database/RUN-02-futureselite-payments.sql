-- =============================================================================
-- MOYENS DE PAIEMENT — FUTURESELITE UNIQUEMENT
-- =============================================================================
-- Prerequis : RUN-01-firm-payment-methods.sql.
--
-- PORTEE : `futureselite` seulement.
-- IDEMPOTENT : `delete` puis `insert` sur cette seule firme.
--
-- `prop_firms.payout_methods` n'est PAS touchee : elle reste le repli, et
-- continue d'etre ecrite par le generateur.
--
-- CE QUI EST VERIFIE, ET CE QUI NE L'EST PAS
--
-- Le flux `payout` est documente : la FAQ paiements nomme Rise, impose un
-- compte Rise et un KYC au premier retrait, et donne les delais.
--
-- Le flux `purchase` ne l'est PAS. Le configurateur est derriere une
-- authentification et aucune page publique n'enumere les moyens d'achat. On
-- n'insere donc AUCUNE ligne `purchase` plutot que de supposer « carte
-- bancaire » — c'est probable, ce n'est pas verifie.
-- =============================================================================

begin;

delete from firm_payment_methods where firm_slug = 'futureselite';

insert into firm_payment_methods
  (firm_slug, flow, name, kind, provider, note, lead_time, availability,
   source_url, verified_at, confidence, sort_order)
values
  ('futureselite', 'payout', 'Rise', 'provider', 'Rise',
   'Le premier retrait exige un compte Rise et un KYC.',
   'Revue en moyenne sous 24 heures ; une verification manuelle peut allonger le delai.',
   null,
   'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed',
   timestamptz '2026-09-07', 'verified', 1),

  ('futureselite', 'payout', 'Bank transfer', 'bank', 'Rise',
   'Verse via Rise.', '1 a 3 jours apres approbation.', null,
   'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed',
   timestamptz '2026-09-07', 'verified', 2),

  ('futureselite', 'payout', 'Crypto', 'crypto', 'Rise',
   'Maximum 500 $ par demande. Au-dela, les methodes Rise standard s appliquent.',
   null, null,
   'https://faq.futureselite.com/en/articles/11949985-how-are-payouts-processed',
   timestamptz '2026-09-07', 'verified', 3);

commit;


-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------
select flow, name, kind, provider, confidence, lead_time
from   firm_payment_methods
where  firm_slug = 'futureselite'
order  by flow, sort_order;

-- ATTENDU : 3 lignes, toutes en `payout`, toutes `verified`.
--   payout | Rise          | provider | Rise | verified | Revue en moyenne...
--   payout | Bank transfer | bank     | Rise | verified | 1 a 3 jours...
--   payout | Crypto        | crypto   | Rise | verified | —
--
-- AUCUNE ligne `purchase` : c'est voulu, les moyens d'achat ne sont pas
-- documentes publiquement. Une ligne inventee ici se retrouverait sur la fiche.


-- Le repli reste en place et inchange.
select payout_methods from prop_firms where slug = 'futureselite';
-- ATTENDU : {Rise}


-- -----------------------------------------------------------------------------
-- RETOUR EN ARRIERE
-- -----------------------------------------------------------------------------
-- delete from firm_payment_methods where firm_slug = 'futureselite';
--
-- La fiche retombe alors sur `prop_firms.payout_methods`, qui n'a pas bouge.
