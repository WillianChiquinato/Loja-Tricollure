<template>
    <div class="flex justify-center !mt-1 mb-3">
        <button class="google-btn" @click="loginWithGoogle">
            <img src="/Google/LogoGoogle.svg" alt="Google" class="icon" />
            <span>Entrar com Google</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'
import { onMounted } from 'vue'

const config = useRuntimeConfig()
const clientId = config.public.googleClientId

let googleClient: any

// onMounted(() => {
//   googleClient = window.google.accounts.id.initialize({
//     client_id: clientId,
//     callback: handleGoogleResponse
//   })
// })

const handleGoogleResponse = async (response: any) => {
    const token = response.credential

    await $fetch('https://localhost:5001/api/auth/google', {
        method: 'POST',
        body: { token }
    })
}

const loginWithGoogle = () => {
    window.google.accounts.id.prompt()
}
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
