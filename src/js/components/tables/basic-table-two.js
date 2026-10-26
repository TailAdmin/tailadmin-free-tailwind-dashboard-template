import Alpine from "alpinejs";
import {
  createTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  createFilteredRowModel,
  filterFns,
} from "@tanstack/alpine-table";
import { basicTableTwoData } from "./table-data.js";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
});

export default function basicTableTwo(initialData = {}) {
  const local = Alpine.reactive({
    orders: initialData.items || [...basicTableTwoData],
    searchQuery: "",
    statusFilter: "all",
    rowSelection: { 1: true },
  });

  const columns = [
    { accessorKey: "dealId", id: "dealId" },
    {
      accessorFn: (row) => `${row.user.name} ${row.user.email}`,
      id: "customer",
    },
    { accessorKey: "productName", id: "productName" },
    { accessorKey: "dealValue", id: "dealValue" },
    { accessorKey: "closeDate", id: "closeDate" },
    { accessorKey: "status", id: "status", filterFn: "equals" },
  ];

  const table = createTable({
    features,
    columns,
    get data() {
      return local.orders;
    },
    getRowId: (row) => String(row.id),
    state: {
      get globalFilter() {
        return local.searchQuery;
      },
      get columnFilters() {
        return local.statusFilter !== "all"
          ? [{ id: "status", value: local.statusFilter }]
          : [];
      },
      get rowSelection() {
        return local.rowSelection;
      },
    },
    onRowSelectionChange: (updater) => {
      local.rowSelection =
        typeof updater === "function" ? updater(local.rowSelection) : updater;
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();
      if (!query) return true;
      const { dealId, user, productName } = row.original;
      return (
        String(dealId || "")
          .toLowerCase()
          .includes(query) ||
        String(user?.name || "")
          .toLowerCase()
          .includes(query) ||
        String(user?.email || "")
          .toLowerCase()
          .includes(query) ||
        String(productName || "")
          .toLowerCase()
          .includes(query)
      );
    },
  });

  return {
    table,
    dropdownOpen: false,
    get searchQuery() {
      return local.searchQuery;
    },
    set searchQuery(val) {
      local.searchQuery = val;
    },
    get statusFilter() {
      return local.statusFilter;
    },
    setStatusFilter(status) {
      local.statusFilter = status;
      this.dropdownOpen = false;
    },
    get rows() {
      return table.getRowModel().rows;
    },
    get isAllSelected() {
      const r = this.rows;
      return (
        r.length > 0 &&
        r.every((row) => Boolean(local.rowSelection[String(row.original.id)]))
      );
    },
    handleSelectAll() {
      const r = this.rows;
      const allSelected = this.isAllSelected;
      const next = { ...local.rowSelection };
      r.forEach((row) => {
        const id = String(row.original.id);
        if (allSelected) {
          delete next[id];
        } else {
          next[id] = true;
        }
      });
      local.rowSelection = next;
    },
    handleRowSelect(id) {
      const key = String(id);
      const next = { ...local.rowSelection };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      local.rowSelection = next;
    },
    isRowSelected(id) {
      return Boolean(local.rowSelection[String(id)]);
    },
    handleDelete(id) {
      local.orders = local.orders.filter(
        (order) => String(order.id) !== String(id),
      );
      const next = { ...local.rowSelection };
      delete next[String(id)];
      local.rowSelection = next;
    },
    statusBadge(status) {
      const s = String(status).toLowerCase();
      if (s === "complete") {
        return { label: "Complete", color: "success" };
      }
      if (s === "pending") {
        return { label: "Pending", color: "warning" };
      }
      return { label: "Cancel", color: "error" };
    },
  };
}
