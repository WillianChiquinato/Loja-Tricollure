<template>
    <Dialog v-model:visible="model" appendTo="body" modal class="p-fluid modalContent">
        <h2 class="text-2xl font-bold mb-4 text-center text-black sm:text-3xl">{{ title }}</h2>

        <GoogleLogin />

        <slot></slot>
    </Dialog>
</template>

<script setup lang="ts">
import GoogleLogin from '../GoogleLogin.vue';

defineEmits(['back']);

const model = defineModel('visible', { default: false });

const props = defineProps({
    title : {
        type: String,
        required: true
    }
});
</script>

<style setup lang="scss">
.modalContent {
    width: 80vw;
    max-width: 600px;
    max-height: 85vh;
    background-color: var(--modal-background-color);
    border-radius: 12px;
    border: solid 0.7px black;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar {
    width: 8px;
}
</style>