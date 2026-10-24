import PageBreadcrumb from "@/components/TailAdminComponents/common/PageBreadCrumb";
import PageMeta from "@/components/TailAdminComponents/common/PageMeta";
import DangerZone from "@/components/TailAdminComponents/UserProfile/DangerZone";
import Security from "@/components/TailAdminComponents/UserProfile/Security";
import UserAddressCard from "@/components/TailAdminComponents/UserProfile/UserAddressCard";
import UserMetaCard from "@/components/TailAdminComponents/UserProfile/UserMetaCard";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserAddressCard />
          <Security />
          <DangerZone />
        </div>
      </div>
    </>
  );
}
