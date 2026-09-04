# Inventaire des textes non traduisibles

Genere le 3 septembre 2026. Chaque chaine listee ici est ecrite en dur
dans le JSX : elle ne traverse aucun dictionnaire et reste donc en anglais
dans les sept langues, quelle que soit la langue choisie par le visiteur.

Les dictionnaires existants, eux, sont complets : 863 cles dans chacune
des sept langues, reparties sur 26 composants. Le probleme n est pas la
traduction manquante, c est le texte qui ne passe pas par la traduction.

| zone | chaines | fichiers | dont sans dictionnaire |
|---|---:|---:|---:|
| Pages publiques diverses | 163 | 29 | 27 |
| Espace membre (connecte) | 60 | 7 | 6 |
| Pages legales et institutionnelles | 45 | 3 | 3 |
| Contenu editorial | 45 | 5 | 4 |
| Outils | 29 | 3 | 3 |
| Comparateur | 25 | 2 | 1 |
| Admin (prive) | 17 | 2 | 2 |

**Total : 384 chaines**, soit 1920 traductions pour couvrir les cinq langues manquantes.


## Admin (prive)

### `app/[locale]/admin/analytics/AnalyticsClient.tsx`

9 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to admin
- Click tracking on every outbound link
- Clicks by firm
- Clicks by source (last 30d)
- No clicks tracked yet
- No clicks yet
- No data
- Once visitors click on affiliate links, data will appear here.
- Until the offers banner stopped using

### `app/[locale]/admin/firms/FirmsClient.tsx`

8 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Affiliate & Deals
- Manage & audit all prop firms
- Max Split %
- Min Price $
- Search firms...
- Status & Rules
- With Logo
- You must be signed in as an admin to access this page.


## Comparateur

### `app/[locale]/compare/ComparePageClient.tsx`

19 chaine(s) en dur, 42 appel(s) au dictionnaire.

- Compare Now
- Every prop firm. One place.
- Find my match
- Find my perfect firm
- Maximum price filter
- Next page
- No website available
- Not recommended by PropFirmScanner
- Not sure which firm to pick?
- Payout screenshot preview
- Price
- Reset all filters
- Search prop firms
- Sort firms by
- Split
- Submit payout proof
- Take the quiz
- Verified
- Your experience

### `app/[locale]/compare/[slug]/page.tsx`

6 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to all firms
- Based on our analysis,
- Get Started with
- Our Verdict
- Split
- Trading Platforms


## Contenu editorial

### `app/[locale]/rules-explained/page.tsx`

19 chaine(s) en dur, 0 appel(s) au dictionnaire.

- All guides launching soon - Join waitlist for early access!
- All-Access Bundle
- Best Value
- Choose Your Prop Firm
- Don&apos;t Risk Your Challenge
- Everything you need to understand and follow the rules
- Get All Guides
- Get Guide
- Prop Firm Rules
- Prop Firms Covered
- Read Free Articles
- Real results from real traders
- Rules Explained
- Search prop firm...
- Select the firm you want to understand. Each guide is $4.99.
- Stop Failing Due to Rule Violations
- Traders Love Our Guides
- What&apos;s Included in Each Guide

### `app/[locale]/education/page.tsx`

12 chaine(s) en dur, 4 appel(s) au dictionnaire.

- Browse Prop Firms
- Choose Your Path
- Every course comes with these premium features
- Join thousands of traders who transformed their journey
- Prop Firm Fundamentals
- Ready to Get Funded?
- We&apos;ll email you first at early bird price.
- What&apos;s Included
- You have access — pick up where you left off
- You&apos;re on the list!
- Your course is now unlocked. Start learning below!
- your@email.com

### `app/[locale]/blog/[slug]/page.tsx`

9 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to Blog
- Compare Prop Firms
- Next Article
- Ready to Get Funded?
- Share on Facebook
- Share on LinkedIn
- Share on Twitter
- Table of Contents
- View Deals

### `app/[locale]/education/AdvancedCourseSection.tsx`

4 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Get early bird access at
- No spam. Just one email when the course launches.
- You're on the list!
- your@email.com

### `app/[locale]/education/fundamentals/FundamentalsClient.tsx`

1 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Prop Firm Fundamentals Course


## Espace membre (connecte)

### `app/[locale]/dashboard/page.tsx`

25 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Account size ($)
- Accounts at Risk
- Add your prop firm challenge to monitor:
- All features unlocked. Thank you for your support!
- At risk
- Browse 90+ firms
- Favorite Firms
- Free plan
- Get Access →
- Learn how to pass any prop firm challenge · $69.99 lifetime
- No challenges tracked yet
- No end date
- No favorites saved yet
- No high-impact events today 🎉
- Not financial advice · Pro feature
- Profit Target
- Prop Firm Fundamentals
- Trading Ideas
- View all →
- View this week →
- Welcome back
- You&apos;re on Pro 🎉

### `app/[locale]/dashboard/DashboardClient.tsx`

