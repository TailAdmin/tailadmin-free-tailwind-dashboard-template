import ApexCharts from "apexcharts";

// ===== Monthly Target Chart (Ecommerce Dashboard)
const monthlyTargetChart = () => {
  const chartSelector = document.querySelectorAll("#monthlyTargetChart");
  if (!chartSelector.length) return;

  const isDarkMode = () =>
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark");

  const getOptions = (dark) => ({
    series: [75.55],
    colors: ["#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "80%",
        },
        track: {
          background: dark ? "#1C243D" : "#E8EAEE",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: dark ? "#FFFFFF" : "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#465FFF"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#9CB9FF",
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
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  });

  const chart = new ApexCharts(
    document.querySelector("#monthlyTargetChart"),
    getOptions(isDarkMode()),
  );
  chart.render();

  const observer = new MutationObserver(() => {
    chart.updateOptions(getOptions(isDarkMode()));
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
};

export default monthlyTargetChart;
