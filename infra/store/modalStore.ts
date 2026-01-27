import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isPromotionOpen: false,
    isLoginOpen: false,
    isShoppingCartOpen: false,
  }),
  actions: {
    openLogin() {
      this.isLoginOpen = true;
    },
    closePromotion() {
      this.isPromotionOpen = false;
    },

    openShoppingCart() {
      this.isShoppingCartOpen = true;
    },
    closeShoppingCart() {
      this.isShoppingCartOpen = false;
    },
  },
});
