import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("PONG_URL", "http://127.0.0.1:5173")


def main() -> None:
    (ROOT / "test-results").mkdir(exist_ok=True)
    browser_errors = []
    page_errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        page.on("console", lambda message: browser_errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.goto(BASE_URL, wait_until="networkidle")
        assert page.title() == "MODEL ARENA // 3D PONG"
        assert page.locator('[data-testid="game-stage"] canvas').count() == 1
        assert page.locator("text=RALPH-98").count() >= 1
        assert page.locator("text=08 MODELS ONLINE").count() == 1

        page.screenshot(path=str(ROOT / "test-results" / "pong-desktop.png"), full_page=True)
        page.get_by_test_id("start-button").click()
        page.wait_for_timeout(900)
        assert "LIVE" in page.get_by_test_id("court-status").inner_text()
        assert page.evaluate("window.__pongGame.getState().running") is True
        page.keyboard.down("w")
        page.wait_for_timeout(180)
        page.keyboard.up("w")
        page.mouse.move(560, 420)
        page.wait_for_timeout(240)
        page.get_by_test_id("reset-button").click()
        assert page.get_by_test_id("player-score").inner_text() == "00"
        assert page.get_by_test_id("ai-score").inner_text() == "00"
        assert "READY" in page.get_by_test_id("court-status").inner_text()

        mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
        mobile.goto(BASE_URL, wait_until="networkidle")
        assert mobile.locator('[data-testid="game-stage"] canvas').count() == 1
        mobile.screenshot(path=str(ROOT / "test-results" / "pong-mobile.png"), full_page=True)
        mobile.close()
        browser.close()
    assert not browser_errors, browser_errors
    assert not page_errors, page_errors
    print("browser smoke: PASS (desktop + mobile, controls, reset, no console errors)")


if __name__ == "__main__":
    main()
