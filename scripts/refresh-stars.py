#!/usr/bin/env python3
"""Refresh the GitHub snapshot fields (stars, language, pushedAt) in
data/projects.json using the authenticated gh CLI on this machine.

Run before committing new entries and daily from cron. Exits 0 even if
some repos fail; a repo that fails keeps its previous snapshot values.
"""
import json
import subprocess
import sys

PATH = "data/projects.json"


def fetch(repo: str):
    r = subprocess.run(
        ["gh", "api", f"repos/{repo}", "--jq",
         "{s: .stargazers_count, l: .language, p: .pushed_at}"],
        capture_output=True, text=True, timeout=30,
    )
    if r.returncode != 0:
        return None
    try:
        return json.loads(r.stdout)
    except json.JSONDecodeError:
        return None


def main() -> int:
    with open(PATH, encoding="utf-8") as f:
        data = json.load(f)
    changed = 0
    failed = []
    for e in data:
        m = fetch(e["repo"])
        if m is None:
            failed.append(e["repo"])
            continue
        new = {"stars": m["s"], "language": m["l"], "pushedAt": m["p"]}
        for k, v in new.items():
            if e.get(k) != v:
                e[k] = v
                changed += 1
    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
        f.write("\n")
    print(f"repos={len(data)} fields_changed={changed} failed={failed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
