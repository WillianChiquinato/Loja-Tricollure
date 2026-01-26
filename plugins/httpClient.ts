import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import NewsLetterService from "~/infra/interfaces/services/newsLetter";
import PromotionService from "~/infra/interfaces/services/promotion";
import RetailService from "~/infra/interfaces/services/retail";
import UserService from "~/infra/interfaces/services/user";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		retail: new RetailService(),
		user: new UserService(),
		newsLetter: new NewsLetterService(),
		promotion: new PromotionService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})