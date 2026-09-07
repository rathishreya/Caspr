#!/usr/bin/env python3
"""Recover Drive downloads captured in this session and write them into the repo.

download_file_content returns base64. Small results land in the session
transcript; oversized ones are spilled to the tool-results directory. Both are
on disk, so files can be decoded exactly rather than re-typed.

Usage: drive_extract.py <title> <dest-relative-to-repo> [<title> <dest> ...]
       drive_extract.py --list
"""
import base64
import json
import os
import sys

SESSION = "fbfeddca-e537-549b-bbf9-3599b4a1d12e"
PROJ = f"/root/.claude/projects/-home-user-Caspr"
JSONL = f"{PROJ}/{SESSION}.jsonl"
SPILL = f"{PROJ}/{SESSION}/tool-results"
REPO = "/home/user/Caspr"


def _payloads():
    """Yield every {content,title,mimeType} blob this session has downloaded."""
    if os.path.isdir(SPILL):
        for name in os.listdir(SPILL):
            try:
                d = json.load(open(os.path.join(SPILL, name), encoding="utf-8"))
            except Exception:
                continue
            if isinstance(d, dict) and "content" in d and "title" in d:
                yield d

    def walk(o):
        if isinstance(o, dict):
            for v in o.values():
                yield from walk(v)
        elif isinstance(o, list):
            for v in o:
                yield from walk(v)
        elif isinstance(o, str) and '"mimeType"' in o and '"content"' in o:
            try:
                d = json.loads(o)
            except Exception:
                return
            if isinstance(d, dict) and "content" in d and "title" in d:
                yield d

    for line in open(JSONL, encoding="utf-8"):
        if '"content"' not in line or "mimeType" not in line:
            continue
        try:
            rec = json.loads(line)
        except Exception:
            continue
        yield from walk(rec)


def index():
    """Latest payload wins, so a re-download supersedes an earlier one."""
    return {d["title"]: d["content"] for d in _payloads()}


def main(argv):
    idx = index()
    if not argv or argv[0] == "--list":
        for t in sorted(idx):
            print(f"{len(base64.b64decode(idx[t])):>9}  {t}")
        return 0

    pairs = list(zip(argv[::2], argv[1::2]))
    rc = 0
    for title, dest in pairs:
        if title not in idx:
            print(f"MISSING  {title}")
            rc = 1
            continue
        raw = base64.b64decode(idx[title])
        path = os.path.join(REPO, dest)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as fh:
            fh.write(raw)
        try:
            raw.decode("utf-8")
            enc = "utf-8 ok"
        except UnicodeDecodeError:
            enc = "binary"
        print(f"{len(raw):>9}  {enc:<9}  {dest}")
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
