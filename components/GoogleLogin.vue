<template>
    <div ref="googleBtn" style="display: none"></div>

    <div class="flex justify-center !mt-1 mb-3">
        <button class="google-btn" @click="loginWithGoogle">
            <img src="/Google/LogoGoogle.svg" alt="Google" class="icon" />
            <span>Entrar com Google</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRuntimeConfig } from '#app'
import { onMounted, ref } from 'vue'
import { setLoggedUser, setToken } from '~/composable/useAuth';
import useLoading from '~/composable/useLoading';
import { useToastService } from '~/composable/useToast';

const { loadingPush, loadingPop } = useLoading();
const { $httpClient } = useNuxtApp();
const toast = useToastService();
const config = useRuntimeConfig()
const clientId = config.public.googleClientId

const emit = defineEmits(['closeModal'])

const handleGoogleResponse = async (response: any) => {
    loadingPush();
        
    const token = response.credential

    try {
        //Login com google gerado igual o login JWT normal.
        const data = await $httpClient.user.LoginGoogle(token);

        if (data) {
            toast.success('Autenticado com sucesso!')
            setToken(data.token)
            setLoggedUser(data.user)

            console.log('Usuario autenticado:', data)

            emit('closeModal')
            loadingPop();
        }
    } catch (error) {
        toast.error('Erro ao autenticar com o Google. Tente novamente mais tarde.')
        console.error('Erro ao autenticar com o Google:', error);
        loadingPop();
    }
}

const loginWithGoogle = () => {
  const btn = googleBtn.value?.querySelector('div[role=button]') as HTMLElement
  btn?.click()
}

const googleBtn = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!window.google || !googleBtn.value) return

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleResponse
  })

  window.google.accounts.id.renderButton(
    googleBtn.value,
    {
      theme: 'outline',
      size: 'large',
      type: 'standard'
    }
  )
})
</script>

<style scoped>
.google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    width: 30%;
    padding: 5px;

    border-radius: 5px;
    border: 1px solid var(--secondary-color);
    background: white;

    font-size: 14px;
    font-weight: 500;

    cursor: pointer;
    transition: all 0.2s ease;

    @media (max-width: 720px) {
        width: 60%;
    }

    @media (max-width: 350px) {
        width: 70%;
    }
}

.google-btn:hover {
    background: #f7f7f7;
}

.icon {
    width: 20px;
    height: 20px;
}
</style>
