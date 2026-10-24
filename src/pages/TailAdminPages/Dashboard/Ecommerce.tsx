import PageMeta from "@/components/TailAdminComponents/common/PageMeta";
import DemographicCard from "@/components/TailAdminComponents/ecommerce/DemographicCard";
import EcommerceMetrics from "@/components/TailAdminComponents/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/TailAdminComponents/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/TailAdminComponents/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/TailAdminComponents/ecommerce/RecentOrders";
import StatisticsChart from "@/components/TailAdminComponents/ecommerce/StatisticsChart";

export default function Ecommerce() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <DemographicCard />
        </div>

      </div>
    </>
  );
}
