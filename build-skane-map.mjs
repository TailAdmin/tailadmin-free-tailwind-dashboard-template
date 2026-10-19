// Användning:
//   node build-skane-map.mjs kommuner.geojson skane-map.js
//
// Läser en GeoJSON med Sveriges kommuner, behåller lan_code "12" (Skåne),
// förenklar gränserna och skriver en jsvectormap-karta med namnet "skane".

import fs from "node:fs";

const [, , input = "kommuner.geojson", output = "skane-map.js"] = process.argv;

const LAN_CODE = "12"; // Skåne län
const WIDTH = 900; // kartans bredd i SVG-enheter (höjden räknas ut)
const TOLERANCE = 0.0004; // förenkling i grader (~40 m). Högre = grövre men mindre fil

// Samma projektion som jsvectormap kallar "mill"
const R = 6381372;
const RAD = Math.PI / 180;
const mill = (lng, lat) => ({
  x: R * lng * RAD,
  y: (-R * Math.log(Math.tan((45 + 0.4 * lat) * RAD))) / 0.8,
});

// Douglas-Peucker
function simplify(points, tol) {
  if (points.length <= 2) return points;
  const sqTol = tol * tol;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];

  const sqSegDist = (p, a, b) => {
    let x = a[0], y = a[1];
    let dx = b[0] - x, dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; }
      else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  };

  while (stack.length) {
    const [first, last] = stack.pop();
    let max = sqTol, index = -1;
    for (let i = first + 1; i < last; i++) {
      const d = sqSegDist(points[i], points[first], points[last]);
      if (d > max) { index = i; max = d; }
    }
    if (index > -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const geo = JSON.parse(fs.readFileSync(input, "utf8"));
const features = geo.features.filter((f) => f.properties.lan_code === LAN_CODE);
if (!features.length) {
  console.error(`Inga kommuner med lan_code "${LAN_CODE}" hittades.`);
  process.exit(1);
}

// Gör om varje kommun till en lista ringar (yttre ringar och hål)
const munis = features.map((f) => {
  const polys =
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const rings = [];
  for (const poly of polys) {
    for (const ring of poly) {
      const s = simplify(ring, TOLERANCE);
      if (s.length >= 4) rings.push(s.map(([lng, lat]) => mill(lng, lat)));
    }
  }
  return { id: f.properties.id, name: f.properties.kom_namn, rings };
});

// Bounding box i projicerade koordinater
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const m of munis)
  for (const ring of m.rings)
    for (const p of ring) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

const scale = WIDTH / (maxX - minX);
const HEIGHT = +((maxY - minY) * scale).toFixed(2);
const r = (n) => +n.toFixed(2);

const paths = {};
for (const m of munis) {
  const d = m.rings
    .map(
      (ring) =>
        "M" +
        ring.map((p) => `${r((p.x - minX) * scale)},${r((p.y - minY) * scale)}`).join("L") +
        "Z"
    )
    .join("");
  paths[m.id] = { name: m.name, path: d };
}

const map = {
  insets: [
    {
      width: WIDTH,
      height: HEIGHT,
      top: 0,
      left: 0,
      bbox: [
        { x: minX, y: minY },
        { x: maxX, y: maxY },
      ],
    },
  ],
  paths,
  height: HEIGHT,
  width: WIDTH,
  projection: { type: "mill" },
};

const out = `import jsVectorMap from "jsvectormap";

jsVectorMap.addMap("skane", ${JSON.stringify(map)});
`;

fs.writeFileSync(output, out);
console.log(
  `${munis.length} kommuner -> ${output} (${(out.length / 1024).toFixed(0)} kB, ${WIDTH}x${HEIGHT})`
);
