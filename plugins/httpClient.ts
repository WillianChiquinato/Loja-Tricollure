import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import RetailService from "~/infra/interfaces/services/retail";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		retail: new RetailService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})