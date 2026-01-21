<template>
    <Transition name="loading-fade">
        <div class="loading-screen">
            <div class="loading-content">
                <div class="lipstick-container">
                    <div class="lipstick-case"></div>
                    <div class="lipstick-bullet"></div>
                    <div class="shine"></div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p class="text-animate">{{ displayedText }}</p>
                <div class="sparkles">
                    <span class="sparkle" v-for="n in 5" :key="n"></span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const textsRandom = [
    "Aplicando o toque final...",
    "Adicionando glamour...",
    "Seu estilo está se preparando...",
    "Beleza em progresso...",
    "Momentos de elegância chegando...",
];

const displayedText = ref("");
onMounted(() => {
    let index = 0;
    const randomIndex = Math.floor(Math.random() * textsRandom.length);
    const fullText = textsRandom[randomIndex];
    const interval = setInterval(() => {
        displayedText.value += fullText[index];
        index++;
        if (index >= fullText.length) {
            clearInterval(interval);
        }
    }, 50);
});
</script>

<style scoped lang="scss">
/* Transição de entrada do loading screen */
.loading-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.loading-fade-enter-from {
    opacity: 0;
    backdrop-filter: blur(0px);
    
    .loading-content {
        transform: scale(0.9) translateY(20px);
        opacity: 0;
    }
}

.loading-fade-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
    
    .loading-content {
        transform: scale(1.1) translateY(-20px);
        opacity: 0;
    }
}

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(110, 70, 33, 0.532) 0%, rgba(0, 0, 0, 0.888) 100%);
    backdrop-filter: blur(15px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 9999;
    overflow: hidden;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation: contentAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes contentAppear {
    0% {
        transform: scale(0.8) translateY(30px);
        opacity: 0;
    }
    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.lipstick-container {
    position: relative;
    width: 60px;
    height: 150px;
    animation: rotate360 3s ease-in-out infinite, slideIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideIn {
    0% {
        transform: translateY(-50px) scale(0.8);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.lipstick-case {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 90px;
    background: linear-gradient(180deg, #c0916e 0%, #8b6f47 100%);
    border-radius: 0 0 8px 8px;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
}

.lipstick-bullet {
    position: absolute;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 35px;
    height: 60px;
    background: linear-gradient(180deg, #e48d3c 0%, #c25e3a 100%);
    border-radius: 50% 50% 0 0;
    animation: lipstickMove 2s ease-in-out infinite;
    box-shadow: 0 4px 15px rgba(228, 141, 60, 0.6);
}

.shine {
    position: absolute;
    top: 20px;
    left: 20%;
    width: 8px;
    height: 20px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    animation: lipstickMove 2s ease-in-out infinite;
}

.progress-bar {
    width: 250px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    margin-top: 40px;
    overflow: hidden;
    animation: progressBarSlide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
    opacity: 0;
}

@keyframes progressBarSlide {
    0% {
        transform: scaleX(0);
        opacity: 0;
    }
    100% {
        transform: scaleX(1);
        opacity: 1;
    }
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #e48d3c, #ff9f5a);
    border-radius: 10px;
    animation: fillProgress 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(228, 141, 60, 0.8);
}

.text-animate {
    margin-top: 25px;
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards 0.5s, textFloat 2s ease-in-out infinite 1s;
    text-align: center;
    padding: 0 20px;
}

@keyframes textFloat {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

.sparkles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    animation: sparkleFloat 3s ease-in-out infinite;
    
    &:nth-child(1) { top: 20%; left: 10%; animation-delay: 0.5s; }
    &:nth-child(2) { top: 40%; right: 15%; animation-delay: 1s; }
    &:nth-child(3) { bottom: 30%; left: 20%; animation-delay: 1.5s; }
    &:nth-child(4) { top: 60%; right: 25%; animation-delay: 2s; }
    &:nth-child(5) { bottom: 20%; right: 10%; animation-delay: 2.5s; }
}

@keyframes rotate360 {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(15deg); }
}

@keyframes lipstickMove {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-10px); }
}

@keyframes fillProgress {
    0% { width: 0%; }
    100% { width: 100%; }
}

@keyframes sparkleFloat {
    0%, 100% { 
        opacity: 0; 
        transform: translateY(0) scale(0); 
    }
    50% { 
        opacity: 1; 
        transform: translateY(-20px) scale(1.5); 
    }
}

@keyframes fadeIn {
    to { opacity: 1; }
}
</style>