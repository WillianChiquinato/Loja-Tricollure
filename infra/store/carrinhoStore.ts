import { defineStore } from "pinia";

export const useCarrinhoStore = defineStore("carrinho", {
  state: () => ({
    items: [] as Array<any>,
    userId: null as number | null
  }),

  getters: {
    itemCount(state) {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    cartTotal(state) {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    getUserId(state) {
      return state.userId;
    }
  },

  actions: {
    setUserId(userId: number) {
      this.userId = userId;
    },

    setItems(items: Array<any>) {
      this.items = items;
    },

    clear() {
      this.items = [];
    },

    removeItem(cartItemId: number) {
      this.items = this.items.filter(i => i.cartItemId !== cartItemId);
    }
  }
});
