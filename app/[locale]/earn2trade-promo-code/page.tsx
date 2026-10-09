// =============================================================================
// PAGE 1 — « Earn2Trade Promo Code: SCANNED »   /earn2trade-promo-code
// =============================================================================
// Page d'atterrissage sur le mot-cle « earn2trade promo code ». Elle vend : le
// code, le mode d'emploi, le tableau des plans, trois regles, une FAQ.
//
// Trois choix a connaitre avant de la modifier :
//
//   1. COMPOSANT SERVEUR, sans « use client ». Tout le texte est dans le HTML
//      envoye par le serveur : c'est la condition pour etre indexe sans
//      dependre de l'execution du JavaScript par le robot.
//
//   2. LES CHIFFRES VIENNENT DE LA FICHE (data/firms/earn2trade.xlsx), par
//      lib/earn2trade-guide.ts. Aucun objectif, aucun drawdown, aucun prix
//      n'est ecrit ici. Une valeur absente de la fiche retire sa ligne.
//
//   3. LES SORTIES PASSENT PAR /api/go, via buildAffiliateUrl. Jamais
//      d'adresse earn2trade.com en dur (regle du depot) : c'est le tunnel qui
//      porte nos identifiants d'affiliation, choisit le checkout du plan et
//      enregistre le clic. Le brief demandait une URL en dur avec un
//      a_pid=XXXX — un identifiant qui n'est pas le notre et qui ne serait
//      suivi nulle part.
//
// CE QUE LE BRIEF MARQUAIT [VERIFY], ET CE QUI EN RESTE
//
// Resolu par la fiche (data/firms/earn2trade.xlsx, chiffres verifies sur
// earn2trade.com et dans le checkout) :
//   - le taux du code SCANNED : 50 % (offre.remise) ;
//   - le partage : 80 % au-dessus du seuil, 50 % en dessous, par retrait et
//     non sur le profit total ; retrait minimum $100 ;
//   - les plateformes : la regle « Platforms » de la fiche, affichee telle
//     quelle dans la FAQ (le brief en citait une liste approximative) ;
//   - les sept plans et leurs chiffres : lus dans la fiche, pas recopies.
//
// NON RESOLU, donc absent de la page : le code s'applique-t-il aux
// renouvellements mensuels ? Voir le [VERIFY] de la section « Monthly
// subscription » plus bas.
//
// `revalidate` : la page affiche les campagnes ouvertes a l'instant du rendu.
// Sans revalidation, une page mise en cache le 9 octobre continuerait
// d'annoncer l'offre du jour precedent (c'est exactement la panne du
// 1er octobre sur /compare).
// =============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Check, Copy, ExternalLink, X } from 'lucide-react'

import { buildAffiliateUrl } from '@/lib/affiliate'
import { generateDynamicAlternates, localeHref, localePath } from '@/lib/seo'
import {
  SLUG,
  campagnesOuvertes,
  ficheEarn2Trade,
  lignePlan,
  lignesPlans,
  money,
  nombresPlan,
  offrePubliable,
  partageFinance,
  planDEntree,
  regleTexte,
  regularite,
  verifieLeAffiche,
} from '@/lib/earn2trade-guide'

export const revalidate = 600

const CHEMIN = '/earn2trade-promo-code'
const CHEMIN_REGLES = '/earn2trade-rules'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale || 'en'
  const titre = 'Earn2Trade Promo Code SCANNED – Verified Discount (2026)'
  const description =
    'Use code SCANNED at Earn2Trade checkout. Verified discount on Trader Career Path and Gauntlet Mini. Rules, prices and how to apply it.'

  return {
    // `absolute` : le gabarit de app/[locale]/layout.tsx ajoute
    // « | PropFirm Scanner » a tous les titres. Ici le titre est calibre pour
    // la limite de Google (60 caracteres) et porte deja la marque du sujet :
    // le suffixe le ferait tronquer dans les resultats.
    title: { absolute: titre },
    description,
    keywords: [
      'earn2trade promo code',
      'earn2trade discount code',
      'earn2trade coupon',
      'earn2trade code',
    ],
    // Canonical + hreflang : cette page n'existe qu'en anglais, lib/seo.ts le
    // declare (EN_ONLY_PATHS). Les six autres locales pointent donc leur
    // canonical vers l'URL anglaise au lieu de reclamer une page distincte.
    ...generateDynamicAlternates(locale, CHEMIN),
    openGraph: {
      type: 'article',
      url: localeHref('en', CHEMIN),
      siteName: 'PropFirm Scanner',
      title: titre,
      description,
    },
    twitter: { card: 'summary_large_image', title: titre, description },
  }
}

