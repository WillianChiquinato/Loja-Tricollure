<template>
    <div class="headerWrapper">
        <header class="w-full flex flex-col bg-[var(--primary-color)] shadow-md headerContainer">
            <div class="bg-[#934303] text-white text-sm font-semibold text-center py-4 headerNotifications">
                <div class="overflow-hidden whitespace-nowrap promotionsMarquee">
                    <div class="inline-block animate-marquee">
                        <a v-for="notification in placeHolderNotifications" :key="notification.id"
                            :href="notification.linkDirect" class="mx-8">
                            {{ notification.message }} –
                        </a>
                    </div>

                    <div class="inline-block animate-marquee">
                        <a v-for="notification in placeHolderNotifications" :key="'copy-' + notification.id"
                            :href="notification.linkDirect" class="mx-8">
                            {{ notification.message }} –
                        </a>
                    </div>
                </div>

            </div>

            <!-- Área principal -->
            <div class="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-12 headerMainArea">
                <div class="flex items-center gap-3">
                    <img :src="logo" alt="Logo" class="logoContent" />

                    <button @click="toggleMenu" class="lg:hidden text-white hamburgerButton">
                        <i class="pi pi-bars text-2xl"></i>
                    </button>
                </div>

                <div class="relative w-full lg:flex-1 flex justify-center lg:mx-6 mx-2">
                    <div class="relative w-full max-w-2xl">
                        <InputText v-model="search" placeholder="O que você está procurando?"
                            class="inputSearch w-full h-12" />

                        <Button class="searchButton" @click="searchButton">
                            <i class="pi pi-search"></i>
                        </Button>
                    </div>
                </div>

                <!-- USUÁRIO E CARRINHO -->
                <div class="headerUserCart">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-user text-2xl md:text-3xl"></i>
                        <div class="leading-tight md:block">
                            <p class="font-bold text-sm md:text-md hidden md:block">Olá visitante</p>
                            <button class="text-xs md:text-sm limitText" v-on:click="loginModalActive">Faça seu login ou
                                cadastre-se</button>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <i class="pi pi-shopping-cart text-2xl md:text-3xl"></i>
                        <button class="text-xs md:text-sm">Carrinho (0)</button>
                    </div>

                </div>
            </div>

            <nav class="hidden lg:block bg-[var(--secondary-color)] border-y border-[#FFF3E5] border-t-0">
                <ul class="flex justify-center gap-12 py-3">
                    <li><a class="menuItem" href="#inicio">Inicio</a></li>
                    <li><a class="menuItem" href="#destaques">Destaques</a></li>
                    <li><a class="menuItem" href="#novidades">Novidades</a></li>
                    <li><a class="menuItem" href="#loja">Loja</a></li>
                    <li><a class="menuItem" href="#solicitacoes">Solicitações</a></li>
                    <li><a class="menuItem" href="#rastreio">Rastreio de pedido</a></li>
                </ul>
            </nav>
        </header>

        <!-- Menu Mobile (fora do header para evitar bug com transform) -->
        <Transition name="slide">
            <div v-if="menuOpen" class="fixed inset-0 mobileMenuContainer lg:hidden">
                <div class="absolute inset-0 bg-black bg-opacity-60" @click="toggleMenu"></div>

                <nav class="absolute left-0 top-0 h-full w-64 bg-[#B4824F] shadow-xl px-4">
                    <div class="flex items-center border-b border-[#FFF3E5] bg-[#a65300] py-4">
                        <div class="headerMobileDivision">
                            <span class="text-white font-bold text-xl">Menu</span>

                            <button @click="toggleMenu" class="text-white text-2xl">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>
                    </div>


                    <ul class="flex flex-col">
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Inicio</a>
                        </li>
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Conjuntos</a>
                        </li>
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Vestidos</a>
                        </li>
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Acessórios</a>
                        </li>
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Solicitações</a>
                        </li>
                        <li class="border-b border-[#B26F2C]">
                            <a class="menuItemMobile" href="/" @click="toggleMenu">Rastreio de pedido</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </Transition>

        <LoginModal v-model:visible="loginModal" title="Ja tem conta?">
            <div class="flex flex-col gap-6 items-center justify-center p-6 !mx-4 !my-7">
                <div class="relative w-full max-w-sm flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="EnvelopeIcon"
                        class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0 md:w-10 md:h-10" />

                    <input type="email" v-model="email" placeholder="Email" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <div class="relative w-full max-w-sm flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="LockClosedIcon"
                        class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0 md:w-10 md:h-10" />

                    <input :type="openPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />

                    <button type="button" @click="togglePasswordVisibility"
                        class="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 hover:scale-95 transition">
                        <component v-if="openPassword" :is="EyeIcon" class="w-5 h-5 stroke-[1.5] text-black" />
                        <component v-else :is="EyeSlashIcon" class="w-5 h-5 stroke-[1.5] text-black" />
                    </button>
                </div>

                <div class="w-full flex justify-center">
                    <Button class="w-[70%] sm:w-[30%] max-w-sm bg-[var(--secondary-color)] text-white font-bold rounded-md !px-6 !py-1
                    hover:bg-[var(--primary-color)] hover:scale-105 transition" @click="LoadUserData">
                        <component :is="ArrowRightEndOnRectangleIcon"
                            class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                        <span class="text-md md:text-2xl sm:text-xl">Entrar</span>
                    </Button>
                </div>

                <div class="w-full flex flex-col gap-1 justify-center">
                    <span class="text-black font-bold text-sm text-center sm:text-base">Não tem uma conta? Cadastre-se
                        já</span>
                    <div class="flex justify-center">
                        <Button class="w-[80%] sm:w-[40%] max-w-sm bg-[var(--background-color)] text-[var(--secondary-color)] font-bold rounded-md !px-6 !py-1 hover:!bg-[var(--secondary-color)] 
                        hover:!text-white hover:scale-105 transition">
                            <component :is="UserPlusIcon" class="w-7 h-7 stroke-[1.5] text-black group-hover:text-white transition" />

                            <span class="text-md md:text-2xl sm:text-xl">Cadastre-se</span>
                        </Button>
                    </div>
                </div>
            </div>
        </LoginModal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import logo from "~/assets/images/Logo-Tricollure.png";
