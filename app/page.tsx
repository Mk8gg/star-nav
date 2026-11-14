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

  return <Explorer items={items} />;
}
