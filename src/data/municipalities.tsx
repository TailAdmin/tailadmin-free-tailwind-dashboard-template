import type { Municipality } from "@/types/municipality";

export const municipalityById = {
  malmo: {
    id: "malmo",
    regionCode: "1280",
    name: "Malmö",
    description: "Skånes största stad.",
    population: 360000,
    totalConsumption: 30000000,
    waterLoss: 3000000,
    lastfiveyears: {
      2026: 32320000, 
      2025: 30315000, 
      2024: 22893020,
      2023: 32400000,
      2022: 30054300}
  },
  lund: {
    id: "lund",
    regionCode: "1281",
    name: "Lund",
    description: "En annan kommun i Skåne.",
    population: 131486,
    totalConsumption: 11040000,
    waterLoss: 123000,
    lastfiveyears: {
      2026:11004200,
      2025:9042000,
      2024:12230203,
      2023:11500420,
      2022:12500420
    }
  },
} satisfies Record<string, Municipality>;

export type MunicipalityId = keyof typeof municipalityById;
export const municipalities: Municipality[] = Object.values(municipalityById);