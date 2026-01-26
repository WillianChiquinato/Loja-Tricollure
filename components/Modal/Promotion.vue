<template>
    <Dialog v-model:visible="model" appendTo="body" modal :closable="true" :showHeader="false" class="modalContent">
        <div class="promo-banner">
            <img :src="imageURL" alt="Promotion Image" />
        </div>

        <div class="promo-body">
            <p class="promo-text">
                {{ description }}
            </p>
        </div>

        <div class="w-full flex flex-col items-center gap-2 px-6 pb-6">
            <Button class="w-[92%] max-w-md bg-[var(--background-color)] text-black font-bold rounded-md !px-4 !py-3 flex items-center justify-center gap-3
                    hover:!bg-[var(--secondary-color)] hover:!text-white hover:scale-[1.02] transition-all" @click="backViewer">
                <component :is="ArrowRightEndOnRectangleIcon" class="w-6 h-6 stroke-[2]" />

                <span class="text-xs md:text-sm">Faça Login ou Cadastre-se para aproveitar as vantagens</span>
            </Button>

            <button class="w-full max-w-md font-semibold text-xs md:text-sm rounded-md !px-4 !py-2 hover:underline transition-all"
                @click="backViewer">
                Não quero aproveitar as vantagens e continuar como visitante
            </button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import {
    ArrowRightEndOnRectangleIcon
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['back']);

const model = defineModel('visible', { default: false });
const backViewer = () => {
    emit('back');
}

const props = defineProps({
    imageURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});
</script>

<style lang="scss">
.modalContent {
    width: 80vw;
    max-width: 600px;
    max-height: 85vh;
    background-color: var(--modal-background-color);
    border-radius: 12px;
    border: solid 0.7px black;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

    padding: 0 !important;
    overflow: hidden;
}

.promo-banner {
    width: 100%;
    height: auto;
    overflow: hidden;
}

.promo-banner img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
}

.promo-body {
    background-color: #e8e0d6;
    padding: 28px 24px 24px;
    text-align: center;
}

.promo-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: #000;
    line-height: 1.5;
    margin: 0;

    @media (max-width: 640px) {
        font-size: 0.85rem;
    }
}
</style>