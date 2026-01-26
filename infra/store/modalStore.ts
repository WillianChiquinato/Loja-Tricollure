import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isPromotionOpen: false,
    isLoginOpen: false,
  }),
  actions: {
    openLogin() {
      this.isLoginOpen = true
    },
    closePromotion() {
      this.isPromotionOpen = false
    }
  }
})