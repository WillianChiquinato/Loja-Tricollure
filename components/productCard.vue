<template>
    <div class="bg-white rounded-lg border border-gray-500 shadow-md overflow-hidden product-card">
        <img :src="product.image" class="w-full h-72 object-cover rounded-t-lg" alt="" />

        <div class="p-5 flex flex-col text-center">
            <h2 class="font-semibold text-lg mt-5 mb-3">
                {{ product.name }}
            </h2>

            <p class="text-sm line-through text-gray-400">
                R${{ formatNumber(product.price * 1.2) }}
            </p>

            <p class="text-lg font-bold text-amber-700">
                R${{ formatNumber(product.pix) }} <span class="text-sm">com PIX</span>
            </p>
            <p>ou</p>
            <p class="text-sm text-gray-800">
                <strong>{{ product.creditQuantity }}x</strong> de <strong>R${{ formatNumber(product.price /
                    product.creditQuantity) }}</strong> sem juros
            </p>

            <div class="flex button-buyEye">
                <button class="buy-button flex">
                    <ShoppingBagIcon class="w-5 h-5 stroke-[1.5] text-white" />
                    <span class="text-xs font-semibold">COMPRAR</span>
                </button>
                
                <button class="eye-button flex">
                    <EyeIcon class="w-5 h-5 stroke-[1.5] text-white" />
                    <span class="text-xs font-semibold">DETALHES</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatNumber } from '~/utils/Format';
import {
    ShoppingBagIcon,
    EyeIcon
} from '@heroicons/vue/24/outline'

defineProps({
    product: Object
})
</script>

<style scoped lang="scss">
.product-card {
    width: 100%;
    max-width: 250px;
    transition: 0.3s ease;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-5px);
        scale: 1.02;
    }

    @media (max-width: 640px) {
        max-width: 100%;
    }
}

.button-buyEye {
    display: flex;
    width: 100%;
    gap: 0.5rem;
    margin: 1rem auto;
    padding: 0 0.75rem;

    button {
        flex: 1;
        min-width: 0;
        background-color: #000;
        color: #fff;
        padding: 0.5rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #333;
        }
    }

    .buy-button {
        background-color: #9D5C26;

        &:hover {
            background-color: #db6300;
        }
    }

    .eye-button {
        background-color: #555;

        &:hover {
            background-color: #777;
        }
    }
}
</style>
