import ApexCharts from "apexcharts";

const series = [
  {
    name: "Sales",
    data: [230, 310, 270, 390, 210, 170, 260, 270, 150, 80, 180, 120],
  },
];

const barChart01 = () => {
  const el = document.querySelector("#chartBarOne");
  if (!el) return;

  const getOptions = (isDark) => ({
    series,
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "38%",
        borderRadius: 8,
        borderRadiusApplication: "around",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${(val / 100).toFixed(1)}%`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 400,
        colors: [isDark ? "#94A3B8" : "#364153"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? "#94A3B8" : "#364153",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      max: 420,
      min: 0,
      tickAmount: 4,
      labels: {
        show: false,
      },
    },
    grid: {
      borderColor: isDark ? "#1E2640" : "#F3F4F6",
      strokeDashArray: 0,
      padding: {
        left: -10,
        right: 0,
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#7592FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "#465FFF",
            opacity: 1,
          },
        ],
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val) => `${(val / 100).toFixed(1)}%`,
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

export default barChart01;
