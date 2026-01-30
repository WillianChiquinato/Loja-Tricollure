<template>
    <div class="bg-white rounded-lg border border-gray-500 shadow-md overflow-hidden product-card">
        <div class="relative">
            <img :src="product?.images?.find((image: any) => image.isPrimary)?.imageURL"
                class="w-full h-72 object-cover rounded-t-lg" alt="" />

            <!-- Overlay com blur -->
            <Transition name="fade">
                <div v-if="showDetails" class="absolute inset-0 bg-white/60 backdrop-blur-sm
           flex items-end justify-center z-10 pb-4">
                    <div class="flex flex-col">
                        <div class="prime-group">
                            <label class="prime-label">Cores</label>

                            <Dropdown v-model="selectedColor" :options="colors" optionLabel="label" optionValue="value"
                                placeholder="Selecione uma cor" class="prime-dropdown" />
                        </div>

                        <div class="prime-group">
                            <label class="prime-label">Tamanhos</label>

                            <Dropdown v-model="selectedSize" :options="sizes" placeholder="Selecione um tamanho"
                                class="prime-dropdown" />
                        </div>

                        <div class="w-full flex justify-center text-center">
                            <button @click="closeDetails" class="text-xl text-red-600 hover:text-red-800
                            text-center
                            !mb-2
                            border border-red-600 rounded-full
                            w-8 h-8 flex items-center justify-center
                            hover:scale-110 transition-transform">
                                &times;
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <div class="p-5 flex flex-col text-center">
            <h2 class="font-semibold text-lg mt-5 mb-3 line-clamp-1 break-words">
                {{ product?.product?.name }}
            </h2>

            <p class="text-sm line-through text-gray-400">
                R${{ formatNumber(product?.skus?.[0]?.price ? product.skus[0].price * 1.45 : 0) }}
            </p>

            <p class="text-lg font-bold text-amber-700">
                R${{ formatNumber(product?.skus?.[0]?.price ? product.skus[0].price : 0) }} <span class="text-sm">com
                    PIX</span>
            </p>
            <p>ou</p>
            <p class="text-sm text-gray-800">
                <strong>{{ credit[0].Quantity }}</strong> de <strong>R${{ formatNumber(product?.skus?.[0]?.price ?
                    product.skus[0].price /
                    credit[0].Quantity : 0) }}</strong> sem juros
            </p>

            <div class="flex button-buyEye">
                <button class="buy-button flex" @click="buyProduct">
                    <ShoppingBagIcon class="w-5 h-5 stroke-[1.5] text-white" />
                    <span class="text-xs font-semibold">COMPRAR</span>
                </button>

                <button class="eye-button flex" @click="openDetails">
                    <EyeIcon class="w-5 h-5 stroke-[1.5] text-white" />
                    <span class="text-xs font-semibold">DETALHES</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo, useNuxtApp } from '#app';

import { formatNumber } from '~/utils/Format';
import {
    ShoppingBagIcon,
    EyeIcon
} from '@heroicons/vue/24/outline'

import { CreditInterface } from '~/infra/interfaces/credit';
import { useToastService } from '~/composable/useToast';
import { useModalStore } from '~/infra/store/modalStore';
import type { ICartItem } from '~/infra/interfaces/services/cart';
import type { IAuth } from '~/infra/interfaces/services/auth';
const { $httpClient } = useNuxtApp();

const modalStore = useModalStore()
const toast = useToastService();
// Defina as props primeiro
const props = defineProps({
    product: Object
})

const showDetails = ref(false);
const credit = CreditInterface();

const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedModel = ref(null)

// Agora use props.product em vez de apenas product
const colors = computed(() => {
    if (!props.product || !props.product.skus) return [];
    return [...new Set(props.product.skus.map((sku: any) => sku.color))]
        .map(color => ({
            label: typeof color === 'string' ? color.charAt(0).toUpperCase() + color.slice(1) : '',
            value: color
        }))
})

/* 📏 Tamanhos únicos */
const sizes = computed(() => {
    if (!props.product || !props.product.skus) return [];
    return [...new Set(props.product.skus.map((sku: any) => sku.size))]
})

const openDetails = () => {
    showDetails.value = true
    console.log("Produto Aberto: ", props.product);
}

const closeDetails = () => {
    showDetails.value = false
}

async function buyProduct() {
    if (!selectedColor.value || !selectedSize.value) {
        toast.info('Por favor, selecione uma cor e um tamanho antes de comprar.');
        return;
    }

    try {
        var response = await $httpClient.product.verifyStock(props.product?.product?.id, selectedColor.value, selectedSize.value);
        var responseUser = await $httpClient.auth.Logged();

        // Se não estiver logado, result será null ou undefined
        if (!responseUser.user.result) {
            toast.info('Por favor, faça login para continuar com a compra.');
            modalStore.isLoginOpen = true;
            return;
        }

        if (response.result != null) {
            //Adiciona ao carrinho.
            const cartItem: ICartItem = {
                userId: responseUser.user.result.id,
                sessionId: "",
                products: [{
                    productId: response.result.productId,
                    color: response.result.color,
                    size: response.result.size,
                    quantity: 1
                }]
            };
            
            var responseAddCart = await $httpClient.cart.addToCart(cartItem);

            if (responseAddCart.success) {
                toast.success('Produto adicionado ao carrinho com sucesso!');
            }
            else {
                toast.error('Ocorreu um erro ao adicionar o produto ao carrinho. Por favor, tente novamente mais tarde.');
            }
        }
        else
        {
            toast.error('Estoque insuficiente para o produto selecionado. Por favor, escolha outra variação.');
        }
    }
    catch (error) {
        console.error('Erro ao navegar para a página de checkout:', error);
        toast.error('Ocorreu um erro ao tentar comprar o produto. Por favor, tente novamente mais tarde.');
    }
}
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

.prime-group {
    width: 180px;
    min-width: 180px;
    text-align: center;
    margin-bottom: 1.4rem;
}

.prime-label {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: block;
}

.prime-dropdown {
    width: 100%;
}

/* Container */
.prime-dropdown .p-dropdown {
    border-radius: 0.6rem;
    border: 1px solid #c9a37a;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

/* Texto */
.prime-dropdown .p-dropdown-label {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: #555;
}

/* Ícone */
.prime-dropdown .p-dropdown-trigger {
    width: 2.5rem;
}

.prime-dropdown .p-dropdown-trigger-icon {
    color: #666;
}

/* Focus */
.prime-dropdown.p-focus .p-dropdown {
    border-color: #9D5C26;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