11 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Compare Firms
- Enter your email
- Get Discounts
- Get notified when we launch new features
- Go to tool
- Start Comparing
- Track Your Challenge
- View Deals
- What You Can Do Right Now
- You&apos;ll be notified!
- Your Dashboard

### `app/[locale]/dashboard/favorites/page.tsx`

10 chaine(s) en dur, 1 appel(s) au dictionnaire.

- Back to Dashboard
- Browse firms
- Compare Now →
- Compare Prop Firms
- Firm data not found
- No favorites yet
- Remove from favorites
- See them side by side to make a decision
- Visit firm
- Want to compare your favorites?

### `app/[locale]/dashboard/accounts/new/page.tsx`

5 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Account Name
- Account Size
- Add Challenge Account
- Profit Target
- Prop Firm

### `app/[locale]/dashboard/accounts/[id]/page.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to Dashboard
- Challenge Rules
- This will permanently delete

### `app/[locale]/dashboard/calendar/page.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Events this week
- No events match your filters.
- This week's market-moving events · Source: Forex Factory

### `components/dashboard/DashboardStats.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Create price alerts and add favorites to see your stats.
- No Data Yet
- Recent Price Alerts


## Outils

### `app/[locale]/tools/page.tsx`

12 chaine(s) en dur, 0 appel(s) au dictionnaire.

- All Tools
- Check if your trade plan complies with prop firm rules
- Check what applies to your planned trade:
- Expecting &gt;30% of target in one day
- Large profit day planned
- Min Trading Days
- News Trading
- Opposite positions on same pair
- Select Prop Firm
- Trading around news time
- Try Pro Tracker Free
- Your Trade Plan

### `app/[locale]/tools/rule-tracker/RuleTrackerClient.tsx`

11 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Account Size
- Add Trading Day
- Add your first trading day above to start tracking.
- Min Trading Days
- No trading days recorded yet.
- Profit Target
- Profit Target %
- Profit/Loss ($)
- Trading Days
- Trading History
- e.g. 500 or -200

### `app/[locale]/tools/risk-calculator/RiskCalculatorClient.tsx`

6 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Account Size
- Calculate your position size to manage risk properly
- Lot Size = (Account Size × Risk %) ÷ (Stop Loss × Pip Value)
- Risk:Reward needed for BE:
- Your Position Size
- Your calculation:


## Pages legales et institutionnelles

### `app/[locale]/disclaimer/page.tsx`

24 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Always verify current information directly with the prop firm
- An offer to provide any financial service
- Assessing whether prop trading is suitable for your situation
- Conducting your own due diligence
- Consulting with a qualified financial advisor if needed
- Interactions with any prop trading firm
- Limitation of Liability
- No Guarantees
- Prop Firm Relationships
- Reading and understanding all terms and conditions
- Some of the links on this website are affiliate links
- Technical errors or website downtime
- The accuracy, completeness, or reliability of any information
- The performance or results of any prop trading firm
- The validity or availability of any discount codes
- Third-party actions or services
- This compensation helps us maintain and improve our website
- Trading advice
- Trading decisions based on our content
- Verifying the legitimacy of the prop firm
- We are an independent comparison and review platform
- Your ability to pass any trading challenge or evaluation
- Your potential profits or losses from trading
- Your use of information on this website

### `app/[locale]/how-we-verify/page.tsx`

11 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Benefits for Us
- Benefits for You
- Discount code links on our Deals page
- How We Make Money
- How to Identify Affiliate Links
- Our Affiliate Relationships
- What This Means for You
- What We Do
- What We Don&apos;t Do
- Why This Model?
- Your Choice Matters

### `app/[locale]/about/page.tsx`

10 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Compare Prop Firms
- Our Journey
- Our Mission
- Our Values
- Ready to Find Your Prop Firm?
- Take the Quiz
- Track & Compare
- Verify & Review
- We monitor 90+ prop firms and keep our data updated weekly.
- What We Do


## Pages publiques diverses

### `app/[locale]/mypropfirm/page.tsx`

20 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Basic tools for getting started
- Be part of the growing PropFirmScanner community
- Compare 80+ prop firms right now, completely free.
- Everything you need to get funded
- Free Tools Available
- Get Started Free
- Join Our Community
- Join traders who are tracking their prop firm journey with us.
- Premium Trading Tools
- Ready to Get Funded?
- Share Your Feedback
- Start Comparing
- Start Free
- Start free, upgrade when you're ready
- Tell us what features you'd like to see in MyPropFirm Pro.
- Try Free First
- Try Free Tools
- Upgrade to Pro
- Upgrade to Pro — $29.99/mo

### `app/[locale]/product/page.tsx`

19 chaine(s) en dur, 0 appel(s) au dictionnaire.

- For serious traders
- Get Started Free
- Get started
- How It Works
- Join traders who use PropFirmScanner to avoid costly mistakes.
- Know your limits before you trade.
- One dashboard to manage
- Prop Firm Control Center
- Prop firm traders often fail challenges
- PropFirmScanner is your
- Start Free
- Start Pro Trial
- Start Protecting Your Accounts
- Start free, upgrade when you need more.
- Start protecting your
- The Problem
- The Solution
- We help you
- What We

