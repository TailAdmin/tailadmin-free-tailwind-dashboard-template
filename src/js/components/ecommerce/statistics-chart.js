import ApexCharts from "apexcharts";
import flatpickr from "flatpickr";

// ===== Statistics Chart (Ecommerce Dashboard)
const statisticsChart = () => {
  const chartSelector = document.querySelectorAll("#statisticsChart");
  if (!chartSelector.length) return;

  const categories12Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sales12Months = [
    180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235,
  ];

  const revenue12Months = [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140];

  let currentTab = "overview";
  let activeCategories = [...categories12Months];
  let activeSalesData = [...sales12Months];
  let activeRevenueData = [...revenue12Months];

  const isDarkMode = () => document.documentElement.classList.contains("dark");

  const getSeriesAndColors = (tab) => {
    if (tab === "sales") {
      return {
        series: [
          {
            name: "Sales",
            data: activeSalesData,
          },
        ],
        colors: ["#465FFF"],
      };
    }

    if (tab === "revenue") {
      return {
        series: [
          {
            name: "Revenue",
            data: activeRevenueData,
          },
        ],
        colors: ["#9CB9FF"],
      };
    }

    // Default: overview (both series)
    return {
      series: [
        {
          name: "Sales",
          data: activeSalesData,
        },
        {
          name: "Revenue",
          data: activeRevenueData,
        },
      ],
      colors: ["#465FFF", "#9CB9FF"],
    };
  };

  const initialConfig = getSeriesAndColors(currentTab);

  const options = {
    series: initialConfig.series,
    colors: initialConfig.colors,
    legend: {
      show: false,
    },
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: isDarkMode() ? "#1E2640" : "#F3F4F6",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      custom: function ({ series, dataPointIndex, w }) {
        const category =
          w.globals?.categoryLabels?.[dataPointIndex] ??
          w.config.xaxis?.categories?.[dataPointIndex] ??
          "";
        const seriesList = w.config.series;
        const colors = w.config.colors;

        const itemsHtml = seriesList
          .map((s, idx) => {
            const val = series[idx]?.[dataPointIndex];
            if (val === undefined || val === null) return "";
            const formattedVal =
              typeof val === "number" ? val.toLocaleString() : (val ?? "");
            const color = colors[idx] || "#465FFF";
            return `
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="size-1.5 rounded-full shrink-0" style="background-color: ${color}"></span>
                  <span class="text-xs text-gray-800 dark:text-white/90">${s.name}</span>
                  <span class="text-xs font-medium text-gray-400 dark:text-gray-500">:</span>
                </div>
                <span class="text-xs font-medium text-gray-800 dark:text-white/90">${formattedVal}</span>
              </div>
            `;
          })
          .join("");

        return `
          <div class="min-w-32.5 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-theme-md border border-gray-200 dark:border-gray-800 space-y-1">
            <p class="mb-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">${category}</p>
            ${itemsHtml}
          </div>
        `;
      },
    },
    xaxis: {
      type: "category",
      categories: activeCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: true,
        width: 2,
        position: "back",
        opacity: 1,
        stroke: {
          width: 0,
          color: "none",
        },
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: isDarkMode() ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
            colorTo: "#9CB9FF",
            stops: [0, 100],
            opacityFrom: 1,
            opacityTo: 1,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
          colors: isDarkMode() ? "#94A3B8" : "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
          colors: isDarkMode() ? "#94A3B8" : "#6B7280",
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const chart = new ApexCharts(
    document.querySelector("#statisticsChart"),
    options,
  );
  chart.render();

  // Watch for theme changes (light/dark mode toggle)
  const themeObserver = new MutationObserver(() => {
    const dark = isDarkMode();
    chart.updateOptions({
      grid: {
        borderColor: dark ? "#1E2640" : "#F3F4F6",
      },
      xaxis: {
        labels: {
          style: {
            colors: dark ? "#94A3B8" : "#6B7280",
          },
        },
        crosshairs: {
          fill: {
            gradient: {
              colorFrom: dark ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
            },
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: dark ? "#94A3B8" : "#6B7280",
          },
        },
      },
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const filterDataByDateRange = (selectedDates) => {
    if (!selectedDates || selectedDates.length < 2) {
      // Reset to 12 months
      activeCategories = [...categories12Months];
      activeSalesData = [...sales12Months];
      activeRevenueData = [...revenue12Months];
      return;
    }

    const [startDate, endDate] = selectedDates;
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    // If span covers different months
    if (startYear !== endYear || startMonth !== endMonth) {
      const fromMonth = Math.min(startMonth, endMonth);
      const toMonth = Math.max(startMonth, endMonth);

      activeCategories = categories12Months.slice(fromMonth, toMonth + 1);
      activeSalesData = sales12Months.slice(fromMonth, toMonth + 1);
      activeRevenueData = revenue12Months.slice(fromMonth, toMonth + 1);
    } else {
      // Within the same month, show days
      const daysDiff = Math.max(
        2,
        Math.min(
          31,
          Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
        ),
      );
      const monthName = startDate.toLocaleString("default", {
        month: "short",
      });
      const startDay = startDate.getDate();

      activeCategories = [];
      activeSalesData = [];
      activeRevenueData = [];

      const baseSales = sales12Months[startMonth] || 180;
      const baseRevenue = revenue12Months[startMonth] || 50;

      for (let i = 0; i < daysDiff; i++) {
        activeCategories.push(`${monthName} ${startDay + i}`);
        // Calculate realistic variations
        const salesVariation = Math.round(
          baseSales * 0.2 * Math.sin((i / daysDiff) * Math.PI) +
            ((i * 17) % 25) -
            10,
        );
        const revenueVariation = Math.round(
          baseRevenue * 0.25 * Math.cos((i / daysDiff) * Math.PI) +
            ((i * 11) % 15) -
            5,
        );

        activeSalesData.push(
          Math.max(20, Math.round(baseSales / 3 + salesVariation)),
        );
        activeRevenueData.push(
          Math.max(10, Math.round(baseRevenue / 3 + revenueVariation)),
        );
      }
    }
  };

  // Expose global update method for Alpine & Flatpickr
  window.updateStatisticsChart = ({ tab, dateRange }) => {
    if (tab) {
      currentTab = tab;
    }

    if (dateRange) {
      filterDataByDateRange(dateRange);
    }

    const { series, colors } = getSeriesAndColors(currentTab);

    chart.updateOptions({
      xaxis: {
        categories: activeCategories,
      },
      colors: colors,
    });
    chart.updateSeries(series);
  };

  // Initialize Flatpickr on #statisticsChartDatePicker
  const datePickerEl = document.querySelector("#statisticsChartDatePicker");
  if (datePickerEl) {
    flatpickr(datePickerEl, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M j",
      prevArrow:
        '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.25 6L9 12.25L15.25 18.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 19L15 12.75L8.75 6.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      onReady(selectedDates, dateStr, instance) {
        instance.element.value = dateStr.replace("to", "-");
        const customClass = instance.element.getAttribute("data-class");
        if (instance.calendarContainer && customClass) {
          instance.calendarContainer.classList.add(customClass);
        }
      },
      onChange(selectedDates, dateStr, instance) {
        instance.element.value = dateStr.replace("to", "-");
        if (window.updateStatisticsChart) {
          window.updateStatisticsChart({ dateRange: selectedDates });
        }
      },
    });
  }
};

export default statisticsChart;
