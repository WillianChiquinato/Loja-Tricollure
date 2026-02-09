<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="$emit('update:isVisible', false)">
    </div>
    <Transition name="slide">
        <div v-if="isVisible"
            class="fixed right-0 top-0 h-full w-full md:w-[400px] bg-[var(--background-color)] z-50 shadow-2xl flex flex-col">
            <!-- Header -->
            <div class="headerContainer">
                <h2 class="text-2xl font-bold mt-2">Carrinho</h2>
                <button @click="$emit('update:isVisible', false)" class="text-gray-600 text-2xl hover:text-gray-800">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <div v-if="cartItems.length != 0" class="flex-1 overflow-y-auto !px-2 !space-y-4">
                <CartItem v-for="item in cartItems" :key="item.id" :item="item"
                    :isRemoving="removingItemIds.includes(item.skuId)" @remove="removeItem" />
            </div>
            <div v-else class="flex-1 justify-center text-center !px-2 !space-y-7 !py-4">
                <span class="text-sm text-gray-600">Nenhum item adicionado no carrinho até o momento</span>
            </div>

            <div class="footerContainer">
                <div v-if="total > 1000" class="footerBonusContent">
                    <i class="pi pi-gift text-orange-600"></i>
                    <span class="text-sm text-gray-800">Parabéns! Você ganhou Frete Grátis</span>
                </div>
                <div v-else class="footerBonusContent">
                    <i class="pi pi-info-circle text-gray-600"></i>
                    <span class="text-sm text-gray-800">Adicione mais {{ formatPrice(1000 - total) }} para ganhar Frete Grátis</span>
                </div>

                <div class="CEPSection">
                    <div class="CEPHeader">
                        <i class="pi pi-map-marker text-gray-800 text-xl"></i>
                        <span class="text-sm text-gray-800 text-base">Informe seu CEP</span>
                    </div>
                    <div class="CEPInputSection">
                        <InputMask v-model="cep" placeholder="CEP" mask="99999-999" @complete="OnCepComplete(cep)"
                            class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />

                        <Button class="w-[50%] max-w-md bg-[var(--secondary-color)] text-white font-bold rounded-md !px-4 !py-3 flex items-center justify-center gap-3
                    hover:!bg-[var(--primary-color)] hover:scale-[1.02] transition-all" @click="calculatedCEP(cep)">

                            <span class="text-xs md:text-sm">Calcular</span>
                        </Button>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <span class="text-lg font-medium">Total:</span>
                    <span class="text-2xl font-bold">{{ formatPrice(total) }}</span>
                </div>
                <p class="text-xs text-gray-600 text-center mb-3">
                    Taxas e frete calculados no checkout
                </p>

                <Button class="w-full bg-[var(--secondary-color)] text-white font-bold rounded-md !py-2 flex items-center justify-center gap-3
                    hover:!bg-[var(--primary-color)] hover:scale-[1.02] transition-all" @click="">
                    <component :is="ClipboardDocumentCheckIcon" class="w-9 h-9 stroke-[1.5] text-black flex-shrink-0" />

                    <span class="text-md md:text-xl">Finalizar Pedido</span>
                </Button>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import { InputMask, InputText } from 'primevue';
import { ref, computed, watch } from 'vue';

import {
    ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline';
import CartItem from './CartItem.vue';
import { useCarrinhoStore } from '~/infra/store/carrinhoStore';
import { storeToRefs } from 'pinia';
import { useToastService } from '~/composable/useToast';
import useLoading from '~/composable/useLoading';

const { $httpClient } = useNuxtApp();
const { loadingPop } = useLoading();
const toast = useToastService();

const carrinhoStore = useCarrinhoStore();
const { items: cartItems, cartTotal } = storeToRefs(carrinhoStore);
const total = computed(() => cartTotal.value);

const cep = ref('');
const cepAuthorized = ref(false);
const removingItemIds = ref<number[]>([]);

function OnCepComplete(addressForm: any) {
    const cep = addressForm.replace(/\D/g, '');
    if (cep.length !== 8) {
        cepAuthorized.value = false;
        return;
    }

    cepAuthorized.value = true;
}

function isCepValid(cep: string): boolean {
    if (!cep) return false;

    const onlyNumbers = cep.replace(/\D/g, '');
    return onlyNumbers.length === 8;
}

async function calculatedCEP(cep: string) {
    if (!isCepValid(cep)) {
        toast.error('CEP incompleto');
        return;
    }

    toast.info('Verificando CEP...');

    try {
        const response = await $httpClient.cep.ConsultarCep(
            cep.replace(/\D/g, '')
        );

        if (response.erro) {
            toast.error('CEP inválido');
            return;
        }

        toast.success('CEP buscado com sucesso');
    } catch (error) {
        toast.error('Não foi possível calcular o frete');
    } finally {
        loadingPop();
    }
}

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

async function removeItem(cartItemId: number) {
    if (removingItemIds.value.includes(cartItemId)) {
        return;
    }

    removingItemIds.value = [...removingItemIds.value, cartItemId];

    try {
        await carrinhoStore.removeItem(cartItemId);

        toast.success("Produto deletado com sucesso!!");
    } catch (error) {
        toast.error("Produto nao deletado!!");
    } finally {
        removingItemIds.value = removingItemIds.value.filter((id) => id !== cartItemId);
    }
}

const props = defineProps({
    isVisible: {
        type: Boolean,
        required: true
    }
});
</script>

<style scoped lang="scss">
/* Transição do carrinho */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

/* Scroll customizado */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Estilo individual */
.headerContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
}

.footerContainer {
    border-top: 1px solid #abadaf;
    padding: 1rem;
}

.footerBonusContent {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff4e5;
    border: 1px solid #ffcc80;
    border-radius: 0.375rem;
    padding: 0.5rem;
    margin-bottom: 1rem;
    gap: 0.5rem;
}

.CEPSection {
    margin-bottom: 1rem;
}

.CEPHeader {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
}

.CEPInputSection {
    display: flex;
    gap: 0.5rem;
}
</style>