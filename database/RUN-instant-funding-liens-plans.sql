-- =============================================================================
-- INSTANT FUNDING — un lien profond par plan (2 octobre 2026)
-- =============================================================================
-- Aujourd'hui, chaque clic vers cette firme atterrit sur sa page d'accueil :
-- le visiteur doit retrouver son produit parmi vingt-trois, choisir sa taille,
-- sa plateforme, son type de compte, puis taper SCANNED. A chaque etape, il en
-- part.
--
-- Leur boutique est une WooCommerce dont le catalogue est public. Chaque plan
-- correspond a une variation, et l'ouvrir dans le panier tient en une URL :
--   https://instantfunding.com/checkout/?add-to-cart=<variation>&quantity=1&partner=8404
-- Verifie le 02/10/2026 : la variation 1061402 ouvre bien le paiement avec
-- « IF Micro Lite, 5000, MetaTrader 5, Commission Free » dans le panier.
--
-- Choix par defaut quand la base ne precise rien : MetaTrader 5, Commission
-- Free. Ce sont les deux options les plus courantes, et elles restent
-- modifiables chez le partenaire.
--
-- Le code promo, lui, ne peut PAS etre pre-applique : coupon, coupon_code,
-- coupon-code, apply_coupon et discount_code ont tous ete essayes sur leur
-- paiement, le total ne bouge pas. Le visiteur saisit SCANNED lui-meme.
--
-- 1. D'ABORD, executer SEUL ce select et exporter le resultat (retour arriere).
-- =============================================================================

select slug, name, affiliate_url from prop_firm_challenges
where firm_slug = 'instant-funding' order by name;


-- 2. Ensuite, executer le fichier entier.
begin;

update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1039574&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-evolve-10k';   -- IF Evolve (Futures Style) $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1039580&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-evolve-25k';   -- IF Evolve (Futures Style) $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1039586&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-evolve-50k';   -- IF Evolve (Futures Style) $50,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=931048&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-10k';   -- IF Micro $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=931054&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-25k';   -- IF Micro $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=931042&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-5k';   -- IF Micro $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016628&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-10k';   -- IF Micro Clarity $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016646&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-100k';   -- IF Micro Clarity $100,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016652&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-200k';   -- IF Micro Clarity $200,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016634&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-25k';   -- IF Micro Clarity $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016622&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-5k';   -- IF Micro Clarity $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016640&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'if-micro-clarity-50k';   -- IF Micro Clarity $50,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367229&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-1250';   -- Instant Funding $1,250
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367247&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-10k';   -- Instant Funding $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=784878&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-120k';   -- Instant Funding $120,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367235&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-2500';   -- Instant Funding $2,500
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367253&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-20k';   -- Instant Funding $20,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367259&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-40k';   -- Instant Funding $40,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367241&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-5k';   -- Instant Funding $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367223&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-625';   -- Instant Funding $625
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367265&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-80k';   -- Instant Funding $80,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023638&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-1250';   -- Instant Funding Clarity $1,250
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023656&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-10k';   -- Instant Funding Clarity $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023845&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-120k';   -- Instant Funding Clarity $120,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023644&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-2500';   -- Instant Funding Clarity $2,500
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023662&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-20k';   -- Instant Funding Clarity $20,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023668&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-40k';   -- Instant Funding Clarity $40,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023650&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-5k';   -- Instant Funding Clarity $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023632&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-625';   -- Instant Funding Clarity $625
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1023674&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-clarity-80k';   -- Instant Funding Clarity $80,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956831&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-1250';   -- Instant Funding GO $1,250
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956849&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-10k';   -- Instant Funding GO $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956837&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-2500';   -- Instant Funding GO $2,500
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956855&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-20k';   -- Instant Funding GO $20,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956861&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-40k';   -- Instant Funding GO $40,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956843&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-5k';   -- Instant Funding GO $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=956867&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'instant-funding-go-80k';   -- Instant Funding GO $80,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367281&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-10k';   -- One-Phase Challenge $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367299&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-100k';   -- One-Phase Challenge $100,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367287&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-25k';   -- One-Phase Challenge $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367275&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-5k';   -- One-Phase Challenge $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=367293&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-50k';   -- One-Phase Challenge $50,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016731&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-clarity-10k';   -- One-Phase Clarity $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016749&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-clarity-100k';   -- One-Phase Clarity $100,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016737&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-clarity-25k';   -- One-Phase Clarity $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016725&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-clarity-5k';   -- One-Phase Clarity $5,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=1016743&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-clarity-50k';   -- One-Phase Clarity $50,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=821072&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-micro-10k';   -- One-Phase Micro $10,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=821090&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-micro-100k';   -- One-Phase Micro $100,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=821078&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-micro-25k';   -- One-Phase Micro $25,000
update prop_firm_challenges set affiliate_url = 'https://instantfunding.com/checkout/?add-to-cart=821084&quantity=1&partner=8404'
 where firm_slug = 'instant-funding' and slug = 'one-phase-micro-50k';   -- One-Phase Micro $50,000