import LoginModal from "~/components/Modal/LoginModal.vue";
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightEndOnRectangleIcon,
    UserPlusIcon
} from '@heroicons/vue/24/outline';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToastService } from "~/composable/useToast";
import { useNuxtApp } from "#app";
import useLoading from "~/composable/useLoading";
import { delay } from "~/composable/useDelay";

//Variables
const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();

const search = ref("");
const menuOpen = ref(false);
const isVisible = ref(false);

//Email and password text.
const email = ref("");
const password = ref("");

//Password
const openPassword = ref(false);
const togglePasswordVisibility = () => {
    openPassword.value = !openPassword.value;
};

//Login Modal
const loginModal = ref(false);
const loginModalActive = () => {
    loginModal.value = true;
    console.log("Login modal activated");
};

const searchButton = () => {
    console.log("Searching for:", search.value);
};

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

//Vem JSON da API futuramente
const placeHolderNotifications = [
    {
        id: 1,
        message: "Frete grátis para compras acima de R$ 200,00!",
        linkDirect: "/",
    },
    {
        id: 2,
        message: "Novas coleções de verão já disponíveis!",
        linkDirect: "/",
    },
    {
        id: 3,
        message: "Descontos exclusivos para membros cadastrados!",
        linkDirect: "/",
    },
    {
        id: 4,
        message: "Compre 2 e leve 3 em acessórios selecionados!",
        linkDirect: "/",
    },
    {
        id: 5,
        message: "Acompanhe seu pedido em tempo real pelo nosso site!",
        linkDirect: "/",
    }
];

