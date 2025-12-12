<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <HeaderDesktop />

    <!-- Carrossel dos banners -->
    <div id="inicio" class="relative bannerHomePage">
      <swiper class="w-full banner-swiper" :modules="[Pagination, Autoplay]" :slides-per-view="1" :pagination="{
        clickable: true,
        dynamicBullets: true
      }" loop :autoplay="{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }" :speed="800" :grabCursor="true">
        <swiper-slide v-for="(img, index) in banners" :key="index">
          <div class="banner-container">
            <img :src="img" :alt="`Banner ${index + 1}`" class="banner-image" />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <br><br><br><br><br><br><br>
  </div>
</template>

<script setup lang="ts">
import HeaderDesktop from '~/composables/headerDesktop.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

import Banner1 from '@/assets/Images/BannerTeste1.png';
import Banner2 from '@/assets/Images/BannerTeste2.png';
import Banner3 from '@/assets/Images/BannerTeste3.png';

import 'swiper/css';
import 'swiper/css/pagination';

const banners = [Banner1, Banner2, Banner3];
</script>

<style lang="scss">
.bannerHomePage {
  margin-top: 10rem;

  @media (max-width: 1024px) {
    margin-top: 13.5rem;
  }

  @media (max-width: 640px) {
    margin-top: 12.5rem;
  }
}

.banner-swiper {
  height: 70vh;

  @media (max-width: 768px) {
    height: 50vh;
  }

  @media (max-width: 480px) {
    height: 40vh;
  }
}

.banner-container {
  width: 100%;
  height: 100%;
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
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5) !important;
  opacity: 1;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.8) !important;
    transform: scale(1.1);
  }
}

.swiper-pagination-bullet-active {
  background: rgb(255, 255, 255) !important;
  border-color: rgba(0, 0, 0, 0.2);
  transform: scale(1.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    transform: scale(1.2);
  }
}

.swiper-pagination-bullet-active-main {
  background: rgb(255, 255, 255) !important;
}
</style>