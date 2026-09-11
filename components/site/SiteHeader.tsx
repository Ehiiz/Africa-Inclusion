"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string };

const LINKS: NavLink[] = [
  { href: "/#expertise", label: "Expertise" },
  { href: "/#audiences", label: "Who We Help" },
  { href: "/insights", label: "Insights" },
  { href: "/#about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className={`site-header${stuck ? " is-stuck" : ""}`} id="top">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Afri Inclusion Advisory — home">
          <Image
            src="/assets/img/logo-light-bg.png"
            alt="Afri Inclusion Advisory"
            width={760}
            height={257}
            priority
          />
        </Link>

        <nav
          className={`nav${open ? " is-open" : ""}`}
          id="nav"
          aria-label="Primary"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="btn btn--green nav__cta" href="/#contact">
            Contact Us{" "}
            <span className="ico-arrow" aria-hidden="true">
              &#8594;
            </span>
          </Link>
        </nav>

        <button
          className="nav-toggle"
          aria-controls="nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle__bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="sr-only">Menu</span>
        </button>
      </div>
    </header>
  );
}
