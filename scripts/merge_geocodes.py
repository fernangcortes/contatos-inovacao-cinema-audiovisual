#!/usr/bin/env python3
"""Merge geocode results and add manual fallbacks for missing entries."""
import json
from pathlib import Path

FALLBACKS = {
    "william-uricchio-mit": {"lat": 42.3601, "lon": -71.0942, "city": "Cambridge", "state": "MA", "country": "EUA", "display_name": "MIT Open Documentary Lab, Cambridge, MA, USA", "manual": True},
    "jose-carlos-aronchi": {"lat": -23.5505, "lon": -46.6333, "city": "São Paulo", "state": "SP", "country": "Brasil", "display_name": "SET EXPO / SEBRAE-SP, São Paulo, SP, Brasil", "manual": True},
    "fabiane-cristina": {"lat": 40.3456, "lon": -1.1065, "city": "Teruel", "state": "Aragón", "country": "Espanha", "display_name": "Teruel, Aragón, Spain", "manual": True},
    "case-angatu-xukuru": {"lat": -14.7934, "lon": -39.0463, "city": "Ilhéus", "state": "BA", "country": "Brasil", "display_name": "Universidade Estadual de Santa Cruz, Ilhéus, BA, Brasil", "manual": True},
    "ive-rubini": {"lat": -23.5505, "lon": -46.6333, "city": "São Paulo", "state": "SP", "country": "Brasil", "display_name": "UNESP / cAt, São Paulo, SP, Brasil", "manual": True},
    "hauke-dorsch": {"lat": 49.9920, "lon": 8.2371, "city": "Mainz", "state": "Rhineland-Palatinate", "country": "Alemanha", "display_name": "Johannes Gutenberg University Mainz, Mainz, Germany", "manual": True},
    "karen-cavalcanti": {"lat": -23.479369, "lon": -46.6502811, "city": "São Paulo", "state": "SP", "country": "Brasil", "display_name": "Laboratório Fantasma, Rua Conselheiro Moreira de Barros 1631, São Paulo, SP, Brasil", "manual": True},
}


def load_results(path: Path):
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    return {item["key"]: item for item in data}


def main():
    scripts_dir = Path(__file__).parent
    initial = load_results(scripts_dir / "geocode_results.json")
    retry = load_results(scripts_dir / "geocode_retry_results.json")
    structured = load_results(scripts_dir / "geocode_structured_results.json")

    merged = {**initial, **retry, **structured}
    for key, fallback in FALLBACKS.items():
        if key not in merged:
            merged[key] = {"key": key, **fallback}
        else:
            # Keep geocoded result but mark manual if desired? No, keep geocoded.
            pass

    # Standardize field name lon -> lng
    for key, item in merged.items():
        item["lng"] = item.pop("lon", item.get("lng"))

    out_path = scripts_dir / "final_geocodes.json"
    out_path.write_text(json.dumps(list(merged.values()), indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(merged)} final geocodes to {out_path}")
    for key in sorted(merged.keys()):
        item = merged[key]
        print(f"  {key}: {item['lat']}, {item['lng']} ({item['city']}/{item['state']}/{item['country']})")


if __name__ == "__main__":
    main()
