-- =============================================================================
-- NETTOYAGE GLOBAL — toutes firmes
-- =============================================================================
-- Deux corrections qui ne visent aucune firme en particulier : les promotions
-- terminees sont marquees comme telles, et le signe dollar double introduit a
-- l import est corrige partout ou il traine.
--
-- Depend de shared-01-schema-provenance.sql pour discount_status.
-- Aucune ligne supprimee.
-- =============================================================================


-- 2. Marquer la promotion terminee, sans l effacer
-- -----------------------------------------------------------------------------
-- La page ne l affiche deja plus : resolvePromotion() compare expires_at a la
-- date du jour. Ce marquage rend l etat lisible en base.
update prop_firms
set discount_status = 'expired'
where discount_expires_at is not null
  and discount_expires_at < now()
  and coalesce(discount_status, '') <> 'expired';


-- -----------------------------------------------------------------------------

-- 3. Le signe dollar double
-- -----------------------------------------------------------------------------
-- Present dans le payload servi : scaling_max '$$400K', account_size '$$25K',
-- cost_timeline -> '$$140-156/month'. Le code n ajoute aucun signe : la donnee
-- est doublee a l import. L affichage est deja protege par cleanMoneyLabel(),
-- ceci corrige la source.
update prop_firms
set scaling_max    = regexp_replace(scaling_max,    '\$\$+', '$', 'g'),
    max_allocation = regexp_replace(max_allocation, '\$\$+', '$', 'g')
where scaling_max like '%$$%' or max_allocation like '%$$%';

update prop_firm_challenges
set account_size = regexp_replace(account_size, '\$\$+', '$', 'g')
where account_size like '%$$%';

-- Les colonnes JSONB : on reserialise en corrigeant le texte.
update prop_firms
set cost_timeline = replace(cost_timeline::text, '$$', '$')::jsonb
where cost_timeline::text like '%$$%';

-- Controle : doit renvoyer zero ligne.
select 'prop_firms' as t, slug from prop_firms
where scaling_max like '%$$%' or max_allocation like '%$$%' or cost_timeline::text like '%$$%'
union all
select 'challenges', slug from prop_firm_challenges where account_size like '%$$%';


-- -----------------------------------------------------------------------------
