"use client";

import { useEffect, useState } from "react";

export default function BrandLogo({ className }) {
  const [hasLogo, setHasLogo] = useState(null);

  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.onload = () => alive && setHasLogo(true);
    img.onerror = () => alive && setHasLogo(false);
    img.src = "/assets/img/logo.png";
    return () => {
      alive = false;
    };
  }, []);

  if (hasLogo) {
    return <img src="/assets/img/logo.png" alt="Capguide Travel" className={"brand-img " + (className || "")} />;
  }

  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-badge">C</span>
      <span className="brand-text">
        <b>CAPGUIDE</b>
        <i>TRAVEL</i>
      </span>
    </span>
  );
}
