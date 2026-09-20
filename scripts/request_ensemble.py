#!/usr/bin/env python3
"""Ask the eight-model planning panel for a bounded game design brief.

The proxy key is read from the running LiteLLM container and is never printed or
written to the project. The output is metadata plus the panel's design brief.
"""

import argparse
import json
import subprocess
from pathlib import Path

import httpx


PROMPT = """You are the eight-model Kathedraal planning panel. Collaborate on a tiny,
playable browser game called MODEL ARENA: 3D PONG. A human plays against an adaptive
model opponent named RALPH-98. The implementation target is a self-contained Vite /
Three.js frontend with a dark neon laboratory aesthetic, keyboard and pointer control,
responsive layout, no secrets in the browser, and Playwright smoke coverage.

Return a compact implementation brief in four sections: shared concept, model-specific
contributions, minimum viable mechanics, and a verification checklist. Keep it under
220 words. Prioritize a fun game that can be built without a backend call during play."""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="/tmp/kathedraal-3d-pong-panel.json")
    args = parser.parse_args()
    key = subprocess.check_output(
        ["docker", "exec", "litellm", "printenv", "LITELLM_MASTER_KEY"], text=True
    ).strip()
    response = httpx.post(
        "http://127.0.0.1:4000/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}"},
        json={
            "model": "plan-panel",
            "messages": [{"role": "user", "content": PROMPT}],
            "max_tokens": 1200,
            "temperature": 0.35,
        },
        timeout=240,
    )
    payload = response.json()
    result = {
        "status": response.status_code,
        "model": payload.get("model"),
        "usage": payload.get("usage"),
        "metadata": payload.get("metadata"),
        "brief": ((payload.get("choices") or [{}])[0].get("message") or {}).get("content", ""),
    }
    Path(args.output).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": result["status"], "model": result["model"], "usage": result["usage"]}))
    print(result["brief"])
    return 0 if response.status_code == 200 and result["brief"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
