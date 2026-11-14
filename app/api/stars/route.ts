import { readFile } from "fs/promises";
import path from "path";

export const revalidate = 600;

type StarInfo = { stars: number; pushedAt: string };

export async function GET() {
  const raw = await readFile(path.join(process.cwd(), "data", "projects.json"), "utf-8");
  const entries = JSON.parse(raw) as { repo: string }[];

  const out: Record<string, StarInfo> = {};
  await Promise.all(
    entries.map(async (e) => {
      try {
        const r = await fetch(`https://api.github.com/repos/${e.repo}`, {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 600 },
        });
        if (!r.ok) return;
        const d = await r.json();
        out[e.repo] = {
          stars: typeof d.stargazers_count === "number" ? d.stargazers_count : 0,
          pushedAt: (d.pushed_at as string) ?? "",
        };
      } catch {
        /* keep the entry out; client keeps its previous value */
      }
    })
  );

  // Never let a failed or partial fetch poison the CDN cache for long:
  // full result caches 10 minutes, partial 60 seconds, empty not at all.
  const got = Object.keys(out).length;
  const cache =
    got === entries.length
      ? "public, s-maxage=600, stale-while-revalidate=1200"
      : got > 0
        ? "public, s-maxage=60, stale-while-revalidate=120"
        : "no-store";
  return Response.json(out, { headers: { "Cache-Control": cache } });
}
