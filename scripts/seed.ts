/**
 * Seeds the four insights drawn in the original comp, so a fresh database
 * renders the landing page as designed. Safe to re-run: existing slugs are skipped.
 *
 * Run it with `npm run seed` — that passes --env-file-if-exists so the script
 * targets the same database the app does. Running `tsx scripts/seed.ts` directly
 * skips .env.local and would write to the local SQLite file instead.
 */
import { db, ready } from "../lib/db";

const POSTS = [
  {
    slug: "why-digital-account-opening-doesnt-guarantee-financial-inclusion",
    title: "Why digital account opening doesn't guarantee financial inclusion",
    category: "Trust & Behaviour",
    excerpt:
      "Registration without sustained usage can hide a deeper problem. Explore the relationship " +
      "between trust, friction, behavior and account dormancy.",
    read_minutes: 9,
    featured: 1,
    published_at: "2026-02-04T09:00:00.000Z",
    body: `Across emerging African markets, institutions are opening millions of digital accounts. The headline numbers look like progress. The usage numbers rarely do.

## Access is not the same as participation

An account that is opened and never used is not inclusion. It is a number on a dashboard. The gap between the two is where most financial inclusion programmes quietly fail.

Dormancy is usually reported as a marketing problem — not enough awareness, not enough incentive. In practice it is four problems wearing one label:

- **Trust.** Does the customer believe their money is safe, and that a mistake can be undone?
- **Comprehension.** Can they tell what a transaction will cost before they commit to it?
- **Access.** Does the channel work on their device, on their network, in their language?
- **Value.** Is there a reason to come back next week?

## The question to ask instead

Most diagnostics start with "why aren't customers using the product?" That framing assumes the product is finished and the customer is the variable.

A better question: what is stopping them from trusting, understanding, accessing or repeatedly using it? Each of those has a different owner inside an institution, and each has a different fix.

## Where the friction actually sits

In the work we do, friction clusters at four points in the journey — onboarding, first transaction, first error, and the first month of silence. The first error matters more than most institutions expect. A customer who cannot resolve a failed transfer will not attempt a second one.

Fixing dormancy means instrumenting those moments, not re-running the acquisition campaign.`,
  },
  {
    slug: "the-trust-gap-in-digital-finance",
    title: "The Trust Gap in Digital Finance",
    category: "Institutional Trust",
    excerpt:
      "Transparency, redress and predictability do more for adoption than any incentive campaign. " +
      "What institutional trust looks like when it is designed rather than assumed.",
    read_minutes: 8,
    featured: 0,
    published_at: "2026-01-14T09:00:00.000Z",
    body: `Trust is treated as a brand attribute. It behaves much more like infrastructure.

## Trust is a property of systems, not messaging

Customers do not decide to trust a financial service because of a campaign. They decide because of what happened the last time something went wrong — and because of whether the cost of a transaction matched what they were told it would be.

## Three things that move the number

1. **Transparent fees, quoted before confirmation.** Not in a tariff sheet. In the flow.
2. **Redress that a person can actually reach.** A dispute path with a name and a timeframe.
3. **Predictability.** The same action producing the same result, including in poor network conditions.

None of these are marketing decisions. They are product, operations and policy decisions, and they compound.`,
  },
  {
    slug: "building-better-agent-banking-networks",
    title: "Building Better Agent Banking Networks",
    category: "Agent Networks",
    excerpt:
      "Agent liquidity is the quiet constraint on rural digital finance. An agent who cannot pay " +
      "out teaches the customer that the channel is unreliable.",
    read_minutes: 10,
    featured: 0,
    published_at: "2025-11-06T09:00:00.000Z",
    body: `Agent networks are usually measured by footprint. Footprint is the easiest number to grow and the least predictive of usage.

## Liquidity is the product

An agent who cannot pay out is worse than no agent at all. The customer travels, queues, and leaves without their money — and learns that the channel is unreliable. One failed cash-out costs more trust than ten successful ones build.

The constraints are rarely about recruitment:

- **Rebalancing frequency.** How far does an agent travel to restock float?
- **Float financing.** Who funds the working capital, and at what cost?
- **Settlement latency.** How long is an agent out of pocket?

## Density without depth

Adding agents into an area that is already liquidity-constrained does not improve service. It divides the same float across more points and increases the chance that any given visit fails.

Measure cash-out success rate per agent per week. It is a harder number to collect than footprint, and a far better predictor of whether a network is working.`,
  },
  {
    slug: "designing-ussd-for-low-literacy-users",
    title: "Designing USSD for Low-Literacy Users",
    category: "Digital Channels",
    excerpt:
      "USSD is still the widest reaching financial channel on the continent. Most menus are written " +
      "for the people who built them.",
    read_minutes: 6,
    featured: 0,
    published_at: "2025-12-02T09:00:00.000Z",
    body: `USSD remains the broadest financial channel in many African markets. It is also the least designed.

## Menu depth is the tax

Every additional level of a USSD tree costs completion. Sessions time out, network conditions vary, and each re-entry is a chance to abandon. The single highest-yield change in most deployments is flattening the tree.

## Write for reading aloud

Menu copy is frequently read out by an agent or a family member. Short, concrete, verb-first lines survive that translation. Abbreviations and internal product names do not.

## Confirm in the language of money

"Confirm 2,500 to 0803…" tells the customer what they need to know. "Confirm transaction" does not.`,
  },
];

async function seed(): Promise<void> {
  await ready();

  for (const post of POSTS) {
    const existing = await db.execute({
      sql: "SELECT id FROM posts WHERE slug = ? LIMIT 1",
      args: [post.slug],
    });
    if (existing.rows.length) {
      console.log(`  skip   ${post.slug}`);
      continue;
    }
    await db.execute({
      sql: `INSERT INTO posts
              (slug, title, excerpt, body, category, read_minutes, featured, published, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      args: [
        post.slug,
        post.title,
        post.excerpt,
        post.body,
        post.category,
        post.read_minutes,
        post.featured,
        post.published_at,
      ],
    });
    console.log(`  insert ${post.slug}`);
  }

  console.log("seed complete");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
