const BASE = "https://www.arla.dk";

// Måneder og deres tagIds fra råvarekalenderen
const MONTHS = {
  januar: ["tdb:7851", "tdb:7796"],
  februar: ["tdb:7797", "tdb:7851"],
  marts: ["tdb:7798", "tdb:7851"],
  april: ["tdb:7799", "tdb:7851"],
  maj: ["tdb:7800", "tdb:7851"],
  juni: ["tdb:7801", "tdb:7851"],
  juli: ["tdb:7802", "tdb:7851"],
  august: ["tdb:7803", "tdb:7851"],
  september: ["tdb:7804", "tdb:7851"],
  oktober: ["tdb:7805", "tdb:7851"],
  november: ["tdb:7806", "tdb:7851"],
  december: ["tdb:7807", "tdb:7851"],
};

// Hent CSRF token og session-cookies fra forsiden
async function getSession() {
  const res = await fetch(`${BASE}/opskrifter/ravarekalender/`);
  const html = await res.text();
  const match = html.match(/id="RequestVerificationToken"[^>]*value="([^"]+)"/);
  if (!match) throw new Error("Kunne ikke finde CSRF token");
  const token = match[1];
  const cookies = res.headers.getSetCookie?.() ?? [];
  const cookieHeader = cookies.map((c) => c.split(";")[0]).join("; ");
  return { token, cookieHeader };
}

// Hent råvarer for en given måned
async function getRaavarer(maaned) {
  const tagUids = MONTHS[maaned.toLowerCase()];
  if (!tagUids)
    throw new Error(
      `Ukendt måned: ${maaned}. Brug: ${Object.keys(MONTHS).join(", ")}`,
    );

  const { token, cookieHeader } = await getSession();

  const res = await fetch(`${BASE}/cvi/publisher/api/da/cards`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      requestverificationtoken: token,
      cookie: cookieHeader,
      Referer: `${BASE}/opskrifter/ravarekalender/`,
    },
    body: JSON.stringify({
      take: 100,
      skip: 0,
      tagUids,
      excludedUids: [],
      order: "alphabetical",
      contentType: "Article",
    }),
  });

  if (!res.ok) throw new Error(`API fejl: ${res.status} ${res.statusText}`);
  return res.json();
}

// --- Main ---
const maaned = process.argv[2] ?? "april";
console.log(`Henter råvarer i sæson i ${maaned}...\n`);

const data = await getRaavarer(maaned);
const raavarer = data.cards ?? data;

console.log(`Fandt ${raavarer.length} råvarer:\n`);
for (const r of raavarer) {
  console.log(`${r.heading}`);
}
