-- =============================================================================
-- FUTURESELITE — RETRAIT D'UNE NOTE TRUSTPILOT SANS SOURCE
-- =============================================================================
-- La fiche affiche « 4,3 — 25 avis ». Ce couple ne vient d'aucun relevé :
-- il est arrivé par le seed initial et n'a jamais été rapproché d'une source.
-- Deux raisons de ne pas le laisser en ligne :
--
--   1. CLAUDE.md impose de vérifier toute donnée firme contre la source
--      officielle avant publication. Une note d'avis pèse sur une décision
--      d'achat autant qu'un prix.
--   2. La page d'accueil de FuturesElite affiche elle-même des compteurs à
--      zéro, donc rien sur place ne corrobore 4,3 ni 25.
--
-- Tentative de vérification du 5 septembre 2026 : la page Trustpilot répond
-- par un contrôle anti-robot. Elle n'a pas été contournée. Faute de pouvoir
-- vérifier, on retire plutôt que de publier.
--
-- L'affichage est déjà conditionné à `trustpilot_rating > 0` : mettre à zéro
-- fait disparaître le bloc proprement, sans toucher au composant.
--
-- POUR REMETTRE LA NOTE : ouvrir https://www.trustpilot.com/review/futureselite.com
-- dans un navigateur ordinaire, relever la note et le nombre d'avis affichés,
-- et rejouer l'UPDATE avec ces deux valeurs plus la date du relevé.
-- =============================================================================

update prop_firms
set    trustpilot_rating  = 0,
       trustpilot_reviews = 0
where  slug = 'futureselite';

-- Contrôle : doit renvoyer une ligne, les deux compteurs à 0.
select slug, name, trustpilot_rating, trustpilot_reviews
from   prop_firms
where  slug = 'futureselite';
