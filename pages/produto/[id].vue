<template>
    <div class="product-page">
        <HeaderDesktop />

        <div class="product-shell">
            <div class="product-grid">
                <div class="thumbs">
                    <button class="thumb-nav" type="button" @click="scrollThumbs(-1)">
                        <ChevronUpIcon class="w-5 h-5" />
                    </button>

                    <div ref="thumbListRef" class="thumb-list">
                        <button v-for="(img, index) in images" :key="index" type="button" class="thumb-item"
                            :class="{ active: normalizeImage(img) === selectedImage }"
                            @click="selectedImage = normalizeImage(img)">
                            <img :src="normalizeImage(img)" alt="Miniatura do produto" />
                        </button>
                    </div>

                    <button class="thumb-nav" type="button" @click="scrollThumbs(1)">
                        <ChevronDownIcon class="w-5 h-5" />
                    </button>
                </div>

                <div class="main-image">
                    <img :src="selectedImage || primaryImage" alt="Imagem do produto" />
                </div>

                <div class="details">
                    <h1 class="product-title">{{ productName }}</h1>

                    <div class="price-block">
                        <div class="price-main">R$ {{ formatNumber(basePrice) }}</div>
                        <div class="price-pix">R$ {{ formatNumber(pixPrice) }} com pagamento no PIX</div>
                        <div class="price-installments">
                            {{ credit[0].Quantity }}x de R$ {{ formatNumber(installmentPrice) }} sem juros
                        </div>
                    </div>

                    <div class="variant-block">
                        <span class="variant-label">Cor: <strong>{{ selectedColor || '-' }}</strong></span>
                        <div class="option-list">
                            <button v-for="color in colors" :key="color" type="button" class="option-button"
                                :class="{ active: selectedColor === color }" @click="clickColor(color as string)">
                                {{ color }}
                            </button>
                        </div>
                    </div>

                    <div class="variant-block">
                        <span class="variant-label">Tamanho:</span>
                        <div class="option-list">
                            <button v-for="size in sizes" :key="size" type="button" class="option-button"
                                :class="{ active: selectedSize === size }" @click="clickSize(size as string)">
                                {{ size }}
                            </button>
                        </div>
                    </div>

                    <span v-if="activeSku?.stock > 1" class="variant-label !mb-1">{{ activeSku?.stock }} quantidades
                        disponiveis</span>
                    <span v-else class="variant-label !mb-1">{{ activeSku?.stock }} quantidade disponivel</span>

                    <div class="buy-row">
                        <div class="qty-control">
                            <button type="button" class="qty-btn" @click="decreaseQty">-</button>
                            <span class="qty-value">{{ quantity }}</span>
                            <button type="button" class="qty-btn" @click="increaseQty">+</button>
                        </div>

                        <button class="buy-button" type="button" @click="addToCart" :disabled="isAddingCart">
                            <ShoppingBagIcon class="w-5 h-5" />
                            <span v-if="isAddingCart" class="text-dm">Adicionando...</span>
                            <span v-else>COMPRAR</span>
                        </button>
                    </div>

                    <div class="buy-meta">
                        <div class="flex flex-row gap-1">
                            <BackwardIcon class="w-5 h-5" />
                            <span>Entrega rapida</span>
                        </div>
                        <div class="flex flex-row gap-1">
                            <FolderOpenIcon class="w-5 h-5" />
                            <span>Troca gratis</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useNuxtApp, useRoute } from '#app';
import { ChevronDownIcon, ChevronUpIcon, ShoppingBagIcon, BackwardIcon, FolderOpenIcon } from '@heroicons/vue/24/outline';

import HeaderDesktop from '~/components/Headers.vue';
import Footer from '~/components/Footer.vue';
import { formatNumber } from '~/utils/Format';
import { CreditInterface } from '~/infra/interfaces/credit';
import { useToastService } from '~/composable/useToast';
import { useModalStore } from '~/infra/store/modalStore';
import { useCarrinhoStore } from '~/infra/store/carrinhoStore';
import type { ICartItem } from '~/infra/interfaces/services/cart';
import useLoading from '~/composable/useLoading';

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();

const route = useRoute();

const isAddingCart = ref(false);

const toast = useToastService();
const modalStore = useModalStore();
const carrinhoStore = useCarrinhoStore();

const credit = CreditInterface();
const product = ref<any | null>(null);

const selectedColor = ref<string | null>(null);
const selectedSize = ref<string | null>(null);
const selectedImage = ref<string>('');
const quantity = ref(1);