async function LoadUserData() {
    if (!email.value || !password.value) {
        toast.error("Ops", "Por favor, insira seu email e senha.", 4000);
        return;
    }

    loadingPush();

    try {
        await delay(2000);

        const loadUser = await $httpClient.user.GetUser(
            email.value,
            password.value
        );

        if (!loadUser || loadUser.result.length === 0) {
            toast.error("Não Encontrado", "Usuário não encontrado. Verifique suas credenciais.", 4000);
            return;
        }

        toast.success("Bem-vindo de volta!", "Login realizado com sucesso.", 3000);
        email.value = "";
        password.value = "";

        loginModal.value = false;
    }
    catch (error) {
        toast.error("Erro", "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.", 4000);
        loginModal.value = false;
        console.error("Login error:", error);
    }
    finally {
        loadingPop();
    }
}

onMounted(() => {
    const header = document.querySelector('.headerContainer');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 85) {
            header?.classList.add('animate');
        } else {
            header?.classList.remove('animate');
        }
    });
});
</script>

<style scoped lang="scss">
.headerWrapper {
    width: 100%;
    position: relative;
    z-index: 2000;
}

.headerContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease-in-out;

    &.animate {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        transform: translateY(-23%);

        @media (max-width: 1024px) {
            transform: translateY(-19%);
        }

        @media (max-width: 768px) {
            transform: translateY(-20%);
        }
    }
}

.headerNotifications {
    margin: 0.25rem 1rem;
    letter-spacing: 0.05rem;
    border-radius: 0.4rem;
    border: solid 1px black;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);

    @media (min-width: 768px) {
        margin: 0.25rem 10rem;
    }

    @media (min-width: 1024px) {
        margin: 0.25rem 20rem;
    }
}

.headerMainArea {
    padding: 0rem 1rem;

    @media (min-width: 768px) {
        padding: 0.1rem 3rem;
    }

    @media (min-width: 1024px) {
        padding: 0.2rem 4rem;
    }

    @media (min-width: 1350px) {
        padding: 0.2rem 6rem;
    }
}

.headerUserCart {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: white;

    @media (max-width: 1024px) {
        padding: 0.4rem 1rem;
        gap: 1rem;
    }

    @media (max-width: 400px) {
        padding: 0.4rem 1rem;
        gap: 0.5rem;
    }
}

.inputSearch {
    border: none !important;
    border-radius: 12px !important;
    padding: 0 3rem 0 1rem !important;
    font-weight: 600;
    background: white;

    &:focus {
        outline: none !important;
        box-shadow: none !important;
    }
}

.searchButton {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none !important;
    border: none !important;
    color: black;
    cursor: pointer;
    font-size: 1.6rem;
    padding: 0.5rem;
}

.searchButton:focus {
    outline: none !important;
}

.menuItem {
    color: white;
    font-weight: bold;
    font-size: 0.875rem;

    @media (min-width: 768px) {
        font-size: 0.95rem;
    }

    @media (min-width: 1024px) {
        font-size: 1rem;
    }
}

.promotionsMarquee {
    span {
        font-weight: 600;
    }
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-marquee {
    padding: 0.2rem 0rem;
    animation: marquee 12s linear infinite;
}

.hamburgerButton {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }

    &:focus {
        outline: none;
    }
}

.menuItemMobile {
    display: block;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    padding: 1rem 1.5rem;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
}

/* Transição do menu lateral */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-active .absolute.left-0,
.slide-leave-active .absolute.left-0 {
    transition: transform 0.3s ease;
}

.slide-enter-from .absolute.left-0 {
    transform: translateX(-100%);
}

.slide-leave-to .absolute.left-0 {
    transform: translateX(-100%);
}

.slide-enter-from .absolute.inset-0,
.slide-leave-to .absolute.inset-0 {
    opacity: 0;
}

.slide-enter-active .absolute.inset-0,
.slide-leave-active .absolute.inset-0 {
    transition: opacity 0.3s ease;
}

.mobileMenuContainer {
    z-index: 9999;
}

.headerMobileDivision {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.1rem 0.6rem;
    width: 100%;
}

.limitText {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
}

.logoContent {
    height: 100px;
    width: auto;
    object-fit: cover;
    scale: 1.6;
}
</style>
