import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <Image
              src="/assets/img/logo-dark-bg.png"
              alt="Afri Inclusion Advisory"
              width={760}
              height={257}
            />
            <p className="footer__tagline">Building trusted digital finance for Africa.</p>
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>

            {/* Social links — PLACEHOLDERS: replace href="#" with the live profile URLs */}
            <ul className="social" aria-label="Afri Inclusion Advisory on social media">
              <li>
                <a
                  href="#"
                  aria-label="Afri Inclusion Advisory on Facebook"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M14.5 8.5V6.8c0-.8.5-1.1 1-1.1h1.9V2.6h-2.6c-2.9 0-3.9 2-3.9 4v1.9H8.6v3.2h2.3v9.7h3.6v-9.7h2.6l.4-3.2z"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-label="Afri Inclusion Advisory on LinkedIn"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M6.5 8.9v12H2.8v-12zM4.6 2.6a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3M21.2 14.3v6.6h-3.7v-6.1c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9v6.3H9.9s.05-10.7 0-11.8h3.7v1.7c.5-.8 1.4-1.9 3.4-1.9 2.5 0 4.2 1.6 4.2 5.4"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer__col" aria-label="Expertise">
            <h2>Expertise</h2>
            <ul>
              <li><Link href="/#expertise">Digital Financial Services</Link></li>
              <li><Link href="/#expertise">Institutional Trust</Link></li>
              <li><Link href="/#expertise">Consumer Protection</Link></li>
              <li><Link href="/#expertise">Financial Inclusion</Link></li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Who we help">
            <h2>Who We Help</h2>
            <ul>
              <li><Link href="/#audiences">Banks &amp; MFIs</Link></li>
              <li><Link href="/#audiences">FinTechs</Link></li>
              <li><Link href="/#audiences">Regulators</Link></li>
              <li><Link href="/#audiences">DFIs</Link></li>
              <li><Link href="/#audiences">Governments</Link></li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Company">
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </nav>
        </div>

        <ul className="footer__contact">
          <li>
            <span className="ico-chip ico-chip--outline-light">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21.5c4.3-4.6 6.5-8 6.5-10.5a6.5 6.5 0 0 0-13 0c0 2.5 2.2 5.9 6.5 10.5Z" />
                <circle cx="12" cy="11" r="2.4" />
              </svg>
            </span>
            <span>
              <span className="footer__contact-label">Office</span>
              <span className="footer__contact-value">
                25, Lake Chad Crescent, Maitama. Abuja
              </span>
            </span>
          </li>
          <li>
            <span className="ico-chip ico-chip--outline-light">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9.2" />
                <path d="M2.8 12h18.4" />
                <path d="M12 2.8c2.4 2.6 3.6 5.7 3.6 9.2s-1.2 6.6-3.6 9.2c-2.4-2.6-3.6-5.7-3.6-9.2S9.6 5.4 12 2.8Z" />
              </svg>
            </span>
            <span>
              <span className="footer__contact-label">Digital Hub</span>
              <a
                className="footer__contact-value"
                href="https://afriinclusion.com"
                rel="noopener noreferrer"
              >
                afriinclusion.com
              </a>
            </span>
          </li>
          <li>
            <span className="ico-chip ico-chip--outline-light">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2.8" y="5" width="18.4" height="14" rx="2.4" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
            </span>
            <span>
              <span className="footer__contact-label">Email</span>
              <a className="footer__contact-value" href="mailto:info@afriinclusion.com">
                info@afriinclusion.com
              </a>
            </span>
          </li>
        </ul>

        <div className="footer__bar">
          <p>&copy; {new Date().getFullYear()} Afri Inclusion Advisory Limited</p>
        </div>
      </div>
    </footer>
  );
}
