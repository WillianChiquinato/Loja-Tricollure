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
                <div class="flex items-center gap-3 logoWrapper">
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
                    <div class="userSection">
                        <div class="userIconWrapper">
                            <i v-if="verifyToken()" class="pi pi-user"></i>
                            <i v-else class="pi pi-user-plus"></i>
                        </div>

                        <!-- LOGADO -->
                        <div v-if="verifyToken()" class="userInfo">
                            <p class="userName">
                                Olá, {{ getLoggedUser()?.userName?.split(' ')[0] || 'Usuário' }}
                            </p>
                            <button class="userButton logoutButton" @click="logout">
                                <i class="pi pi-sign-out"></i>
                                Sair
                            </button>
                        </div>

                        <!-- NÃO LOGADO -->
                        <div v-else class="userInfo">
                            <p class="userName">
                                Olá, visitante
                            </p>
                            <button class="userButton loginButton" @click="loginModalActive">
                                <i class="pi pi-sign-in"></i>
                                Entre ou cadastre-se
                            </button>
                        </div>
                    </div>

                    <div class="cartSection" @click="toggleCart">
                        <div class="cartIconWrapper">
                            <i class="pi pi-shopping-cart"></i>
                            <span class="cartBadge">{{ itemCount }}</span>
                        </div>
                        <button class="cartButton">Carrinho</button>
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

        <LoginCadastroModal v-model:visible="modalStore.isLoginOpen" :title="titleModal" @back="handleBack">
            <div v-if="isLoginModal" class="flex flex-col gap-6 items-center justify-center p-6 !mx-4 !my-7">
                <div class="relative w-full max-w-sm flex items-center gap-3 border-b pb-2 transition"
                    :class="!isEmailValid(emailLogin) && emailLogin ? 'border-red-500' : 'border-gray-400'">
                    <component :is="EnvelopeIcon" class="w-7 h-7 stroke-[1.5] flex-shrink-0 md:w-10 md:h-10"
                        :class="!isEmailValid(emailLogin) && emailLogin ? 'text-red-500' : 'text-black'" />

                    <InputText v-model.trim="emailLogin" type="email" placeholder="Email" class="w-full bg-transparent border-0 text-gray-700 text-sm md:text-xl sm:text-lg
    focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <span v-if="!isEmailValid(emailLogin) && emailLogin" class="text-xs text-red-500 mt-1">
                    Email inválido
                </span>

                <div class="relative w-full max-w-sm flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="LockClosedIcon"
                        class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0 md:w-10 md:h-10" />

                    <input :type="openPassword ? 'text' : 'password'" v-model="passwordLogin" placeholder="Senha" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
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
                    <span class="text-black font-bold text-sm text-center sm:text-base">Não tem uma conta?
                        Cadastre-se
                        já</span>
                    <div class="flex justify-center">
                        <Button class="w-[80%] sm:w-[40%] max-w-sm bg-[var(--background-color)] text-[var(--secondary-color)] font-bold rounded-md !px-6 !py-1 hover:!bg-[var(--secondary-color)] 
                        hover:!text-white hover:scale-105 transition" @click="sigOnModalActive">
                            <component :is="UserPlusIcon"
                                class="w-7 h-7 stroke-[1.5] text-black group-hover:text-white transition" />

                            <span class="text-md md:text-2xl sm:text-xl">Cadastre-se</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col gap-6 items-center justify-center p-6 !mx-4 !my-7">
                <div class="relative w-full max-w-lg flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="UserIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                    <input type="text" v-model="userRegister.userName" placeholder="Usuário" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <div class="relative w-full max-w-lg flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="UserGroupIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                    <input type="text" v-model="userRegister.name" placeholder="Nome Completo" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <div class="relative w-full max-w-lg flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="DocumentIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                    <InputMask mask="999.999.999-99" type="text" v-model="userRegister.cpfCnpj" placeholder="CPF" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <div class="relative w-full max-w-lg flex items-center gap-3 border-b pb-2 transition"
                    :class="!isEmailValid(userRegister.email!) && userRegister.email ? 'border-red-500' : 'border-gray-400'">
                    <component :is="EnvelopeIcon" class="w-7 h-7 stroke-[1.5] flex-shrink-0"
                        :class="!isEmailValid(userRegister.email!) && userRegister.email ? 'text-red-500' : 'text-black'" />

                    <InputText v-model.trim="userRegister.email" type="email" placeholder="Email" class="w-full bg-transparent border-0 text-gray-700 text-sm md:text-xl sm:text-lg
    focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <span v-if="!isEmailValid(userRegister.email!) && userRegister.email" class="text-xs text-red-500 mt-1">
                    Email inválido
                </span>

                <div class="relative w-full max-w-lg flex items-center gap-3 border-b border-gray-400 pb-2">
                    <component :is="PhoneIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                    <InputMask mask="(99) 99999-9999" type="text" v-model="userRegister.primaryPhone"
                        placeholder="Telefone + DDD" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
         focus:outline-none focus:placeholder-transparent transition-all py-2" />
                </div>

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-lg">
                    <!-- Data -->
                    <div class="relative w-full flex items-center gap-5 md:gap-3 border-b border-gray-400 pb-2">
                        <component :is="CalendarDateRangeIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                        <input type="date" v-model="userRegister.dateOfBirth" placeholder="Data de Nascimento" class="w-full bg-transparent border-0 text-gray-700 text-sm sm:text-lg md:text-xl
            focus:outline-none transition-all py-2" />
                    </div>

                    <!-- Sexo -->
                    <div class="relative w-full flex items-center gap-5 md:gap-3 border-b border-gray-400 pb-2">
                        <component :is="CalendarDateRangeIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                        <select v-model="userRegister.sex" class="w-full bg-transparent border-0 text-gray-700 text-sm sm:text-lg md:text-xl
            focus:outline-none transition-all py-2">
                            <option disabled value="">Selecione o sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="O">Outro</option>
                            <option value="N">Prefiro não informar</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-lg">
                    <div class="relative w-full flex items-center gap-5 md:gap-3 border-b border-gray-400 pb-2">
                        <component :is="LockOpenIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                        <input :type="openPassword ? 'text' : 'password'" v-model="userRegister.password"
                            placeholder="Senha" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
                        focus:outline-none focus:placeholder-transparent transition-all py-2" />

                        <button type="button" @click="togglePasswordVisibility"
                            class="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 hover:scale-95 transition">
                            <component v-if="openPassword" :is="EyeIcon" class="w-5 h-5 stroke-[1.5] text-black" />
                            <component v-else :is="EyeSlashIcon" class="w-5 h-5 stroke-[1.5] text-black" />
                        </button>
                    </div>

                    <div class="relative w-full flex items-center gap-5 md:gap-3 border-b border-gray-400 pb-2">
                        <component :is="LockClosedIcon" class="w-7 h-7 stroke-[1.5] text-black flex-shrink-0" />

                        <input :type="confirmedOpenPassword ? 'text' : 'password'" v-model="confirmedPassword"
                            placeholder="Confirmar Senha" class="w-full bg-transparent border-0 text-gray-700 placeholder-gray-500 text-sm md:text-xl sm:text-lg
                    focus:outline-none focus:placeholder-transparent transition-all py-2" />

                        <button type="button" @click="toggleConfirmedPasswordVisibility"
                            class="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 hover:scale-95 transition">
                            <component v-if="confirmedOpenPassword" :is="EyeIcon"
                                class="w-5 h-5 stroke-[1.5] text-black" />
                            <component v-else :is="EyeSlashIcon" class="w-5 h-5 stroke-[1.5] text-black" />
                        </button>
                    </div>
                </div>

                <div class="w-full flex flex-col gap-1 justify-center">
                    <div class="flex justify-center">
                        <Button class="w-[95%] sm:w-[60%] max-w-lg bg-[var(--secondary-color)] text-[var(--background-color)] font-bold rounded-md !px-6 !py-1 hover:!bg-[var(--primary-color)] 
                        hover:!text-white hover:scale-105 transition" @click="createUserData">
                            <component :is="UserPlusIcon"
                                class="w-7 h-7 stroke-[1.5] text-black group-hover:text-white transition" />

                            <span class="text-md md:text-2xl sm:text-xl">Criar uma conta</span>
                        </Button>
                    </div>
                </div>
            </div>
        </LoginCadastroModal>

        <ShoppingCart v-model:isVisible="isCartVisible" />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { computed, onMounted, ref } from "vue";
