// src/components/SydvattenKPI/MunicipalityDetails.tsx
import type { Municipality } from "@/types/municipality";

const nf = new Intl.NumberFormat("sv-SE");

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-white/90">{value}</span>
    </div>
  );
}

export default function MunicipalityDetails({
  municipality,
}: {
  municipality?: Municipality;
}) {
  if (!municipality) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Hovra över en kommun för att se data.
      </p>
    );
  }

  // Beräknade värden, detta ska vara från API senare
  const litersPerPersonPerDay =
    (municipality.totalConsumption * 1000) / municipality.population / 365;

  const years = Object.entries(municipality.lastfiveyears)
    .map(([year, value]) => ({ year: Number(year), value }))
    .sort((a, b) => b.year - a.year); // nyaste först

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {municipality.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {municipality.description}
      </p>

      <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
        <Row label="Befolkning" value={nf.format(municipality.population)} />
        <Row
          label="Totalt mottaget vatten i år"
          value={`${nf.format(municipality.totalConsumption)} m³`}
        />
        <Row
          label="Beräknad vattenförlust i år"
          value={`${nf.format(municipality.waterLoss)} m³/år`}
        />
        <Row
          label="Förbrukning per person"
          value={`${Math.round(litersPerPersonPerDay)} l/dag`}
        />
      </div>

      <h4 className="mt-6 text-sm font-semibold text-gray-800 dark:text-white/90">
        Mottaget vatten de senaste 5 åren
      </h4>
      <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-800">
        {years.map(({ year, value }) => (
          <Row key={year} label={String(year)} value={`${nf.format(value)} m³`} />
        ))}
      </div>
    </div>
  );
}