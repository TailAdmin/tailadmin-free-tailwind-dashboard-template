import type { list } from "postcss";

export interface Municipality {
  id: string;
  regionCode: string;          
  name: string;
  description: string;
  population: number;          
  totalConsumption: number;    
  waterLoss: number;
  lastfiveyears: Record<number,number>;           
}