import type { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { CalendarAltIcon } from "@/icons";

/* -------------------------------------------------------------------------- */
/*  Typer                                                                     */
/* -------------------------------------------------------------------------- */

/** Minsta gemensamma nämnare: ett datum (YYYY-MM-DD) och ett värde. */
export interface DataPoint {
  date: string;
  value: number;
}

/** En linje/serie i charten. Allt som ska ritas konverteras till detta. */
export interface ChartSeries {
  id: string;
  name: string;
  points: DataPoint[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  waterflow: number;
  waterlevel: number;
  series: DataPoint[];
}

export interface Municipality {
  id: string;
  name: string;
  lastfiveyears: Record<number, number>;
  [key: string]: unknown;
}

export type Granularity = "year" | "month" | "day";
export type Aggregation = "sum" | "avg";

/* -------------------------------------------------------------------------- */
/*  Adaptrar: gör om dina objekt till ChartSeries                              */
/* -------------------------------------------------------------------------- */

export const locationToSeries = (loc: Location): ChartSeries => ({
  id: loc.id,
  name: loc.name,
  points: loc.series,
});

/** lastfiveyears -> en punkt per år (1 januari). Använd granularity="year". */
export const municipalityToSeries = (m: Municipality): ChartSeries => ({
  id: m.id,
  name: m.name,
  points: Object.entries(m.lastfiveyears).map(([year, value]) => ({
    date: `${year}-01-01`,
    value,
  })),
});

/* -------------------------------------------------------------------------- */
/*  Hook för att hämta från API                                               */
/* -------------------------------------------------------------------------- */

/**
 * Hämtar data och mappar den till ChartSeries[].
 *
 * const { series, loading, error } = useChartData<Location[]>(
 *   "/api/locations",
 *   (locations) => locations.map(locationToSeries),
 * );
 */
export function useChartData<T>(url: string, map: (raw: T) => ChartSeries[]) {
  const [series, setSeries] = useState<ChartSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((raw) => setSeries(mapRef.current(raw)))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  return { series, loading, error };
}

/* -------------------------------------------------------------------------- */
/*  Hjälpfunktioner                                                           */
/* -------------------------------------------------------------------------- */

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const keyLength: Record<Exclude<Granularity, "day">, number> = {
  year: 4,
  month: 7,
};

function aggregate(
  points: DataPoint[],
  granularity: Exclude<Granularity, "day">,
  mode: Aggregation,
): Map<string, number> {
  const groups = new Map<string, number[]>();
  for (const p of points) {
    const key = p.date.slice(0, keyLength[granularity]);
    const list = groups.get(key) ?? [];
    list.push(p.value);
    groups.set(key, list);
  }
  const result = new Map<string, number>();
  groups.forEach((values, key) => {
    const sum = values.reduce((a, b) => a + b, 0);
    result.set(key, mode === "sum" ? sum : sum / values.length);
  });
  return result;
}

const round = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------- */
/*  Komponent                                                                 */
/* -------------------------------------------------------------------------- */

interface WaterFlowChartProps {
  series: ChartSeries[];
  title?: string;
  subtitle?: string;
  /** Enhet som visas i tooltip och på y-axeln, t.ex. "l/s" eller "m³". */
  unit?: string;
  /** Vilka vyer användaren kan växla mellan. */
  granularities?: Granularity[];
  defaultGranularity?: Granularity;
  /** Hur värden slås ihop i år-/månadsvy. Flöde (l/s) = "avg", volym = "sum". */
  aggregation?: Aggregation;
  loading?: boolean;
  error?: string | null;
  height?: number;
  colors?: string[];
}

export default function WaterFlowChart({
  series,
  title,
  subtitle,
  unit = "l/s",
  granularities = ["month", "day"],
  defaultGranularity = "month",
  aggregation = "avg",
  loading = false,
  error = null,
  height = 310,
  colors = ["#465FFF", "#9CB9FF", "#12B76A", "#F79009"],
}: WaterFlowChartProps) {
  const { t, i18n } = useTranslation();
  const [granularity, setGranularity] = useState<Granularity>(
    granularities.includes(defaultGranularity)
      ? defaultGranularity
      : granularities[0],
  );
  const [range, setRange] = useState<[string, string] | null>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);

  /* Äldsta och nyaste datum i all data (för datumväljaren) */
  const bounds = useMemo(() => {
    const dates = series.flatMap((s) => s.points.map((p) => p.date));
    if (dates.length === 0) return null;
    dates.sort();
    return { min: dates[0], max: dates[dates.length - 1] };
  }, [series]);

  /* Standard: de senaste 30 dagarna i datan, om användaren inte valt något */
  const effectiveRange = useMemo<[string, string] | null>(() => {
    if (range) return range;
    if (!bounds) return null;
    const end = new Date(bounds.max);
    const start = new Date(end);
    start.setDate(end.getDate() - 29);
    const startYmd = toYmd(start);
    return [startYmd < bounds.min ? bounds.min : startYmd, bounds.max];
  }, [range, bounds]);

  /* Datumväljare (visas bara i dagsvy) */
  useEffect(() => {
    if (granularity !== "day" || !datePickerRef.current || !bounds) return;

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      minDate: bounds.min,
      maxDate: bounds.max,
      defaultDate: effectiveRange ?? undefined,
      onChange: (dates) => {
        if (dates.length === 2) setRange([toYmd(dates[0]), toYmd(dates[1])]);
      },
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };
    // effectiveRange medvetet utelämnad: flatpickr äger sitt eget läge efter init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granularity, bounds]);

  /* Bygg ApexCharts-serier */
  const { apexSeries, categories } = useMemo(() => {
    if (granularity === "day") {
      const [from, to] = effectiveRange ?? ["", ""];
      return {
        categories: undefined,
        apexSeries: series.map((s) => ({
          name: s.name,
          data: s.points
            .filter((p) => p.date >= from && p.date <= to)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((p) => ({ x: Date.parse(p.date), y: round(p.value) })),
        })),
      };
    }

    const perSeries = series.map((s) => ({
      name: s.name,
      map: aggregate(s.points, granularity, aggregation),
    }));
    const keys = Array.from(
      new Set(perSeries.flatMap((s) => Array.from(s.map.keys()))),
    ).sort();

    return {
      categories: keys,
      apexSeries: perSeries.map((s) => ({
        name: s.name,
        data: keys.map((k) => {
          const v = s.map.get(k);
          return v === undefined ? null : round(v);
        }),
      })),
    };
  }, [series, granularity, aggregation, effectiveRange]);

  const formatCategory = (key: string) => {
    if (granularity === "year") return key;
    const [y, m] = key.split("-").map(Number);
    return new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      year: "2-digit",
    }).format(new Date(y, m - 1, 1));
  };

  const options: ApexOptions = {
    colors,
    legend: {
      show: series.length > 1,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    chart: {
      fontFamily: "Outfit, sans-serif",
      height,
      type: granularity === "day" ? "area" : "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: series.length > 1 ? "60%" : "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    stroke:
      granularity === "day"
        ? { curve: "straight", width: series.map(() => 2) }
        : { show: true, width: 4, colors: ["transparent"] },
    fill:
      granularity === "day"
        ? { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0 } }
        : { opacity: 1 },
    markers: { size: 0, hover: { size: 5 } },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      x: granularity === "day" ? { format: "dd MMM yyyy" } : undefined,
      y: { formatter: (v) => (v == null ? "–" : `${v} ${unit}`) },
    },
    xaxis:
      granularity === "day"
        ? {
            type: "datetime",
            labels: { datetimeUTC: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
          }
        : {
            type: "category",
            categories: categories?.map(formatCategory),
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
          },
    yaxis: {
      title: { text: unit, style: { fontSize: "12px", color: "#6B7280" } },
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (v) => String(Math.round(v)),
      },
    },
    noData: { text: t("chart.noData", "Ingen data för vald period") },
  };

  const granularityLabel: Record<Granularity, string> = {
    year: t("chart.year", "År"),
    month: t("chart.month", "Månad"),
    day: t("chart.day", "Dag"),
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          {granularities.length > 1 && (
            <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              {granularities.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGranularity(g)}
                  className={`rounded-md px-3 py-2 text-theme-sm font-medium ${
                    granularity === g
                      ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {granularityLabel[g]}
                </button>
              ))}
            </div>
          )}

          {granularity === "day" && (
            <div className="relative inline-flex items-center">
              <CalendarAltIcon className="pointer-events-none absolute inset-s-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-gray-500 lg:inset-s-3 lg:translate-x-0 rtl:translate-x-1/2 rtl:lg:translate-x-0 dark:text-gray-400" />
              <input
                ref={datePickerRef}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent outline-none lg:h-auto lg:w-56 lg:py-2 lg:ps-10 lg:pe-3 lg:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300"
                placeholder={t("chart.selectDateRange", "Välj period")}
              />
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="py-16 text-center text-sm text-error-500">
          {t("chart.error", "Kunde inte hämta data")}: {error}
        </p>
      ) : loading ? (
        <div
          className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
          style={{ height }}
        />
      ) : (
        <div className="custom-scrollbar max-w-full overflow-x-auto">
          <div className="min-w-250 xl:min-w-full">
            {/* key tvingar fram en ren omritning när diagramtypen byts */}
            <Chart
              key={granularity}
              options={options}
              series={apexSeries}
              type={granularity === "day" ? "area" : "bar"}
              height={height}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exempeldata: ett helt år (2025) med dagliga värden                         */
/* -------------------------------------------------------------------------- */

/** Deterministisk pseudoslump så att exempeldatan är densamma vid varje rendering. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Dagligt flöde med säsongsvariation (högre på sommaren) och lite brus. */
export function generateYearSeries(
  year: number,
  base: number,
  seed: number,
): DataPoint[] {
  const rand = seeded(seed);
  const points: DataPoint[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(year, 0, 0).getTime()) / 86_400_000,
    );
    const season = 1 + 0.25 * Math.sin(((dayOfYear - 100) / 365) * 2 * Math.PI);
    const noise = 0.9 + rand() * 0.2;
    points.push({ date: toYmd(d), value: round(base * season * noise) });
    d.setDate(d.getDate() + 1);
  }
  return points;
}

export const sampleLocations: Location[] = [
  {
    id: "verket-norr",
    name: "Vattenverket Norr",
    description: "Utgående flöde från vattenverket.",
    waterflow: 520,
    waterlevel: 4.2,
    series: generateYearSeries(2025, 520, 1),
  },
  {
    id: "hogreservoar",
    name: "Högreservoaren",
    description: "Flöde ut till distributionsnätet.",
    waterflow: 340,
    waterlevel: 6.8,
    series: generateYearSeries(2025, 340, 2),
  },
  {
    id: "pumpstation-syd",
    name: "Pumpstation Syd",
    description: "Pumpat flöde mot södra stadsdelarna.",
    waterflow: 190,
    waterlevel: 2.1,
    series: generateYearSeries(2025, 190, 3),
  },
];

/* -------------------------------------------------------------------------- */
/*  Användningsexempel                                                        */
/* -------------------------------------------------------------------------- */

/*
// 1) Med exempeldata
<WaterFlowChart
  title="Vattenflöden"
  subtitle="Jämför flöde per mätpunkt"
  unit="l/s"
  series={sampleLocations.map(locationToSeries)}
/>

// 2) Från ditt API
const { series, loading, error } = useChartData<Location[]>(
  "/api/locations",
  (locations) => locations.map(locationToSeries),
);
<WaterFlowChart series={series} loading={loading} error={error} unit="l/s" />

// 3) Kommundata (årsvis, summerad volym)
<WaterFlowChart
  title="Förbrukning per år"
  unit="m³"
  series={[municipalityToSeries(municipalityById.malmo)]}
  granularities={["year"]}
  defaultGranularity="year"
  aggregation="sum"
/>
*/
