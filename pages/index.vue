<template>
  <div class="min-h-screen">
    <HeaderDesktop />

    <!-- Carrossel dos banners -->
    <div id="inicio" class="relative bannerHomePage">
      <swiper v-if="retailList.length > 0" class="w-full banner-swiper" :modules="[Pagination, Autoplay]"
        :slides-per-view="1" :pagination="{
          clickable: true,
          dynamicBullets: true
        }" loop :autoplay="{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }" :speed="1000" :grabCursor="true">
        <swiper-slide v-for="(item, index) in retailList" :key="item.id ?? index">
          <div class="banner-container">
            <img :src="item.imageURL" :alt="`Banner ${index + 1}`" class="banner-image" />
          </div>
        </swiper-slide>
      </swiper>

      <!-- Banner padrão -->
      <div v-else class="banner-container">
        <img src="/images/Banners/BannerInicial.png" alt="banner padrao" class="banner-image" />
      </div>
    </div>

    <div class="grid place-items-center promotionsHomePage mt-20 gap-10
         grid-cols-1
         sm:grid-cols-2
         lg:grid-cols-4">
      <div v-for="promotions in promotionsHomePage" :key="promotions.title"
        class="flex flex-col items-center text-center">
        <component :is="promotions.icon" class="w-12 h-12 sm:w-20 sm:h-20 mb-6 stroke-[0.9] text-black" />
        <h1 class="text-base font-bold sm:text-2xl">{{ promotions.title }}</h1>
        <p class="text-sm sm:text-base mt-4">{{ promotions.subtitle }}</p>
      </div>
    </div>

    <div id="destaques" class="flex justify-center mt-20">
      <h1 class="text-3xl font-bold sm:text-4xl">DESTAQUES</h1>
    </div>

    <!-- Carrossel de componentes -->
    <Swiper :modules="[Navigation]" :slides-per-view="1" :space-between="20" navigation :breakpoints="{
      600: { slidesPerView: 2 },
      750: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1300: { slidesPerView: 5 }
    }" class="products-swiper">
      <SwiperSlide v-for="product in products" :key="product.id" class="swiper-slide-flex">
        <ProductCard :product="product" />
      </SwiperSlide>
    </Swiper>

    <button class="start-shopping-button">Comece a comprar agora mesmo -></button>

    <div class="flex w-full h-full bg-gray-200 mb-10">
      <img :src="DestaqueImage?.imageURL" alt="Imagem de Destaque" class="w-full h-full object-cover object-center" />
    </div>

    <div id="novidades" class="flex flex-col justify-center items-center novidadesContainer">
      <h1 class="text-xl font-bold sm:text-2xl mt-6">Fique por dentro das novidades</h1>
      <p class="text-sm sm:text-base font-medium mt-2">Increva-se para receber todas as novidades e noticias,
        exclusividadee online e muito mais</p>

      <div class="flex flex-col items-center gap-2">
        <!-- E-mail -->
        <div class="w-72 sm:w-96">
          <label class="block text-xs sm:text-base tracking-widest text-gray-700 mb-2 text-center"
            :class="!isEmailValid(newsLetter.email!) && newsLetter.email ? 'text-red-500' : 'text-gray-700'">
            E-MAIL *
          </label>
          <InputText v-model="newsLetter.email" type="email" class="w-full bg-transparent border-0 border-b border-gray-400
             text-center focus:outline-none focus:ring-0
             focus:border-gray-700" :class="!isEmailValid(newsLetter.email!) && newsLetter.email ? 'border-red-500' : 'border-gray-400'" />

          <span v-if="!isEmailValid(newsLetter.email!) && newsLetter.email" class="block text-sm text-red-500 text-center">
            Email inválido
          </span>
        </div>

        <!-- Telefone -->
        <div class="w-72 sm:w-96">
          <label class="block text-xs sm:text-base tracking-widest text-gray-700 mb-2 text-center">
            TELEFONE *
          </label>
          <InputMask mask="(99) 99999-9999" type="text" v-model="newsLetter.phoneNumber" class="w-full bg-transparent border-0 border-b border-gray-400
             text-center focus:outline-none focus:ring-0
             focus:border-gray-700" />
        </div>

        <!-- Botão -->
        <button class="start-shopping-button" @click="subscriberNewsLetter(newsLetter)">
          Enviar
        </button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  TruckIcon,
  TagIcon,
  CreditCardIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline';

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();

