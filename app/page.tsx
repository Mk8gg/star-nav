import { readFile } from "fs/promises";
import path from "path";
import Explorer, { type ProjectItem } from "@/components/Explorer";

export const revalidate = 3600;

type LocalEntry = {
  repo: string;
  blurb: string;
  category: string;
  tags?: string[];
};

async function fetchRepoMeta(full: string) {
  try {
    const r = await fetch(`https://api.github.com/repos/${full}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!r.ok) return null;
    const d = await r.json();
    return {
      stars: typeof d.stargazers_count === "number" ? d.stargazers_count : 0,
      language: d.language as string | null,
      updatedAt: d.updated_at as string,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const raw = await readFile(path.join(process.cwd(), "data", "projects.json"), "utf-8");
  const entries = JSON.parse(raw) as LocalEntry[];

  const items: ProjectItem[] = await Promise.all(
    entries.map(async (e) => {
      const meta = await fetchRepoMeta(e.repo);
      const [owner, name] = e.repo.split("/");
      return {
        repo: e.repo,
        owner,
        name,
        blurb: e.blurb,
        category: e.category,
        tags: e.tags ?? [],
        stars: meta?.stars ?? 0,
        language: meta?.language ?? null,
        updatedAt: meta?.updatedAt ?? "",
      };
    })
  );

  const totalStars = items.reduce((s, it) => s + it.stars, 0);
  const categoryCount = new Set(items.map((it) => it.category)).size;
  const fmtTotal =
    totalStars >= 1000 ? (totalStars / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(totalStars);

  return (
    <>
      <Explorer items={items} />
      <section className="intro">
        <div className="intro-panel">
          <h2>关于 GitHub Star</h2>
          <p>
            这里收录站长逐个挑选的 GitHub 开源软件，每一个都配了一句中文介绍，点任意卡片就能直达仓库。
          </p>
          <p>
            用顶部的搜索框和分类标签可以快速定位想找的工具；卡片上的 star 数和开发语言会自动同步 GitHub 的最新数据。
          </p>
          <div className="intro-stats">
            <div className="intro-stat">
              <strong>{items.length}</strong>
              <span>收录项目</span>
            </div>
            <div className="intro-stat">
              <strong>{categoryCount}</strong>
              <span>分类</span>
            </div>
            <div className="intro-stat">
              <strong>{fmtTotal}</strong>
              <span>总 star</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
