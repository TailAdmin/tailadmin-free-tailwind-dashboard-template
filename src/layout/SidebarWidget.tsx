import { useTranslation } from "react-i18next";

export default function SidebarWidget() {
  const { t } = useTranslation();

  return (
    <div className="pb-20">
      <div className="mx-auto w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
          {t("sidebar.widget.title")}
        </h3>
        <p className="mb-4 text-theme-sm text-gray-500 dark:text-gray-400">
          {t("sidebar.widget.description")}
        </p>
        <a
          href="https://tailadmin.com/pricing"
          target="_blank"
          rel="nofollow"
          className="flex items-center justify-center rounded-lg bg-brand-500 p-3 text-theme-sm font-medium text-white hover:bg-brand-600"
        >
          {t("sidebar.widget.purchasePlan")}
        </a>
      </div>
    </div>
  );
}
