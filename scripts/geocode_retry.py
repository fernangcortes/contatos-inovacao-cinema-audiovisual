#!/usr/bin/env python3
"""Retry geocoding for addresses that failed in the first pass."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ADDRESSES = [
    ("cinehub", "Rua São Bento 181, Centro, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("spcine-hq", "Rua Líbero Badaró 293, Centro, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("uview360", "Av. João Carlos Machado 271, Barra da Tijuca, Rio de Janeiro, RJ, Brazil", "Rio de Janeiro", "RJ", "Brasil"),
    ("set", "Av. Auro Soares de Moura Andrade 252, Barra Funda, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("faap", "Rua Alagoas 903, Higienópolis, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("phb-eletronica", "Rua São Bernardino 12, Parque Anhanguera, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("tania-fraga", "Rua Dr. Cesário Mota Júnior 454, Vila Buarque, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("cartografia-filmes", "Rua Benjamin Constant 229, Curitiba, PR, Brazil", "Curitiba", "PR", "Brasil"),
    ("cineway", "Rua Antero de Quental 263, Coimbra, Portugal", "Coimbra", "Coimbra", "Portugal"),
    ("elpauer-comfama", "Carrera 45 49A-16, Medellín, Antioquia, Colombia", "Medellín", "Antioquia", "Colombia"),
    ("william-uricchio-mit", "MIT Open Documentary Lab, Cambridge, MA, USA", "Cambridge", "MA", "EUA"),
    ("rob-mclaughlin-vancouver", "351 Abbott Street, Vancouver, BC, Canada", "Vancouver", "BC", "Canadá"),
    ("rodrigo-samia", "Av. Pinheiro Machado 48, Santos, SP, Brazil", "Santos", "SP", "Brasil"),
    ("jose-carlos-aronchi", "SET Expo, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
    ("lenildo-gomes", "Universidade Federal do Ceará, Fortaleza, CE, Brazil", "Fortaleza", "CE", "Brasil"),
    ("fabiane-cristina", "Calle Atarazana 4, Teruel, Spain", "Teruel", "Aragón", "Espanha"),
    ("case-angatu-xukuru", "Universidade Estadual de Santa Cruz, Ilhéus, BA, Brazil", "Ilhéus", "BA", "Brasil"),
    ("hauke-dorsch", "Johannes Gutenberg University Mainz, Mainz, Germany", "Mainz", "Rhineland-Palatinate", "Alemanha"),
    ("ive-rubini", "UNESP Instituto de Artes, São Paulo, SP, Brazil", "São Paulo", "SP", "Brasil"),
]

USER_AGENT = "contatos_inovacao_geocoder/1.0 (research)"
BASE_URL = "https://nominatim.openstreetmap.org/search"


def geocode(key: str, address: str, city: str, state: str, country: str):
    params = {
        "q": address,
        "format": "json",
        "limit": 1,
        "addressdetails": 1,
    }
    url = f"{BASE_URL}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"[ERROR] {key}: {exc}")
        return None

    if not data:
        print(f"[NOT FOUND] {key}: {address}")
        return None

    item = data[0]
    result = {
        "key": key,
        "query": address,
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
    for key, address, city, state, country in ADDRESSES:
        result = geocode(key, address, city, state, country)
        if result:
            results.append(result)
        time.sleep(1.1)

    out_path = Path(__file__).with_name("geocode_retry_results.json")
    out_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(results)} results to {out_path}")


if __name__ == "__main__":
    main()
