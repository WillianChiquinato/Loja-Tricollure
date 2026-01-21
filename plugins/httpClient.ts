import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import RetailService from "~/infra/interfaces/services/retail";
import UserService from "~/infra/interfaces/services/user";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		retail: new RetailService(),
		user: new UserService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})