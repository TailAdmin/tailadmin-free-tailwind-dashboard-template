import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, MdOutlineWater } from "@/icons";
import { useTranslation } from "react-i18next";
import { IoWater } from "react-icons/io5";
import Badge from "../../ui/badge/Badge";

export default function EcommerceMetrics() {
  const { t } = useTranslation("common", { keyPrefix: "ecommerce.metrics" });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <IoWater className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Senaste uppmätta vattenflöde
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              3,782 liter / sekund
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            1.3%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <MdOutlineWater className="size-6 text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {/*{t("orders")}*/}
              Vattennivå
            </span>
            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
              142 Meter över havet
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            0.13%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