const thumbListRef = ref<HTMLElement | null>(null);

const productName = computed(() =>
    product.value?.product?.name ?? product.value?.name ?? 'Produto'
);

const images = computed(() => {
    return product.value?.images ?? product.value?.productImages ?? [];
});

const skus = computed(() => product.value?.skus ?? []);

const primaryImage = computed(() => {
    const primary = images.value.find((img: any) => img?.isPrimary);
    return normalizeImage(primary || images.value[0] || '');
});

const colors = computed(() => {
    if (!skus.value.length) return [];
    const filtered = selectedSize.value
        ? skus.value.filter((sku: any) => sku.size === selectedSize.value)
        : skus.value;
    return [...new Set(filtered.map((sku: any) => sku.color))].filter(Boolean);
});

const sizes = computed(() => {
    if (!skus.value.length) return [];
    const filtered = selectedColor.value
        ? skus.value.filter((sku: any) => sku.color === selectedColor.value)
        : skus.value;
    return [...new Set(filtered.map((sku: any) => sku.size))].filter(Boolean);
});

const activeSku = computed(() => {
    if (!skus.value.length) return null;
    if (selectedColor.value && selectedSize.value) {
        return skus.value.find(
            (sku: any) => sku.color === selectedColor.value && sku.size === selectedSize.value
        );
    }
    return skus.value.find((sku: any) => sku.isActive) ?? skus.value[0];
});

const basePrice = computed(() => activeSku.value?.price ?? 0);
const pixPrice = computed(() => basePrice.value * 0.8);
const installmentPrice = computed(() =>
    credit[0].Quantity ? basePrice.value / credit[0].Quantity : 0
);

watch(images, (nextImages) => {
    if (!nextImages.length) return;
    selectedImage.value = primaryImage.value;
});

watch([colors, sizes], ([nextColors, nextSizes]) => {
    if (selectedColor.value && !nextColors.includes(selectedColor.value)) {
        selectedColor.value = null;
    }
    if (selectedSize.value && !nextSizes.includes(selectedSize.value)) {
        selectedSize.value = null;
    }
});

function normalizeImage(image: any): string {
    if (!image) return '';
    if (typeof image === 'string') return image;
    return image.imageURL ?? image.url ?? '';
}

function scrollThumbs(direction: number) {
    if (!thumbListRef.value) return;
    const firstItem = thumbListRef.value.querySelector<HTMLElement>('.thumb-item');
    const step = firstItem ? firstItem.offsetHeight + 16 : 120;

    thumbListRef.value.scrollBy({
        top: direction * step,
        behavior: 'smooth'
    });
}

function increaseQty() {
    const max = activeSku.value?.stock ?? 10;
    if (quantity.value < max) quantity.value += 1;
}

function decreaseQty() {
    if (quantity.value > 1) quantity.value -= 1;
}

function clickColor(color: string) {
    if (selectedColor.value === color) {
        selectedColor.value = null;
    } else {
        selectedColor.value = color;
    }

    loadingNewPrice();
}

function clickSize(size: string) {
    if (selectedSize.value === size) {
        selectedSize.value = null;
    } else {
        selectedSize.value = size;
    }

    loadingNewPrice();
}

function loadingNewPrice() {
    if (!selectedColor.value || !selectedSize.value) return;

    loadingPush();

    setTimeout(() => {
        loadingPop();
    }, 500);
}

async function loadProduct() {
    loadingPush();

    try {
        const pageResult = await $httpClient.product.GetProductsById(Number(route.params.id));

        product.value = pageResult?.result ?? null;
        selectedImage.value = primaryImage.value;
    } catch (error) {
        console.warn('Erro ao carregar produto:', error);
        product.value = null;
    } finally {
        loadingPop();
    }
}

async function addToCart() {
    if (!selectedColor.value || !selectedSize.value) {
        toast.info('Selecione cor e tamanho antes de comprar.');
        return;
    }

    if (!carrinhoStore.isLogged) {
        toast.info('Por favor, faca login para continuar com a compra.');
        modalStore.isLoginOpen = true;
        return;
    }

    try {
        isAddingCart.value = true;
        const response = await $httpClient.product.VerifyStock(
            product.value?.product?.id ?? product.value?.id,
            selectedColor.value,
            selectedSize.value
        );

        if (response.result != null) {
            const cartItem: ICartItem = {
                userId: carrinhoStore.userId ?? 0,
                sessionId: '',
                products: [
                    {
                        productId: response.result.productId,
                        color: response.result.color,
                        size: response.result.size,
                        quantity: quantity.value
                    }
                ]
            };

            await carrinhoStore.addItem(cartItem);
            toast.success('Produto adicionado ao carrinho com sucesso!');
        }
    } catch (error: any) {
        if (error.code === 'NOT_LOGGED') {
            toast.info('Por favor, faca login para continuar.');
            modalStore.isLoginOpen = true;
            return;
        }

        toast.error(error.message ?? 'Erro ao adicionar produto ao carrinho.');
    }
    finally {
        isAddingCart.value = false;
    }
}

