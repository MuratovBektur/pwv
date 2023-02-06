// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  defineCustomElement as VueDefineCustomElement,
  h,
  createApp,
  getCurrentInstance,
} from "vue";

import { createPinia } from "pinia";

const getRootElement = (el) => {
  while (el?.nodeType !== 11 /* DocumentFragment */) el = el.parentNode;
  return el;
};
export const defineCustomElementWithStyles = (component) =>
  VueDefineCustomElement({
    setup() {
      const app = createApp();

      const pinia = createPinia();
      app.use(pinia);

      app.mixin({
        mounted() {
          const insertStyles = (styles) => {
            if (styles?.length) {
              this.__style = document.createElement("style");
              this.__style.innerText = styles.join("").replace(/\n/g, "");
              const rootElement = getRootElement(this.$el);
              rootElement.insertBefore(this.__style, rootElement.firstChild);
            }
          };
          insertStyles(this.$?.type.styles, this);
          if (this.$options.components) {
            for (const comp of Object.values(this.$options.components)) {
              insertStyles(comp.styles, this);
            }
          }
        },
        unmounted() {
          this.__style?.remove();
        },
      });

      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      return () => h(component);
    },
  });
