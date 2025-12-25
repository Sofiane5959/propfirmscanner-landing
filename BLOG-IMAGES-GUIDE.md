# 🖼️ Images pour les Articles Blog

## Option 1 : Images SVG (Recommandé - Pas besoin de télécharger)

Ajoute ces images SVG directement dans tes articles. Elles sont légères et professionnelles.

---

## Images à créer dans /public/blog/

### 1. hero-choose-prop-firm.svg
```svg
<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111827"/>
      <stop offset="100%" style="stop-color:#1f2937"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)"/>
  <circle cx="650" cy="200" r="150" fill="#10b981" opacity="0.1"/>
  <circle cx="150" cy="300" r="100" fill="#3b82f6" opacity="0.1"/>
  <!-- Cards representing firms -->
  <rect x="100" y="120" width="180" height="160" rx="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  <rect x="310" y="120" width="180" height="160" rx="12" fill="#1f2937" stroke="#10b981" stroke-width="2"/>
  <rect x="520" y="120" width="180" height="160" rx="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  <!-- Stars -->
  <text x="190" y="180" fill="#fbbf24" font-size="20" text-anchor="middle">★★★★☆</text>
  <text x="400" y="180" fill="#fbbf24" font-size="20" text-anchor="middle">★★★★★</text>
  <text x="610" y="180" fill="#fbbf24" font-size="20" text-anchor="middle">★★★★☆</text>
  <!-- Check mark on selected -->
  <circle cx="400" cy="240" r="20" fill="#10b981"/>
  <path d="M390 240 L398 248 L412 232" stroke="white" stroke-width="3" fill="none"/>
  <text x="400" y="350" fill="white" font-size="24" font-weight="bold" text-anchor="middle">Choose Your Perfect Firm</text>
</svg>
```

### 2. hero-news-trading.svg
```svg
<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111827"/>
      <stop offset="100%" style="stop-color:#1f2937"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg2)"/>
  <!-- Chart background -->
  <rect x="100" y="80" width="600" height="240" rx="8" fill="#1f2937"/>
  <!-- Candlesticks -->
  <rect x="150" y="150" width="20" height="80" fill="#ef4444"/>
  <rect x="200" y="180" width="20" height="60" fill="#ef4444"/>
  <rect x="250" y="140" width="20" height="100" fill="#10b981"/>
  <rect x="300" y="120" width="20" height="120" fill="#10b981"/>
  <rect x="350" y="100" width="20" height="140" fill="#10b981"/>
  <!-- NEWS label with spike -->
  <rect x="380" y="60" width="80" height="30" rx="4" fill="#ef4444"/>
  <text x="420" y="82" fill="white" font-size="14" font-weight="bold" text-anchor="middle">NEWS</text>
  <!-- Spike up -->
  <rect x="400" y="80" width="20" height="160" fill="#10b981"/>
  <rect x="450" y="100" width="20" height="100" fill="#10b981"/>
  <rect x="500" y="130" width="20" height="70" fill="#10b981"/>
  <rect x="550" y="150" width="20" height="60" fill="#ef4444"/>
  <rect x="600" y="160" width="20" height="50" fill="#ef4444"/>
  <text x="400" y="360" fill="white" font-size="24" font-weight="bold" text-anchor="middle">News Trading Rules Explained</text>
</svg>
```

### 3. hero-consistency-rules.svg
```svg
<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#111827"/>
  <circle cx="700" cy="100" r="80" fill="#10b981" opacity="0.1"/>
  <!-- Calendar grid -->
  <rect x="150" y="80" width="500" height="240" rx="8" fill="#1f2937"/>
  <!-- Days grid -->
  <g fill="#374151">
    <rect x="170" y="120" width="60" height="50" rx="4"/>
    <rect x="240" y="120" width="60" height="50" rx="4"/>
    <rect x="310" y="120" width="60" height="50" rx="4"/>
    <rect x="380" y="120" width="60" height="50" rx="4"/>
    <rect x="450" y="120" width="60" height="50" rx="4"/>
    <rect x="520" y="120" width="60" height="50" rx="4"/>
    <rect x="170" y="180" width="60" height="50" rx="4"/>
    <rect x="240" y="180" width="60" height="50" rx="4"/>
    <rect x="310" y="180" width="60" height="50" rx="4"/>
    <rect x="380" y="180" width="60" height="50" rx="4"/>
    <rect x="450" y="180" width="60" height="50" rx="4"/>
    <rect x="520" y="180" width="60" height="50" rx="4"/>
  </g>
  <!-- Green check marks -->
  <circle cx="200" cy="145" r="15" fill="#10b981"/>
  <circle cx="270" cy="145" r="15" fill="#10b981"/>
  <circle cx="340" cy="145" r="15" fill="#10b981"/>
  <circle cx="410" cy="145" r="15" fill="#10b981"/>
  <!-- Progress bar -->
  <rect x="170" y="260" width="410" height="20" rx="10" fill="#374151"/>
  <rect x="170" y="260" width="300" height="20" rx="10" fill="#10b981"/>
  <text x="580" y="275" fill="#10b981" font-size="14" font-weight="bold">73%</text>
  <text x="400" y="360" fill="white" font-size="24" font-weight="bold" text-anchor="middle">Consistency Rules Explained</text>
</svg>
```

---

## Option 2 : Utiliser des images Unsplash (Gratuites)

Télécharge ces images et place-les dans `/public/blog/`:

| Article | Image Unsplash | Recherche |
|---------|---------------|-----------|
| How to Choose | [Trading desk](https://unsplash.com/s/photos/trading-desk) | "trading desk" |
| News Trading | [Financial news](https://unsplash.com/s/photos/financial-news) | "financial news" |
| Consistency | [Calendar planning](https://unsplash.com/s/photos/calendar) | "calendar planning" |

---

## Option 3 : Générer avec AI

Utilise ces prompts sur **Midjourney** ou **DALL-E** :

### Prompt 1 : How to Choose
```
Modern dark trading dashboard with multiple prop firm comparison cards, green accent colors, professional UI design, 16:9 aspect ratio, dark theme
```

### Prompt 2 : News Trading
```
Abstract financial chart with news spike, candlestick pattern, red and green colors, dark background, professional trading interface, 16:9
```

### Prompt 3 : Consistency Rules
```
Calendar with trading checkmarks, progress bar, dark trading dashboard aesthetic, green accents, professional, 16:9
```

---

## Comment ajouter les images aux articles

Dans `app/blog/[slug]/page.tsx`, ajoute après le header de chaque article :

```tsx
// Dans le contenu de l'article
<img 
  src="/blog/hero-choose-prop-firm.svg" 
  alt="How to choose a prop firm"
  className="w-full rounded-xl mb-8"
/>
```

Ou ajoute un champ `image` dans blogPosts :

```typescript
{
  slug: 'how-to-choose-right-prop-firm',
  title: 'How to Choose the Right Prop Firm',
  image: '/blog/hero-choose-prop-firm.svg', // Ajoute ça
  // ...
}
```

---

## Structure des fichiers

```
public/
└── blog/
    ├── hero-choose-prop-firm.svg
    ├── hero-news-trading.svg
    ├── hero-consistency-rules.svg
    ├── hero-pass-challenge.svg
    ├── hero-best-firms-2025.svg
    └── hero-trailing-drawdown.svg
```

---

C'est tout ! Les SVG sont légers (~2KB chacun) et se chargent instantanément.
