import { basicTableOneData } from "./table-data.js";

export default function basicTableOne(initialData = {}) {
  return {
    orders: initialData.items || [...basicTableOneData],
    getStatusColor(status) {
      const s = String(status).toLowerCase();
      if (s === "active") return "success";
      if (s === "pending") return "warning";
      if (s === "cancel") return "error";
      return "gray";
    },
    getInitials(name) {
      return String(name || "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
    },
  };
}