export default function Earn2TradePromoCodePage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en'
  const sheet = ficheEarn2Trade()
  const offre = sheet ? offrePubliable(sheet) : null

  // Sans fiche ni offre confirmee, la page n'a rien a vendre. Mieux vaut le
  // dire que d'afficher un code qui n'est plus a nous.
  if (!sheet || !offre) {
    return (
      <main className="min-h-screen bg-bg-base px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Earn2Trade Promo Code
          </h1>
          <p className="mt-4 text-text-secondary">
            This offer is being re-verified. In the meantime, see every verified prop firm
            discount on our comparison page.
          </p>
          <Link
            href={localePath(locale, '/compare')}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-hover px-5 text-sm font-semibold text-on-accent"
          >
            Compare prop firms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  const plans = lignesPlans(sheet)
  const entree = planDEntree(sheet)
  const tcp25 = lignePlan(sheet, 'TCP25')
  const partage = partageFinance(sheet, 'TCP25')
  const regulariteTcp = regularite(sheet, 'TCP25')
  const plateformes = regleTexte(sheet, 'Platforms')
  const campagnes = campagnesOuvertes(sheet)

  /** Une sortie, un placement : les clics de chaque bloc se comptent a part. */
  const sortie = (placement: string, lienPlan?: string | null) =>
    buildAffiliateUrl(SLUG, { placement, locale, challenge: lienPlan ?? undefined })

  // Le plus grand des deux taux : l'offre permanente, ou la campagne en cours
  // quand elle en porte un. La fiche reste la source.
  const remiseCampagne = campagnes.reduce<number | null>(
    (max, c) => (c.remise != null ? Math.max(max ?? 0, Math.round(c.remise * 100)) : max),
    null
  )
  const remiseAffichee = Math.max(offre.remise, remiseCampagne ?? 0)

  // L'exemple chiffre de la regle de regularite : la meilleure journee
  // autorisee, calculee sur l'objectif reel du TCP25 (fiche), pas ecrite ici.
  const chiffresTcp = nombresPlan(sheet, 'TCP25')
  const meilleureJournee =
    chiffresTcp && regulariteTcp != null
      ? money(Math.round(chiffresTcp.objectif * regulariteTcp), chiffresTcp.devise)
      : null

  const faq: { question: string; reponse: string }[] = [
    {
      question: `Is the ${offre.code} code verified?`,
      // « Last checked » vient de VERIFIE_LE : une seule date sur les deux pages.
      reponse: `Yes. ${offre.code} is PropFirm Scanner's official partner code with Earn2Trade. We last checked it on ${verifieLeAffiche()} by running it through the checkout ourselves.`,
    },
    {
      question: `Can I stack ${offre.code} with the anniversary sale?`,
      // Verifie en passant commande : Earn2Trade ecrase le champ coupon avec sa
      // campagne en cours (voir AFFILIATE_COUPON_GUARANTEE dans lib/affiliate.ts).
      reponse:
        'No, offers are not cumulative. During a site-wide sale the campaign price applies and the coupon field is overwritten, so use our link: the discount still shows and the visit stays attributed to us.',
    },
    {
      question: 'Is Earn2Trade legit?',
      reponse: `Earn2Trade has been running since ${sheet.anneeCreation ?? 2016} and is futures-only, on CME Group markets. Traders who pass the evaluation are funded by partner proprietary trading firms.`,
    },
    {
      question: 'What is the profit split?',
      reponse: partage
        ? `${partage.haut}% to the trader${
            partage.bas != null && partage.seuil
              ? `, and ${partage.bas}% on the part of a withdrawal below ${partage.seuil}`
              : ''
          }. The rate depends on the size of each withdrawal, not on your total profit${
            partage.retraitMinimum ? `, and the minimum withdrawal is ${partage.retraitMinimum}` : ''
          }.`
        : 'Up to 80% to the trader on funded accounts.',
    },
    ...(plateformes ? [{ question: 'Which platforms can I use?', reponse: plateformes }] : []),
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.reponse },
    })),
  }

  return (
    <main className="min-h-screen bg-bg-base font-sans text-text-primary">
      {/* Le balisage FAQ : il decrit la FAQ qui est VRAIMENT sur la page, en
          dessous. Un balisage qui annonce des questions absentes du texte est
          une infraction aux regles de Google, pas une optimisation. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* ------------------------------------------------------------------ */}
        {/* Fil d'Ariane                                                        */}
        {/* ------------------------------------------------------------------ */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-text-muted">
          <Link href={localePath(locale, '/compare')} className="hover:text-text-secondary">
            Prop firms
          </Link>
          <span className="px-1.5">/</span>
          <Link
            href={localePath(locale, `/prop-firm/${SLUG}`)}
            className="hover:text-text-secondary"
          >
            Earn2Trade
          </Link>
          <span className="px-1.5">/</span>
          <span className="text-text-secondary">Promo code</span>
        </nav>

        {/* Un seul H1 sur la page : c'est le titre du sujet. */}
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Earn2Trade Promo Code: {offre.code}
        </h1>

        {/* ------------------------------------------------------------------ */}
        {/* Le coupon : ce que le visiteur est venu chercher, au-dessus du pli  */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-6 rounded-2xl border border-dashed border-amber-400/70 bg-gradient-to-r from-amber-50 via-amber-50/60 to-transparent p-4 dark:border-amber-300/30 dark:from-amber-400/[0.12] dark:via-amber-400/[0.05]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-11 flex-none items-center rounded-xl bg-amber-400 px-3 font-mono text-lg font-extrabold tabular-nums text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(120,53,15,0.25)]">
              −{remiseAffichee}%
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted">
                Code
              </span>
              <span className="block font-mono text-xl font-bold tracking-wide">{offre.code}</span>
            </span>
            <a
              href={sortie('seo_promo_hero', entree?.lienPlan)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-hover px-5 text-sm font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,35,26,0.2)] hover:brightness-105"
            >
              Get the discount <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-3 text-sm text-text-secondary">
            Works on Trader Career Path (TCP) and Gauntlet Mini (GAU) — {remiseAffichee}% off the
            evaluation.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            Last checked: {verifieLeAffiche()} by PropFirm Scanner
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Les campagnes en cours                                              */}
        {/* ------------------------------------------------------------------ */}
        {/* Ce bloc vient du calendrier de la fiche : il apparait quand une
            fenetre est ouverte et DISPARAIT TOUT SEUL a sa fermeture. La
            checklist demandait de penser a retirer le bloc anniversaire le
            18 octobre — personne n'a plus a y penser. Les fenetres a venir ne
            sont pas rendues : le calendrier est confidentiel. */}
        {campagnes.length > 0 && (
          <section className="mt-8 rounded-2xl border border-accent-border bg-accent-subtle p-5">
            <h2 className="font-display text-lg font-bold">Running right now at Earn2Trade</h2>
            <ul className="mt-3 space-y-3">
              {campagnes.map((c) => (
                <li key={`${c.titre}-${c.fin}`} className="text-sm">
                  <span className="font-semibold text-text-primary">{c.titre}</span>
                  {c.detail && <span className="text-text-secondary"> — {c.detail}</span>}
                  <span className="block text-xs text-text-muted">
                    Until{' '}
                    {new Date(c.fin).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-text-secondary">
              Offers are not cumulative. During a sale, open Earn2Trade through{' '}
              <a
                href={sortie('seo_promo_campagne', entree?.lienPlan)}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="font-semibold text-accent underline underline-offset-2"
              >
                our link
              </a>{' '}
              so the discount applies and the visit stays tracked.
            </p>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Mode d'emploi                                                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">How to use the code (30 seconds)</h2>
          <ol className="mt-4 space-y-3 text-sm text-text-secondary">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                1
              </span>
              <span>
                Open Earn2Trade through{' '}
                <a
                  href={sortie('seo_promo_etape1', entree?.lienPlan)}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="font-semibold text-accent underline underline-offset-2"
                >
                  this link
                </a>
                . It lands on the checkout with the code already in the URL.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                2
              </span>
              <span>Pick your program: Trader Career Path or Gauntlet Mini.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                3
              </span>
              <span>
                At checkout, check the coupon field reads{' '}
                <span className="inline-flex items-center gap-1 rounded-md bg-bg-elevated px-1.5 font-mono text-xs font-bold">
                  <Copy className="h-3 w-3" />
                  {offre.code}
                </span>
                . If it is empty, type it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                4
              </span>
              <span>Check the price drops before you pay.</span>
            </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Le tableau des plans — un vrai <table>                              */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Which plan should you pick?</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Evaluation figures, straight from our Earn2Trade data sheet. Every row opens its own
            checkout with {offre.code} applied.
          </p>

          {/* Un vrai tableau (thead/tbody/th/td), pas une grille de div : c'est
              ce que Google lit comme un tableau comparatif, et ce qu'un lecteur
              d'ecran annonce ligne par ligne. Le defilement horizontal est sur
              l'enveloppe, le tableau reste entier. */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Earn2Trade evaluation plans: account size, profit goal, end-of-day drawdown and
                daily loss limit
              </caption>
              <thead>
                <tr className="bg-bg-elevated text-left">
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Plan
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Account
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Profit goal
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    EOD drawdown
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Daily loss limit
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                    <span className="sr-only">Checkout</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.code ?? `${plan.programme}-${plan.tailleBrute}`} className="border-t border-border">
                    <th scope="row" className="whitespace-nowrap px-3 py-2.5 text-left font-mono font-bold">
                      {plan.code ?? plan.taille}
                    </th>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">{plan.taille}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">
                      {plan.objectif ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">
                      {plan.drawdown ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">
                      {plan.perteJour ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-text-secondary">
                      {plan.prix ? `${plan.prix}/mo` : '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <a
                        href={sortie(`seo_promo_tableau_${plan.code?.toLowerCase() ?? 'plan'}`, plan.lienPlan)}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-accent px-2.5 text-xs font-semibold text-accent hover:bg-accent-subtle"
                      >
                        Get −{remiseAffichee}%
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border border-border bg-bg-elevated p-4 text-sm text-text-secondary">
              <strong className="text-text-primary">New to futures prop firms?</strong> Start with
              TCP25: the lowest cost, and the Trader Career Path scales up to $200K.
            </p>
            <p className="rounded-xl border border-border bg-bg-elevated p-4 text-sm text-text-secondary">
              <strong className="text-text-primary">Want one bigger account now?</strong> Gauntlet
              Mini starts at the size you choose — no scaling path.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Trois regles avant de payer                                         */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">3 rules to know before you pay</h2>
          <ol className="mt-4 space-y-4">
            <li className="rounded-xl border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-bold">End-of-day trailing drawdown</h3>
              <p className="mt-1 text-sm text-text-secondary">
                The floor only moves at the end of the day, on your closing balance. Open profit
                during the day does not raise it.
              </p>
            </li>
            {regulariteTcp != null && (
              <li className="rounded-xl border border-border bg-bg-elevated p-4">
                <h3 className="text-sm font-bold">
                  {Math.round(regulariteTcp * 100)}% consistency rule
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  During the evaluation, no single day can be {Math.round(regulariteTcp * 100)}% or
                  more of your total profit.
                  {tcp25?.objectif && meilleureJournee
                    ? ` With a ${tcp25.objectif} target on TCP25, your best day must stay under ${meilleureJournee}.`
                    : ''}{' '}
                  <Link
                    href={localePath(locale, CHEMIN_REGLES)}
                    className="font-semibold text-accent underline underline-offset-2"
                  >
                    Worked example
                  </Link>
                </p>
              </li>
            )}
            <li className="rounded-xl border border-border bg-bg-elevated p-4">
              <h3 className="text-sm font-bold">Monthly subscription</h3>
              <p className="mt-1 text-sm text-text-secondary">
                You pay every month until you pass, so budget for more than one cycle. A discount
                code saves money on the first payment.
                {/* [VERIFY] — Le code s'applique-t-il aussi aux renouvellements
                    mensuels ? Eva (Earn2Trade) n'a pas repondu, et le checkout
                    ne le montre pas : il n'affiche que le premier paiement.
                    Tant que ce n'est pas verifie, la page ne promet rien sur
                    les renouvellements (regle du depot : ne pas promettre au
                    visiteur ce que le partenaire ne garantit pas). */}
              </p>
            </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* FAQ — le meme texte que le JSON-LD                                  */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Earn2Trade promo code FAQ</h2>
          <dl className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {faq.map((item) => (
              <div key={item.question} className="p-4">
                <dt className="text-sm font-bold">{item.question}</dt>
                <dd className="mt-1 text-sm text-text-secondary">{item.reponse}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Pour qui, pour qui pas                                              */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-accent-border bg-accent-subtle p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Check className="h-4 w-4 text-accent" /> Good fit
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Futures traders who want clear rules, end-of-day drawdown and a scaling path.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <X className="h-4 w-4 text-text-muted" /> Not a fit
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Forex and CFD traders — Earn2Trade is futures-only — and anyone who makes most of
              their profit in one big day.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Sortie basse + liens internes                                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10 rounded-2xl border border-border bg-bg-elevated p-5 text-center">
          <p className="font-mono text-sm font-bold">Code {offre.code}</p>
          <a
            href={sortie('seo_promo_bas', entree?.lienPlan)}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-hover px-6 text-sm font-semibold text-on-accent hover:brightness-105"
          >
            Open Earn2Trade <ExternalLink className="h-4 w-4" />
          </a>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href={localePath(locale, '/compare')}
              className="text-accent underline underline-offset-2"
            >
              Compare Earn2Trade with 90+ firms
            </Link>
            <Link
              href={localePath(locale, CHEMIN_REGLES)}
              className="text-accent underline underline-offset-2"
            >
              Earn2Trade rules explained
            </Link>
            <Link
              href={localePath(locale, `/prop-firm/${SLUG}`)}
              className="text-accent underline underline-offset-2"
            >
              Full Earn2Trade review
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            We earn a commission when you buy through our links, at no extra cost to you —{' '}
            <Link href={localePath(locale, '/how-we-make-money')} className="underline">
              how we make money
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
