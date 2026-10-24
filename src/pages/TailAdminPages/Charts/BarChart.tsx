import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import PageBreadcrumb from "@/components/TailAdminComponents/common/PageBreadCrumb";
import PageMeta from "@/components/TailAdminComponents/common/PageMeta";

export default function BarChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
