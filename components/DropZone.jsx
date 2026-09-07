"use client";

import { useState } from "react";

export default function DropZone({ onFile, disabled, className, children }) {
  const [over, setOver] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  }

  return (
    <div
      className={"a-drop" + (over ? " a-drop-over" : "") + (className ? " " + className : "")}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
