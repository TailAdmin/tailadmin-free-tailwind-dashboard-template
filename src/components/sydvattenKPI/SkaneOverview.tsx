"use client";
import { useState } from "react";
import SkaneMap from "./SkaneMap";
import MunicipalityDetails from "./MunicipalityDetails";
import { municipalities } from "@/data/municipalities";

export default function SkaneOverview() {
  const [code, setCode] = useState<string | null>(null);
  const hovered = municipalities.find((m) => m.regionCode === code);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="relative h-[500px] min-w-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <SkaneMap onHover={setCode} />
  </div>
      <aside className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
      <MunicipalityDetails municipality={hovered} />
    </aside>
    </div>
  );
}