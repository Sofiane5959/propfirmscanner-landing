// =============================================================================
// PAGE 2 — « Earn2Trade Rules Explained »              /earn2trade-rules
// =============================================================================
// Page d'information sur le mot-cle « earn2trade rules ». Elle attire le
// trafic et renvoie vers la page 1, qui vend.
//
// Memes trois choix que la page 1 : composant serveur, chiffres pris dans
// data/firms/earn2trade.xlsx via lib/earn2trade-guide.ts, sorties par /api/go.
// Les exemples chiffres (le plancher a $23,500, la meilleure journee a $525)
// sont CALCULES a partir des chiffres de la fiche, pas recopies : si Earn2Trade
// change le drawdown du TCP25, les exemples suivent au lieu de mentir.
// =============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Check, ExternalLink, X } from 'lucide-react'

import { buildAffiliateUrl } from '@/lib/affiliate'
import { generateDynamicAlternates, localeHref, localePath } from '@/lib/seo'
import {
  SLUG,
  ficheEarn2Trade,
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

const CHEMIN = '/earn2trade-rules'
const CHEMIN_PROMO = '/earn2trade-promo-code'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale || 'en'
  const titre = 'Earn2Trade Rules 2026: Drawdown, Consistency & Payouts Explained'
  const description =
    'Earn2Trade rules in plain English: EOD trailing drawdown, 30% consistency rule, daily loss limit and payouts, with simple examples.'

  return {
    // `absolute` : le gabarit de app/[locale]/layout.tsx ajoute
    // « | PropFirm Scanner » a tous les titres. Ici le titre est calibre pour
    // la limite de Google (60 caracteres) et porte deja la marque du sujet :
    // le suffixe le ferait tronquer dans les resultats.
    title: { absolute: titre },
    description,
    keywords: [
      'earn2trade rules',
      'earn2trade drawdown',
      'earn2trade consistency rule',
      'earn2trade tcp25 rules',
    ],
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

export default function Earn2TradeRulesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en'
  const sheet = ficheEarn2Trade()

  if (!sheet) {
    return (
      <main className="min-h-screen bg-bg-base px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">Earn2Trade Rules</h1>
          <p className="mt-4 text-text-secondary">
            This page is being updated. Our full comparison is still available.
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

  const offre = offrePubliable(sheet)
  const entree = planDEntree(sheet)
  const tcp = nombresPlan(sheet, 'TCP25')
  const reg = regularite(sheet, 'TCP25')
  const partage = partageFinance(sheet, 'TCP25')
  const heures = regleTexte(sheet, 'Trading hours')
  const nuit = regleTexte(sheet, 'Overnight holding')
  const news = regleTexte(sheet, 'News trading')
  const instruments = regleTexte(sheet, 'Instruments')
  const plateformes = regleTexte(sheet, 'Platforms')

  const sortie = (placement: string, lienPlan?: string | null) =>
    buildAffiliateUrl(SLUG, { placement, locale, challenge: lienPlan ?? undefined })

  // L'exemple du drawdown de fin de journee, entierement calcule sur la fiche.
  const exemple = tcp
    ? {
        depart: money(tcp.taille, tcp.devise),
        plancherDepart: money(tcp.taille - tcp.drawdown, tcp.devise),
        cloture: money(tcp.taille + 1000, tcp.devise),
        plancherApres: money(tcp.taille + 1000 - tcp.drawdown, tcp.devise),
        drawdown: money(tcp.drawdown, tcp.devise),
        perteJour: money(tcp.perteJour, tcp.devise),
        // Un stop personnel sous la limite : trois quarts, arrondis a la
        // cinquantaine. C'est un conseil de prudence, pas une regle de la firme.
        stopConseille: money(Math.floor((tcp.perteJour * 0.75) / 50) * 50, tcp.devise),
        objectif: money(tcp.objectif, tcp.devise),
      }
    : null

  const regularitePct = reg != null ? Math.round(reg * 100) : null
  const meilleureJournee =
    tcp && reg != null ? money(Math.round(tcp.objectif * reg), tcp.devise) : null
  // « Une journee a $700 ? Il faut alors $2,334 de profit total. » Les deux
  // chiffres se deduisent de la regle : une journee un tiers au-dessus de la
  // limite, arrondie a la cinquantaine pour qu'elle se lise, puis divisee par
  // le taux de regularite. Rien n'est ecrit en dur.
  const exempleGrosseJournee =
    tcp && reg != null ? Math.round((tcp.objectif * reg * 1.35) / 50) * 50 : null
  const totalNecessaire =
    exempleGrosseJournee && reg != null
      ? money(Math.ceil(exempleGrosseJournee / reg), tcp!.devise)
      : null

  // L'echelle du Trader Career Path, lue dans le resume du programme de la
  // fiche : elle y est deja ecrite, inutile de la retaper.
  const tcpProgramme = (sheet.programmes || []).find((p) => p.slug === 'tcp')
  const taillesTcp = lignesPlans(sheet).filter((l) => l.code?.startsWith('TCP'))

  return (
    <main className="min-h-screen bg-bg-base font-sans text-text-primary">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
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
          <span className="text-text-secondary">Rules</span>
        </nav>

        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Earn2Trade Rules Explained (With Simple Examples)
        </h1>

        <p className="mt-4 text-base text-text-secondary">
          Earn2Trade is a futures-only prop firm with two programs: Trader Career Path and Gauntlet
          Mini. Here are the rules that decide whether you pass, with real numbers.
        </p>

        {/* Le bloc qui renvoie vers la page qui vend, haut de page. */}
        {offre && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-amber-400/70 bg-amber-50 p-4 dark:border-amber-300/30 dark:bg-amber-400/[0.08]">
            <span className="text-sm text-text-secondary">
              Save {offre.remise}% on Earn2Trade with code{' '}
              <span className="font-mono font-bold text-text-primary">{offre.code}</span>
            </span>
            <Link
              href={localePath(locale, CHEMIN_PROMO)}
              className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-accent-hover px-4 text-sm font-semibold text-on-accent hover:brightness-105"
            >
              See the code <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 1. Drawdown de fin de journee                                       */}
        {/* ------------------------------------------------------------------ */}
        {exemple && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">1. End-of-day trailing drawdown</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Example on TCP25 ({exemple.depart} account, {exemple.drawdown} drawdown):
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5">
                Start: your floor sits at{' '}
                <strong className="font-mono tabular-nums">{exemple.plancherDepart}</strong>
              </li>
              <li className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5">
                Day 1 closes at{' '}
                <strong className="font-mono tabular-nums">{exemple.cloture}</strong> → the floor
                moves to{' '}
                <strong className="font-mono tabular-nums">{exemple.plancherApres}</strong>
              </li>
              <li className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5">
                Day 2 you are up +$1,000 intraday, then close flat → the floor{' '}
                <strong>does not move</strong>. Only the closing balance counts.
              </li>
            </ul>
            <p className="mt-3 flex gap-2 text-sm text-text-secondary">
              <Check className="mt-0.5 h-4 w-4 flex-none text-accent" />
              Better than an intraday trailing drawdown: floating profit never traps you by raising
              the floor mid-session.
            </p>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 2. Perte du jour                                                    */}
        {/* ------------------------------------------------------------------ */}
        {exemple && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">2. Daily loss limit</h2>
            <p className="mt-2 text-sm text-text-secondary">
              On TCP25 it is{' '}
              <strong className="font-mono tabular-nums text-text-primary">
                {exemple.perteJour}
              </strong>
              . Lose more than that in one day and the account is gone. Set your own stop at{' '}
              <strong className="font-mono tabular-nums text-text-primary">
                {exemple.stopConseille}
              </strong>{' '}
              so a bad fill does not end the evaluation.
            </p>
            <p className="mt-3 text-sm text-text-secondary">
              Every size has its own limit — see the{' '}
              <Link
                href={localePath(locale, CHEMIN_PROMO)}
                className="font-semibold text-accent underline underline-offset-2"
              >
                full plan table
              </Link>
              .
            </p>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. Regularite                                                       */}
        {/* ------------------------------------------------------------------ */}
        {regularitePct != null && exemple && meilleureJournee && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">
              3. {regularitePct}% consistency rule
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Profit goal {exemple.objectif} → your best single day must stay{' '}
              <strong className="text-text-primary">under {meilleureJournee}</strong>.
            </p>
            {exempleGrosseJournee != null && totalNecessaire && (
              <p className="mt-3 flex gap-2 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-text-secondary">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-warning" />
                <span>
                  Made {money(exempleGrosseJournee, tcp!.devise)} in one day? You now need more
                  total profit: {money(exempleGrosseJournee, tcp!.devise)} ÷ {regularitePct}% ={' '}
                  <strong className="font-mono tabular-nums text-text-primary">
                    {totalNecessaire}
                  </strong>{' '}
                  before you pass.
                </span>
              </p>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 4. Retraits                                                         */}
        {/* ------------------------------------------------------------------ */}
        {partage && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">4. Payouts</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5">
                <strong className="text-text-primary">{partage.haut}% profit split</strong> on
                funded accounts
                {partage.bas != null && partage.seuil
                  ? ` — ${partage.bas}% on the part of a withdrawal below ${partage.seuil}. The rate depends on the size of each withdrawal, not on your total profit.`
                  : '.'}
              </li>
              {partage.retraitMinimum && (
                <li className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5">
                  Minimum withdrawal:{' '}
                  <strong className="font-mono tabular-nums text-text-primary">
                    {partage.retraitMinimum}
                  </strong>{' '}
                  net, paid weekly.
                  {/* Le detail du calendrier (mercredi, demande avant vendredi
                      14h CT) est dans la FAQ de la fiche firme : il vit en base,
                      pas en dur ici. */}
                </li>
              )}
            </ul>
            <p className="mt-3 text-sm text-text-secondary">
              Full payout schedule and fees:{' '}
              <Link
                href={localePath(locale, `/prop-firm/${SLUG}`)}
                className="font-semibold text-accent underline underline-offset-2"
              >
                our Earn2Trade review
              </Link>
              .
            </p>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 5. Montee en taille                                                 */}
        {/* ------------------------------------------------------------------ */}
        {tcpProgramme?.resume && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">5. Scaling (Trader Career Path)</h2>
            <p className="mt-2 text-sm text-text-secondary">{tcpProgramme.resume}</p>
            {taillesTcp.length > 0 && (
              <p className="mt-2 font-mono text-sm tabular-nums text-text-muted">
                {taillesTcp.map((l) => l.code).join(' · ')}
              </p>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 6. Ce qui est autorise                                              */}
        {/* ------------------------------------------------------------------ */}
        {(heures || nuit || news || instruments || plateformes) && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">6. What you may and may not do</h2>
            <dl className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {[
                { libelle: 'Trading hours', texte: heures },
                { libelle: 'Overnight holding', texte: nuit },
                { libelle: 'News trading', texte: news },
                { libelle: 'Instruments', texte: instruments },
                { libelle: 'Platforms', texte: plateformes },
              ]
                .filter((ligne) => ligne.texte)
                .map((ligne) => (
                  <div key={ligne.libelle} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-4">
                    <dt className="w-44 flex-none text-sm font-semibold">{ligne.libelle}</dt>
                    <dd className="text-sm text-text-secondary">{ligne.texte}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-2 text-xs text-text-muted">
              Rules verified on earn2trade.com — last checked {verifieLeAffiche()}.
            </p>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Pour qui                                                            */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-accent-border bg-accent-subtle p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Check className="h-4 w-4 text-accent" /> Who it suits
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Futures traders who want strict but clear rules and a scaling path.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <X className="h-4 w-4 text-text-muted" /> Who it does not
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Forex and CFD traders, and traders who make most of their profit in one big day.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Sortie basse                                                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-10 rounded-2xl border border-border bg-bg-elevated p-5 text-center">
          <p className="text-sm font-semibold">Ready?</p>
          {offre && (
            <p className="mt-1 font-mono text-sm font-bold">
              Code {offre.code} · −{offre.remise}%
            </p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <a
              href={sortie('seo_regles_bas', entree?.lienPlan)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-hover px-6 text-sm font-semibold text-on-accent hover:brightness-105"
            >
              Open Earn2Trade <ExternalLink className="h-4 w-4" />
            </a>
            <Link
              href={localePath(locale, CHEMIN_PROMO)}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-accent px-6 text-sm font-semibold text-accent hover:bg-accent-subtle"
            >
              Promo code page <ArrowRight className="h-4 w-4" />
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
