import type { RouteRecordRaw } from "vue-router";
import { h } from "vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => h("div"),
  },
  {
    path: "/receipts",
    name: "receipts",
    component: () => h("div"),
  },
];
