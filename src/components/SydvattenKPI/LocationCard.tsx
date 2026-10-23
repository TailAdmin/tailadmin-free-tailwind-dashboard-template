import type { Location } from "@/types/location";

export default function LocationCard({ location }: { location: Location }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {location.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {location.description}
      </p>
      <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">
        Vattenflöde: {location.waterflow} m³/s <br></br>
        Vattennivå: {location.waterlevel} meter över havet
      </p>
    </div>
  );
}