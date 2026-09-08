"use client";

const PALETTE = ["#D9611F", "#0F7B4F", "#2563EB", "#9333EA", "#DC2626", "#CA8A04", "#0891B2", "#DB2777", "#7A6A5C"];

function topNPlusOther(items, n) {
  if (!items || items.length <= n) return items || [];
  const head = items.slice(0, n);
  const rest = items.slice(n).reduce((s, i) => s + i.count, 0);
  return rest > 0 ? [...head, { name: "Diğer", count: rest }] : head;
}

export default function DonutChart({ items, size = 140, maxSlices = 6 }) {
  const data = topNPlusOther(items, maxSlices);
  if (!data || data.length === 0) return <p className="a-hint">Henüz veri yok.</p>;

  const total = data.reduce((s, i) => s + i.count, 0) || 1;
  let acc = 0;
  const stops = data.map((it, i) => {
    const start = (acc / total) * 360;
    acc += it.count;
    const end = (acc / total) * 360;
    return `${PALETTE[i % PALETTE.length]} ${start}deg ${end}deg`;
  });

  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(${stops.join(",")})`,
          position: "relative",
          flex: "none"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: Math.round(size * 0.24),
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
            color: "#1A1512"
          }}
        >
          {total}
        </div>
      </div>
      <div style={{ display: "grid", gap: 7, flex: 1, minWidth: 150 }}>
        {data.map((it, i) => (
          <div key={it.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i % PALETTE.length], flex: "none" }} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
            <b>{it.count}</b>
            <span style={{ color: "var(--muted)", fontSize: 11, width: 34, textAlign: "right" }}>
              {Math.round((it.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
