import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true
  },
  
  imports: {
    dirs: [
      'composables/**',
      'stores/**'
    ]
  },
  
  typescript: {
    strict: true,
    typeCheck: false
  },

  css: ["~/assets/css/tailwind.css", '@fortawesome/fontawesome-free/css/all.min.css'],
  
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap"
        }
      ]
    },
    baseURL: '/Loja-Tricollure/',
    buildAssetsDir: '/_nuxt/'
  },

  ssr: false,
  nitro: {
    preset: 'github-pages'
  },

  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || ''
    }
  }
})