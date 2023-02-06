// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { defineCustomElementWithStyles } from "./defineCustomElementWithStyles";
import App from "./AppBuild.vue";

customElements.define("widget-vue", defineCustomElementWithStyles(App));
