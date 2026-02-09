import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { ICartItem } from "../interfaces/services/cart";

export const useCarrinhoStore = defineStore("carrinho", {
  state: () => ({
    items: [] as Array<any>,
    userId: null as number | null,
    initialized: false,
  }),

  getters: {
    itemCount: (state) => state.items.filter(Boolean).length,

    cartTotal: (state) =>
      state.items.reduce((t, i) => t + i.price * i.quantity, 0),

    isLogged: (state) => !!state.userId,
  },

  actions: {
    async setUser(userId: number | null) {
      this.userId = userId;
      this.initialized = false;

      if (!userId) {
        this.items = [];
        return;
      }

      await this.sync();
    },

    async sync() {
      if (!this.userId) return;

      const { $httpClient } = useNuxtApp();
      const result = await $httpClient.cartItem.getItemsInCart(this.userId);

      this.items = result.result.products.map((p) => {
        const sku = p.skus.find((s: any) => s.isActive)!;

        if (!sku) {
          console.warn("Produto sem SKU ativo:", p);
          return null;
        }

        return {
          cartItemId: p.product.cartItemId,
          productId: p.product.productId,
          name: p.product.name,
          image: p.images.find((i: any) => i.isPrimary)?.imageURL,
          skuId: sku.id,
          size: sku.size,
          color: sku.color,
          price: sku.price,
          stock: sku.stock,
          quantity: p.product.quantity,
          skus: p.skus,
        };
      });

      this.initialized = true;
    },

    async addItem(payload: ICartItem) {
      const { $httpClient } = useNuxtApp();
      var response = await $httpClient.cart.addToCart(payload);

      if (response.result) {
        await this.sync();
      }
    },

    async removeItem(cartItemId: number) {
      const { $httpClient } = useNuxtApp();
      await $httpClient.cartItem.RemoveItemFromCart(cartItemId);

      await this.sync();
    },

    clear() {
      this.items = [];
      this.userId = null;
      this.initialized = false;
    },
  },
});
