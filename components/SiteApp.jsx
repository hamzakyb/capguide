"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import BrandLogo from "./BrandLogo";
import { waLink, CAT_HUE } from "@/lib/wa";
import { LANGS, DEFAULT_LANG, RTL_LANGS, CAT_LABEL, FILTER_LABEL, BADGE_LABEL, WA_TEMPLATE, t } from "@/lib/i18n";

const NAV_KEYS = [
  { key: "navHome", href: "#home" },
  { key: "navTours", href: "#tours", filter: "tours" },
  { key: "navActivities", href: "#tours", filter: "activities" },
  { key: "navExperiences", href: "#tours", filter: "experiences" },
  { key: "navWorkshops", href: "#tours", filter: "workshops" },
  { key: "navContact", href: "#contact" }
];

const FILTER_CATS = ["all", "tours", "activities", "transfer", "experiences", "workshops"];

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

  const [lang, setLang] = useState(DEFAULT_LANG);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("capguide_lang");
      if (saved && LANGS.some((l) => l.code === saved)) setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("capguide_lang", lang);
    } catch {}
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  }, [lang]);

  const s = settings.i18n[lang] || settings.i18n[DEFAULT_LANG];
  const currentLangInfo = LANGS.find((l) => l.code === lang);

  const num = (settings.whatsapp || "").replace(/\D/g, "");
  const defaultMsg = s.defaultMsg;
  const wa = (msg) => waLink(num, msg || defaultMsg);

  function trackClick(tourEnName) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "tour_click", tourName: tourEnName })
    }).catch(() => {});
  }

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("home");
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover:none)").matches
  );

  const rootRef = useReveal([tours.length, filter, lang]);

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
    () => (filter === "all" ? tours : tours.filter((tr) => tr.cat === filter)),
    [tours, filter]
  );

  function goFilter(cat) {
    setFilter(cat);
    setMenuOpen(false);
    const el = document.getElementById("tours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const prettyNum = num.replace(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");

  function tourText(tour) {
    return tour.i18n[lang] || tour.i18n[DEFAULT_LANG];
  }
  function featText(f) {
    return f.i18n[lang] || f.i18n[DEFAULT_LANG];
  }
  function waForTour(tour) {
    const txt = tourText(tour);
    return txt.wa || WA_TEMPLATE[lang]?.(txt.name) || WA_TEMPLATE.en(txt.name);
  }

  const chipTourIds = ["red-tour", "balloon-tour", "classic-car-tour"];
  const chipTours = chipTourIds.map((id) => tours.find((tr) => tr.id === id)).filter(Boolean);

  return (
    <div ref={rootRef}>
      {/* ============ HEADER ============ */}
      <header className={"site-header" + (scrolled ? " scrolled" : "")} id="header">
        <div className="wrap header-inner">
          <a href="#home" className="brand" aria-label="Capguide Travel">
            <BrandLogo src={settings.logoImg} />
          </a>

          <nav className={"nav" + (menuOpen ? " open" : "")} id="nav">
            {NAV_KEYS.map((n) => (
              <a
                key={n.key}
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
                {t(lang, n.key)}
              </a>
            ))}
            <a className="mob-wa" href={wa()} target="_blank" rel="noopener noreferrer">
              {t(lang, "navChatWa")}
            </a>
          </nav>

          <div className="lang-switch">
            <button
              type="button"
              className="lang-btn"
              onClick={() => setLangMenuOpen((v) => !v)}
              aria-expanded={langMenuOpen}
            >
              <span>{currentLangInfo?.flag}</span>
              <span className="lang-code">{lang.toUpperCase()}</span>
            </button>
            {langMenuOpen ? (
              <div className="lang-menu">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={"lang-opt" + (l.code === lang ? " is-active" : "")}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <a className="btn btn-wa header-cta" href={wa()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="ico-wa" />
            {t(lang, "headerWa")}
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
          <span className="eyebrow reveal">{t(lang, "heroEyebrow")}</span>
          <h1 className="hero-title reveal">
            {s.heroTitleTop}
            <br />
            <em>{s.heroTitleBottom}</em>
          </h1>
          <p className="hero-sub reveal">
            {s.heroSub.split("•").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 ? <span>•</span> : null}
              </span>
            ))}
          </p>
          <div className="hero-actions reveal">
            <a className="btn btn-primary btn-lg" href={wa()} target="_blank" rel="noopener noreferrer">
              {t(lang, "heroPlan")}
            </a>
            <a className="btn btn-ghost btn-lg" href="#tours">
              {t(lang, "heroExplore")}
            </a>
          </div>

          <div className="hero-tags reveal">
            {chipTours.map((tour) => {
              const txt = tourText(tour);
              return (
                <span className="chip" key={tour.id}>
                  <i className="dot"></i>
                  {tour.badge ? (BADGE_LABEL[lang]?.[tour.badge] || tour.badge) : ""} <b>{txt.name}</b>
                </span>
              );
            })}
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
            <h3>{t(lang, "trust1Title")}</h3>
            <p>{t(lang, "trust1Desc")}</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="m12 2 2.9 6.2 6.6.8-4.9 4.6 1.3 6.7L12 17l-5.9 3.3 1.3-6.7L2.5 9l6.6-.8L12 2Z" />
            </svg>
            <h3>{t(lang, "trust2Title")}</h3>
            <p>{t(lang, "trust2Desc")}</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.6-9 5.8V22h18v-2.2c0-3.2-4-5.8-9-5.8Z" />
            </svg>
            <h3>{t(lang, "trust3Title")}</h3>
            <p>{t(lang, "trust3Desc")}</p>
          </div>
          <div className="trust-item reveal">
            <svg viewBox="0 0 24 24" className="ti">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Z" />
            </svg>
            <h3>{t(lang, "trust4Title")}</h3>
            <p>{t(lang, "trust4Desc")}</p>
          </div>
        </div>
      </section>

      {/* ============ TOURS ============ */}
      <section className="section tours-section" id="tours">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow dark">{t(lang, "toursEyebrow")}</span>
            <h2 className="section-title">
              {t(lang, "toursTitleTop")} <em>{t(lang, "toursTitleEm")}</em>
            </h2>
            <p className="section-sub">{t(lang, "toursSub")}</p>
          </div>

          <div className="filters reveal">
            {FILTER_CATS.map((cat) => (
              <button
                key={cat}
                className={"filter" + (filter === cat ? " is-active" : "")}
                onClick={() => setFilter(cat)}
              >
                {FILTER_LABEL[lang]?.[cat] || cat}
              </button>
            ))}
          </div>

          <div className="cards">
            {filteredTours.map((tour) => {
              const txt = tourText(tour);
              return (
                <article
                  className="card"
                  key={tour.id}
                  data-cat={tour.cat}
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
                      <div className="ph" style={{ "--h": CAT_HUE[tour.cat] || 24 }}>
                        <div className="ph-fallback"></div>
                        <img
                          src={tour.img}
                          alt={txt.name}
                          loading="lazy"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                      <div className="grad"></div>
                      {tour.badge ? (
                        <span className="badge" data-b={tour.badge}>
                          {BADGE_LABEL[lang]?.[tour.badge] || tour.badge}
                        </span>
                      ) : null}
                      <div className="card-front-body">
                        <h3 className="card-name">{txt.name}</h3>
                        <div className="card-meta">
                          {tour.time ? <span>{tour.time}</span> : null}
                          {tour.price ? <span>{tour.price}</span> : null}
                        </div>
                      </div>
                    </div>
                    <div className="face face-back">
                      <div>
                        <span className="back-cat">{CAT_LABEL[lang]?.[tour.cat] || ""}</span>
                        <h3 className="back-name">{txt.name}</h3>
                        <p className="back-desc">{txt.desc}</p>
                        <div className="back-info">
                          {tour.time ? <span className="pill">{tour.time}</span> : null}
                          {tour.price ? <span className="pill">{tour.price}</span> : null}
                          {tour.badge ? <span className="pill">{BADGE_LABEL[lang]?.[tour.badge] || tour.badge}</span> : null}
                        </div>
                      </div>
                      <a
                        className="back-btn"
                        href={wa(waForTour(tour))}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackClick(tour.i18n.en.name);
                        }}
                      >
                        <WhatsAppIcon width={16} height={16} />
                        {t(lang, "askWa")}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="flip-hint">{t(lang, "flipHint")}</p>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="section featured-section" id="featured">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">{t(lang, "featuredEyebrow")}</span>
            <h2 className="section-title light">
              {t(lang, "featuredTitleTop")} <em>{t(lang, "featuredTitleEm")}</em>
            </h2>
          </div>
          <div className="featured-grid">
            {featured.map((f, i) => {
              const ftxt = featText(f);
              const tour = tours.find((tr) => tr.id === f.tourId);
              const waMsg = tour ? waForTour(tour) : WA_TEMPLATE[lang]?.(ftxt.title) || WA_TEMPLATE.en(ftxt.title);
              return (
                <a
                  className="feat"
                  key={f.tourId || i}
                  href={wa(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(tour ? tour.i18n.en.name : ftxt.title)}
                >
                  <div className="ph-fallback"></div>
                  <img
                    src={f.img}
                    alt={ftxt.title}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="feat-shade"></div>
                  <div className="feat-body">
                    <h3 className="feat-title">{ftxt.title}</h3>
                    <p className="feat-sub">{ftxt.sub}</p>
                    <span className="feat-cta">{t(lang, "featuredCta")}</span>
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
            <span className="eyebrow dark">{t(lang, "aboutEyebrow")}</span>
            <h2 className="section-title">
              {t(lang, "aboutTitle1")}
              <br />
              {t(lang, "aboutTitle2")}
              <br />
              <em>{t(lang, "aboutTitleEm")}</em>
            </h2>
            <p>{t(lang, "aboutP1")}</p>
            <p>{t(lang, "aboutP2")}</p>
            <a className="btn btn-primary" href={wa()} target="_blank" rel="noopener noreferrer">
              {t(lang, "aboutCta")}
            </a>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section contact" id="contact">
        <div className="wrap contact-inner reveal">
          <span className="eyebrow">{t(lang, "contactEyebrow")}</span>
          <h2 className="contact-title">
            {t(lang, "contactTitle1")}
            <br />
            <em>{t(lang, "contactTitleEm")}</em>
          </h2>
          <p className="contact-sub">{t(lang, "contactSub")}</p>

          <div className="contact-cards">
            <a className="contact-card" href={wa()} target="_blank" rel="noopener noreferrer">
              <span className="cc-label">{t(lang, "contactWaLabel")}</span>
              <span className="cc-value">+{prettyNum}</span>
            </a>
            <a className="contact-card" href={`mailto:${settings.email}`}>
              <span className="cc-label">{t(lang, "contactEmailLabel")}</span>
              <span className="cc-value">{settings.email}</span>
            </a>
          </div>

          <a className="btn btn-primary btn-xl" href={wa()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="ico-wa" />
            {t(lang, "contactCta")}
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
            {NAV_KEYS.map((n) => (
              <a
                key={n.key}
                href={n.href}
                onClick={(e) => {
                  if (n.filter) {
                    e.preventDefault();
                    goFilter(n.filter);
                  }
                }}
              >
                {t(lang, n.key)}
              </a>
            ))}
          </nav>
          <p className="copy">
            © {new Date().getFullYear()} Capguide Travel. {t(lang, "footerRights")}.
            <br />
            <span className="credit">{t(lang, "footerCredit")}</span>
          </p>
        </div>
      </footer>

      {/* ============ SABİT WHATSAPP BUTONU ============ */}
      <a className="wa-float" href={wa()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WhatsAppIcon width={32} height={32} />
        <span className="wa-float-label">{t(lang, "waFloatLabel")}</span>
      </a>
    </div>
  );
}
