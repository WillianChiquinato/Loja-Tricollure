import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
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
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})