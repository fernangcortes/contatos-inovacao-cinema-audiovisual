#!/usr/bin/env python3
"""Geocode addresses using Nominatim (OpenStreetMap) and save results to JSON."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ADDRESSES = [
    # (key, address string, expected city/state/country for fallback)
    ("cinehub", "Rua São Bento, 181, Centro, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("spcine-leia", "Tendal da Lapa, Rua Guaicurus, 1100, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("spcine-hq", "Rua Líbero Badaró, 293, Centro, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("klaxon-brlab", "Largo Senador Raul Cardoso, 250, Vila Clementino, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("etc-filmes", "Avenida Queiroz Filho, 1700, Vila Hamburguesa, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("sp-audiovisual-hub", "Rua Alagoas, 903, Higienópolis, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("uview360", "Avenida João Carlos Machado, 271, Sala 201, Barra da Tijuca, Rio de Janeiro, RJ, 22620-081, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("laboratorio-fantasma", "Rua Conselheiro Moreira de Barros, 1631, Lauzane Paulista, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("cinemateca-brasileira", "Largo Senador Raul Cardoso, 207, Vila Clementino, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("set", "Avenida Auro Soares de Moura Andrade, 252, cjs 31/32, Barra Funda, São Paulo, SP, 01156-001, Brasil", "São Paulo", "SP", "Brasil"),
    ("legado-tecnologia", "Praça Maastricht, 200, Jardim Europa, Bragança Paulista, SP, 12917-021, Brasil", "Bragança Paulista", "SP", "Brasil"),
    ("mackenzie", "Rua da Consolação, 930, Consolação, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("faap", "Rua Alagoas, 903, Prédio 01, São Paulo, SP, 01242-902, Brasil", "São Paulo", "SP", "Brasil"),
    ("phb-eletronica", "Rua São Bernardino, 12, Quadra 5, Parque Anhanguera, São Paulo, SP, 05120-050, Brasil", "São Paulo", "SP", "Brasil"),
    ("futuriste", "Vila Mariana, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("tania-fraga", "Rua Dr. Cesário Mota Júnior, 454, Sala 1401, Vila Buarque, São Paulo, SP, 01221-020, Brasil", "São Paulo", "SP", "Brasil"),
    ("olabi", "Rua Martins Ferreira, 12, Botafogo, Rio de Janeiro, RJ, 22271-010, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("ancine", "Avenida Graça Aranha, 35, Centro, Rio de Janeiro, RJ, 20030-002, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("bndes", "Avenida República do Chile, 100, Centro, Rio de Janeiro, RJ, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("riofilme", "Rua das Laranjeiras, 307, Laranjeiras, Rio de Janeiro, RJ, 22240-004, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("apan", "Avenida Pompeia, 1770, Vila Pompeia, São Paulo, SP, 05022-001, Brasil", "São Paulo", "SP", "Brasil"),
    ("cartografia-filmes", "Rua Benjamin Constant, 229, Loja 02, Curitiba, PR, Brasil", "Curitiba", "PR", "Brasil"),
    ("cineway", "Rua Antero de Quental, 263, 7º Piso, Estúdio 1, 3000-033 Coimbra, Portugal", "Coimbra", "Coimbra", "Portugal"),
    ("elpauer-comfama", "Carrera 45 #49A-16, Comfama edificio, Medellín, Antioquia, Colombia", "Medellín", "Antioquia", "Colombia"),
    ("william-uricchio-mit", "MIT Open Documentary Lab, MIT Room E15-313, Cambridge, MA, USA", "Cambridge", "MA", "EUA"),
    ("rob-mclaughlin-vancouver", "National Film Board of Canada Digital Studio, 351 Abbott Street Suite 250, Vancouver, BC V6B 0G6, Canada", "Vancouver", "BC", "Canadá"),
    ("rodrigo-samia", "Teatro Rosinha Mastrangelo, Avenida Pinheiro Machado, 48, Vila Mathias, Santos, SP, Brasil", "Santos", "SP", "Brasil"),
    ("jose-carlos-aronchi", "SET EXPO, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("lenildo-gomes", "Universidade Federal do Ceará, Instituto de Cultura e Arte, Fortaleza, CE, Brasil", "Fortaleza", "CE", "Brasil"),
    ("karen-cavalcanti", "Laboratório Fantasma, Rua Conselheiro Moreira de Barros, 1631, Lauzane Paulista, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("fabiane-cristina", "Universidad de Zaragoza, Unidad Predepartamental de Bellas Arte - FCSH, C/Atarazana 4, Centro, 44003 Teruel, Spain", "Teruel", "Aragón", "Espanha"),
    ("case-angatu-xukuru", "Universidade Estadual de Santa Cruz, Ilhéus, BA, Brasil", "Ilhéus", "BA", "Brasil"),
    ("tania-aedo", "Laboratorio Arte Alameda, Mexico City, Mexico", "Ciudad de México", "CDMX", "México"),
    ("hauke-dorsch", "African Music Archives, Johannes Gutenberg University Mainz, Forum universitatis 6, 55099 Mainz, Germany", "Mainz", "Rhineland-Palatinate", "Alemanha"),
    ("ive-rubini", "UNESP, São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("wotec", "Zona Oeste, Rio de Janeiro, RJ, Brasil", "Rio de Janeiro", "RJ", "Brasil"),
    ("monica-rizzolli", "Kassel, Germany", "Kassel", "Hesse", "Alemanha"),
    ("regina-silveira", "São Paulo, SP, Brasil", "São Paulo", "SP", "Brasil"),
    ("shari-frilot", "Park City, UT, USA", "Park City", "UT", "EUA"),
    ("caspar-sonnen", "Amsterdam, Netherlands", "Amsterdam", "Noord-Holland", "Holanda"),
    ("jess-search", "London, United Kingdom", "Londres", "England", "Reino Unido"),
    ("emilio-martinez", "Valencia, Spain", "Valencia", "Comunidad Valenciana", "Espanha"),
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
    addr = item.get("address", {})
    # enrich when available
    if not city and addr.get("city"):
        result["city"] = addr["city"]
    if not state and addr.get("state"):
        result["state"] = addr["state"]
    print(f"[OK] {key}: {result['lat']}, {result['lon']} ({result['display_name'][:60]}...)")
    return result


def main():
    results = []
    for key, address, city, state, country in ADDRESSES:
        result = geocode(key, address, city, state, country)
        if result:
            results.append(result)
        time.sleep(1.1)  # respect Nominatim usage policy

    out_path = Path(__file__).with_name("geocode_results.json")
    out_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(results)} results to {out_path}")


if __name__ == "__main__":
    main()
