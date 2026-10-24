export interface Location {
  id: string;
  name: string;
  description: string;
  waterflow: number;
  waterlevel: number;               
  series: { date: string; value: number }[];
}
export interface Location {
  id: string;
  regionCode: string;          
  name: string;
  description: string;
  population: number;          
  totalConsumption: number;    
  waterLoss: number;           
}