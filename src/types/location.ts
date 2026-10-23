export interface Location {
  id: string;
  name: string;
  description: string;
  waterflow: number;
  waterlevel: number;               
  series: { date: string; value: number }[];
}
