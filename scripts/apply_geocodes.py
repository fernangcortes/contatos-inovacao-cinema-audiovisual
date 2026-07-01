#!/usr/bin/env python3
"""Apply final geocodes to existing contacts and generate new contacts file."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"

# key -> one or more existing contact ids to update
UPDATE_MAP = {
    "cinehub": ["cinehub", "georgia-araujo"],
    "spcine-leia": ["spcine-leia", "renato-nery"],
    "klaxon-brlab": ["brlab", "rafael-sampaio"],
    "etc-filmes": ["etc-filmes"],
    "sp-audiovisual-hub": ["sp-audiovisual-hub"],
    "tania-fraga": ["tania-fraga"],
    "olabi": ["olabi", "gabriela-agustini"],
    "ancine": ["ancine", "alex-braga"],
    "bndes": ["bndes"],
    "riofilme": ["riofilme"],
    "futuriste": ["raquel-molina"],  # also will create futuriste entry
    "monica-rizzolli": ["monica-rizzolli"],
    "regina-silveira": ["regina-silveira"],
    "shari-frilot": ["shari-frilot"],
    "caspar-sonnen": ["caspar-sonnen"],
    "jess-search": ["jess-search"],
    "emilio-martinez": ["emilio-martinez"],
    "wotec": ["hugo-lima"],  # also will create wotec entry
}

# IDs for brand-new contacts (from geocode keys not in UPDATE_MAP or handled separately)
NEW_CONTACT_KEYS = [
    "spcine-hq",
    "uview360",
    "laboratorio-fantasma",
    "cinemateca-brasileira",
    "set",
    "legado-tecnologia",
    "mackenzie",
    "faap",
    "phb-eletronica",
    "futuriste",
    "apan",
    "cartografia-filmes",
    "laboratorio-griot",
    "cineway",
    "elpauer-comfama",
    "william-uricchio-mit",
    "rob-mclaughlin-vancouver",
    "rodrigo-samia",
    "jose-carlos-aronchi",
    "lenildo-gomes",
    "karen-cavalcanti",
    "fabiane-cristina",
    "case-angatu-xukuru",
    "tania-aedo",
    "hauke-dorsch",
    "ive-rubini",
    "wotec",
]


def load_geocodes():
    data = json.loads((ROOT / "scripts" / "final_geocodes.json").read_text(encoding="utf-8"))
    return {item["key"]: item for item in data}


def format_location(item):
    lines = [
        "    location: {",
        f"      lat: {item['lat']},",
        f"      lng: {item['lng']},",
        f"      city: '{item['city']}',",
    ]
    if item.get("state"):
        lines.append(f"      state: '{item['state']}',")
    lines.append(f"      country: '{item['country']}',")
    lines.append("    },")
    return "\n".join(lines)


def replace_location(text: str, contact_id: str, location_text: str) -> str:
    # Match location block after the given id's opening object
    # We use a regex that finds the id then the next location: { ... } within the same object.
    # Simpler: find id occurrence, then replace the first location block after it before the next `},` or `  },` that closes the object.
    pattern = re.compile(
        rf"(id: '{re.escape(contact_id)}',.*?)(location: \{{[\s\S]*?\}},)",
        re.DOTALL,
    )
    return pattern.sub(rf"\1{location_text}", text, count=1)


def main():
    geocodes = load_geocodes()

    contacts_ts = (DATA_DIR / "contacts.ts").read_text(encoding="utf-8")
    original = contacts_ts

    updated_ids = set()
    for key, ids in UPDATE_MAP.items():
        item = geocodes.get(key)
        if not item:
            print(f"[WARN] No geocode for update key {key}")
            continue
        loc = format_location(item)
        for cid in ids:
            if f"id: '{cid}'," in contacts_ts:
                contacts_ts = replace_location(contacts_ts, cid, loc)
                updated_ids.add(cid)
            else:
                print(f"[WARN] Contact id {cid} not found in contacts.ts")

    if contacts_ts != original:
        (DATA_DIR / "contacts.ts").write_text(contacts_ts, encoding="utf-8")
        print(f"Updated {len(updated_ids)} existing contact locations in contacts.ts")
    else:
        print("No existing contacts updated")

    # Generate new contacts file
    new_contacts = []
    for key in NEW_CONTACT_KEYS:
        item = geocodes.get(key)
        if not item:
            print(f"[WARN] No geocode for new contact key {key}")
            continue
        new_contacts.append((key, item))

    print(f"Prepared {len(new_contacts)} new contacts (to be written manually)")
    for key, item in new_contacts:
        print(f"  {key}: {item['lat']}, {item['lng']}")


if __name__ == "__main__":
    main()
