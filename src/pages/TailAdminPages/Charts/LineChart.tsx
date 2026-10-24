import LineChartOne from "@/components/charts/line/LineChartOne";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import PageBreadcrumb from "@/components/TailAdminComponents/common/PageBreadCrumb";
import PageMeta from "@/components/TailAdminComponents/common/PageMeta";
import LineChartTree from "@/components/charts/line/LineChartOne";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 3">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}
