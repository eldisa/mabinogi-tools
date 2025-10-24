// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
    plugins: [vue(), vueJsx()],
    base: "/mabinogi-tools/", // 注意要有 / 斜線！
});
