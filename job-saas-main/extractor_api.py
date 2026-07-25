#!/usr/bin/env python3
"""
JobFlow LinkedIn Job Extractor API
===================================
A lightweight FastAPI wrapper around the LinkedIn scraper from job-saas-main.
Runs as a standalone microservice on port 8001.
The React frontend calls this to trigger scraping and fetch results.

Run:  python extractor_api.py
Requires: pip install fastapi uvicorn selenium beautifulsoup4 python-dotenv
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json, os, time, uuid
from datetime import datetime
from pathlib import Path

# ── Try importing selenium (optional — graceful fallback to mock data) ──────────
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from bs4 import BeautifulSoup
    from urllib.parse import quote_plus
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("⚠️  Selenium not installed. Running in MOCK mode.")
    print("   Install with: pip install selenium beautifulsoup4")

# ── Data file (persists discovered jobs across restarts) ────────────────────────
DATA_FILE = Path(__file__).parent / "discovered_jobs.json"
CONFIG_FILE = Path(__file__).parent / "extractor_config.json"

app = FastAPI(title="JobFlow Extractor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ─────────────────────────────────────────────────────────────────────

class ExtractorConfig(BaseModel):
    keywords: List[str]
    location: str
    target_skills: List[str]
    max_jobs: int = 25

class DiscoveredJob(BaseModel):
    id: str
    title: str
    company: str
    location: str
    link: str
    matched_skills: List[str]
    extracted_at: str
    imported: bool = False

class ScrapeStatus(BaseModel):
    running: bool
    last_run: Optional[str]
    jobs_found: int
    message: str

# ─── State ──────────────────────────────────────────────────────────────────────

scrape_state = {"running": False, "last_run": None, "message": "Ready to scan"}

def load_jobs() -> List[dict]:
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text())
    return []

def save_jobs(jobs: List[dict]):
    DATA_FILE.write_text(json.dumps(jobs, indent=2))

def load_config() -> dict:
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text())
    return {
        "keywords": ["React Developer", "Frontend Engineer", "Full Stack Developer"],
        "location": "India",
        "target_skills": ["react", "python", "javascript", "typescript", "node", "sql"],
        "max_jobs": 25,
    }

def save_config(config: dict):
    CONFIG_FILE.write_text(json.dumps(config, indent=2))

# ─── LinkedIn Scraper ────────────────────────────────────────────────────────────

def build_linkedin_url(keyword: str, location: str) -> str:
    from urllib.parse import quote_plus
    return f"https://www.linkedin.com/jobs/search/?keywords={quote_plus(keyword)}&location={quote_plus(location)}&f_TPR=r86400"

def run_scraper(config: dict):
    """Core scraping function — runs in background."""
    global scrape_state
    scrape_state["running"] = True
    scrape_state["message"] = "🔍 Launching browser..."

    existing_jobs = load_jobs()
    existing_links = {j["link"] for j in existing_jobs}
    new_jobs = []

    if not SELENIUM_AVAILABLE:
        # ── MOCK MODE: return realistic fake results ────────────────────────────
        scrape_state["message"] = "🤖 Mock mode — generating sample jobs..."
        time.sleep(2)
        mock_data = [
            {"title": "Senior React Developer", "company": "Flipkart", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock1", "matched_skills": ["react", "javascript"]},
            {"title": "Full Stack Engineer (Node + React)", "company": "Razorpay", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock2", "matched_skills": ["node", "react", "javascript"]},
            {"title": "Frontend Developer", "company": "Swiggy", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock3", "matched_skills": ["react", "typescript"]},
            {"title": "Python Backend Engineer", "company": "PhonePe", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock4", "matched_skills": ["python", "sql"]},
            {"title": "React Native Developer", "company": "Groww", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock5", "matched_skills": ["react", "javascript"]},
            {"title": "Software Engineer - Frontend", "company": "CRED", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock6", "matched_skills": ["react", "typescript", "javascript"]},
            {"title": "Full Stack Developer (Django + React)", "company": "Zepto", "location": config["location"], "link": "https://linkedin.com/jobs/view/mock7", "matched_skills": ["python", "react", "javascript"]},
        ]
        for m in mock_data:
            if m["link"] not in existing_links:
                new_jobs.append({
                    "id": str(uuid.uuid4()),
                    "title": m["title"],
                    "company": m["company"],
                    "location": m["location"],
                    "link": m["link"],
                    "matched_skills": m["matched_skills"],
                    "extracted_at": datetime.now().isoformat(),
                    "imported": False,
                })
    else:
        # ── REAL SELENIUM MODE ──────────────────────────────────────────────────
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        driver = webdriver.Chrome(options=options)

        try:
            for keyword in config["keywords"]:
                scrape_state["message"] = f"🔍 Scanning LinkedIn for: {keyword} in {config['location']}"
                url = build_linkedin_url(keyword, config["location"])
                driver.get(url)
                time.sleep(4)

                # Scroll to load more jobs
                for _ in range(5):
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)

                soup = BeautifulSoup(driver.page_source, "html.parser")
                cards = soup.find_all("div", class_="base-card")

                for card in cards[:config.get("max_jobs", 25)]:
                    a_tag = card.find("a", class_="base-card__full-link")
                    if not a_tag:
                        continue
                    job_link = a_tag["href"].split("?")[0]
                    if job_link in existing_links:
                        continue

                    title_el = a_tag.text.strip()
                    company_el = card.find("h4")
                    company = company_el.text.strip() if company_el else ""
                    loc_el = card.find("span", class_="job-search-card__location")
                    loc = loc_el.text.strip() if loc_el else ""

                    # Fetch job description to match skills
                    try:
                        driver.get(job_link)
                        time.sleep(2)
                        desc = BeautifulSoup(driver.page_source, "html.parser").get_text(" ", strip=True).lower()
                        matched = [s for s in config["target_skills"] if s.lower() in desc]
                    except Exception:
                        matched = []

                    if matched:
                        existing_links.add(job_link)
                        new_jobs.append({
                            "id": str(uuid.uuid4()),
                            "title": title_el,
                            "company": company,
                            "location": loc,
                            "link": job_link,
                            "matched_skills": matched,
                            "extracted_at": datetime.now().isoformat(),
                            "imported": False,
                        })
        finally:
            driver.quit()

    all_jobs = new_jobs + existing_jobs
    save_jobs(all_jobs)

    scrape_state["running"] = False
    scrape_state["last_run"] = datetime.now().isoformat()
    scrape_state["message"] = f"✅ Done! Found {len(new_jobs)} new jobs."
    print(scrape_state["message"])


# ─── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "JobFlow Extractor API", "selenium": SELENIUM_AVAILABLE}

@app.get("/config")
def get_config():
    return load_config()

@app.post("/config")
def update_config(config: ExtractorConfig):
    data = config.dict()
    save_config(data)
    return {"success": True, "config": data}

@app.post("/scrape")
def trigger_scrape(background_tasks: BackgroundTasks):
    if scrape_state["running"]:
        raise HTTPException(status_code=409, detail="Scraper is already running")
    config = load_config()
    background_tasks.add_task(run_scraper, config)
    return {"success": True, "message": "Scraper started in background"}

@app.get("/status")
def get_status():
    jobs = load_jobs()
    return {
        "running": scrape_state["running"],
        "last_run": scrape_state["last_run"],
        "jobs_found": len(jobs),
        "new_jobs": len([j for j in jobs if not j.get("imported")]),
        "message": scrape_state["message"],
        "selenium_available": SELENIUM_AVAILABLE,
    }

@app.get("/jobs")
def get_jobs(imported: Optional[bool] = None):
    jobs = load_jobs()
    if imported is not None:
        jobs = [j for j in jobs if j.get("imported") == imported]
    return {"jobs": jobs, "total": len(jobs)}

@app.post("/jobs/{job_id}/import")
def mark_imported(job_id: str):
    jobs = load_jobs()
    for job in jobs:
        if job["id"] == job_id:
            job["imported"] = True
            save_jobs(jobs)
            return {"success": True}
    raise HTTPException(status_code=404, detail="Job not found")

@app.delete("/jobs/{job_id}")
def delete_job(job_id: str):
    jobs = [j for j in load_jobs() if j["id"] != job_id]
    save_jobs(jobs)
    return {"success": True}

@app.delete("/jobs")
def clear_all_jobs():
    save_jobs([])
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    print("🚀 JobFlow Extractor API starting on http://localhost:8001")
    print(f"   Selenium: {'✅ Available (real scraping)' if SELENIUM_AVAILABLE else '⚠️  Not installed (mock mode)'}")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