### `app/[locale]/pricing/page.tsx`

12 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Avoid breaking prop firm rules.
- FTMO, FundedNext, The5ers — all in one dashboard
- Go to Dashboard
- Know exactly how much you can risk before breaking any rule
- One avoided rule violation pays for months of Pro.
- Ready to trade with confidence?
- Sign in to Upgrade
- Simulate Before Trading
- Test your trade size before risking real capital
- Track All Accounts
- Trade with clarity.
- Why traders trust PropFirmScanner

### `components/QuickCompareWidget.tsx`

12 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Compare key features of top prop firms
- Discover prop firms that match how you trade
- Find Your Perfect Prop Firm
- Find by Trading Style
- Max Profit Split
- News Trading
- Prop Firms
- Quick Compare
- Side-by-Side Comparison
- Split
- Starting Price
- To Use

### `app/[locale]/quiz/QuizClient.tsx`

9 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Based on your experience, style, budget and priorities.
- Browse all firms →
- Compare Now
- Compare them side by side
- Here are your top matches
- No account required
- Personalized matching — free, no signup
- Start matching
- Your personalized results

### `app/[locale]/auth/login/page.tsx`

8 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Access your personal space
- Check your inbox!
- Click the link in the email to sign in instantly.
- No password needed — we'll email you a login link
- Sign In
- The link expires in 24 hours.
- We sent a magic link to
- you@example.com

### `app/[locale]/quick-match/QuickMatchClient.tsx`

8 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Analyzing 90+ prop firms
- Answer 3 questions and get personalized recommendations
- Compare All Firms
- Find Your Perfect Prop Firm
- Finding Your Perfect Match...
- Start Over
- Your Top Matches!

### `components/PriceAlertModal.tsx`

8 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Alert me when price drops to
- Create Price Alert
- Current price
- Email for notification
- Price Alert
- We'll email you when
- We'll only email you when the price drops. No spam, ever.
- your@email.com

### `components/Newsletter.tsx`

6 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Enter your email
- Enter your email address
- No spam, unsubscribe anytime. We respect your privacy.
- Stay Ahead of the Market
- Weekly prop firm updates & exclusive deals
- your@email.com

### `components/NewsletterPopup.tsx`

6 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Newsletter — free
- We sent a confirmation link to:
- Your name
- Your trading level
- you@example.com

### `components/SocialShare.tsx`

6 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Share on Facebook
- Share on LinkedIn
- Share on Twitter
- Share this article

### `app/[locale]/glossary/GlossaryPageClient.tsx`

5 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Learn the terminology used in prop trading and funded accounts
- No terms found
- Prop Trading Glossary
- Search terms...
- Try a different search or category

### `app/[locale]/status/page.tsx`

5 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Get Status Alerts
- Prop Firm Status Tracker
- Stay informed about prop firm closures, issues, and warnings
- Subscribe to Updates
- Under Review

### `app/[locale]/best-for/[category]/page.tsx`

4 chaine(s) en dur, 3 appel(s) au dictionnaire.

- Compare
- Compare All 55+ Prop Firms
- No firms found for this category.
- Profit Split

### `app/[locale]/changelog/page.tsx`

4 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Get notified when we add new features or prop firms.
- Have a feature request or found a bug?
- Latest updates, features, and improvements to PropFirm Scanner
- What&apos;s New

### `components/CookieConsent.tsx`

4 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Accept All
- Learn more
- Required for the website to function. Cannot be disabled.
- Used to track visitors and display relevant ads.

### `app/[locale]/checkout/success/page.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to Home
- Go to Dashboard
- Processing your order...

### `app/[locale]/not-found.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Compare Firms
- Go back
- Page Not Found

### `components/CompareModal.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Best values highlighted
- Compare Prop Firms
- Price Alert

### `components/SocialFooter.tsx`

3 chaine(s) en dur, 1 appel(s) au dictionnaire.

- Enter your email
- Get the latest deals and prop firm news.
- Not financial advice

### `components/TopPicksCarousel.tsx`

3 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Our recommended picks for 2025
- Profit Split
- Top 10 Prop Firms

### `app/not-found.tsx`

2 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Page Not Found
- The page you are looking for does not exist.

### `app/[locale]/checkout/cancel/page.tsx`

2 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to Home
- Back to Pricing

### `components/AccountOverview.tsx`

2 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Profit Target
- Profit/Loss

### `components/PromoTicker.tsx`

2 chaine(s) en dur, 0 appel(s) au dictionnaire.

- All Deals
- Verified Deals

### `components/BackToTop.tsx`

1 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Back to top

### `components/NotificationSettings.tsx`

1 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Notification quand l'objectif de profit est atteint

### `components/PrintButton.tsx`

1 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Print this page

### `components/TableOfContents.tsx`

1 chaine(s) en dur, 0 appel(s) au dictionnaire.

- Table of Contents

