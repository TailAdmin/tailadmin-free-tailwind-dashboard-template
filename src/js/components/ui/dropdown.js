import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
} from "@floating-ui/dom";

function checkIsRTL(element) {
  if (element) {
    try {
      if (window.getComputedStyle(element).direction === "rtl") return true;
    } catch {
      // fallback
    }
  }
  return document.documentElement.dir === "rtl" || document.body.dir === "rtl";
}

function getTransformOrigin(placement, isRTL) {
  const [side, align] = placement.split("-");

  let originY = "center";
  let originX = "center";

  if (side === "bottom") {
    originY = "top";
  } else if (side === "top") {
    originY = "bottom";
  } else if (side === "left") {
    originX = "right";
  } else if (side === "right") {
    originX = "left";
  }

  if (side === "bottom" || side === "top") {
    if (align === "start") {
      originX = isRTL ? "right" : "left";
    } else if (align === "end") {
      originX = isRTL ? "left" : "right";
    }
  } else if (side === "left" || side === "right") {
    if (align === "start") {
      originY = "top";
    } else if (align === "end") {
      originY = "bottom";
    }
  }

  return `${originY} ${originX}`;
}

export default (options = {}) => {
  const {
    placement = "bottom-start",
    offset: offsetDistance = 8,
    subPlacement = "left-start",
    subOffset: subOffsetDistance = 4,
    matchWidth = false,
    ...extraState
  } = options;

  return {
    open: false,
    subOpen: false,
    placement,
    offsetDistance,
    subPlacement,
    subOffsetDistance,
    matchWidth,
    _cleanup: null,
    _subCleanup: null,
    _onLanguageChanged: null,

    getReference() {
      return (
        this.$refs.trigger ||
        this.$refs.button ||
        this.$el.querySelector("button") ||
        this.$el.firstElementChild ||
        this.$el
      );
    },

    getFloating() {
      return (
        this.$refs.dropdown ||
        this.$refs.menu ||
        this.$refs.content ||
        this.$el.querySelector('[x-show="open"]') ||
        this.$el.querySelector(":scope > [x-show]") ||
        this.$el.lastElementChild
      );
    },

    getSubReference() {
      return (
        this.$refs.subTrigger ||
        this.$el.querySelector("[data-submenu-trigger]") ||
        this.$el.querySelector("button[aria-controls]")
      );
    },

    getSubFloating() {
      return (
        this.$refs.submenu ||
        this.$el.querySelector("[data-submenu]") ||
        this.$el.querySelector('[id*="submenu"]')
      );
    },

    toggle() {
      this.open = !this.open;
    },

    show() {
      this.open = true;
    },

    hide() {
      this.open = false;
    },

    close() {
      this.open = false;
    },

    position() {
      this.updateFloating();
    },

    _setupPositioning({
      reference,
      floating,
      placement: basePlacement,
      offsetDistance: distance,
      zIndex = "999",
      arrowEl = null,
      matchWidth: matchW = false,
      setCleanup,
    }) {
      if (!reference || !floating) return;

      // Prevent rendering at stale coordinates before computePosition resolves
      floating.style.visibility = "hidden";
      floating.style.left = "";
      floating.style.top = "";
      if (floating.style.display === "none") {
        floating.style.display = "";
      }

      const shouldMatchWidth = matchW || floating.classList.contains("w-full");

      const update = () => {
        const isRTL = checkIsRTL(floating);

        // For side placements (e.g. submenu left-start), invert side in RTL
        let computedPlacement = basePlacement || "bottom-start";
        if (isRTL) {
          if (computedPlacement.startsWith("left")) {
            computedPlacement = computedPlacement.replace("left", "right");
          } else if (computedPlacement.startsWith("right")) {
            computedPlacement = computedPlacement.replace("right", "left");
          }
        }

        return computePosition(reference, floating, {
          placement: computedPlacement,
          strategy: "fixed",
          middleware: [
            offset(distance),
            flip({ fallbackAxisSideDirection: "start" }),
            shift({ padding: 8 }),
            ...(arrowEl ? [arrow({ element: arrowEl, padding: 4 })] : []),
            ...(shouldMatchWidth
              ? [
                  size({
                    apply({ rects, elements }) {
                      Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                      });
                    },
                  }),
                ]
              : []),
          ],
        })
          .then(({ x, y, placement: finalPlacement, middlewareData }) => {
            Object.assign(floating.style, {
              position: "fixed",
              left: `${x}px`,
              top: `${y}px`,
              zIndex,
            });

            floating.style.transformOrigin = getTransformOrigin(
              finalPlacement,
              isRTL,
            );

            if (arrowEl && middlewareData && middlewareData.arrow) {
              const { x: arrowX, y: arrowY } = middlewareData.arrow;
              const side = finalPlacement.split("-")[0];
              const staticSide = {
                top: "bottom",
                right: "left",
                bottom: "top",
                left: "right",
              }[side];

              const arrowLen = arrowEl.offsetWidth || 8;
              Object.assign(arrowEl.style, {
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
                right: "",
                bottom: "",
                [staticSide]: `-${arrowLen / 2}px`,
              });
            }

            floating.style.visibility = "";
          })
          .catch(() => {
            floating.style.visibility = "";
          });
      };

      setCleanup(autoUpdate(reference, floating, update));
    },

    updateFloating() {
      this.cleanupFloating();

      const floating = this.getFloating();
      const arrowEl =
        this.$refs.arrow ||
        floating?.querySelector('[x-ref="arrow"]') ||
        floating?.querySelector(".dropdown-arrow") ||
        floating?.querySelector("span.rotate-45");

      this._setupPositioning({
        reference: this.getReference(),
        floating,
        placement: this.placement,
        offsetDistance: this.offsetDistance,
        zIndex: "999",
        arrowEl,
        matchWidth: this.matchWidth,
        setCleanup: (fn) => {
          this._cleanup = fn;
        },
      });
    },

    updateSubmenuFloating() {
      this.cleanupSubmenuFloating();

      this._setupPositioning({
        reference: this.getSubReference(),
        floating: this.getSubFloating(),
        placement: this.subPlacement,
        offsetDistance: this.subOffsetDistance,
        zIndex: "1000",
        setCleanup: (fn) => {
          this._subCleanup = fn;
        },
      });
    },

    cleanupFloating() {
      if (this._cleanup) {
        this._cleanup();
        this._cleanup = null;
      }
    },

    cleanupSubmenuFloating() {
      if (this._subCleanup) {
        this._subCleanup();
        this._subCleanup = null;
      }
    },

    destroy() {
      this.cleanupFloating();
      this.cleanupSubmenuFloating();
      if (this._onLanguageChanged) {
        window.removeEventListener(
          "i18n:language-changed",
          this._onLanguageChanged,
        );
        this._onLanguageChanged = null;
      }
    },

    init() {
      this._onLanguageChanged = () => {
        if (this.open) {
          this.updateFloating();
        } else {
          const floating = this.getFloating();
          if (floating) {
            floating.style.left = "";
            floating.style.top = "";
            floating.style.transformOrigin = "";
          }
        }
        if (this.subOpen) {
          this.updateSubmenuFloating();
        } else {
          const subFloating = this.getSubFloating();
          if (subFloating) {
            subFloating.style.left = "";
            subFloating.style.top = "";
            subFloating.style.transformOrigin = "";
          }
        }
      };
      window.addEventListener("i18n:language-changed", this._onLanguageChanged);

      this.$watch("open", (value) => {
        if (value) {
          this.updateFloating();
        } else {
          this.cleanupFloating();
          this.cleanupSubmenuFloating();
        }
      });

      this.$watch("subOpen", (value) => {
        if (value) {
          this.updateSubmenuFloating();
        } else {
          this.cleanupSubmenuFloating();
        }
      });

      if (this.open) {
        this.updateFloating();
      }

      if (this.subOpen) {
        this.updateSubmenuFloating();
      }
    },
    ...extraState,
  };
};
