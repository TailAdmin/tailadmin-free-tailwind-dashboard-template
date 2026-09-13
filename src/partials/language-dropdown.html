<!-- Language Sub-Dropdown Item -->
<li
  class="relative"
  x-data="{ isSubDropdownOpen: false }"
  @click.outside="isSubDropdownOpen = false"
>
  <button
    type="button"
    @click.prevent="isSubDropdownOpen = !isSubDropdownOpen"
    class="group text-theme-sm flex max-h-10 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 font-medium transition-colors"
    :class="isSubDropdownOpen
      ? 'bg-gray-100 text-gray-900 dark:bg-white/5 dark:text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'"
  >
    <span class="text-theme-sm flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        class="stroke-gray-500 group-hover:stroke-gray-700 dark:stroke-gray-400 dark:group-hover:stroke-gray-300"
      >
        <path
          d="M12.001 2.75C17.1091 2.75 21.2501 6.89178 21.2501 11.9999C21.2501 17.108 17.1091 21.2498 12.001 21.2498M12.001 2.75C6.89289 2.75 2.75195 6.89178 2.75195 11.9999C2.75195 17.108 6.8929 21.2498 12.001 21.2498M12.001 2.75C14.2097 2.75 16.0005 6.8914 16.0005 11.9993C16.0005 17.1073 14.2098 21.2498 12.001 21.2498M12.001 2.75C9.79226 2.75 8.00195 6.89141 8.00195 11.9994C8.00195 17.1073 9.79226 21.2498 12.001 21.2498M3.24561 8.99976H20.7544M3.24561 14.9998H20.7544"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <span x-text="$t('userDropdown.language')">Language</span>
    </span>

    <span
      class="text-theme-xs flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 font-medium text-gray-700 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300"
    >
      <span x-text="$store.i18n ? $store.i18n.currentLang.shortName : 'English'"
        >English</span
      >
      <img
        :src="$store.i18n && $store.i18n.currentLang ? $store.i18n.currentLang.flag : ''"
        :alt="$store.i18n && $store.i18n.currentLang ? $store.i18n.currentLang.name : 'Flag'"
        class="size-3.5 shrink-0 overflow-hidden rounded-full"
      />
    </span>
  </button>

  <!-- Flyout Sub-dropdown -->
  <div
    x-show="isSubDropdownOpen"
    x-cloak
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="transform opacity-0 scale-95"
    x-transition:enter-end="transform opacity-100 scale-100"
    x-transition:leave="transition ease-in duration-75"
    x-transition:leave-start="transform opacity-100 scale-100"
    x-transition:leave-end="transform opacity-0 scale-95"
    class="shadow-theme-lg dark:bg-gray-dark absolute top-11 z-99 w-62.5 rounded-2xl border border-gray-200 bg-white p-2 md:top-0 ltr:-left-2 ltr:md:right-[calc(100%+14px)] ltr:md:left-auto rtl:-right-2 rtl:md:right-auto rtl:md:left-[calc(100%+14px)] dark:border-gray-800"
  >
    <ul class="flex flex-col gap-1">
      <template
        x-for="language in ($store.i18n ? $store.i18n.locales : [])"
        :key="language.code"
      >
        <li>
          <button
            type="button"
            @click.stop="$store.i18n.setLocale(language.code); isSubDropdownOpen = false; dropdownOpen = false"
            class="text-theme-sm flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-start font-medium transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            :class="$store.i18n && $store.i18n.currentLocale === language.code
              ? 'bg-brand-50 dark:bg-brand-500/15'
              : 'hover:bg-gray-100 dark:hover:bg-white/5'"
          >
            <span class="flex items-center gap-2">
              <span
                class="size-1.5 shrink-0 rounded-full transition-opacity"
                :class="$store.i18n && $store.i18n.currentLocale === language.code
                  ? 'bg-brand-500 opacity-100 dark:bg-brand-400'
                  : 'opacity-0'"
              ></span>
              <img
                :src="language.flag"
                :alt="language.name"
                class="size-5 shrink-0 overflow-hidden rounded-full"
              />
              <span class="truncate" x-text="language.name"></span>
            </span>

            <template x-if="language.badge">
              <span
                class="bg-warning-50 text-theme-xs text-warning-600 dark:bg-warning-500/15 dark:text-warning-400 rounded px-1.5 py-0.5 font-semibold"
                x-text="language.badge"
              ></span>
            </template>
          </button>
        </li>
      </template>
    </ul>
  </div>
</li>
