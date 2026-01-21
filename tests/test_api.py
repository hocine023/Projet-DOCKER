import os
import time
import requests

API_URL = os.getenv("API_URL", "http://api:8000")

def wait_for_api(timeout=40):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(f"{API_URL}/health", timeout=2)
            if r.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(1)
    return False

def test_health():
    assert wait_for_api(), "API not ready"
    r = requests.get(f"{API_URL}/health", timeout=5)
    assert r.status_code == 200
    assert r.json().get("ok") is True

def test_country_list():
    assert wait_for_api(), "API not ready"
    r = requests.get(f"{API_URL}/country", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "id" in data[0] and "name" in data[0]

def test_pandemic_list():
    assert wait_for_api(), "API not ready"
    r = requests.get(f"{API_URL}/pandemic", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "id" in data[0] and "name" in data[0]

def test_summary_and_daily_smoke():
    assert wait_for_api(), "API not ready"

    countries = requests.get(f"{API_URL}/country", timeout=10).json()
    pandemics = requests.get(f"{API_URL}/pandemic", timeout=10).json()
    cid = countries[0]["id"]
    pid = pandemics[0]["id"]

    r1 = requests.get(f"{API_URL}/pandemic_country/{cid}/{pid}", timeout=10)
    assert r1.status_code in (200, 404)
    if r1.status_code == 200:
        j = r1.json()
        assert "total_confirmed" in j
        assert "total_deaths" in j

    r2 = requests.get(f"{API_URL}/daily_pandemic_country/{cid}/{pid}", timeout=15)
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)
