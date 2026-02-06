import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import AuthService from "~/infra/interfaces/services/auth";
import CartService from "~/infra/interfaces/services/cart";
import CartItemService from "~/infra/interfaces/services/cartItem";
import CepService from "~/infra/interfaces/services/cep";
import NewsLetterService from "~/infra/interfaces/services/newsLetter";
import ProductsConsolidatedService from "~/infra/interfaces/services/productsConsolidated";
import PromotionService from "~/infra/interfaces/services/promotion";
import RetailService from "~/infra/interfaces/services/retail";
import UserService from "~/infra/interfaces/services/user";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		retail: new RetailService(),
		user: new UserService(),
		newsLetter: new NewsLetterService(),
		promotion: new PromotionService(),
		product: new ProductsConsolidatedService(),
		cart: new CartService(),
		cartItem: new CartItemService(),
		cep: new CepService(),
		auth: new AuthService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})