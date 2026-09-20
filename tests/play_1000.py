import argparse
import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description="Speel de echte MODEL ARENA-engine 1000 keer automatisch.")
    parser.add_argument("--count", type=int, default=1000)
    parser.add_argument("--url", default=os.environ.get("PONG_URL", "http://127.0.0.1:5173"))
    parser.add_argument("--output", default=str(ROOT / "test-results" / "batch-1000.json"))
    args = parser.parse_args()

    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(args.url, wait_until="networkidle")
        result = page.evaluate("count => window.__pongGame.runBatch(count)", args.count)
        assert result["matches"] == args.count, result
        assert result["playerWins"] + result["modelWins"] == args.count, result
        assert result["elapsedMs"] >= 0, result
        assert not errors, errors
        browser.close()

    evidence = {"url": args.url, "requested": args.count, **result}
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(evidence, ensure_ascii=False))


if __name__ == "__main__":
    main()
