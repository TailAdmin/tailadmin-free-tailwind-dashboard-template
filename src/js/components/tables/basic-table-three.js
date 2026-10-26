import Alpine from "alpinejs";
import {
  createTable,
  tableFeatures,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
} from "@tanstack/alpine-table";
import { basicTableThreeData } from "./table-data.js";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
});

export default function basicTableThree(initialData = {}) {
  const local = Alpine.reactive({
    transactions: initialData.items || [...basicTableThreeData],
    searchQuery: "",
    pagination: {
      pageIndex: 0,
      pageSize: initialData.pageSize || 7,
    },
  });

  const columns = [
    { accessorKey: "name", id: "name" },
    { accessorKey: "date", id: "date" },
    { accessorKey: "price", id: "price" },
    { accessorKey: "category", id: "category" },
    { accessorKey: "status", id: "status" },
  ];

  const table = createTable({
    features,
    columns,
    get data() {
      return local.transactions;
    },
    getRowId: (row) => String(row.id),
    state: {
      get globalFilter() {
        return local.searchQuery;
      },
      get pagination() {
        return local.pagination;
      },
    },
    onPaginationChange: (updater) => {
      local.pagination =
        typeof updater === "function" ? updater(local.pagination) : updater;
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();
      if (!query) return true;
      const { name, category, status, price, date } = row.original;
      return (
        String(name || "")
          .toLowerCase()
          .includes(query) ||
        String(category || "")
          .toLowerCase()
          .includes(query) ||
        String(status || "")
          .toLowerCase()
          .includes(query) ||
        String(price || "")
          .toLowerCase()
          .includes(query) ||
        String(date || "")
          .toLowerCase()
          .includes(query)
      );
    },
  });

  return {
    table,
    get searchQuery() {
      return local.searchQuery;
    },
    set searchQuery(val) {
      local.searchQuery = val;
      local.pagination.pageIndex = 0;
    },
    get rows() {
      return table.getRowModel().rows;
    },
    get pageIndex() {
      return local.pagination.pageIndex;
    },
    get currentPage() {
      return this.pageIndex + 1;
    },
    get totalPages() {
      return Math.max(10, table.getPageCount());
    },
    setPage(newPageIndex) {
      if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
        local.pagination.pageIndex = newPageIndex;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.setPage(this.pageIndex - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.pageIndex + 1);
      }
    },
    getPages() {
      const total = this.totalPages;
      const current = this.currentPage;
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      if (current <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis-end", total];
      }
      if (current >= total - 3) {
        return [
          1,
          "ellipsis-start",
          total - 4,
          total - 3,
          total - 2,
          total - 1,
          total,
        ];
      }
      return [
        1,
        "ellipsis-start",
        current - 1,
        current,
        current + 1,
        "ellipsis-end",
        total,
      ];
    },
    statusBadgeColor(status) {
      const s = String(status).toLowerCase();
      if (s === "success") return "success";
      if (s === "pending") return "warning";
      return "error";
    },
  };
}
