// Restyle the Master Roadmap Visual Deck onto the XD House palette used by the
// Security & Assurance and CDE Demo decks, so the three read as one set.
//
// Mechanical and reversible: colour values are swapped in the packed XML, and
// AI-tell symbols are removed from slide text. Layout and content untouched.
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("roadmap"); // already-unpacked deck
const files = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".xml")) files.push(p);
  }
}
walk(path.join(SRC, "ppt"));

// Old roadmap palette (Midnight Executive navy) -> XD House palette.
const COLOR_MAP = {
  "1E2761": "23242A", // navy primary            -> charcoal
  "0F1433": "16171B", // darkest navy            -> deeper charcoal
  D4AF37: "C9A227",   // roadmap gold            -> XD gold
  CADCFC: "C8C9D0",   // ice blue                -> neutral light
  F0F0F0: "F4F3F0",   // light grey              -> CDE background
  "606060": "6B6D76", // muted grey              -> CDE muted
  "4CAF50": "2E7D32", // green                   -> CDE ok
  E53935: "C62828",   // red                     -> CDE err
  E97132: "B26A00",   // orange                  -> CDE warn
  "2196F3": "2C5F8A", // blue                    -> CDE STR blue
  "9C27B0": "6A3D9A", // purple                  -> CDE ELE purple
  FFC107: "C9A227",   // amber                   -> XD gold
  "00BCD4": "2C5F8A", // cyan                    -> CDE STR blue
};

let colorHits = 0;
let dotHits = 0;

for (const f of files) {
  let xml = fs.readFileSync(f, "utf8");
  const before = xml;

  for (const [from, to] of Object.entries(COLOR_MAP)) {
    // Match the hex only where it is a colour value, case-insensitively.
    const re = new RegExp(`(val=")${from}(")`, "gi");
    xml = xml.replace(re, (_m, a, b) => {
      colorHits++;
      return a + to + b;
    });
  }

  // Middot separators in titles read as machine-written. Use a spaced pipe,
  // matching the footers in the other two decks.
  if (xml.includes("·")) {
    xml = xml.replace(/\s*·\s*/g, (m) => {
      dotHits++;
      return "  |  ";
    });
  }

  if (xml !== before) fs.writeFileSync(f, xml, "utf8");
}

console.log(`colour values remapped: ${colorHits}`);
console.log(`middot separators replaced: ${dotHits}`);
