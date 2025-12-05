import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara';
import 'primeicons/primeicons.css';

import InputText from 'primevue/inputtext';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Lara,
      options: {
        darkModeSelector: false,
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities'
        }
      }
    },
    unstyled: false
  })

  nuxtApp.vueApp.component('InputText', InputText)
});