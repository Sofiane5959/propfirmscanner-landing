-- DIAGNOSTIC — lecture seule. Aucune ecriture.
--
-- Les plans d'une firme dans prop_firm_challenges, avec leur lien profond.
-- Le slug de chaque plan va dans la colonne lien_plan de l'onglet Plans du
-- tableur : les boutons de la page ouvrent alors le paiement de CE plan,
-- code applique. Changer 'earn2trade' pour une autre firme.
--
-- A lancer dans l'editeur SQL de Supabase, puis m'envoyer le resultat.

select slug,
       name,
       account_size,
       price,
       affiliate_url,
       affiliate_url ~* '[?&]plan='     as porte_le_plan,
       affiliate_url ~* '[?&]discount=' as porte_le_code
from prop_firm_challenges
where firm_slug = 'earn2trade'
order by name, price;
