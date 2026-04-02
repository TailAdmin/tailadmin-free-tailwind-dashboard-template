import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world";

const map01 = () => {
  const mapSelectorOne = document.querySelectorAll("#mapOne");

  if (mapSelectorOne.length) {
    const mapOne = new jsVectorMap({
      selector: "#mapOne",
      map: "world",
      zoomButtons: false,

      regionStyle: {
        initial: {
          fontFamily: "Outfit",
          fill: "#D9D9D9",
        },
        hover: {
          fillOpacity: 1,
          fill: "#465fff",
        },
      },
      markers: [
        {
          name: "Egypt",
          coords: [26.8206, 30.8025],
        },
        {
          name: "United Kingdom",
          coords: [55.3781, 3.436],
        },
        {
          name: "United States",
          coords: [37.0902, -95.7129],
        },
      ],

      markerStyle: {
        initial: {
          strokeWidth: 1,
          fill: "#465fff",
          fillOpacity: 1,
          r: 4,
        },
        hover: {
          fill: "#465fff",
          fillOpacity: 1,
        },
        selected: {},
        selectedHover: {},
      },

      onRegionTooltipShow: function (tooltip, code) {
        if (code === "EG") {
          tooltip.selector.innerHTML =
            tooltip.text() + " <b>(Hello Russia)</b>";
        }
      },
    });
  }
};

export default map01;