onMounted(loadProduct);
</script>

<style scoped lang="scss">
.product-page {
    min-height: 100vh;
    margin-top: 9.6rem;
    background: var(--background-color);

    @media (max-width: 1024px) {
        margin-top: 13.5rem;
    }

    @media (max-width: 640px) {
        margin-top: 12.5rem;
    }
}

.product-shell {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
}

.product-loading {
    padding: 4rem 1rem;
    text-align: center;
    color: #775339;
    font-weight: 600;
}

.product-grid {
    display: grid;
    grid-template-columns: 86px 1fr 420px;
    gap: 2rem;
    align-items: start;
}

.thumbs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    height: 520px;
}

.thumb-nav {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid #d8c2a8;
    background: #fffaf3;
    color: #7b5534;
    display: grid;
    place-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(123, 85, 52, 0.18);
    }
}

.thumb-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 420px;
    overflow-y: auto;
    padding: 0.25rem 0.35rem;
}

.thumb-item {
    width: 70px;
    height: 35%;
    border-radius: 0.6rem;
    border: 1px solid #e2d6c8;
    overflow: hidden;
    background: #fff;
    transition: border 0.2s ease, transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
}

.thumb-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.thumb-item.active {
    border-color: #a8703b;
    transform: scale(1.1);
}

.main-image {
    background: #f2ebe3;
    border-radius: 1rem;
    padding: 1.5rem;
    display: grid;
    place-items: center;
    min-height: 520px;
}

.main-image img {
    width: 100%;
    max-height: 540px;
    object-fit: contain;
}

.details {
    background: #fffaf3;
    border-radius: 1.2rem;
    border: 1px solid #eadccf;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(110, 73, 36, 0.12);
}

.product-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #3f2c1f;
    margin-bottom: 1.5rem;
}

.price-block {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.price-main {
    font-size: 1.8rem;
    font-weight: 700;
    color: #a8703b;
}

.price-pix {
    font-size: 0.95rem;
    color: #6c4c2f;
}

.price-installments {
    font-size: 0.9rem;
    color: #6c4c2f;
}

.variant-block {
    margin-bottom: 1.5rem;
}

.variant-label {
    font-size: 0.95rem;
    color: #6c4c2f;
    display: block;
    margin-bottom: 0.6rem;
}

.option-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
}

.option-button {
    padding: 0.35rem 0.9rem;
    border-radius: 0.5rem;
    border: 1px solid #d7c2ae;
    background: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    color: #4b3626;
    text-transform: capitalize;
    transition: all 0.2s ease;
}

.option-button.active {
    background: #a8703b;
    border-color: #a8703b;
    color: #fff;
}

.buy-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.qty-control {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border: 1px solid #d7c2ae;
    border-radius: 0.75rem;
    padding: 0.45rem 0.9rem;
    background: #fff;
}

.qty-btn {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    border: 1px solid #d7c2ae;
    display: grid;
    place-items: center;
    color: #4b3626;
    background: #fffaf3;
}

.qty-value {
    font-weight: 700;
    min-width: 18px;
    text-align: center;
}

.buy-button {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #a8703b;
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.7rem 1.2rem;
    border-radius: 0.8rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(168, 112, 59, 0.25);
        background-color: #db6300;
    }
}

.buy-meta {
    display: flex;
    margin-top: 1.2rem;
    gap: 1.5rem;
    font-size: 0.85rem;
    color: #6c4c2f;
}

@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: 70px 1fr;
    }

    .details {
        grid-column: 1 / -1;
    }
}

@media (max-width: 720px) {
    .product-grid {
        grid-template-columns: 1fr;
    }

    .thumbs {
        flex-direction: row;
        justify-content: center;
        order: 2;
        height: auto;
    }

    .thumb-list {
        flex-direction: row;
        height: auto;
        max-width: 100%;
        overflow-x: auto;
    }

    .thumb-item {
        width: 70px;
        height: 90px;
    }

    .main-image {
        min-height: 380px;
    }
}
</style>