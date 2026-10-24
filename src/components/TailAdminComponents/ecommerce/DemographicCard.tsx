"use client";

import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import CountryMap from "../../sydvattenKPI/SkaneMap";

export default function DemographicCard() {
  const { t } = useTranslation("ecommerce.demographic");
  const { t: tCommon } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("Karta över Skåne")}
          </h3>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("Nuvarande flöden")}
          </p>
        </div>

        <div className="relative h-fit">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {tCommon("viewMore")}
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {tCommon("delete")}
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
  <div
    id="mapOne"
    className="mapOne map-btn h-[400px] w-full md:h-[300px] xl:h-[1050px]"
  >
    <CountryMap />
  </div>
</div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNkj_lgqbMnmkWbjp9fP8qzw1KY6U0mrvIXsnGvEwMNA&s=10"
                alt="Malmö"
                className="size-[48px]"
              />
            </div>
            <div>
              <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                {t("Malmö")}
              </p>
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                {t("customers", { count: "2,379" })}
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-35 items-center gap-3">
            <div className="relative block h-2 w-full max-w-25 rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute top-0 left-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
              79%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-8 items-center rounded-full">
              <img
                className="size-[48px]"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNEZadJpy9_c3xJfC7q3I-MMcYLMccXYY--4OC6qMU1w&s"
                alt="france"
              />
            </div>
            <div>
              <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                {t("Lund")}
              </p>
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                {t("customers", { count: "589" })}
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-35 items-center gap-3">
            <div className="relative block h-2 w-full max-w-25 rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute top-0 left-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
              23%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
