import VectorMap from "@/components/common/VectorMap";

export default function CountryMap() {
  return (
    <VectorMap
      map="skane"
      backgroundColor="transparent"
      focusOn={{
        coords: [55.9, 13.5],
        scale: 14,
        animate: false,
      }}
      markerStyle={{ initial: { fill: "#465FFF", r: 4 } }}
      markers={[
        { coords: [55.605, 13.0038], name: "Malmö" },
        { coords: [55.7047, 13.191], name: "Lund" },
        { coords: [56.0465, 12.6945], name: "Helsingborg" },
        { coords: [56.0294, 14.1567], name: "Kristianstad" },
      ]}
      zoomOnScroll={false}
      zoomButtons={false}
      zoomMin={1}
      zoomMax={20}
      regionStyle={{
        initial: { fill: "#D0D5DD", stroke: "none" },
        hover: { fill: "#465fff", fillOpacity: 0.7 },
      }}
    />
  );
} 