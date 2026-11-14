import { readFile } from "fs/promises";
import path from "path";
import Explorer, { type ProjectItem } from "@/components/Explorer";

export const revalidate = 3600;

type LocalEntry = {
  repo: string;
  blurb: string;
  category: string;
  tags?: string[];
  /* Snapshot of GitHub data, refreshed by scripts/refresh-stars.py and
     committed with the repo, so the page never depends on GitHub's
     unauthenticated rate limit from Vercel's shared IPs. The /api/stars
     poll still refreshes numbers live whenever GitHub cooperates. */
  stars?: number;
  language?: string | null;
  pushedAt?: string;
};

export default async function Home() {
  const raw = await readFile(path.join(process.cwd(), "data", "projects.json"), "utf-8");
  const entries = JSON.parse(raw) as LocalEntry[];

  const items: ProjectItem[] = entries.map((e) => {
    const [owner, name] = e.repo.split("/");
    return {
      repo: e.repo,
      owner,
      name,
      blurb: e.blurb,
      category: e.category,
      tags: e.tags ?? [],
      stars: e.stars ?? 0,
      language: e.language ?? null,
      pushedAt: e.pushedAt ?? "",
    };
  });

  return <Explorer items={items} />;
}