import ProductCard from '~/components/productCard.vue'
import HeaderDesktop from '~/components/Headers.vue';
import Footer from '~/components/Footer.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import useLoading from '~/composable/useLoading';
import { useNuxtApp } from '#app';

import type { IRetail } from '~/infra/interfaces/services/retail';

import Product1 from '@/assets/Images/Product1.png';
import Product2 from '@/assets/Images/Product2.png';
import Product3 from '@/assets/Images/Product3.png';
import Product4 from '@/assets/Images/Product4.png';
import Product5 from '@/assets/Images/Product5.png';
import Product6 from '@/assets/Images/Product6.png';
import Product7 from '@/assets/Images/Product7.png';
import Product8 from '@/assets/Images/Product8.png';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { InputText } from 'primevue';
import { delay } from '~/composable/useDelay';
import { useToastService } from '~/composable/useToast';
import { NewsLetterSource, type INewsLetter } from '~/infra/interfaces/services/newsLetter';
import { isEmailValid, isPhoneNumberValid } from '~/utils/Invalids';

const toast = useToastService();

const retailList = ref<IRetail[]>([]);
const DestaqueImage = ref<IRetail | null>(null);

const newsLetter = ref<Partial<INewsLetter>>({
  email: '',
  phoneNumber: '',
  source: NewsLetterSource.Website
});

const promotionsHomePage = [
  {
    title: 'Frete Grátis',
    subtitle: 'Na compra acima de R$ 199,00',
    icon: TruckIcon,
  },
  {
    title: '5% de Desconto',
    subtitle: 'Use o cupom: Gabriel até dia 15/04/26',
    icon: TagIcon,
  },
  {
    title: 'Parcelamento',
    subtitle: 'Parcelamentos em ate 48x sem juros',
    icon: CreditCardIcon,
  },
  {
    title: 'Whatsapp',
    subtitle: 'Contato no numero (11)94864-1187',
    icon: PhoneIcon,
  },
]

const products = [
  {
    id: 1,
    name: 'Vestido Azul',
    price: 499.90,
    pix: 359.90,
    creditQuantity: 4,
    image: Product1
  },
  {
    id: 2,
    name: 'Blusa Sofisticada',
    price: 109.90,
    pix: 79.90,
    creditQuantity: 4,
    image: Product2
  },
  {
    id: 3,
    name: 'Vestido Midi com fenda',
    price: 40.00,
    pix: 35.90,
    creditQuantity: 4,
    image: Product3
  },
  {
    id: 4,
    name: 'Vestido Longo',
    price: 119.90,
    pix: 100.00,
    creditQuantity: 4,
    image: Product4
  },
  {
    id: 5,
    name: 'Saia Rodada',
    price: 89.90,
    pix: 70.00,
    creditQuantity: 4,
    image: Product5
  },
  {
    id: 6,
    name: 'Macacão Estampado',
    price: 159.90,
    pix: 120.00,
    creditQuantity: 4,
    image: Product6
  },
  {
    id: 7,
    name: 'Vestido Casual',
    price: 79.90,
    pix: 59.90,
    creditQuantity: 4,
    image: Product7
  },
  {
    id: 8,
    name: 'Blusa de Seda',
    price: 129.90,
    pix: 99.90,
    creditQuantity: 4,
    image: Product8
  },
]

async function loadRetails() {
  loadingPush();

  try {
    const retails = await $httpClient.retail.GetRetails();

    if (!retails || retails.result.length === 0) {
      retailList.value = [];
      return;
    }

    const allRetails = retails.result;

    // Pega o destaque
    const emphasisItem = allRetails.find(r => r.isEmphasis === true);
    DestaqueImage.value = emphasisItem ?? null;

    // Lista SEM o destaque
    retailList.value = allRetails.filter(r => r.isEmphasis !== true);
  } catch (err) {
    console.warn("Erro ao buscar retails:", err);
    retailList.value = [];
  }
  finally {
    loadingPop();
  }
}

