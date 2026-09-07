"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";

export default function ImageUploadField({ label, value, onChange, hint }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [over, setOver] = useState(false);

  async function upload(file) {
    if (!file || !file.type?.startsWith("image/")) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.url) onChange(out.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="a-field a-full">
      {label ? <label>{label}</label> : null}
      <div
        className={"a-upload" + (over ? " a-upload-over" : "") + (uploading ? " a-upload-busy" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (uploading) return;
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        onClick={() => !uploading && fileRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="" className="a-upload-preview" onError={(e) => (e.currentTarget.style.display = "none")} />
        ) : null}
        <div className="a-upload-overlay">
          {uploading ? (
            <Loader2 className="a-upload-icon a-spin" size={22} />
          ) : (
            <ImageUp className="a-upload-icon" size={22} />
          )}
          <span>
            {uploading ? "Yükleniyor…" : (
              <>
                <b>Sürükleyip bırakın</b> ya da tıklayıp seçin
              </>
            )}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) upload(f);
          }}
        />
      </div>
      <input
        className="a-upload-url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="veya bir görsel URL'si yapıştırın"
      />
      {hint ? <span className="a-hint">{hint}</span> : null}
    </div>
  );
}
