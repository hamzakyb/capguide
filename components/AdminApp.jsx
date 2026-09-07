"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DropZone from "./DropZone";

const CAT_OPTIONS = [
  { v: "tours", l: "Turlar" },
  { v: "activities", l: "Macera & Aktivite" },
  { v: "transfer", l: "Transfer & Araç Kiralama" },
  { v: "experiences", l: "Deneyimler" },
  { v: "workshops", l: "Atölyeler" }
];
const CAT_LABEL = Object.fromEntries(CAT_OPTIONS.map((c) => [c.v, c.l]));
const CAT_LABEL_EN = {
  tours: "Cappadocia Tour",
  activities: "Adventure & Activity",
  transfer: "Transfer & Rental",
  experiences: "Experience",
  workshops: "Workshop"
};
const BADGES = ["", "BEST SELLER", "POPULAR", "LIMITED", "SUPER PRICE", "NEW", "PRIVATE"];

const emptyTour = () => ({
  cat: "tours", badge: "", name: "Yeni Tur", desc: "", time: "", price: "", img: "", wa: ""
});

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [data, setData] = useState(null);
  const [idx, setIdx] = useState(0);
  const [page, setPage] = useState("tours");
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState(null);
  const toastT = useRef(null);
  const fileRef = useRef(null);
  const jsonRef = useRef(null);
  const logoFileRef = useRef(null);
  const faviconFileRef = useRef(null);
  const heroFileRef = useRef(null);
  const aboutFileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [passErr, setPassErr] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  function showToast(msg, err) {
    setToast({ msg, err: !!err });
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => showToast("İçerik yüklenemedi.", true));
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (res.ok) setAuthed(true);
    else {
      const d = await res.json().catch(() => ({}));
      setLoginErr(d.error || "Şifre hatalı.");
      setPassword("");
    }
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    setAuthed(false);
  }

  function mark() {
    setDirty(true);
  }

  async function save() {
    if (!data) return;
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      setDirty(false);
      showToast("Kaydedildi. Site anında güncellendi.");
    } else if (res.status === 401) {
      setAuthed(false);
      showToast("Oturum sona erdi, tekrar giriş yapın.", true);
    } else {
      showToast("Kaydedilemedi.", true);
    }
  }

  useEffect(() => {
    function beforeUnload(e) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (page !== "stats" || !authed) return;
    setStatsLoading(true);
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.stats);
        else showToast(d.error || "İstatistikler yüklenemedi.", true);
      })
      .catch(() => showToast("İstatistikler yüklenemedi.", true))
      .finally(() => setStatsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, authed]);

  if (!data || checking) {
    return (
      <div className="a-login">
        <div className="a-login-box">
          <div className="a-logo">C</div>
          <p>Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="a-login">
        <form className="a-login-box" onSubmit={login}>
          <div className="a-logo">C</div>
          <h1>Capguide Yönetim Paneli</h1>
          <p>Devam etmek için şifrenizi girin.</p>
          <input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <div className="a-login-err">{loginErr}</div>
          <button className="a-btn a-p" type="submit">
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  const tour = data.tours[idx] || null;

  function updateTour(patch) {
    setData((d) => {
      const tours = d.tours.slice();
      tours[idx] = { ...tours[idx], ...patch };
      return { ...d, tours };
    });
    mark();
  }

  function move(from, to) {
    if (to < 0 || to >= data.tours.length) return;
    setData((d) => {
      const tours = d.tours.slice();
      [tours[from], tours[to]] = [tours[to], tours[from]];
      return { ...d, tours };
    });
    setIdx(to);
    mark();
  }

  function addTour() {
    setData((d) => {
      const tours = d.tours.slice();
      tours.splice(idx + 1, 0, emptyTour());
      return { ...d, tours };
    });
    setIdx((i) => i + 1);
    mark();
  }

  function dupTour() {
    if (!tour) return;
    setData((d) => {
      const tours = d.tours.slice();
      tours.splice(idx + 1, 0, { ...tour, name: tour.name + " (kopya)" });
      return { ...d, tours };
    });
    setIdx((i) => i + 1);
    mark();
  }

  function delTour() {
    if (!tour) return;
    if (!confirm(`"${tour.name}" silinsin mi?`)) return;
    setData((d) => {
      const tours = d.tours.slice();
      tours.splice(idx, 1);
      return { ...d, tours };
    });
    setIdx((i) => Math.max(0, i - 1));
    mark();
  }

  function genWa() {
    if (!tour) return;
    updateTour({ wa: "Hello, I would like to get information about " + (tour.name || "your tours") + "." });
  }

  async function uploadTourFile(f) {
    if (!f || !tour) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const out = await res.json();
      if (res.ok && out.url) {
        updateTour({ img: out.url });
        showToast("Fotoğraf yüklendi.");
      } else {
        showToast(out.error || "Yükleme başarısız.", true);
      }
    } catch {
      showToast("Yükleme başarısız.", true);
    } finally {
      setUploading(false);
    }
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    uploadTourFile(f);
  }

  async function uploadTo(file, field, setBusy) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const out = await res.json();
      if (res.ok && out.url) {
        updateSettings({ [field]: out.url });
        showToast("Yüklendi.");
      } else {
        showToast(out.error || "Yükleme başarısız.", true);
      }
    } catch {
      showToast("Yükleme başarısız.", true);
    } finally {
      setBusy(false);
    }
  }

  function handleLogoFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadTo(f, "logoImg", setUploadingLogo);
  }

  function handleFaviconFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadTo(f, "faviconImg", setUploadingFavicon);
  }

  function handleHeroFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadTo(f, "heroImg", setUploadingHero);
  }

  function handleAboutFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadTo(f, "aboutImg", setUploadingAbout);
  }

  async function changePassword(e) {
    e.preventDefault();
    setPassErr("");
    if (newPass.length < 6) {
      setPassErr("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPass !== newPass2) {
      setPassErr("Yeni şifreler eşleşmiyor.");
      return;
    }
    setChangingPass(true);
    try {
      const res = await fetch("/api/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: curPass, newPassword: newPass })
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setCurPass("");
        setNewPass("");
        setNewPass2("");
        showToast("Şifre değiştirildi.");
      } else {
        setPassErr(out.error || "Şifre değiştirilemedi.");
      }
    } catch {
      setPassErr("Şifre değiştirilemedi.");
    } finally {
      setChangingPass(false);
    }
  }

  function updateFeatured(i, patch) {
    setData((d) => {
      const featured = d.featured.slice();
      featured[i] = { ...featured[i], ...patch };
      return { ...d, featured };
    });
    mark();
  }

  function updateSettings(patch) {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
    mark();
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type: type || "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }

  function exportJson() {
    download("capguide-yedek-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(data, null, 2), "application/json");
  }

  function importJson(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(String(r.result));
        if (!Array.isArray(d.tours)) throw new Error("geçersiz");
        setData({ settings: d.settings || {}, tours: d.tours, featured: d.featured || [] });
        setIdx(0);
        mark();
        showToast("Yedek yüklendi. Kaydetmeyi unutmayın.");
      } catch {
        showToast("Dosya okunamadı.", true);
      }
    };
    r.readAsText(f);
  }

  const num = (data.settings.whatsapp || "").replace(/\D/g, "");

  return (
    <div className={"a-shell" + " a-on"}>
      <aside className="a-side">
        <div className="a-brand">
          <i>C</i>
          <div>
            <b>CAPGUIDE</b>
            <small>YÖNETİM</small>
          </div>
        </div>
        <button className={"a-tab" + (page === "tours" ? " a-on" : "")} onClick={() => setPage("tours")}>
          🗂️ Turlar &amp; Aktiviteler
        </button>
        <button className={"a-tab" + (page === "featured" ? " a-on" : "")} onClick={() => setPage("featured")}>
          ⭐ Öne Çıkanlar
        </button>
        <button className={"a-tab" + (page === "settings" ? " a-on" : "")} onClick={() => setPage("settings")}>
          ⚙️ Genel Ayarlar
        </button>
        <button className={"a-tab" + (page === "stats" ? " a-on" : "")} onClick={() => setPage("stats")}>
          📊 İstatistikler
        </button>
        <button className={"a-tab" + (page === "publish" ? " a-on" : "")} onClick={() => setPage("publish")}>
          🚀 Yayınla
        </button>
        <div className="a-side-foot">
          <a href="/" target="_blank">↗ Siteyi aç</a>
          <button className="a-tab" onClick={logout} style={{ padding: "8px 12px" }}>⎋ Çıkış</button>
          <span>Capguide Travel · 2026</span>
        </div>
      </aside>

      <main className="a-main">
        {page === "tours" && (
          <section className="a-page a-on">
            <div className="a-page-head">
              <div>
                <h2>Turlar &amp; Aktiviteler</h2>
                <p>Soldaki listeden seçin, sağdaki alanları düzenleyin. Sıralama siteye birebir yansır.</p>
              </div>
              <div className="a-page-actions" style={{ display: "flex", gap: 8 }}>
                <button className="a-btn" onClick={dupTour}>Kopyala</button>
                <button className="a-btn a-d" onClick={delTour}>Sil</button>
                <button className="a-btn a-p" onClick={addTour}>+ Yeni Ekle</button>
              </div>
            </div>

            <div className="a-grid2">
              <div>
                <div className="a-list">
                  {data.tours.map((t, i) => (
                    <div key={i} className={"a-row" + (i === idx ? " a-on" : "")} onClick={() => setIdx(i)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="a-thumb" src={t.img || ""} alt="" onError={(e) => (e.currentTarget.style.opacity = 0.15)} />
                      <div className="a-t">
                        <b>{t.name || "(isimsiz)"}</b>
                        <span>{CAT_LABEL[t.cat] || t.cat}</span>
                      </div>
                      {t.badge ? <span className="a-tag">{t.badge}</span> : null}
                      <div className="a-mv">
                        <button onClick={(e) => { e.stopPropagation(); move(i, i - 1); }} title="Yukarı">▲</button>
                        <button onClick={(e) => { e.stopPropagation(); move(i, i + 1); }} title="Aşağı">▼</button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="a-hint" style={{ marginTop: 10 }}>
                  Toplam <b>{data.tours.length}</b> hizmet · ▲▼ ile sırayı değiştirin
                </p>
              </div>

              {tour && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 20, alignItems: "start" }}>
                  <div className="a-card">
                    <div className="a-grid-form">
                      <div className="a-field a-full">
                        <label>Tur / Aktivite Adı</label>
                        <input value={tour.name} onChange={(e) => updateTour({ name: e.target.value })} placeholder="Cappadocia Red Tour" />
                      </div>
                      <div className="a-field">
                        <label>Kategori</label>
                        <select value={tour.cat} onChange={(e) => updateTour({ cat: e.target.value })}>
                          {CAT_OPTIONS.map((c) => (
                            <option key={c.v} value={c.v}>{c.l}</option>
                          ))}
                        </select>
                      </div>
                      <div className="a-field">
                        <label>Etiket</label>
                        <select value={tour.badge} onChange={(e) => updateTour({ badge: e.target.value })}>
                          {BADGES.map((b) => (
                            <option key={b} value={b}>{b || "— Etiket yok —"}</option>
                          ))}
                        </select>
                      </div>
                      <div className="a-field">
                        <label>Süre</label>
                        <input value={tour.time} onChange={(e) => updateTour({ time: e.target.value })} placeholder="Full day" />
                      </div>
                      <div className="a-field">
                        <label>Fiyat (boş bırakılabilir)</label>
                        <input value={tour.price} onChange={(e) => updateTour({ price: e.target.value })} placeholder="€45" />
                      </div>
                      <div className="a-field a-full">
                        <label>Kısa Açıklama (kartın arkası)</label>
                        <textarea value={tour.desc} onChange={(e) => updateTour({ desc: e.target.value })} placeholder="Discover Cappadocia's iconic valleys..." />
                      </div>
                      <div className="a-field a-full">
                        <label>Fotoğraf</label>
                        <DropZone onFile={uploadTourFile} disabled={uploading}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <input
                              style={{ flex: 1, minWidth: 220 }}
                              value={tour.img}
                              onChange={(e) => updateTour({ img: e.target.value })}
                              placeholder="/assets/img/red-tour.jpg"
                            />
                            <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleFile} />
                            <button type="button" className="a-btn a-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                              {uploading ? "Yükleniyor…" : "Bilgisayardan yükle"}
                            </button>
                          </div>
                          <span className="a-hint">Seçtiğiniz fotoğrafı buraya sürükleyip bırakabilir veya bilgisayarınızdan seçebilirsiniz.</span>
                        </DropZone>
                      </div>
                      <div className="a-field a-full">
                        <label>WhatsApp Mesajı</label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <input
                            style={{ flex: 1, minWidth: 220 }}
                            value={tour.wa}
                            onChange={(e) => updateTour({ wa: e.target.value })}
                            placeholder="Hello, I would like to get information about..."
                          />
                          <button type="button" className="a-btn a-sm" onClick={genWa}>Otomatik yaz</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="a-prev-wrap">
                    <div className="a-prev">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tour.img || ""} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                      <div className="a-g"></div>
                      {tour.badge ? <span className="a-b">{tour.badge}</span> : null}
                      <div className="a-n">
                        <b dangerouslySetInnerHTML={{ __html: (tour.name || "—").replace(/^Cappadocia /, "CAPPADOCIA<br>") }} />
                        <span>{[tour.time, tour.price].filter(Boolean).join("  ·  ")}</span>
                      </div>
                    </div>
                    <div className="a-prev-back">
                      <span className="a-c">{CAT_LABEL_EN[tour.cat] || ""}</span>
                      <h4>{tour.name || "—"}</h4>
                      <p>{tour.desc || "—"}</p>
                      <a
                        className="a-wa"
                        href={`https://wa.me/${num}?text=${encodeURIComponent(tour.wa || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {page === "featured" && (
          <section className="a-page a-on">
            <div className="a-page-head">
              <div>
                <h2>Öne Çıkanlar</h2>
                <p>Ana sayfada büyük fotoğraflarla gösterilen 4 deneyim.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 16 }}>
              {data.featured.map((f, i) => (
                <div className="a-card" key={i}>
                  <div style={{ height: 130, borderRadius: 11, overflow: "hidden", background: "#241206", marginBottom: 14 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.style.opacity = 0)} />
                  </div>
                  <div className="a-grid-form" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="a-field">
                      <label>Başlık</label>
                      <input value={f.title} onChange={(e) => updateFeatured(i, { title: e.target.value })} />
                    </div>
                    <div className="a-field">
                      <label>Alt yazı</label>
                      <input value={f.sub} onChange={(e) => updateFeatured(i, { sub: e.target.value })} />
                    </div>
                    <div className="a-field">
                      <label>Fotoğraf</label>
                      <input value={f.img} onChange={(e) => updateFeatured(i, { img: e.target.value })} />
                    </div>
                    <div className="a-field">
                      <label>Bağlı olduğu tur (WhatsApp mesajı için)</label>
                      <select value={f.name} onChange={(e) => updateFeatured(i, { name: e.target.value })}>
                        {data.tours.map((t) => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {page === "settings" && (
          <section className="a-page a-on">
            <div className="a-page-head">
              <div>
                <h2>Genel Ayarlar</h2>
                <p>İletişim bilgileri ve ana sayfa metinleri.</p>
              </div>
            </div>
            <div className="a-card" style={{ maxWidth: 820 }}>
              <div className="a-grid-form">
                <div className="a-field">
                  <label>WhatsApp Numarası (ülke kodu ile, sadece rakam)</label>
                  <input value={data.settings.whatsapp} onChange={(e) => updateSettings({ whatsapp: e.target.value })} placeholder="905391399131" />
                </div>
                <div className="a-field">
                  <label>E-posta</label>
                  <input value={data.settings.email} onChange={(e) => updateSettings({ email: e.target.value })} placeholder="info@capguidetravel.com" />
                </div>
                <div className="a-field">
                  <label>Ana Başlık — 1. satır</label>
                  <input value={data.settings.heroTitleTop} onChange={(e) => updateSettings({ heroTitleTop: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>Ana Başlık — 2. satır (turuncu)</label>
                  <input value={data.settings.heroTitleBottom} onChange={(e) => updateSettings({ heroTitleBottom: e.target.value })} />
                </div>
                <div className="a-field a-full">
                  <label>Başlık altı yazı</label>
                  <input value={data.settings.heroSub} onChange={(e) => updateSettings({ heroSub: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>Ana (hero) fotoğrafı</label>
                  <DropZone onFile={(f) => uploadTo(f, "heroImg", setUploadingHero)} disabled={uploadingHero}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        style={{ flex: 1, minWidth: 180 }}
                        value={data.settings.heroImg}
                        onChange={(e) => updateSettings({ heroImg: e.target.value })}
                      />
                      <input type="file" accept="image/*" hidden ref={heroFileRef} onChange={handleHeroFile} />
                      <button type="button" className="a-btn a-sm" onClick={() => heroFileRef.current?.click()} disabled={uploadingHero}>
                        {uploadingHero ? "Yükleniyor…" : "Bilgisayardan yükle"}
                      </button>
                    </div>
                    <span className="a-hint">Sürükleyip bırakabilirsiniz.</span>
                  </DropZone>
                </div>
                <div className="a-field">
                  <label>Hakkımızda fotoğrafı</label>
                  <DropZone onFile={(f) => uploadTo(f, "aboutImg", setUploadingAbout)} disabled={uploadingAbout}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        style={{ flex: 1, minWidth: 180 }}
                        value={data.settings.aboutImg}
                        onChange={(e) => updateSettings({ aboutImg: e.target.value })}
                      />
                      <input type="file" accept="image/*" hidden ref={aboutFileRef} onChange={handleAboutFile} />
                      <button type="button" className="a-btn a-sm" onClick={() => aboutFileRef.current?.click()} disabled={uploadingAbout}>
                        {uploadingAbout ? "Yükleniyor…" : "Bilgisayardan yükle"}
                      </button>
                    </div>
                    <span className="a-hint">Sürükleyip bırakabilirsiniz.</span>
                  </DropZone>
                </div>
                <div className="a-field a-full">
                  <label>Genel WhatsApp mesajı (butonlar için)</label>
                  <input value={data.settings.defaultMsg} onChange={(e) => updateSettings({ defaultMsg: e.target.value })} />
                </div>
                <div className="a-field">
                  <label>Logo</label>
                  <DropZone onFile={(f) => uploadTo(f, "logoImg", setUploadingLogo)} disabled={uploadingLogo}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {data.settings.logoImg ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={data.settings.logoImg} alt="" style={{ height: 40, borderRadius: 6, background: "#241206" }} />
                      ) : null}
                      <input
                        style={{ flex: 1, minWidth: 180 }}
                        value={data.settings.logoImg}
                        onChange={(e) => updateSettings({ logoImg: e.target.value })}
                        placeholder="/assets/img/logo.png"
                      />
                      <input type="file" accept="image/*" hidden ref={logoFileRef} onChange={handleLogoFile} />
                      <button type="button" className="a-btn a-sm" onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}>
                        {uploadingLogo ? "Yükleniyor…" : "Bilgisayardan yükle"}
                      </button>
                    </div>
                    <span className="a-hint">Sürükleyip bırakabilirsiniz. Boş bırakılırsa varsayılan &quot;CAPGUIDE&quot; yazı logosu gösterilir.</span>
                  </DropZone>
                </div>
                <div className="a-field">
                  <label>Favicon (sekme ikonu)</label>
                  <DropZone onFile={(f) => uploadTo(f, "faviconImg", setUploadingFavicon)} disabled={uploadingFavicon}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {data.settings.faviconImg ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={data.settings.faviconImg} alt="" style={{ height: 32, width: 32, borderRadius: 6, objectFit: "cover", background: "#241206" }} />
                      ) : null}
                      <input
                        style={{ flex: 1, minWidth: 180 }}
                        value={data.settings.faviconImg}
                        onChange={(e) => updateSettings({ faviconImg: e.target.value })}
                        placeholder="/icon.png"
                      />
                      <input type="file" accept="image/*" hidden ref={faviconFileRef} onChange={handleFaviconFile} />
                      <button type="button" className="a-btn a-sm" onClick={() => faviconFileRef.current?.click()} disabled={uploadingFavicon}>
                        {uploadingFavicon ? "Yükleniyor…" : "Bilgisayardan yükle"}
                      </button>
                    </div>
                    <span className="a-hint">Sürükleyip bırakabilirsiniz. Kare bir görsel önerilir.</span>
                  </DropZone>
                </div>
              </div>
            </div>

            <div className="a-card" style={{ maxWidth: 820, marginTop: 20 }}>
              <h3 style={{ marginTop: 0 }}>SEO (Arama Motoru Ayarları)</h3>
              <p className="a-hint" style={{ marginTop: -6, marginBottom: 16 }}>
                Google gibi arama motorlarında ve sosyal medyada paylaşıldığında görünen başlık ve açıklama.
              </p>
              <div className="a-grid-form">
                <div className="a-field a-full">
                  <label>Sayfa Başlığı (SEO Title)</label>
                  <input
                    value={data.settings.seoTitle}
                    onChange={(e) => updateSettings({ seoTitle: e.target.value })}
                    placeholder="Capguide Travel — Discover Cappadocia"
                  />
                </div>
                <div className="a-field a-full">
                  <label>Meta Açıklama (SEO Description)</label>
                  <textarea
                    value={data.settings.seoDescription}
                    onChange={(e) => updateSettings({ seoDescription: e.target.value })}
                    placeholder="Capguide Travel — Tours, adventures, experiences and workshops in Cappadocia."
                  />
                </div>
              </div>
            </div>

            <div className="a-card" style={{ maxWidth: 420, marginTop: 20 }}>
              <h3 style={{ marginTop: 0 }}>Panel Şifresini Değiştir</h3>
              <form onSubmit={changePassword} className="a-grid-form" style={{ gridTemplateColumns: "1fr" }}>
                <div className="a-field">
                  <label>Mevcut Şifre</label>
                  <input type="password" value={curPass} onChange={(e) => setCurPass(e.target.value)} autoComplete="current-password" />
                </div>
                <div className="a-field">
                  <label>Yeni Şifre</label>
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} autoComplete="new-password" />
                </div>
                <div className="a-field">
                  <label>Yeni Şifre (tekrar)</label>
                  <input type="password" value={newPass2} onChange={(e) => setNewPass2(e.target.value)} autoComplete="new-password" />
                </div>
                {passErr ? <div className="a-login-err">{passErr}</div> : null}
                <button className="a-btn a-p" type="submit" disabled={changingPass}>
                  {changingPass ? "Değiştiriliyor…" : "Şifreyi Değiştir"}
                </button>
              </form>
            </div>
          </section>
        )}

        {page === "stats" && (
          <section className="a-page a-on">
            <div className="a-page-head">
              <div>
                <h2>İstatistikler</h2>
                <p>Ziyaret ve WhatsApp tıklama özetleri.</p>
              </div>
            </div>

            {statsLoading && !stats ? (
              <p className="a-hint">Yükleniyor…</p>
            ) : stats ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
                  <div className="a-card">
                    <span className="a-hint">TOPLAM ZİYARET</span>
                    <h2 style={{ fontSize: 30, marginTop: 6 }}>{stats.pageviewsTotal}</h2>
                  </div>
                  <div className="a-card">
                    <span className="a-hint">SON 7 GÜN ZİYARET</span>
                    <h2 style={{ fontSize: 30, marginTop: 6 }}>{stats.pageviews7d}</h2>
                  </div>
                  <div className="a-card">
                    <span className="a-hint">SON 30 GÜN ZİYARET</span>
                    <h2 style={{ fontSize: 30, marginTop: 6 }}>{stats.pageviews30d}</h2>
                  </div>
                  <div className="a-card">
                    <span className="a-hint">SON 30 GÜN WHATSAPP TIKLAMASI</span>
                    <h2 style={{ fontSize: 30, marginTop: 6 }}>{stats.tourClicks30d}</h2>
                  </div>
                </div>

                <div className="a-card" style={{ maxWidth: 620 }}>
                  <h3 style={{ marginTop: 0 }}>En Çok İlgi Gören Turlar (son 30 gün)</h3>
                  {stats.topTours.length === 0 ? (
                    <p className="a-hint">Henüz veri yok.</p>
                  ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                      {stats.topTours.map((t) => (
                        <div key={t.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                          <span>{t.name}</span>
                          <span className="a-tag">{t.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="a-hint">Veri yok.</p>
            )}
          </section>
        )}

        {page === "publish" && (
          <section className="a-page a-on">
            <div className="a-page-head">
              <div>
                <h2>Yayınla</h2>
                <p>Bu bir Next.js uygulaması olduğu için Kaydet dediğiniz an değişiklik sunucuda kalıcı olur ve herkes tarafından görülür.</p>
              </div>
            </div>
            <div className="a-steps" style={{ maxWidth: 820 }}>
              <div className="a-step">
                <i>1</i>
                <div>
                  <h4>Kaydet</h4>
                  <p>Sağ alttaki <b>Kaydet</b> butonuna bastığınızda içerik sunucudaki <code>data/content.json</code> dosyasına yazılır — ekstra bir dosya indirip yüklemenize gerek yoktur.</p>
                </div>
              </div>
              <div className="a-step">
                <i>2</i>
                <div>
                  <h4>Önizleme</h4>
                  <p>Değişiklikleri yeni sekmede canlı olarak görün.</p>
                  <p style={{ marginTop: 10 }}>
                    <a className="a-btn a-sm" href="/" target="_blank">Siteyi Yeni Sekmede Aç</a>
                  </p>
                </div>
              </div>
              <div className="a-step">
                <i>3</i>
                <div>
                  <h4>Yedek &amp; Sıfırlama</h4>
                  <p>Tüm içeriği JSON olarak yedekleyebilir veya bir yedekten geri yükleyebilirsiniz.</p>
                  <p style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="a-btn a-sm" onClick={exportJson}>Yedek İndir (JSON)</button>
                    <button className="a-btn a-sm" onClick={() => jsonRef.current?.click()}>Yedekten Yükle</button>
                  </p>
                  <input type="file" accept="application/json" hidden ref={jsonRef} onChange={importJson} />
                </div>
              </div>
              <div className="a-step">
                <i>4</i>
                <div>
                  <h4>Dağıtım</h4>
                  <p>Bu proje herhangi bir Node.js sunucusunda (Vercel, kendi sunucunuz vb.) <code>npm run build &amp;&amp; npm start</code> ile çalışır. <code>data/</code> ve <code>public/assets/img/</code> klasörlerinin yazılabilir olduğundan emin olun.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="a-bar">
        <span className="a-sp">{dirty ? "● Kaydedilmemiş değişiklik var" : "Tüm değişiklikler kaydedildi"}</span>
        <a className="a-btn" href="/" target="_blank">Siteyi Önizle</a>
        <button className="a-btn a-g" onClick={save}>💾 Kaydet</button>
      </div>

      {toast && <div className={"a-toast a-on" + (toast.err ? " a-err" : "")}>{toast.msg}</div>}
    </div>
  );
}
