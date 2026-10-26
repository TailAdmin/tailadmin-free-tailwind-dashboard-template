import flatpickr from "flatpickr";
import { Calendar } from "fullcalendar";
import dayGridPlugin from "fullcalendar/daygrid";
import interactionPlugin from "fullcalendar/interaction";
import multiMonthPlugin from "fullcalendar/multimonth";
import themePlugin from "fullcalendar/themes/classic";
import timeGridPlugin from "fullcalendar/timegrid";

// FullCalendar v7 CSS imports
import "fullcalendar/skeleton.css";
import "fullcalendar/themes/classic/palette.css";
import "fullcalendar/themes/classic/theme.css";

/*========Calender Js=========*/
/*==========================*/

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.querySelector("#calendar");
  if (!calendarEl) return;

  function syncCalendarTheme() {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark");
    calendarEl.setAttribute("data-color-scheme", isDark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-color-scheme",
      isDark ? "dark" : "light",
    );
  }

  syncCalendarTheme();

  const themeObserver = new MutationObserver(() => {
    syncCalendarTheme();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const isRtl = document.documentElement.dir === "rtl";
  const locale = document.documentElement.lang || "en";

  let isMobile = window.innerWidth < 640;
  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 640;
  });

  let currentView = "dayGridMonth";
  let selectedEvent = null;
  let eventTitle = "";
  let eventStartDate = "";
  let eventEndDate = "";
  let eventLevel = "Primary";

  const viewOptions = [
    { key: "multiMonthYear", label: "Year" },
    { key: "dayGridMonth", label: "Month" },
    { key: "timeGridWeek", label: "Week" },
    { key: "timeGridDay", label: "Day" },
  ];

  let events = [
    {
      id: "1",
      title: "Event Conf.",
      start: new Date().toISOString().split("T")[0],
      extendedProps: { calendar: "Danger" },
    },
    {
      id: "2",
      title: "Meeting",
      start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      extendedProps: { calendar: "Success" },
    },
    {
      id: "3",
      title: "Workshop",
      start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      extendedProps: { calendar: "Primary" },
    },
  ];

  /*=====================*/
  // Modal Elements & Handlers
  /*=====================*/
  const modalEl = document.getElementById("eventModal");
  const getModalTitleEl = document.querySelector("#event-title");
  const getModalStartDateEl = document.querySelector("#event-start-date");
  const getModalEndDateEl = document.querySelector("#event-end-date");
  const getModalAddBtnEl = document.querySelector(".btn-add-event");
  const getModalUpdateBtnEl = document.querySelector(".btn-update-event");

  let startPicker = null;
  let endPicker = null;

  function initPickers() {
    if (getModalStartDateEl && !startPicker) {
      startPicker = flatpickr(getModalStartDateEl, {
        dateFormat: "Y-m-d",
        prevArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (_selectedDates, dateStr) => {
          eventStartDate = dateStr;
        },
      });
    }

    if (getModalEndDateEl && !endPicker) {
      endPicker = flatpickr(getModalEndDateEl, {
        dateFormat: "Y-m-d",
        prevArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (_selectedDates, dateStr) => {
          eventEndDate = dateStr;
        },
      });
    }
  }

  initPickers();

  function openModal() {
    if (modalEl) {
      modalEl.classList.remove("hidden");
      modalEl.classList.add("flex");
      modalEl.style.display = "flex";
      initPickers();
    }
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.add("hidden");
      modalEl.classList.remove("flex");
      modalEl.style.display = "none";
    }
    resetModalFields();
  }

  function resetModalFields() {
    eventTitle = "";
    eventStartDate = "";
    eventEndDate = "";
    eventLevel = "Primary";
    selectedEvent = null;

    if (getModalTitleEl) getModalTitleEl.value = "";
    if (getModalStartDateEl) getModalStartDateEl.value = "";
    if (getModalEndDateEl) getModalEndDateEl.value = "";
    if (startPicker) startPicker.clear();
    if (endPicker) endPicker.clear();

    const defaultRadio = document.querySelector(
      'input[name="event-level"][value="Primary"]',
    );
    if (defaultRadio) {
      defaultRadio.checked = true;
      defaultRadio.dispatchEvent(new Event("change"));
    }
  }

  function handleOpenAddModal() {
    resetModalFields();
    const currentDate = new Date();
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const combineDate = `${yyyy}-${mm}-${dd}`;

    eventStartDate = combineDate;
    eventEndDate = combineDate;
    eventLevel = "Primary";

    if (getModalStartDateEl) getModalStartDateEl.value = eventStartDate;
    if (getModalEndDateEl) getModalEndDateEl.value = eventEndDate;
    if (startPicker) startPicker.setDate(eventStartDate, false);
    if (endPicker) endPicker.setDate(eventEndDate, false);

    if (getModalAddBtnEl) {
      getModalAddBtnEl.classList.remove("hidden");
      getModalAddBtnEl.style.display = "flex";
    }
    if (getModalUpdateBtnEl) {
      getModalUpdateBtnEl.classList.add("hidden");
      getModalUpdateBtnEl.style.display = "none";
    }

    openModal();
  }

  function handleDateSelect(selectInfo) {
    resetModalFields();
    eventStartDate = selectInfo.startStr
      ? selectInfo.startStr.split("T")[0]
      : "";
    eventEndDate = selectInfo.endStr
      ? selectInfo.endStr.split("T")[0]
      : eventStartDate;
    eventLevel = "Primary";

    if (getModalStartDateEl) getModalStartDateEl.value = eventStartDate;
    if (getModalEndDateEl) getModalEndDateEl.value = eventEndDate;
    if (startPicker) startPicker.setDate(eventStartDate, false);
    if (endPicker) endPicker.setDate(eventEndDate, false);

    if (getModalAddBtnEl) {
      getModalAddBtnEl.classList.remove("hidden");
      getModalAddBtnEl.style.display = "flex";
    }
    if (getModalUpdateBtnEl) {
      getModalUpdateBtnEl.classList.add("hidden");
      getModalUpdateBtnEl.style.display = "none";
    }

    openModal();
  }

  function handleEventClick(clickInfo) {
    const event = clickInfo.event;
    if (event.url) {
      window.open(event.url);
      clickInfo.jsEvent.preventDefault();
      return;
    }

    selectedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: { calendar: event.extendedProps?.calendar || "Primary" },
    };

    eventTitle = event.title;
    eventStartDate = event.startStr ? event.startStr.split("T")[0] : "";
    eventEndDate = event.endStr ? event.endStr.split("T")[0] : eventStartDate;
    eventLevel = event.extendedProps?.calendar || "Primary";

    if (getModalTitleEl) getModalTitleEl.value = eventTitle;
    if (getModalStartDateEl) getModalStartDateEl.value = eventStartDate;
    if (getModalEndDateEl) getModalEndDateEl.value = eventEndDate;
    if (startPicker) startPicker.setDate(eventStartDate, false);
    if (endPicker) endPicker.setDate(eventEndDate, false);

    const checkedRadio = document.querySelector(
      `input[name="event-level"][value="${eventLevel}"]`,
    );
    if (checkedRadio) {
      checkedRadio.checked = true;
      checkedRadio.dispatchEvent(new Event("change"));
    }

    if (getModalAddBtnEl) {
      getModalAddBtnEl.classList.add("hidden");
      getModalAddBtnEl.style.display = "none";
    }
    if (getModalUpdateBtnEl) {
      getModalUpdateBtnEl.classList.remove("hidden");
      getModalUpdateBtnEl.style.display = "flex";
    }

    openModal();
  }

  function handleAddOrUpdateEvent(e) {
    if (e && e.preventDefault) e.preventDefault();
    const titleVal =
      (getModalTitleEl?.value || "").trim() ||
      (selectedEvent ? "Event" : "New Event");
    const startDateVal = getModalStartDateEl?.value || eventStartDate;
    const endDateVal = getModalEndDateEl?.value || eventEndDate || startDateVal;
    const checkedRadio = document.querySelector(
      'input[name="event-level"]:checked',
    );
    const levelVal = checkedRadio
      ? checkedRadio.value
      : eventLevel || "Primary";

    if (selectedEvent) {
      events = events.map((ev) =>
        String(ev.id) === String(selectedEvent.id)
          ? {
              ...ev,
              title: titleVal,
              start: startDateVal,
              end: endDateVal || startDateVal,
              extendedProps: { calendar: levelVal },
            }
          : ev,
      );
    } else {
      const newEvent = {
        id: Date.now().toString(),
        title: titleVal,
        start: startDateVal,
        end: endDateVal || startDateVal,
        allDay: true,
        extendedProps: { calendar: levelVal },
      };
      events = [...events, newEvent];
    }

    calendar.removeAllEvents();
    events.forEach((ev) => calendar.addEvent(ev));
    closeModal();
  }

  /*=====================*/
  // Event Content Renderer
  /*=====================*/
  function renderEventContent(eventInfo) {
    const calendarLevel = (
      eventInfo.event.extendedProps?.calendar || "primary"
    ).toLowerCase();

    const colorMap = {
      success: {
        bg: "border border-green-100 bg-green-50 dark:border-green-500/20 dark:bg-green-500/15",
        dot: "bg-green-500",
        title: "text-green-700 dark:text-green-400",
        time: "text-green-600/80 dark:text-green-400/80",
      },
      danger: {
        bg: "border border-red-100 bg-red-50 dark:border-red-500/20 dark:bg-red-500/15",
        dot: "bg-red-500",
        title: "text-red-700 dark:text-red-400",
        time: "text-red-600/80 dark:text-red-400/80",
      },
      primary: {
        bg: "border border-brand-100 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/15",
        dot: "bg-brand-500",
        title: "text-brand-700 dark:text-brand-400",
        time: "text-brand-600/80 dark:text-brand-400/80",
      },
      warning: {
        bg: "border border-orange-100 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/15",
        dot: "bg-orange-500",
        title: "text-orange-700 dark:text-orange-400",
        time: "text-orange-600/80 dark:text-orange-400/80",
      },
      info: {
        bg: "border border-blue-100 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/15",
        dot: "bg-blue-500",
        title: "text-blue-700 dark:text-blue-400",
        time: "text-blue-600/80 dark:text-blue-400/80",
      },
    };

    const colors = colorMap[calendarLevel] || colorMap["primary"];
    const isTimeGridView =
      !eventInfo.event?.allDay &&
      eventInfo.view?.type &&
      eventInfo.view.type.startsWith("timeGrid");

    if (isTimeGridView) {
      return {
        html: `
          <div dir="ltr" class="event-fc-color flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1 transition-colors sm:rounded-lg sm:p-1.5 ${colors.bg}">
            <div class="flex items-center gap-1 sm:gap-1.5">
              <div class="size-1.5 shrink-0 rounded-full sm:size-2 ${colors.dot}"></div>
              <div class="truncate text-[11px] font-semibold leading-tight sm:text-xs ${colors.title}">${eventInfo.event.title || ""}</div>
            </div>
            ${
              eventInfo.timeText
                ? `<div class="mt-0.5 truncate ps-2.5 text-[10px] font-medium leading-tight sm:ps-3.5 sm:text-[11px] ${colors.time}">${eventInfo.timeText}</div>`
                : ""
            }
          </div>
        `,
      };
    }

    return {
      html: `
        <div dir="ltr" class="event-fc-color flex items-center rounded-md py-1 ps-1.5 pe-2 transition-colors sm:rounded-lg sm:py-1.5 sm:ps-2.5 sm:pe-3 ${colors.bg}">
          <div class="fc-daygrid-event-dot ms-0 me-1 h-2.5 w-1 shrink-0 rounded-full border-none sm:me-2 sm:h-3.5 ${colors.dot}"></div>
          ${
            eventInfo.timeText
              ? `<div class="fc-event-time me-1 p-0 text-[10px] font-normal text-gray-500 sm:me-1.5 sm:text-xs dark:text-gray-400">${eventInfo.timeText}</div>`
              : ""
          }
          <div class="fc-event-title truncate p-0 text-[11px] font-medium text-gray-700 sm:text-xs dark:text-white">${eventInfo.event.title || ""}</div>
        </div>
      `,
    };
  }

  /*=====================*/
  // Custom View Dropdown
  /*=====================*/
  function renderViewSelect(containerEl, activeViewKey) {
    if (!containerEl) return;
    const activeOption =
      viewOptions.find((v) => v.key === activeViewKey) ||
      viewOptions.find((v) => v.key === "dayGridMonth") ||
      viewOptions[1];

    const existingDropdown = containerEl.querySelector(
      ".calendar-view-dropdown",
    );
    if (existingDropdown) {
      const labelEl = existingDropdown.querySelector(".calendar-view-label");
      if (labelEl) labelEl.textContent = activeOption.label;
      existingDropdown
        .querySelectorAll(".calendar-view-option")
        .forEach((optionBtn) => {
          const isSelected = optionBtn.dataset.viewKey === activeViewKey;
          optionBtn.classList.toggle("bg-gray-100", isSelected);
          optionBtn.classList.toggle("font-medium", isSelected);
          optionBtn.classList.toggle("dark:bg-white/5", isSelected);
          optionBtn.classList.toggle("font-normal", !isSelected);
        });
      return;
    }

    containerEl.innerHTML = `
      <div class="calendar-view-dropdown relative">
        <button
          type="button"
          class="calendar-view-btn flex h-9 w-full min-w-18 items-center justify-center gap-1 rounded-lg border border-gray-300 ps-2.5 pe-1.5 text-xs font-medium text-gray-700 shadow-xs sm:min-w-20 sm:gap-1.5 sm:ps-3 sm:pe-2 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          aria-expanded="false"
          aria-haspopup="listbox"
        >
          <span class="calendar-view-label">${activeOption.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calendar-view-chevron h-4 w-4 transition-transform duration-200 sm:h-4.5 sm:w-4.5">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div class="calendar-view-menu absolute inset-e-0 z-50 mt-1.5 hidden w-36 max-w-[calc(100vw-32px)] space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg sm:w-38 dark:border-gray-700 dark:bg-gray-900">
          ${viewOptions
            .map(
              (view) => `
            <button
              type="button"
              data-view-key="${view.key}"
              class="calendar-view-option w-full rounded-lg px-2.5 py-1.5 text-start text-xs text-gray-700 hover:bg-gray-100 sm:text-sm dark:text-gray-300 dark:hover:bg-white/5 ${
                activeViewKey === view.key
                  ? "bg-gray-100 font-medium dark:bg-white/5"
                  : "font-normal"
              }"
            >
              ${view.label}
            </button>
          `,
            )
            .join("")}
        </div>
      </div>
    `;

    const dropdownContainer = containerEl.querySelector(
      ".calendar-view-dropdown",
    );
    if (!dropdownContainer) return;
    const btn = dropdownContainer.querySelector(".calendar-view-btn");
    const menu = dropdownContainer.querySelector(".calendar-view-menu");
    const chevron = dropdownContainer.querySelector(".calendar-view-chevron");

    if (btn && menu && chevron) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains("hidden");
        document
          .querySelectorAll(".calendar-view-menu")
          .forEach((m) => m.classList.add("hidden"));
        document
          .querySelectorAll(".calendar-view-chevron")
          .forEach((c) => c.classList.remove("rotate-180"));

        if (isHidden) {
          menu.classList.remove("hidden");
          chevron.classList.add("rotate-180");
          btn.setAttribute("aria-expanded", "true");
        } else {
          menu.classList.add("hidden");
          chevron.classList.remove("rotate-180");
          btn.setAttribute("aria-expanded", "false");
        }
      });

      dropdownContainer
        .querySelectorAll(".calendar-view-option")
        .forEach((optionBtn) => {
          optionBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const viewKey = optionBtn.dataset.viewKey;
            if (viewKey) {
              currentView = viewKey;
              if (calendar && typeof calendar.changeView === "function") {
                calendar.changeView(viewKey);
              }
            }
            menu.classList.add("hidden");
            chevron.classList.remove("rotate-180");
            btn.setAttribute("aria-expanded", "false");
          });
        });
    }
  }

  // Dismiss view dropdown on click outside
  window.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".calendar-view-dropdown")) {
      document
        .querySelectorAll(".calendar-view-menu")
        .forEach((m) => m.classList.add("hidden"));
      document
        .querySelectorAll(".calendar-view-chevron")
        .forEach((c) => c.classList.remove("rotate-180"));
    }
  });

  /*=====================*/
  // FullCalendar Options & Init
  /*=====================*/
  const bookmarkIconHtml = `<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4.5 text-brand-500 sm:size-5.5"><path d="M19 3v17a1 1 0 01-1.496.868l-4.512-2.578a2 2 0 00-1.984 0l-4.512 2.578A1 1 0 015 20V3z" /></svg></span>`;

  const calendarOptions = {
    plugins: [
      themePlugin,
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      multiMonthPlugin,
    ],
    initialView: "dayGridMonth",
    direction: isRtl ? "rtl" : "ltr",

    // Toolbar Header configuration
    headerToolbar: {
      start: "prev,next addEventButton",
      center: "title",
      end: "",
    },
    headerToolbarClass:
      "sticky top-0! z-20! flex-wrap gap-2 sm:gap-4 [padding-inline:16px]! sm:[padding-inline:24px]! pt-4 sm:pt-6",
    toolbarTitleClass:
      "text-base! sm:text-lg! font-semibold! text-gray-800 dark:text-white/90",
    toolbarSectionClass: (info) => {
      if (info.name === "start") {
        return "ta-toolbar-section ta-toolbar-start order-2 flex w-full items-center justify-between sm:order-1 sm:w-auto sm:justify-start gap-2";
      }
      if (info.name === "center") {
        return "ta-toolbar-section ta-toolbar-center order-1 flex items-center justify-start sm:order-2 sm:justify-center";
      }
      if (info.name === "end") {
        return "ta-toolbar-section ta-toolbar-end order-1 flex items-center justify-end sm:order-3 sm:justify-end";
      }
      return "ta-toolbar-section";
    },
    buttonGroupClass: "gap-2",

    buttons: {
      prev: {
        iconContent: {
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-5 bg-transparent text-gray-700 sm:size-6 rtl:rotate-180 dark:text-gray-400"><path d="M15 18l-6-6 6-6" /></svg>`,
        },
        className:
          "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
      },
      next: {
        iconContent: {
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-5 bg-transparent text-gray-700 sm:size-6 rtl:rotate-180 dark:text-gray-400"><path d="M9 18l6-6-6-6" /></svg>`,
        },
        className:
          "flex size-9! sm:size-10! p-0! items-center justify-center! rounded-lg! border! bg-transparent! border-gray-200! text-gray-700 hover:border-gray-200 hover:bg-gray-50! focus:shadow-none active:border-gray-200! active:bg-transparent! active:shadow-none! dark:border-gray-800! dark:text-gray-400 dark:hover:border-gray-800 dark:hover:bg-gray-900! dark:active:border-gray-800!",
      },
      addEventButton: {
        text: "Add Event +",
        click: () => handleOpenAddModal(),
        className:
          "rounded-lg! border-0! bg-brand-500! px-3! sm:px-4! py-2! sm:py-2.5! text-xs! sm:text-sm! font-medium! text-white hover:bg-brand-600! focus:shadow-none! w-auto!",
      },
    },

    // View configurations
    views: {
      multiMonthYear: {
        multiMonthMaxColumns: 3,
        singleMonthClass: "fc-multimonth",
        tableClass:
          "overflow-visible! border-0! sm:border! sm:border-gray-200! dark:sm:border-gray-800! rounded-none! sm:rounded-lg! mt-0! bg-transparent!",
        singleMonthHeaderClass:
          "mb-0! bg-white dark:bg-gray-900 sm:bg-transparent!",
        tableHeaderClass:
          "mb-0! rounded-none! sm:rounded-t-lg! bg-gray-50 dark:bg-gray-900!",
        tableBodyClass: "mt-0!",
        singleMonthMinWidth: 280,
        showNonCurrentDates: true,
        singleMonthHeaderInnerClass:
          "text-sm font-medium! text-gray-800 dark:text-white/90",
        dayHeaderRowClass: "fc-multimonth-day-header-row",
        dayHeaderClass: (data) =>
          data.inPopover
            ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
            : "border-0! bg-gray-50 py-2! dark:bg-gray-900 dark:sm:bg-transparent! first:rounded-none! first:sm:rounded-ss-lg! last:rounded-none! last:sm:rounded-se-lg!",
        dayHeaderInnerClass: (data) =>
          data.inPopover
            ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
            : "py-1 text-[11px] sm:text-xs font-medium text-gray-400 uppercase",
        dayCellClass: (data) => {
          if (data.inPopover) return "bg-transparent! p-3!";
          let cls = "relative! p-0.5 sm:p-1!";
          if (data.isToday)
            cls +=
              " isolate rounded-sm! bg-gray-100! dark:bg-gray-800/40! font-semibold text-brand-500 dark:text-brand-400";
          if (data.isOther) cls += " bg-transparent!";
          return cls;
        },
        dayCellInnerClass: (data) =>
          data.inPopover
            ? "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto"
            : "h-0 max-h-0 overflow-hidden invisible",
        dayCellTopInnerClass:
          "text-xs! sm:text-sm! text-gray-700 dark:text-gray-300",
        dayMaxEvents: 0,
        moreLinkClass:
          "border-0! border-transparent! bg-transparent! p-0! hover:bg-transparent! focus:outline-none! focus:ring-0!",
        rowMoreLinkClass:
          "absolute! top-0! sm:-top-0.5! start-0.5! sm:start-1! z-10! border-0! border-transparent! bg-transparent! p-0!",
        rowMoreLinkInnerClass: "overflow-visible",
        moreLinkContent() {
          return { html: bookmarkIconHtml };
        },
      },
      dayGridMonth: {
        dayMaxEvents: isMobile ? 0 : 2,
        dayHeaderAlign: (data) => (data.inPopover ? "start" : "center"),
        dayHeaderClass: (data) =>
          data.inPopover
            ? "relative! border-b! border-gray-200! bg-gray-50/70! px-4! py-3! text-start! dark:border-gray-800! dark:bg-gray-800/50!"
            : "border-x-0! border-t border-gray-200! bg-gray-50 dark:border-gray-800! dark:bg-gray-900",
        dayHeaderInnerClass: (data) =>
          data.inPopover
            ? "text-sm! font-semibold! text-gray-800! dark:text-white/90!"
            : "px-1! py-2! sm:px-3! sm:py-3! md:px-5! md:py-4! text-xs! sm:text-sm! font-medium! text-gray-400 uppercase",
        dayCellClass: (data) => {
          if (data.inPopover) return "bg-transparent! p-3!";
          return `bg-transparent! p-1! sm:p-2! ${
            data.isToday ? "bg-gray-100! dark:bg-gray-800/40!" : ""
          }`;
        },
        dayCellTopInnerClass:
          "text-xs! sm:text-sm! text-gray-700 dark:text-gray-300",
        dayCellInnerClass: (data) => {
          if (data.inPopover)
            return "flex custom-scrollbar max-h-60 flex-col gap-1.5 overflow-y-auto";
          if (isMobile) return "h-0 max-h-0 overflow-hidden invisible";
          return data.isToday ? "rounded-sm!" : "";
        },
        rowMoreLinkClass: isMobile
          ? "absolute -top-1 -start-0.5 z-10 border-0 bg-transparent p-0"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible" : "",
        moreLinkClass:
          "border-0 bg-transparent p-0 hover:bg-transparent focus:outline-none",
        moreLinkContent(args) {
          if (isMobile) {
            return { html: bookmarkIconHtml };
          }
          return {
            html: `<span class="fc-more-link-badge inline-flex items-center rounded-sm bg-brand-50 px-1 py-0.5 text-[10px] font-medium text-brand-600 transition-colors hover:bg-brand-100 sm:px-1.5 sm:text-xs dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25">+${args.num} more</span>`,
          };
        },
      },
      timeGridWeek: {
        slotDuration: "01:00:00",
        slotMinHeight: 56,
        allDaySlot: true,
        dayMaxEvents: isMobile ? 0 : undefined,
        moreLinkClass:
          "border-0 bg-transparent p-0 hover:bg-transparent focus:outline-none",
        rowMoreLinkClass: isMobile
          ? "absolute -top-1 -start-0.5 z-10 border-0 bg-transparent p-0"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible" : "",
        moreLinkContent: isMobile
          ? () => ({ html: bookmarkIconHtml })
          : undefined,
        dayHeaderContent: (arg) => {
          const weekday = new Intl.DateTimeFormat(locale, {
            weekday: "short",
          })
            .format(arg.date)
            .toUpperCase();
          const day = new Intl.DateTimeFormat(locale, {
            day: "numeric",
          }).format(arg.date);
          return `${weekday} - ${day}`;
        },
        dayHeaderClass: (data) =>
          `border-0! bg-gray-50! dark:bg-gray-900! ${
            data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
          }`,
        dayHeaderInnerClass: (data) =>
          `px-1.5! sm:px-3! py-2.5! sm:py-3.5! text-center! text-[11px]! sm:text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
            data.isToday
              ? "font-semibold! text-brand-500! dark:text-brand-400!"
              : ""
          }`,
        slotHeaderDividerClass:
          "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
        slotHeaderClass:
          "px-1.5! sm:px-3! py-1.5! sm:py-2! text-start! text-[11px]! sm:text-xs! font-medium! text-gray-400! dark:text-gray-500!",
        slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
        dayLaneClass: (data) =>
          `border-gray-200! dark:border-gray-800! ${
            data.isToday ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!" : ""
          }`,
        allDayDividerClass:
          "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
        allDayHeaderClass:
          "border-0! bg-gray-50! text-[11px]! sm:text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
      },
      timeGridDay: {
        slotDuration: "00:30:00",
        slotMinHeight: 48,
        allDaySlot: true,
        dayMaxEvents: isMobile ? 0 : undefined,
        moreLinkClass:
          "border-0 bg-transparent p-0 hover:bg-transparent focus:outline-none",
        rowMoreLinkClass: isMobile
          ? "absolute -top-1 -start-0.5 z-10 border-0 bg-transparent p-0"
          : "",
        rowMoreLinkInnerClass: isMobile ? "overflow-visible" : "",
        moreLinkContent: isMobile
          ? () => ({ html: bookmarkIconHtml })
          : undefined,
        dayHeaderContent: (arg) => {
          const weekday = new Intl.DateTimeFormat(locale, {
            weekday: "short",
          })
            .format(arg.date)
            .toUpperCase();
          const day = new Intl.DateTimeFormat(locale, {
            day: "numeric",
          }).format(arg.date);
          return `${weekday} - ${day}`;
        },
        dayHeaderClass: (data) =>
          `border-0! bg-gray-50! dark:bg-gray-900! ${
            data.isToday ? "bg-gray-100/70! dark:bg-gray-800/60!" : ""
          }`,
        dayHeaderInnerClass: (data) =>
          `px-2! sm:px-4! py-2.5! sm:py-3.5! text-center! text-xs! font-medium! text-gray-500! uppercase! dark:text-gray-400! ${
            data.isToday
              ? "font-semibold! text-brand-500! dark:text-brand-400!"
              : ""
          }`,
        slotHeaderDividerClass:
          "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
        slotHeaderClass:
          "px-2! sm:px-3! py-1.5! sm:py-2! text-start! text-[11px]! sm:text-xs! font-medium! text-gray-400! dark:text-gray-500!",
        slotLaneClass: "border-gray-100! dark:border-gray-800/60!",
        dayLaneClass: (data) =>
          `border-gray-200! dark:border-gray-800! ${
            data.isToday ? "bg-brand-50/15! dark:bg-brand-500/[0.03]!" : ""
          }`,
        allDayDividerClass:
          "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
        allDayHeaderClass:
          "border-0! bg-gray-50! text-xs! font-medium! text-gray-500! dark:border-0! dark:bg-gray-900! dark:text-gray-400!",
      },
    },

    // Body configuration
    height: "auto",
    borderless: true,
    viewClass:
      "border-t! border-b-0! border-x-0! border-gray-200! bg-transparent! dark:border-gray-800! dark:bg-transparent!",
    tableHeaderClass: "border-0! bg-gray-50! dark:bg-gray-900!",
    dayHeaderDividerClass:
      "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
    slotMinHeight: 56,
    slotHeaderDividerClass:
      "border-e! border-s-0! border-y-0! border-gray-200! dark:border-gray-800!",
    allDayDividerClass:
      "border-b! border-t-0! border-x-0! border-gray-200! p-0! bg-transparent! dark:border-gray-800!",
    eventClass: "focus:shadow-none",
    nowIndicator: false,
    columnEventClass:
      "bg-transparent! border-0! p-1! shadow-none! hover:shadow-none! focus:outline-none",
    columnEventInnerClass: "p-0! border-0! bg-transparent! h-full",
    tableHeaderSticky: true,
    tableClass: "overflow-hidden bg-transparent!",
    rowEventClass:
      "bg-transparent! border-0! px-1! py-0.5! shadow-none! hover:shadow-none! focus:outline-none",
    rowEventInnerClass: "p-0! border-0! bg-transparent!",
    popoverFormat: { month: "short", day: "numeric", year: "numeric" },
    popoverClass:
      "z-99999! w-72 max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-900",
    popoverCloseClass:
      "absolute end-3 top-2.5 flex size-7 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
    popoverCloseContent: {
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M18 6L6 18M6 6l12 12" /></svg>`,
    },

    selectable: true,
    events: events,
    select: (info) => handleDateSelect(info),
    eventClick: (info) => handleEventClick(info),
    eventContent: (arg) => renderEventContent(arg),
    datesSet: (arg) => {
      currentView = arg.view.type;
      requestAnimationFrame(() => {
        const chunk = calendarEl.querySelector(
          ".ta-toolbar-section:last-child",
        );
        if (chunk) {
          renderViewSelect(chunk, currentView);
        }
      });
    },
  };

  const calendar = new Calendar(calendarEl, calendarOptions);
  calendar.render();

  /*=====================*/
  // Event Listeners for Modal
  /*=====================*/
  const eventForm = document.getElementById("eventForm");
  if (eventForm) {
    eventForm.addEventListener("submit", handleAddOrUpdateEvent);
  }

  if (getModalAddBtnEl) {
    getModalAddBtnEl.addEventListener("click", handleAddOrUpdateEvent);
  }
  if (getModalUpdateBtnEl) {
    getModalUpdateBtnEl.addEventListener("click", handleAddOrUpdateEvent);
  }

  document.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalEl) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modalEl &&
      !modalEl.classList.contains("hidden")
    ) {
      closeModal();
    }
  });
});
