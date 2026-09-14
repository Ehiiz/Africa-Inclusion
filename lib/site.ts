/**
 * Site-wide constants. No server dependencies, so client components can import
 * this too.
 */

/**
 * The Zoho slot-booking page behind every "book a consultation" call to action.
 * Kept here so the four Who We Work With cards and the closing CTA cannot drift
 * apart from each other.
 */
export const BOOKING_URL =
  "https://calendar.zoho.com/zc/view/slot-booking/zz08011220ef6015d5fb319ec3aa809f7b41a20e457653b179aefa4b3a5cd8a8826d93c8f9";

/** Everything an outbound link to the booking page needs. */
export const BOOKING_LINK_PROPS = {
  href: BOOKING_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