do $verif$
declare manquants int;
begin
  select count(*) into manquants from prop_firm_challenges
   where firm_slug = 'instant-funding'
     and slug in ('if-evolve-10k', 'if-evolve-25k', 'if-evolve-50k', 'if-micro-10k', 'if-micro-25k', 'if-micro-5k', 'if-micro-clarity-10k', 'if-micro-clarity-100k', 'if-micro-clarity-200k', 'if-micro-clarity-25k', 'if-micro-clarity-5k', 'if-micro-clarity-50k', 'instant-funding-1250', 'instant-funding-10k', 'instant-funding-120k', 'instant-funding-2500', 'instant-funding-20k', 'instant-funding-40k', 'instant-funding-5k', 'instant-funding-625', 'instant-funding-80k', 'instant-funding-clarity-1250', 'instant-funding-clarity-10k', 'instant-funding-clarity-120k', 'instant-funding-clarity-2500', 'instant-funding-clarity-20k', 'instant-funding-clarity-40k', 'instant-funding-clarity-5k', 'instant-funding-clarity-625', 'instant-funding-clarity-80k', 'instant-funding-go-1250', 'instant-funding-go-10k', 'instant-funding-go-2500', 'instant-funding-go-20k', 'instant-funding-go-40k', 'instant-funding-go-5k', 'instant-funding-go-80k', 'one-phase-10k', 'one-phase-100k', 'one-phase-25k', 'one-phase-5k', 'one-phase-50k', 'one-phase-clarity-10k', 'one-phase-clarity-100k', 'one-phase-clarity-25k', 'one-phase-clarity-5k', 'one-phase-clarity-50k', 'one-phase-micro-10k', 'one-phase-micro-100k', 'one-phase-micro-25k', 'one-phase-micro-50k')
     and (affiliate_url is null or affiliate_url not like 'https://instantfunding.com/checkout/?add-to-cart=%');
  if manquants > 0 then
    raise exception 'Instant Funding : % plan(s) sans lien profond, annulation', manquants;
  end if;
end
$verif$;

commit;


-- 3. Controle final.
select name, affiliate_url from prop_firm_challenges
where firm_slug = 'instant-funding' and affiliate_url is not null order by name;


-- Plans laisses sans lien, faute de correspondance certaine :
--   IF Micro $100,000 : aucune variation IF Micro Pro 100000 (tailles de ce nom : [1250, 2500, 5000, 10000, 25000])
--   IF Micro $50,000 : aucune variation IF Micro Pro 50000 (tailles de ce nom : [1250, 2500, 5000, 10000, 25000])
--   IF1 (24-Hour Account) $10,000 : famille sans equivalent
--   IF1 (24-Hour Account) $100,000 : famille sans equivalent
--   IF1 (24-Hour Account) $2,000 : famille sans equivalent
--   IF1 (24-Hour Account) $20,000 : famille sans equivalent
--   IF1 (24-Hour Account) $5,000 : famille sans equivalent
--   IF1 (24-Hour Account) $50,000 : famille sans equivalent
