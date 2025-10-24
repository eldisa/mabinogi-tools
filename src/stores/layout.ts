import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLayoutStore = defineStore("layout", () => {
    // State
    const screenWidth = ref(0);
    const breakpoint = ref(768); // Tailwind md breakpoint

    // Getters
    const isMobile = computed(() => screenWidth.value < breakpoint.value);
    const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024);
    const isDesktop = computed(() => screenWidth.value >= 1024);

    // Actions
    function initializeScreenSize() {
        screenWidth.value = window.innerWidth;
    }

    function updateScreenSize(width: number) {
        screenWidth.value = width;
    }

    function setBreakpoint(value: number) {
        breakpoint.value = value;
    }

    return {
        screenWidth,
        breakpoint,
        isMobile,
        isTablet,
        isDesktop,
        initializeScreenSize,
        updateScreenSize,
        setBreakpoint,
    };
});
