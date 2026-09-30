'use client'

// =============================================================================
// JOURNAL DES CLICS ET DES CODES              admin/analytics/JournalClics.tsx
// =============================================================================
// Ce que le panneau d'un reseau d'affiliation montre — la liste des clics, un
// par ligne, filtrable — et ce qu'il ne montre pas : ce qui se passe sur NOTRE
// site avant la sortie.
//
// Deux tables, une seule lecture :
//   affiliate_clicks  les sorties, ecrites par /api/go ;
//   site_events       les gestes d'avant, ecrits par /api/signal — aujourd'hui
//                     les codes copies.
//
// L'entonnoir se lit dans ce sens : un code copie sans clic sortant, c'est un
// visiteur parti payer sans passer par notre lien, donc une commission perdue.
// Beaucoup de clics sans copie, c'est l'inverse : le code ne sert a rien, ou
// il est deja applique par le lien.
//
// Rien n'identifie un visiteur : ni cookie, ni identifiant. L'empreinte d'IP
// n'est la que pour recouper deux tables, jamais affichee.
// =============================================================================

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Copy, Download, RefreshCw, Search } from 'lucide-react'

interface Clic {
  id: string
  click_id: string | null
  firm_slug: string
  firm_name: string | null
  destination_type: string
  destination_url: string | null
  source: string | null
  locale: string | null
  country: string | null
  referrer: string | null
  is_bot: boolean
  created_at: string
}

interface Signal {
  id: string
  event: string
  firm_slug: string
  code: string | null
  placement: string | null
  locale: string | null
  country: string | null
  path: string | null
  is_bot: boolean
  created_at: string
}

/** Une ligne de l'entonnoir : ce qu'une firme a produit des deux cotes. */
interface LigneEntonnoir {
  firm_slug: string
  copies: number
  clics: number
  liensProfonds: number
}

const JOURS = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 } as const
type Fenetre = keyof typeof JOURS