import logo from "~/assets/images/Logo-Tricollure.png";
import LoginCadastroModal from "~/components/Modal/LoginCadastroModal.vue";
import {
    EnvelopeIcon,
    LockClosedIcon,
    LockOpenIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightEndOnRectangleIcon,
    UserPlusIcon,
    UserIcon,
    UserGroupIcon,
    DocumentIcon,
    PhoneIcon,
    CalendarDateRangeIcon
} from '@heroicons/vue/24/outline';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import { useToastService } from "~/composable/useToast";
import { useNuxtApp } from "#app";
import useLoading from "~/composable/useLoading";
import { delay } from "~/composable/useDelay";
import type { IUser } from "~/infra/interfaces/services/user";
import { cleanCpfCnpj, cleanPhoneNumber, formatCpfCnpj, formatPhoneNumber } from "~/utils/Format";
import { clearAuth, getLoggedUser, setLoggedUser, setToken, verifyToken } from "~/composable/useAuth";
import { isEmailValid } from "~/utils/Invalids";
import { useModalStore } from "~/infra/store/modalStore";
import ShoppingCart from "./ShoppingCart.vue";
import { useCarrinhoStore } from "~/infra/store/carrinhoStore";

//Variables
const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const modalStore = useModalStore()

const search = ref("");
const menuOpen = ref(false);
const isCartVisible = ref(false);
const titleModal = ref("");

