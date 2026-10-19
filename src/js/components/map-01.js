import jsVectorMap from "jsvectormap";
import "./skane-map"; // din genererade Skåne-karta

const map01 = () => {
  const mapSelectorOne = document.querySelectorAll("#mapOne");

  if (mapSelectorOne.length) {
    new jsVectorMap({
      selector: "#mapOne",
      map: "skane",
      zoomButtons: false,
      zoomOnScroll: false,

      regionStyle: {
        initial: { fontFamily: "Outfit", fill: "#D9D9D9", stroke: "#fff", strokeWidth: 1 },
        hover: { fillOpacity: 1, fill: "#465fff" },
      },
      markers: [
        { name: "Malmö", coords: [55.605, 13.0038] },
        { name: "Lund", coords: [55.7047, 13.191] },
        { name: "Helsingborg", coords: [56.0465, 12.6945] },
        { name: "Kristianstad", coords: [56.0294, 14.1567] },
      ],
      markerStyle: {
        initial: { strokeWidth: 1, fill: "#465fff", fillOpacity: 1, r: 4 },
        hover: { fill: "#465fff", fillOpacity: 1 },
        selected: {},
        selectedHover: {},
      },
    });
  }
};

export default map01;