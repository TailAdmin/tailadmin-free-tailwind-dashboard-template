import { basicTableFiveData } from "./table-data.js";

export default function basicTableFive(initialData = {}) {
  return {
    orders: initialData.items || [...basicTableFiveData],
  };
}
