import ApexCharts from "apexcharts";

const categories = [
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

const series = [
  {
    name: "Sales",
    data: [0, 35, 28, 48, 45, 55, 62, 70, 92, 105, 125, 150],
  },
];

const lineChart02 = () => {
  const el = document.querySelector("#chartLineTwo");
  if (!el) return;

  const getOptions = (isDark) => ({
    series,
    legend: {
      show: false,
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      width: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      colors: ["#ffffff"],
      strokeColors: ["#465FFF"],
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    grid: {
      position: "back",
      borderColor: isDark ? "#1E2640" : "#F3F4F6",
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
      custom: function ({ series: chartSeries, dataPointIndex, w }) {
        const category =
          w.globals?.categoryLabels?.[dataPointIndex] ??
          w.config.xaxis?.categories?.[dataPointIndex] ??
          "";
        const colors = w.config.colors ?? ["#465FFF"];
        const seriesList = w.config.series ?? [];

        const rows = seriesList
          .map((s, idx) => {
            const val = chartSeries[idx]?.[dataPointIndex];
            const color = colors[idx] ?? "#465FFF";
            const formattedVal =
              typeof val === "number" ? val.toLocaleString() : (val ?? "");
            return `
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="size-1.5 rounded-full shrink-0" style="background-color: ${color}"></span>
                    <span class="w-13 text-xs text-gray-800 dark:text-white/90">${s.name ?? ""}</span>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">:</span>
                  </div>
                  <span class="text-xs font-medium text-gray-800 dark:text-white/90">${formattedVal}</span>
                </div>
              `;
          })
          .join("");

        return `
            <div class="min-w-32.5">
              <p class="mb-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">${category}</p>
              <div class="flex flex-col gap-1">
                ${rows}
              </div>
            </div>
          `;
      },
    },
    xaxis: {
      type: "category",
      categories,
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
            colorFrom: isDark ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
            colorTo: "#9CB9FF",
            stops: [0, 100],
            opacityFrom: 1,
            opacityTo: 1,
          },
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
          colors: isDark ? "#94A3B8" : "#6B7280",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
          colors: isDark ? "#94A3B8" : "#6B7280",
        },
      },
      title: {
        text: undefined,
      },
    },
  });

  const isDarkMode = () =>
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark");

  const chart = new ApexCharts(el, getOptions(isDarkMode()));
  chart.render();

  const observer = new MutationObserver(() => {
    chart.updateOptions(getOptions(isDarkMode()));
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
};

export default lineChart02;
