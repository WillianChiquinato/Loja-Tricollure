<template>
    <div class="cartItemContainer">
        <img :src="item.image" alt="Produto" class="imageProduct" />

        <div class="flex flex-col flex-1 justify-between !p-2">
            <div class="flex justify-between items-start gap-2">
                <h3 class="text-md font-semibold leading-snug">
                    {{ item.name }}<br />
                    {{ item.category }}
                </h3>

                <button class="text-gray-500 hover:text-red-500 hover:scale-110 transition" @click="removeItem(item.id)">
                    <i class="pi pi-trash"></i>
                </button>
            </div>

            <!-- TAMANHO -->
            <span class="text-sm text-gray-500">
                Tamanho: <strong>{{ item.size }}</strong>
            </span>

            <!-- RODAPÉ -->
            <div class="flex items-center justify-between">
                <select v-model="item.quantity"
                    class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>

                <span class="text-md font-semibold">
                    R$ {{ formatNumber(item.pricePerUnit) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatNumber } from '~/utils/Format';

const emit = defineEmits(['remove']);

const removeItem = (itemId: number) => {
    emit('remove', itemId);
}

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

</script>

<style scoped lang="scss">
.cartItemContainer {
    display: flex;
    gap: 0.6rem;
    border-radius: 0.3rem;
    border: 1px solid var(--primary-color);
}

.imageProduct {
    width: 7rem;
    height: 10rem;
    object-fit: cover;
    border-top-left-radius: 0.3rem;
    border-bottom-left-radius: 0.3rem;
}
</style>