const csvEchappe = (v: unknown) => {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function JournalClics({ includeBots }: { includeBots: boolean }) {
  const supabase = createClientComponentClient()

  const [clics, setClics] = useState<Clic[]>([])
  const [signaux, setSignaux] = useState<Signal[]>([])
  const [fenetre, setFenetre] = useState<Fenetre>('30d')
  const [firme, setFirme] = useState('')
  const [recherche, setRecherche] = useState('')
  const [chargement, setChargement] = useState(true)
  const [tableAbsente, setTableAbsente] = useState(false)
  const [copie, setCopie] = useState<string | null>(null)

  const charger = useCallback(async () => {
    setChargement(true)
    const depuis = new Date(Date.now() - JOURS[fenetre] * 86_400_000).toISOString()

    const { data: c } = await supabase
      .from('affiliate_clicks')
      .select('id, click_id, firm_slug, firm_name, destination_type, destination_url, source, locale, country, referrer, is_bot, created_at')
      .eq('is_prefetch', false)
      .gte('created_at', depuis)
      .order('created_at', { ascending: false })
      .limit(2000)
    setClics(c || [])

    // La table peut ne pas exister encore : database/RUN-site-events.sql n'a
    // pas forcement ete execute. On le dit, plutot que d'afficher zero.
    const { data: s, error } = await supabase
      .from('site_events')
      .select('id, event, firm_slug, code, placement, locale, country, path, is_bot, created_at')
      .gte('created_at', depuis)
      .order('created_at', { ascending: false })
      .limit(2000)
    setTableAbsente(Boolean(error))
    setSignaux(s || [])

    setChargement(false)
  }, [supabase, fenetre])

  useEffect(() => {
    void charger()
  }, [charger])

  const clicsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    return clics.filter((c) => {
      if (!includeBots && c.is_bot) return false
      if (firme && c.firm_slug !== firme) return false
      if (!q) return true
      return [c.firm_slug, c.firm_name, c.source, c.country, c.locale, c.click_id, c.destination_type]
        .some((v) => (v || '').toLowerCase().includes(q))
    })
  }, [clics, includeBots, firme, recherche])

  const signauxFiltres = useMemo(
    () => signaux.filter((s) => (includeBots || !s.is_bot) && (!firme || s.firm_slug === firme)),
    [signaux, includeBots, firme]
  )

  const firmes = useMemo(
    () => Array.from(new Set([...clics.map((c) => c.firm_slug), ...signaux.map((s) => s.firm_slug)])).sort(),
    [clics, signaux]
  )

  const entonnoir = useMemo(() => {
    const par = new Map<string, LigneEntonnoir>()
    const ligne = (slug: string) =>
      par.get(slug) || { firm_slug: slug, copies: 0, clics: 0, liensProfonds: 0 }
    for (const s of signauxFiltres) {
      if (s.event !== 'code_copie') continue
      const l = ligne(s.firm_slug)
      l.copies++
      par.set(s.firm_slug, l)
    }
    for (const c of clicsFiltres) {
      const l = ligne(c.firm_slug)
      l.clics++
      if (c.destination_type === 'affiliate_challenge' || c.destination_type === 'affiliate_coupon') {
        l.liensProfonds++
      }
      par.set(c.firm_slug, l)
    }
    return Array.from(par.values()).sort((a, b) => b.copies + b.clics - (a.copies + a.clics))
  }, [signauxFiltres, clicsFiltres])

  const parPlacement = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of signauxFiltres) {
      if (s.event !== 'code_copie') continue
      const k = s.placement || 'inconnu'
      m.set(k, (m.get(k) || 0) + 1)
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  }, [signauxFiltres])

  const exporter = () => {
    const entetes = ['date', 'firme', 'type', 'source', 'pays', 'langue', 'click_id', 'referrer', 'destination', 'bot']
    const lignes = clicsFiltres.map((c) => [
      c.created_at, c.firm_slug, c.destination_type, c.source, c.country, c.locale,
      c.click_id, c.referrer, c.destination_url, c.is_bot ? 'oui' : 'non',
    ])
    const csv = [entetes, ...lignes].map((l) => l.map(csvEchappe).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `clics-${fenetre}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copierId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopie(id)
      setTimeout(() => setCopie((c) => (c === id ? null : c)), 1200)
    } catch {
      /* presse-papiers indisponible : la valeur reste selectionnable a l'ecran */
    }
  }

  const totalCopies = signauxFiltres.filter((s) => s.event === 'code_copie').length

  return (
    <div className="mt-6 space-y-4">
      {tableAbsente && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="text-xs font-medium text-amber-300">
            La table site_events n&apos;existe pas encore — les codes copiés ne sont pas mesurés
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-400/70">
            Exécuter <code className="font-mono">database/RUN-site-events.sql</code> dans Supabase.
            En attendant, les boutons « copier » fonctionnent, mais le geste n&apos;est enregistré nulle part.
          </p>
        </div>
      )}

      {/* --- Entonnoir : ce que chaque firme produit des deux cotes --------- */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-dark-700/50">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Codes copiés → sorties</h2>
            <p className="text-[11px] text-text-muted">
              Un code copié sans clic sortant, c&apos;est un visiteur parti payer sans passer par le lien.
            </p>
          </div>
          <span className="text-xs text-text-muted">{totalCopies} copie{totalCopies > 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-text-secondary">
                <th className="px-4 py-2 text-left font-medium">Firme</th>
                <th className="px-4 py-2 text-right font-medium">Codes copiés</th>
                <th className="px-4 py-2 text-right font-medium">Clics sortants</th>
                <th className="px-4 py-2 text-right font-medium">Dont lien profond</th>
                <th className="px-4 py-2 text-right font-medium">Sorties / copie</th>
              </tr>
            </thead>
            <tbody>
              {entonnoir.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-text-muted">
                    Rien sur cette période
                  </td>
                </tr>
              ) : (
                entonnoir.map((l) => (
                  <tr key={l.firm_slug} className="border-b border-border/30 hover:bg-dark-700/30">
                    <td className="px-4 py-2.5 text-white">{l.firm_slug}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-accent">{l.copies}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-white">{l.clics}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-sky-400">{l.liensProfonds}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">
                      {l.copies > 0 ? `${Math.round((l.clics / l.copies) * 100)}%` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {parPlacement.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border/50 px-4 py-3">
            {parPlacement.map(([p, n]) => (
              <span key={p} className="rounded-md bg-dark-600 px-2 py-1 text-[11px] text-text-secondary">
                {p} <span className="font-medium text-white">{n}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* --- Journal : une ligne par clic ----------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-dark-700/50">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/50 px-4 py-3">
          <h2 className="mr-auto text-sm font-semibold text-white">Journal des clics</h2>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="firme, source, pays, click id…"
              className="w-56 rounded-lg border border-border bg-dark-700 py-1.5 pl-7 pr-2 text-xs text-white placeholder:text-text-muted"
            />
          </div>

          <select
            value={firme}
            onChange={(e) => setFirme(e.target.value)}
            className="rounded-lg border border-border bg-dark-700 px-2 py-1.5 text-xs text-white"
          >
            <option value="">Toutes les firmes</option>
            {firmes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={fenetre}
            onChange={(e) => setFenetre(e.target.value as Fenetre)}
            className="rounded-lg border border-border bg-dark-700 px-2 py-1.5 text-xs text-white"
          >
            {Object.keys(JOURS).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <button
            onClick={() => void charger()}
            className="rounded-lg bg-dark-700 px-2 py-1.5 text-xs text-text-secondary hover:bg-dark-600"
            aria-label="Recharger"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${chargement ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exporter}
            disabled={clicsFiltres.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-accent-hover px-3 py-1.5 text-xs font-medium text-white hover:brightness-110 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            CSV ({clicsFiltres.length})
          </button>
        </div>

        <div className="max-h-[32rem] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-dark-700">
              <tr className="border-b border-border/50 text-xs text-text-secondary">
                <th className="px-4 py-2 text-left font-medium">Quand</th>
                <th className="px-4 py-2 text-left font-medium">Firme</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Source</th>
                <th className="px-4 py-2 text-left font-medium">Pays</th>
                <th className="px-4 py-2 text-left font-medium">Click id</th>
              </tr>
            </thead>
            <tbody>
              {chargement ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">Chargement…</td></tr>
              ) : clicsFiltres.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">Aucun clic sur cette période</td></tr>
              ) : (
                clicsFiltres.map((c) => (
                  <tr key={c.id} className="border-b border-border/30 hover:bg-dark-700/30">
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-text-muted">
                      {new Date(c.created_at).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-2 text-white">{c.firm_slug}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          c.destination_type === 'affiliate_challenge' || c.destination_type === 'affiliate_coupon'
                            ? 'text-sky-400'
                            : c.destination_type === 'affiliate'
                            ? 'text-accent'
                            : 'text-text-secondary'
                        }
                      >
                        {c.destination_type}
                      </span>
                      {c.is_bot && <span className="ml-1 text-[10px] text-amber-400">bot</span>}
                    </td>
                    <td className="px-4 py-2 text-text-secondary">{c.source || '—'}</td>
                    <td className="px-4 py-2 text-text-secondary">{c.country || '—'}</td>
                    <td className="px-4 py-2">
                      {c.click_id ? (
                        <button
                          onClick={() => void copierId(c.click_id as string)}
                          className="inline-flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-white"
                          title="Copier pour le panneau du partenaire"
                        >
                          {c.click_id}
                          <Copy className="h-3 w-3 opacity-60" />
                          {copie === c.click_id && <span className="text-accent">copié</span>}
                        </button>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
