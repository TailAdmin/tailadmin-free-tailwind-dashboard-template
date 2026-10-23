import type { Location } from "@/types/location";

export const locationById = {
  kavlingean: {
    id: "kavlingean",
    name: "Kävlingeån",
    description: "Rinner genom mellersta Skåne.",
    waterflow: 12.4,
    waterlevel: 14,
    series: [],
  },
  helgean: {
    id: "helgean",
    name: "Helgeån",
    description: "Rinner mot Hanöbukten.",
    waterflow: 31.8,
    waterlevel: 14,
    series: [],
  },
  vomb: {
    id: "vomb",
    name: "Vombsjön",
    description: "Stor sjö i Lunds kommun.",
    waterflow: 31.8,
    waterlevel: 14,
    series: [],
  },
  ringsjon: {
    id: "ringsjon",
    name: "Ringsjön",
    description: "Ser ut som en ring typ.",
    waterflow: 12.8,
    waterlevel: 33,
    series: [],
  },
  bolmen: {
    id: "bolmen",
    name: "Bolmen",
    description: "Bolmar rök.",
    waterflow: 7.8,
    waterlevel: 130,
    series: [],
  },
} satisfies Record<string, Location>;

export type LocationId = keyof typeof locationById