import { readFile } from "fs/promises";
import path from "path";

export const revalidate = 300;

type StarInfo = { stars: number; updatedAt: string };

export async function GET() {
  const raw = await readFile(path.join(process.cwd(), "data", "projects.json"), "utf-8");
  const entries = JSON.parse(raw) as { repo: string }[];

  const out: Record<string, StarInfo> = {};
  await Promise.all(
    entries.map(async (e) => {
      try {
        const r = await fetch(`https://api.github.com/repos/${e.repo}`, {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 300 },
        });
        if (!r.ok) return;
        const d = await r.json();
        out[e.repo] = {
          stars: typeof d.stargazers_count === "number" ? d.stargazers_count : 0,
          updatedAt: (d.updated_at as string) ?? "",
        };
      } catch {
        /* keep the entry out; client keeps its previous value */
      }
    })
  );

  return Response.json(out, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
