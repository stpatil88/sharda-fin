import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

# ------------------------------------------------------
# 1️⃣  Configuration
# ------------------------------------------------------
from dotenv import load_dotenv
load_dotenv()
DEEPSEEK_API_KEY  = os.getenv("DEEPSEEK_API_KEY")   # 👈 Replace this with your actual key
print(DEEPSEEK_API_KEY)

NEWS_SOURCES = {
    "Economic Times": "https://economictimes.indiatimes.com/markets",
    "Moneycontrol": "https://www.moneycontrol.com/news/business/markets/",
    "Business Standard": "https://www.business-standard.com/markets"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/125.0 Safari/537.36"
}

# ------------------------------------------------------
# 2️⃣  Helper function: Translate using Hugging Face API
# ------------------------------------------------------
K2_BASE = "https://api.cerebras.ai/v1"   # replace with the actual base URL you get
MODEL = "qwen-3-235b-a22b-instruct-2507"                   # or the provider's model ID
K2_API_KEY = os.getenv("k2")
HEADERS = {
    "Authorization": f"Bearer {K2_API_KEY}",
    "Content-Type": "application/json"
}

def translate_to_marathi(english_text, max_retries=4, backoff=1.5, timeout=30):
    """
    Translate English -> Marathi by prompting K2-Think.
    Replace K2_BASE and MODEL with values from the provider.
    """
    prompt = f"Translate to Marathi: {english_text}"
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional translator from English to Marathi."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.0
    }

    url = f"{K2_BASE}/chat/completions"  # adapt if provider uses /v1/chat/completions
    attempt = 0
    wait = 1.0
    max_retries=4
    while attempt < max_retries:
        attempt += 1
        try:
            r = requests.post(url, headers=HEADERS, json=payload, timeout=timeout)
        except requests.RequestException as e:
            print(f"[K2] Network error (attempt {attempt}): {e}")
            time.sleep(wait); wait *= 1.7; continue
        print(r.status_code)
        if r.status_code == 200:
            j = r.json()
            try:
                return j["choices"][0]["message"]["content"].strip()
            except Exception:
                # provider might return different structure; try common fallbacks
                text = j.get("generated_text") or j.get("output") or str(j)
                return str(text).strip()

        if r.status_code in (429, 502, 503, 504):
            print(f"[K2] {r.status_code} - retrying in {wait:.1f}s")
            time.sleep(wait); wait *= 1.7; continue

        if r.status_code in (401, 403):
            print(f"[K2] Auth error {r.status_code}: {r.text}")
            return english_text

        print(f"[K2] Error {r.status_code}: {r.text}")
        return english_text

    print("[K2] exhausted retries")
    return english_text

# 3️⃣  Scraping functions
# ------------------------------------------------------
def fetch_economic_times():
    articles = []
    r = requests.get(NEWS_SOURCES["Economic Times"], headers=HEADERS)
    soup = BeautifulSoup(r.text, "html.parser")
    for a in soup.find_all("a", class_="title", limit=8):
        title = a.get_text(strip=True)
        link = "https://economictimes.indiatimes.com" + a.get("href", "")
        articles.append((title, link))
    return articles

def fetch_moneycontrol():
    articles = []
    r = requests.get(NEWS_SOURCES["Moneycontrol"], headers=HEADERS)
    soup = BeautifulSoup(r.text, "html.parser")
    for a in soup.select("li.clearfix a", limit=8):
        title = a.get_text(strip=True)
        link = a.get("href", "")
        if title and "moneycontrol" in link:
            articles.append((title, link))
    return articles

def fetch_business_standard():
    articles = []
    r = requests.get(NEWS_SOURCES["Business Standard"], headers=HEADERS)
    soup = BeautifulSoup(r.text, "html.parser")
    for a in soup.select("a.listing-txt-link", limit=8):
        title = a.get_text(strip=True)
        link = "https://www.business-standard.com" + a.get("href", "")
        articles.append((title, link))
    return articles

# ------------------------------------------------------
# 4️⃣  Main scraping + translation flow
# ------------------------------------------------------
def scrape_all_sources():
    all_articles = []
    print("📰 Fetching from Economic Times...")
    all_articles += [("Economic Times", *a) for a in fetch_economic_times()]
    time.sleep(1)

    print("📰 Fetching from Moneycontrol...")
    all_articles += [("Moneycontrol", *a) for a in fetch_moneycontrol()]
    time.sleep(1)

    print("📰 Fetching from Business Standard...")
    all_articles += [("Business Standard", *a) for a in fetch_business_standard()]

    return all_articles

def main():
    articles = scrape_all_sources()
    data = []

    print(f"\n🔍 Found {len(articles)} articles. Translating to Marathi via Hugging Face API...\n")

    for source, title, link in articles:
        marathi_title = translate_to_marathi(title)
        data.append({
            "Source": source,
            "English Title": title,
            "Marathi Title": marathi_title,
            "URL": link
        })
        time.sleep(2)  # avoid API rate limits

    df = pd.DataFrame(data)
    df.to_csv("financial_news_marathi_api.csv", index=False, encoding="utf-8-sig")

    print("\n✅ Done! Saved results to financial_news_marathi_api.csv")

if __name__ == "__main__":
    main()
    # translate_to_marathi("Metal index hits record high amid Fed rate cut expectations; SAIL, Hind Copper rise up to 8%","Metal index hits record high amid Fed rate cut expectations; SAIL, Hind Copper rise up to 8%")