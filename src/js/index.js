import "dropzone/dist/dropzone.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.min.css";
import "../css/style.css";

import persist from "@alpinejs/persist";
import Alpine from "alpinejs";
import Dropzone from "dropzone";
import flatpickr from "flatpickr";
import { setupI18n } from "./i18n";

import "./components/calendar-init.js";
import chart01 from "./components/charts/chart-01";
import chart02 from "./components/charts/chart-02";
import chart03 from "./components/charts/chart-03";
import monthlySalesChart from "./components/ecommerce/monthly-sales-chart";
import monthlyTargetChart from "./components/ecommerce/monthly-target-chart";
import statisticsChart from "./components/ecommerce/statistics-chart";
import "./components/image-resize";
import map01 from "./components/map-01";
import customerPinPointMap from "./components/maps/vector/customer-pin-point-map";
import dropdown from "./components/ui/dropdown";
import popover from "./components/ui/popover";
import tooltip from "./components/ui/tooltip";

// TailAdmin Theme Manager: reads from localStorage, falls back to dark
(function () {
  var stored = localStorage.getItem("darkMode");
  var isDark = stored !== null ? JSON.parse(stored) : false;

  if (isDark) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-color-scheme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-color-scheme", "light");
  }
})();

Alpine.plugin(persist);
window.Alpine = Alpine;

// Setup i18next & Alpine reactive integration
setupI18n(Alpine);

// Register UI component models
Alpine.data("dropdown", dropdown);
Alpine.data("tooltip", tooltip);
Alpine.data("popover", popover);

Alpine.start();

// Init flatpickr
flatpickr(".datepicker", {
  mode: "range",
  static: true,
  monthSelectorType: "static",
  dateFormat: "M j",
  defaultDate: [new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), new Date()],
  prevArrow:
    '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.25 6L9 12.25L15.25 18.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  nextArrow:
    '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 19L15 12.75L8.75 6.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  onReady: (selectedDates, dateStr, instance) => {
    instance.element.value = dateStr.replace("to", "-");
    const customClass = instance.element.getAttribute("data-class");
    if (instance.calendarContainer && customClass) {
      instance.calendarContainer.classList.add(customClass);
    }
  },
  onChange: (selectedDates, dateStr, instance) => {
    instance.element.value = dateStr.replace("to", "-");
  },
});

// Init Dropzone
const dropzoneArea = document.querySelectorAll("#demo-upload");

if (dropzoneArea.length) {
  new Dropzone("#demo-upload", { url: "/file/post" });
}

// Document Loaded
document.addEventListener("DOMContentLoaded", () => {
  monthlySalesChart();
  monthlyTargetChart();
  statisticsChart();
  customerPinPointMap();
  chart01();
  chart02();
  chart03();
  map01();
});

// Get the current year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// For Copy//
document.addEventListener("DOMContentLoaded", () => {
  const copyInput = document.getElementById("copy-input");
  if (copyInput) {
    const copyButton = document.getElementById("copy-button");
    const copyText = document.getElementById("copy-text");
    const websiteInput = document.getElementById("website-input");

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(websiteInput.value).then(() => {
        copyText.textContent = "Copied";
        setTimeout(() => {
          copyText.textContent = "Copy";
        }, 2000);
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (!searchInput || !searchButton) return;

  function focusSearchInput() {
    searchInput.focus();
  }

  searchButton.addEventListener("click", focusSearchInput);

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      focusSearchInput();
    }
  });
});
