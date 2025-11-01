<script setup lang="ts">
const props = defineProps({
    link: String
});
</script>

<template>
    <a :href="props.link">
        <button>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="3.7"
                      d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4m-8-2l8-8m0 0v5m0-5h-5"/>
            </svg>
        </button>
    </a>
</template>

<style scoped lang="scss">
button {
    height: 100%;
    width: 100%;
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 0;

    svg {
        height: 100%;
        width: 100%;
    }
}
</style>