//Email and password text.
const emailLogin = ref("");
const passwordLogin = ref("");
const confirmedPassword = ref("");

const userRegister = ref<Partial<IUser>>({
    userName: "",
    name: "",
    cpfCnpj: "",
    email: "",
    primaryPhone: null,
    password: "",
    sex: "",
    dateOfBirth: new Date()
});

//Password
const openPassword = ref(false);
const confirmedOpenPassword = ref(false);
const togglePasswordVisibility = () => {
    openPassword.value = !openPassword.value;
};
const toggleConfirmedPasswordVisibility = () => {
    confirmedOpenPassword.value = !confirmedOpenPassword.value;
};

const carrinhoStore = useCarrinhoStore();
const { itemCount } = storeToRefs(carrinhoStore);

//Login Modal
const isLoginModal = ref(true);
const loginModalActive = () => {
    modalStore.isLoginOpen = true;
    isLoginModal.value = true;

    titleModal.value = "Já tem conta?";
};

const sigOnModalActive = () => {
    modalStore.isLoginOpen = false;

    setTimeout(() => {
        modalStore.isLoginOpen = true;
        isLoginModal.value = false;

        titleModal.value = "Cadastro";
    }, 100);
};

const searchButton = () => {
    console.log("Searching for:", search.value);
};

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

//Carrinho.
const toggleCart = () => {
    isCartVisible.value = !isCartVisible.value;
};

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
    if (!emailLogin.value || !passwordLogin.value) {
        toast.error("Ops", "Por favor, insira seu email e senha.", 4000);
        return;
    }

    loadingPush();

    try {
        const loadUser = await $httpClient.user.Login(
            emailLogin.value,
            passwordLogin.value
        );

        if (!loadUser || !loadUser.token) {
            toast.error(
                "Não Encontrado",
                "Usuário não encontrado. Verifique suas credenciais.",
                4000
            );
            return;
        }

        setToken(loadUser.token);
        setLoggedUser(loadUser.user);
        
        const user = getLoggedUser();
        carrinhoStore.setUser(user.id);

        // se ainda quiser manter firstAccess (opcional)
        if (loadUser.user.firstAcess == null) {
            await $httpClient.user.FirstAccess(
                loadUser.user.id
            );
        }

        toast.success(
            "Bem-vindo de volta!",
            "Login realizado com sucesso.",
            3000
        );

        emailLogin.value = "";
        passwordLogin.value = "";
        modalStore.isLoginOpen = false;
    }
    catch (error) {
        toast.error("Erro", "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.", 4000);
        modalStore.isLoginOpen = false;
        console.error("Login error:", error);
    }
    finally {
        loadingPop();
    }
}