async function subscriberNewsLetter(newsLetter: Partial<INewsLetter>) {
  loadingPush();

  if (!isEmailValid(newsLetter.email!)) {
    toast.error("Por favor, insira um e-mail válido.");
    loadingPop();
    return;
  }

  if (!isPhoneNumberValid(newsLetter.phoneNumber!)) {
    toast.error("Por favor, insira um número de telefone válido.");
    loadingPop();
    return;
  }

  try {
    const response = await $httpClient.newsLetter.SubscriberNewLetter(
      newsLetter.email ?? '',
      newsLetter.phoneNumber ?? '',
      NewsLetterSource.Website
    );

    if (!response || !response.result) {
      toast.error("Erro ao inscrever na newsletter. Tente novamente mais tarde.");
      loadingPop();
      return;
    }

    toast.success("Inscrição na newsletter realizada com sucesso!");
    newsLetter.email = '';
    newsLetter.phoneNumber = '';
  } catch (err) {
    console.warn("Erro ao inscrever na newsletter:", err);
    toast.error("Erro ao inscrever na newsletter. Tente novamente mais tarde.");
  }
  finally {
    loadingPop();
  }
}

onMounted(() => {
  loadRetails();
});
</script>

<style lang="scss">
:root {
  --swiper-navigation-color: #000;
}

.bannerHomePage {
  margin-top: 9.6rem;

  @media (max-width: 1024px) {
    margin-top: 13.5rem;
  }

  @media (max-width: 640px) {
    margin-top: 12.5rem;
  }
}

.banner-swiper {
  height: 85vh;

  @media (max-width: 768px) {
    height: 50vh;
  }

  @media (max-width: 480px) {
    height: 40vh;
  }
}

.banner-swiper :deep(.swiper-slide) {
  height: 100%;
}

.banner-container {
  width: 100%;
  height: 100%;
  max-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.swiper-pagination {
  bottom: 30px !important;
  z-index: 10;

  @media (max-width: 768px) {
    bottom: 20px !important;
  }
}

.swiper-pagination-bullet {
  width: 15px;
  height: 15px;
  background: rgba(32, 32, 32, 0.750) !important;
  opacity: 1;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid rgba(35, 35, 35, 0.812);

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }

  &:hover {
    background: rgba(161, 186, 180, 0.8) !important;
    transform: scale(1.1);
  }
}

.swiper-pagination-bullet-active {
  background: rgb(161, 186, 180) !important;
  border-color: rgba(0, 0, 0, 0.6);
  transform: scale(1.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    transform: scale(1.2);
  }
}

.swiper-pagination-bullet-active-main {
  background: rgb(255, 255, 255) !important;
}

.products-swiper {
  position: relative;
  width: 90%;

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(0, 0, 0, 0.5);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    z-index: 10;

    &:after {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      transform: translateY(-50%) scale(1.1);
    }

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;

      &:after {
        font-size: 16px;
      }
    }
  }

  :deep(.swiper-button-prev) {
    left: 10px;

    @media (min-width: 1024px) {
      left: 20px;
    }
  }

  :deep(.swiper-button-next) {
    right: 10px;

    @media (min-width: 1024px) {
      right: 20px;
    }
  }

  :deep(.swiper-button-disabled) {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

.swiper-slide-flex {
  display: flex;
  justify-content: center;
  padding: 2rem 0.2rem;
}

.promotionsHomePage {
  padding: 7rem 0.5rem;
  height: auto;

  @media (max-width: 640px) {
    padding: 3rem 0.5rem;
  }
}

.start-shopping-button {
  display: block;
  margin: 1.7rem auto 6rem auto;
  padding: 0.5rem 4rem;
  background-color: #F9F9F9;
  color: #8B5E33;
  font-size: 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 0.4rem;
  border: 1px solid #8B5E33;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #ffffff;
    color: #885e36;

    transform: scale(1.05);
  }

  @media (max-width: 640px) {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
}

.novidadesContainer {
  margin: 7rem 0rem 0rem 0rem;

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    text-align: center;
    max-width: 600px;
    margin-bottom: 1.7rem;
  }
}
</style>