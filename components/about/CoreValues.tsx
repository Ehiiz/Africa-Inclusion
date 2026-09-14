"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";

type Value = {
  key: string;
  name: string;
  line: string;
  /** Which of the three brand accents this value carries. */
  tone: "green" | "amber" | "red";
  icon: ReactElement;
  points: string[];
};

/** How long each value holds before the next one slides in. */
const INTERVAL_MS = 7000;

const VALUES: Value[] = [
  {
    key: "trust",
    name: "Trust",
    line: "Transparency, security and consumer protection, built into the rails themselves.",
    tone: "green",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.8 20 6v6c0 4.6-3.2 7.7-8 9.2C7.2 19.7 4 16.6 4 12V6z" />
        <path d="m9.2 12.2 2 2 3.6-4" />
      </svg>
    ),
    points: [
      "Embedding transparency, security, and consumer protection into every financial rail.",
      "Operating with absolute integrity, openness, and accountability in team and client interactions.",
      "Building clear fee structures and dispute resolution workflows that strengthen user confidence.",
      "Safeguarding data privacy and maintaining uncompromised compliance standards.",
    ],
  },
  {
    key: "rigor",
    name: "Rigor",
    line: "Advice grounded in empirical research and tested against operational reality.",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.6" cy="10.6" r="6.4" />
        <path d="m15.4 15.4 4.4 4.4" />
        <path d="M8 11.4l1.8 1.8 3.2-3.6" />
      </svg>
    ),
    points: [
      "Grounding strategic advisory solutions in empirical research and real-world field data.",
      "Upholding high intellectual discipline, thoroughness, and precision in daily work.",
      "Mapping behavioral friction to diagnose and eliminate account dormancy.",
      "Validating recommendations against operational realities before execution.",
    ],
  },
  {
    key: "simplicity",
    name: "Simplicity",
    line: "Friction removed — from the KYC journey to the language of the policy note.",
    tone: "red",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 7h17M3.5 12h11M3.5 17h6" />
      </svg>
    ),
    points: [
      "Eliminating technical, operational, and organizational friction across all workflows.",
      "Streamlining e-KYC and USSD user journeys for effortless digital onboarding.",
      "Communicating complex policy, technical, and financial concepts clearly.",
      "Designing intuitive channels accessible to low-literacy and informal-market users.",
    ],
  },
  {
    key: "inclusion",
    name: "Inclusion",
    line: "Opportunity extended to the unbanked, the rural and the informal market.",
    tone: "green",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6" />
        <path d="M17 6.2a3 3 0 0 1 0 5.6" />
        <path d="M18.4 14.9c1.8.8 2.8 2.4 2.8 5.1" />
      </svg>
    ),
    points: [
      "Expanding financial opportunity to unbanked, rural, and informal market sectors.",
      "Embracing diverse internal perspectives to foster innovative problem-solving.",
      "Scaling agent networks and cash transfer rails to reach last-mile communities.",
      "Aligning banks, fintechs, regulators, and donors around shared inclusion mandates.",
    ],
  },
  {
    key: "impact",
    name: "Impact",
    line: "Success measured in sustained usage, not in accounts opened.",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
    points: [
      "Measuring success by active, sustained usage rather than mere account sign-ups.",
      "Focusing team effort on high-value outcomes over superficial deliverables.",
      "Converting dormant digital access into active everyday financial engagement.",
      "Delivering actionable advisory that translates strategy into institutional results.",
    ],
  },
];

/**
 * The five core values, advancing on their own. Rotation stops while a reader
 * hovers or tabs into the block, and never starts at all when the system asks
 * for reduced motion — an animation nobody can pause is the thing to avoid here.
 */
export default function CoreValues() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [animate, setAnimate] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!animate || held) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % VALUES.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [active, animate, held]);

  // Arrow keys move between values, as they do in any tab list.
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    setActive((i) => {
      const next = (i + step + VALUES.length) % VALUES.length;
      const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>("button");
      buttons?.[next]?.focus();
      return next;
    });
  }, []);

  const value = VALUES[active]!;

  return (
    <div
      className="values"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="values__tabs" role="tablist" aria-label="Core values" ref={tabsRef} onKeyDown={onKeyDown}>
        {VALUES.map((item, index) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`value-tab-${item.key}`}
            aria-selected={index === active}
            aria-controls={`value-panel-${item.key}`}
            tabIndex={index === active ? 0 : -1}
            className={`values__tab values__tab--${item.tone}${index === active ? " is-active" : ""}`}
            onClick={() => setActive(index)}
          >
            {item.name}
            <span
              className="values__tab-rail"
              aria-hidden="true"
              // The rail fills over one interval, so the reader can see the
              // rotation coming rather than being surprised by it.
              style={
                index === active && animate && !held
                  ? { animationDuration: `${INTERVAL_MS}ms` }
                  : undefined
              }
              data-running={index === active && animate && !held ? "true" : "false"}
            />
          </button>
        ))}
      </div>

      <div
        key={value.key}
        className={`values__panel values__panel--${value.tone}`}
        role="tabpanel"
        id={`value-panel-${value.key}`}
        aria-labelledby={`value-tab-${value.key}`}
        tabIndex={0}
      >
        <div className="values__head">
          <span className={`ico-chip ico-chip--tint-${value.tone}`}>
            {value.icon}
          </span>
          <div>
            <h3 className="values__name">{value.name}</h3>
            <p className="values__line">{value.line}</p>
          </div>
          <p className="values__count" aria-hidden="true">
            {String(active + 1).padStart(2, "0")}
            <span>/{String(VALUES.length).padStart(2, "0")}</span>
          </p>
        </div>

        <ul className="values__points">
          {value.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