async function createUserData() {
    if (!userRegister.value.userName || !userRegister.value.name || !userRegister.value.email ||
        !userRegister.value.primaryPhone || !userRegister.value.password || !confirmedPassword.value) {
        toast.error("Ops", "Por favor, preencha todos os campos.", 4000);
        return;
    }

    if (!isEmailValid(userRegister.value.email)) {
        toast.error("Ops", "Por favor, insira um email válido.", 4000);
        return;
    }

    if (userRegister.value.password !== confirmedPassword.value) {
        toast.error("Ops", "As senhas não coincidem. Verifique e tente novamente.", 4000);
        return;
    }

    loadingPush();

    try {
        userRegister.value.primaryPhone = cleanPhoneNumber(userRegister.value.primaryPhone);

        userRegister.value.cpfCnpj = cleanCpfCnpj(userRegister.value.cpfCnpj || null);

        const createUser = await $httpClient.user.CreateUser(
            userRegister.value as IUser
        );

        if (!createUser || !createUser.result) {
            toast.error("Erro ao Criar Conta", "Não foi possível criar sua conta. Tente novamente.", 4000);
            return;
        }

        toast.success("Conta Criada!", "Seu cadastro foi realizado com sucesso.", 3000);

        userRegister.value = {
            userName: "",
            name: "",
            email: "",
            primaryPhone: null,
            password: "",
            sex: "",
            dateOfBirth: new Date()
        };
        confirmedPassword.value = "";

        modalStore.isLoginOpen = false;
        loginModalActive();
    }
    catch (error: any) {
        if (error?.errors && error.errors.length > 0) {
            toast.error("Erro", `${error.errors}`, 4000);
            return;
        }

        modalStore.isLoginOpen = false;
        console.error("Create user error:", error);
    }
    finally {
        loadingPop();
    }
}

function handleBack() {
    modalStore.isLoginOpen = false;
}

function logout() {
    clearAuth();
    toast.success("Logout", "Você saiu da sua conta com sucesso.", 3000);
    carrinhoStore.setUser(null);
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

.logoWrapper {
    height: 90px;
    display: flex;
    align-items: center;
}

.logoContent {
    height: 200px;
    width: auto;
    object-fit: contain;
}

/* User Section Styles */
.userSection,
.cartSection {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.userSection:hover .userIconWrapper,
.cartSection:hover .cartIconWrapper {
    transform: scale(1.1);
}

.userIconWrapper,
.cartIconWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    transition: all 0.3s ease;

    i {
        font-size: 1.25rem;
        color: white;
    }

    @media (min-width: 768px) {
        width: 3rem;
        height: 3rem;

        i {
            font-size: 1.5rem;
        }
    }
}

.cartIconWrapper {
    position: relative;
}

.cartBadge {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    background: #e74c3c;
    color: white;
    font-size: 0.65rem;
    font-weight: bold;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--primary-color);
}

.userInfo {
    flex-direction: column;
    gap: 0.15rem;

    @media (min-width: 768px) {
        display: flex;
    }
}

.userName {
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.2;
    white-space: nowrap;

    @media (min-width: 1024px) {
        font-size: 0.95rem;
    }
}

.userButton,
.cartButton {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.15rem 0;
    transition: all 0.2s ease;
    text-align: left;

    i {
        font-size: 0.75rem;
    }

    &:hover {
        color: white;
        transform: translateX(2px);
    }

    &:focus {
        outline: none;
    }

    @media (min-width: 1024px) {
        font-size: 0.8rem;

        i {
            font-size: 0.8rem;
        }
    }
}

.logoutButton:hover {
    color: #ffcccb;
}

.loginButton:hover {
    color: #b3e5fc;
}

.cartButton {
    display: none;
    color: white;
    font-weight: 600;
    font-size: 0.8rem;

    @media (min-width: 768px) {
        display: block;
    }

    @media (min-width: 1024px) {
        font-size: 0.875rem;
    }
}
</style>
