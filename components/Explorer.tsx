"use client";

import { useMemo, useState } from "react";

export type ProjectItem = {
  repo: string;
  owner: string;
  name: string;
  blurb: string;
  category: string;
  tags: string[];
  stars: number;
  language: string | null;
  updatedAt: string;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Java: "#b07219",
};

function fmtStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function Explorer({ items }: { items: ProjectItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [sort, setSort] = useState<"stars" | "updated">("stars");

  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const it of items) if (!seen.includes(it.category)) seen.push(it.category);
    return ["全部", ...seen];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((it) => {
      if (category !== "全部" && it.category !== category) return false;
      if (!q) return true;
      const hay = `${it.repo} ${it.name} ${it.blurb} ${it.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) =>
      sort === "stars" ? b.stars - a.stars : (b.updatedAt || "").localeCompare(a.updatedAt || "")
    );
    return list;
  }, [items, query, category, sort]);

  return (
    <div className="wrap">
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder={`搜索 ${items.length} 个已收录软件：名称、用途、标签…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="sort" value={sort} onChange={(e) => setSort(e.target.value as "stars" | "updated")}>
          <option value="stars">按 star 数</option>
          <option value="updated">按最近更新</option>
        </select>
      </div>

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={"chip" + (category === c ? " active" : "")}
            onClick={() => setCategory(c)}
          >
            {c}
            <span className="chip-count">
              {c === "全部" ? items.length : items.filter((i) => i.category === c).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty">没有找到匹配的软件，换个关键词试试。</p>
      ) : (
        <div className="grid">
          {filtered.map((it) => (
            <a
              key={it.repo}
              className="card"
              href={`https://github.com/${it.repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="avatar"
                  src={`https://github.com/${it.owner}.png?size=96`}
                  alt={it.owner}
                  width={44}
                  height={44}
                  loading="lazy"
                />
                <div className="card-title">
                  <span className="repo-name">{it.name}</span>
                  <span className="repo-owner">{it.repo}</span>
                </div>
                <span className="stars">⭐ {fmtStars(it.stars)}</span>
              </div>
              <p className="blurb">{it.blurb}</p>
              <div className="card-bottom">
                <span className="cat">{it.category}</span>
                {it.language && (
                  <span className="lang">
                    <span
                      className="lang-dot"
                      style={{ background: LANG_COLORS[it.language] ?? "#888" }}
                    />
                    {it.language}
                  </span>
                )}
                {it.tags.slice(0, 2).map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
