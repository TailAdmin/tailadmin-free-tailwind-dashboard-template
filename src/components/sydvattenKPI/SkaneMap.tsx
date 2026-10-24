// SkaneMap.tsx
import VectorMap from "@/components/TailAdminComponents/common/VectorMap";
import { municipalities } from "@/data/municipalities";

const REGION_STYLE = {
  initial: { stroke: "#fff", strokeWidth: 1 },
};

const css = municipalities
  .map(
    (m) => `
      .skane-map .jvm-region.jvm-element[data-code="${m.regionCode}"] { fill: #98A9FF !important; }
      .skane-map .jvm-region.jvm-element[data-code="${m.regionCode}"]:hover { fill: #465fff !important; }
    `
  )
  .join("");

export default function SkaneMap({
  onHover,
}: {
  onHover: (code: string | null) => void;
}) {
  return (
    <div
      className="skane-map h-full w-full"
      onMouseOver={(e) => {
        const el = (e.target as Element).closest("[data-code]");
        onHover(el?.getAttribute("data-code") ?? null);
      }}
      onMouseLeave={() => onHover(null)}
    >
      <style>{css}</style>
      <VectorMap
        map="skane"
        backgroundColor="transparent"
        zoomOnScroll={true}
        zoomButtons={true}
        regionStyle={REGION_STYLE}
      />
    </div>
  );
}