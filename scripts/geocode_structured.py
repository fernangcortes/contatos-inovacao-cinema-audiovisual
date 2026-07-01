#!/usr/bin/env python3
"""Geocode using Nominatim structured search for problematic addresses."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

# Each tuple: (key, params dict, fallback city/state/country)
CASES = [
    ("cinehub", {"street": "Rua São Bento, 181", "city": "São Paulo", "state": "SP", "country": "Brasil"}, "São Paulo", "SP", "Brasil"),
    ("spcine-hq", {"street": "Rua Líbero Badaró, 293", "city": "São Paulo", "state": "SP", "country": "Brasil"}, "São Paulo", "SP", "Brasil"),
    ("phb-eletronica", {"street": "Rua São Bernardino, 12", "city": "São Paulo", "state": "SP", "country": "Brasil"}, "São Paulo", "SP", "Brasil"),
    ("tania-fraga", {"street": "Rua Dr. Cesário Mota Júnior, 454", "city": "São Paulo", "state": "SP", "country": "Brasil"}, "São Paulo", "SP", "Brasil"),
    ("elpauer-comfama", {"street": "Carrera 45 #49A-16", "city": "Medellín", "state": "Antioquia", "country": "Colombia"}, "Medellín", "Antioquia", "Colombia"),
    ("william-uricchio-mit", {"street": "MIT Room E15-313", "city": "Cambridge", "state": "Massachusetts", "country": "USA"}, "Cambridge", "MA", "EUA"),
    ("jose-carlos-aronchi", {"q": "SET Expo São Paulo"}, "São Paulo", "SP", "Brasil"),
    ("fabiane-cristina", {"street": "Calle Atarazana, 4", "city": "Teruel", "state": "Aragón", "country": "Spain"}, "Teruel", "Aragón", "Espanha"),
    ("case-angatu-xukuru", {"q": "Universidade Estadual de Santa Cruz Ilhéus Bahia"}, "Ilhéus", "BA", "Brasil"),
    ("ive-rubini", {"q": "UNESP Instituto de Artes São Paulo"}, "São Paulo", "SP", "Brasil"),
    ("hauke-dorsch", {"street": "Forum universitatis 6", "city": "Mainz", "state": "Rhineland-Palatinate", "country": "Germany"}, "Mainz", "Rhineland-Palatinate", "Alemanha"),
]

USER_AGENT = "contatos_inovacao_geocoder/1.0 (research)"
BASE_URL = "https://nominatim.openstreetmap.org/search"


def geocode(key: str, params: dict, city: str, state: str, country: str):
    params = {**params, "format": "json", "limit": 1, "addressdetails": 1}
    url = f"{BASE_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"[ERROR] {key}: {exc}")
        return None

    if not data:
        print(f"[NOT FOUND] {key}: {params}")
        return None

    item = data[0]
    result = {
        "key": key,
        "query": str(params),
        "display_name": item.get("display_name"),
        "lat": float(item["lat"]),
        "lon": float(item["lon"]),
        "city": city,
        "state": state,
        "country": country,
        "place_id": item.get("place_id"),
        "osm_type": item.get("osm_type"),
        "osm_id": item.get("osm_id"),
    }
    print(f"[OK] {key}: {result['lat']}, {result['lon']} ({result['display_name'][:60]}...)")
    return result


def main():
    results = []
    for key, params, city, state, country in CASES:
        result = geocode(key, params, city, state, country)
        if result:
            results.append(result)
        time.sleep(1.1)

    out_path = Path(__file__).with_name("geocode_structured_results.json")
    out_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(results)} results to {out_path}")


if __name__ == "__main__":
    main()
