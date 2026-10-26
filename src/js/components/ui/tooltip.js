import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";

export function tooltip(options = {}) {
  const {
    placement = "top",
    offset: offsetDistance = 8,
    arrowPadding = 4,
    ...extraState
  } = options;

  return {
    open: false,
    placement,
    offsetDistance,
    arrowPadding,
    currentPlacement: placement,
    _cleanup: null,
    ...extraState,

    show() {
      this.open = true;
    },

    hide() {
      this.open = false;
    },

    toggle() {
      this.open = !this.open;
    },

    updateFloating() {
      const reference =
        this.$refs.trigger ||
        this.$refs.button ||
        this.$el.querySelector(":scope > button") ||
        this.$el.querySelector("button") ||
        this.$el.firstElementChild ||
        this.$el;

      const floating =
        this.$refs.content ||
        this.$refs.tooltip ||
        this.$refs.dropdown ||
        this.$el.querySelector('[role="tooltip"]') ||
        this.$el.querySelector(":scope > [x-show]") ||
        this.$el.lastElementChild;

      if (!reference || !floating) return;

      const arrowEl =
        this.$refs.arrow ||
        floating.querySelector('[x-ref="arrow"]') ||
        floating.querySelector(".tooltip-arrow") ||
        floating.querySelector("span.rotate-45");

      this.cleanupFloating();

      const update = () => {
        computePosition(reference, floating, {
          placement: this.placement || "top",
          strategy: "fixed",
          middleware: [
            offset(this.offsetDistance),
            flip({
              fallbackAxisSideDirection: "start",
            }),
            shift({ padding: 8 }),
            ...(arrowEl
              ? [arrow({ element: arrowEl, padding: this.arrowPadding })]
              : []),
          ],
        }).then(({ x, y, placement: finalPlacement, middlewareData }) => {
          this.currentPlacement = finalPlacement;

          Object.assign(floating.style, {
            position: "fixed",
            left: `${x}px`,
            top: `${y}px`,
            zIndex: "9999",
          });

          if (arrowEl && middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow;
            const side = finalPlacement.split("-")[0];
            const staticSide = {
              top: "bottom",
              right: "left",
              bottom: "top",
              left: "right",
            }[side];

            const arrowLen = arrowEl.offsetWidth || 8;
            const offsetStatic = `-${arrowLen / 2}px`;

            Object.assign(arrowEl.style, {
              left: arrowX != null ? `${arrowX}px` : "",
              top: arrowY != null ? `${arrowY}px` : "",
              right: "",
              bottom: "",
              [staticSide]: offsetStatic,
            });
          }
        });
      };

      this._cleanup = autoUpdate(reference, floating, update);
    },

    cleanupFloating() {
      if (this._cleanup) {
        this._cleanup();
        this._cleanup = null;
      }
    },

    destroy() {
      this.cleanupFloating();
    },

    init() {
      this.$watch("open", (value) => {
        if (value) {
          this.$nextTick(() => {
            this.updateFloating();
          });
        } else {
          this.cleanupFloating();
        }
      });

      if (this.open) {
        this.$nextTick(() => {
          this.updateFloating();
        });
      }
    },
  };
}

export default tooltip;
