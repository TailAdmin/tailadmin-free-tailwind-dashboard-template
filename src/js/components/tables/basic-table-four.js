import { basicTableFourData } from "./table-data.js";

export default function basicTableFour(initialData = {}) {
  return {
    campaigns: initialData.items || [...basicTableFourData],
    dropdownOpen: false,
    getStatusColor(status) {
      const s = String(status).toLowerCase();
      if (s === "success") return "success";
      if (s === "pending") return "warning";
      return "error";
    },
  };
}
