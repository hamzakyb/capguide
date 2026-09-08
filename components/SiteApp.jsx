"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import BrandLogo from "./BrandLogo";
import { waLink, CAT_LABEL, CAT_HUE } from "@/lib/wa";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Tours", href: "#tours", filter: "tours" },
  { label: "Activities", href: "#tours", filter: "activities" },
  { label: "Experiences", href: "#tours", filter: "experiences" },
  { label: "Workshops", href: "#tours", filter: "workshops" },
  { label: "Contact", href: "#contact" }
];

const FILTERS = [
  { cat: "all", label: "All" },
  { cat: "tours", label: "Tours" },
  { cat: "activities", label: "Adventures" },
  { cat: "transfer", label: "Transfer & Rental" },
  { cat: "experiences", label: "Experiences" },
  { cat: "workshops", label: "Workshops" }
];

function useReveal(deps) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll(".reveal, .card, .feat");
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 8) * 55 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export default function SiteApp({ content }) {
  const { settings, tours, featured } = content;
  const num = (settings.whatsapp || "").replace(/\D/g, "");
  const defaultMsg = settings.defaultMsg;
  const wa = (msg) => waLink(num, msg || defaultMsg);

  function trackClick(tourName) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "tour_click", tourName })
    }).catch(() => {});
  }

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("home");
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover:none)").matches
  );

  const rootRef = useReveal([tours.length, filter]);

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", referrer: document.referrer })
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "tours", "featured", "about", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActiveSection(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, []);

  const filteredTours = useMemo(
    () => (filter === "all" ? tours : tours.filter((t) => t.cat === filter)),
    [tours, filter]
  );

  function goFilter(cat) {
    setFilter(cat);
    setMenuOpen(false);
    const el = document.getElementById("tours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const prettyNum = num.replace(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");

  return (
    <div ref={rootRef}>
      {/* ============ HEADER ============ */}
      <header className={"site-header" + (scrolled ? " scrolled" : "")} id="header">
        <div className="wrap header-inner">
          <a href="#home" className="brand" aria-label="Capguide Travel">
<BrandLogo src={settings.logoImg} />
          </a>

          <nav className={"nav" + (menuOpen ? " open" : "")} id="nav">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className={activeSection === n.href.slice(1) ? "active" : ""}
                onClick={(e) => {
                  if (n.filter) {
                    e.preventDefault();
                    goFilter(n.filter);
                  } else {
                    setMenuOpen(false);
                  }
                }}
              >
                {n.label}
              </a>
            ))}
            <a className="mob-wa" href={wa()} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </nav>

          <a className="btn btn-wa header-cta" href={wa()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="ico-wa" />
            WhatsApp
          </a>

          <button
            className="burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero" id="home">
        <div className="hero-media">
          <img src={settings.heroImg} alt="Cappadocia" onError={(e) => (e.currentTarget.style.display = "none")} />
          <div className="hero-fallback" aria-hidden="true"></div>
        </div>
        <div className="hero-shade"></div>

        <div className="wrap hero-content">
          <span className="eyebrow reveal">CAPGUIDE TRAVEL · CAPPADOCIA</span>
          <h1 className="hero-title reveal">
            {settings.heroTitleTop}
            <br />
            <em>{settings.heroTitleBottom}</em>
          </h1>
          <p className="hero-sub reveal">
            {settings.heroSub.split("•").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 ? <span>•</span> : null}
              </span>
            ))}
          </p>
          <div className="hero-actions reveal">
            <a className="btn btn-primary btn-lg" href={wa()} target="_blank" rel="noopener noreferrer">
              PLAN YOUR EXPERIENCE
            </a>
            <a className="btn btn-ghost btn-lg" href="#tours">
              EXPLORE TOURS
            </a>
          </div>

          <div className="hero-tags reveal">
            <span className="chip">
              <i className="dot"></i>BEST SELLER <b>Cappadocia Red Tour</b>
            </span>
            <span className="chip">
              <i className="dot"></i>POPULAR <b>Hot Air Balloon</b>
            </span>
            <span className="chip">
              <i className="dot"></i>LIMITED <b>Classic Car Tour</b>
            </span>
          </div>
        </div>

        <a href="#trust" className="scroll-hint" aria-label="Scroll">
          <span></span>
        </a>
      </section>

      {/* ============ TRUST ============ */}
      <section className="trust" id="trust">
        <div className="wrap trust-grid">
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7l-9-5Z" />
            </svg>
            <h3>LOCAL EXPERIENCE</h3>
            <p>Authentic Cappadocia experiences</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="m12 2 2.9 6.2 6.6.8-4.9 4.6 1.3 6.7L12 17l-5.9 3.3 1.3-6.7L2.5 9l6.6-.8L12 2Z" />
            </svg>
            <h3>BEST EXPERIENCES</h3>
            <p>Tours &amp; activities for every traveler</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.6-9 5.8V22h18v-2.2c0-3.2-4-5.8-9-5.8Z" />
            </svg>
            <h3>PRIVATE OPTIONS</h3>
            <p>Flexible private experiences</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Z" />
            </svg>
            <h3>WHATSAPP SUPPORT</h3>
            <p>Quick &amp; easy communication</p>
          </div>
        </div>
      </section>

      {/* ============ TOURS ============ */}
      <section className="section tours-section" id="tours">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow dark">OUR SERVICES</span>
            <h2 className="section-title">
              EXPLORE <em>CAPPADOCIA</em>
            </h2>
            <p className="section-sub">
              Discover the most unforgettable tours, adventures and experiences in Cappadocia.
            </p>
          </div>

          <div className="filters reveal">
            {FILTERS.map((f) => (
              <button
                key={f.cat}
                className={"filter" + (filter === f.cat ? " is-active" : "")}
                onClick={() => setFilter(f.cat)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="cards">
            {filteredTours.map((t) => {
              const id = t.name;
              return (
                <article
                  className="card"
                  key={id}
                  data-cat={t.cat}
                  onClick={(e) => {
                    if (!isTouch) return;
                    if (e.target.closest("a")) return;
                    const card = e.currentTarget;
                    const wasFlipped = card.classList.contains("flipped");
                    card.parentElement
                      ?.querySelectorAll(".card.flipped")
                      .forEach((c) => c !== card && c.classList.remove("flipped"));
                    card.classList.toggle("flipped", !wasFlipped);
                  }}
                >
                  <div className="card-inner">
                    <div className="face face-front">
                      <div className="ph" style={{ "--h": CAT_HUE[t.cat] || 24 }}>
                        <div className="ph-fallback"></div>
                        <img
                          src={t.img}
                          alt={t.name}
                          loading="lazy"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                      <div className="grad"></div>
                      {t.badge ? (
                        <span className="badge" data-b={t.badge}>
                          {t.badge}
                        </span>
                      ) : null}
                      <div className="card-front-body">
                        <h3
                          className="card-name"
                          dangerouslySetInnerHTML={{
                            __html: t.name.replace(/^Cappadocia /, "CAPPADOCIA<br>")
                          }}
                        />
                        <div className="card-meta">
                          {t.time ? <span>{t.time}</span> : null}
                          {t.price ? <span>{t.price}</span> : null}
                        </div>
                      </div>
                    </div>
                    <div className="face face-back">
                      <div>
                        <span className="back-cat">{CAT_LABEL[t.cat] || ""}</span>
                        <h3 className="back-name">{t.name}</h3>
                        <p className="back-desc">{t.desc}</p>
                        <div className="back-info">
                          {t.time ? <span className="pill">{t.time}</span> : null}
                          {t.price ? <span className="pill">{t.price}</span> : null}
                          {t.badge ? <span className="pill">{t.badge}</span> : null}
                        </div>
                      </div>
                      <a
                        className="back-btn"
                        href={wa(t.wa)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackClick(t.name);
                        }}
                      >
                        <WhatsAppIcon width={16} height={16} />
                        Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="flip-hint">Hover over a card to see the details — on mobile, just tap.</p>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="section featured-section" id="featured">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">HIGHLIGHTS</span>
            <h2 className="section-title light">
              UNFORGETTABLE <em>MOMENTS</em>
            </h2>
          </div>
          <div className="featured-grid">
            {featured.map((f) => {
              const t = tours.find((x) => x.name === f.name);
              return (
                <a
                  className="feat"
                  key={f.title}
                  href={wa(t ? t.wa : "Hello, I would like to get information about " + f.title + ".")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(f.name)}
                >
                  <div className="ph-fallback"></div>
                  <img
                    src={f.img}
                    alt={f.title}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="feat-shade"></div>
                  <div className="feat-body">
                    <h3 className="feat-title">{f.title}</h3>
                    <p className="feat-sub">{f.sub}</p>
                    <span className="feat-cta">Ask on WhatsApp →</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section about" id="about">
        <div className="wrap about-grid">
          <div className="about-media reveal">
            <img src={settings.aboutImg} alt="Cappadocia" onError={(e) => (e.currentTarget.style.display = "none")} />
            <div className="about-fallback" aria-hidden="true"></div>
          </div>
          <div className="about-text reveal">
            <span className="eyebrow dark">CAPGUIDE TRAVEL</span>
            <h2 className="section-title">
              DISCOVER.
              <br />
              EXPERIENCE.
              <br />
              <em>REMEMBER.</em>
            </h2>
            <p>
              Cappadocia is not a place you simply visit — it is a place you feel. We design days that go beyond
              sightseeing: sunrise above the valleys, dust on the trails, warm stone under your hand in an Avanos
              workshop.
            </p>
            <p>Tell us what you dream of, and we will shape the rest.</p>
            <a className="btn btn-primary" href={wa()} target="_blank" rel="noopener noreferrer">
              TALK TO US ON WHATSAPP
            </a>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section contact" id="contact">
        <div className="wrap contact-inner reveal">
          <span className="eyebrow">CONTACT</span>
          <h2 className="contact-title">
            LET&apos;S PLAN YOUR
            <br />
            <em>CAPPADOCIA EXPERIENCE</em>
          </h2>
          <p className="contact-sub">
            Have a question or looking for the perfect Cappadocia experience? Contact us on WhatsApp and we&apos;ll
            help you plan your trip.
          </p>

          <div className="contact-cards">
            <a className="contact-card" href={wa()} target="_blank" rel="noopener noreferrer">
              <span className="cc-label">WHATSAPP</span>
              <span className="cc-value">+{prettyNum}</span>
            </a>
            <a className="contact-card" href={`mailto:${settings.email}`}>
              <span className="cc-label">EMAIL</span>
              <span className="cc-value">{settings.email}</span>
            </a>
          </div>

          <a className="btn btn-primary btn-xl" href={wa()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="ico-wa" />
            CHAT ON WHATSAPP
          </a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <a href="#home" className="brand footer-brand">
<BrandLogo src={settings.logoImg} />
          </a>
          <nav className="footer-nav">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={(e) => {
                  if (n.filter) {
                    e.preventDefault();
                    goFilter(n.filter);
                  }
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <p className="copy">
            © {new Date().getFullYear()} Capguide Travel. All Rights Reserved.
            <br />
            <span className="credit">Photos: Wikimedia Commons &amp; Flickr contributors (CC BY / CC BY-SA)</span>
          </p>
        </div>
      </footer>

      {/* ============ SABİT WHATSAPP BUTONU ============ */}
      <a className="wa-float" href={wa()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WhatsAppIcon width={32} height={32} />
        <span className="wa-float-label">Chat with us</span>
      </a>
    </div>
  );
}
