import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";
import type { IProductsInCart } from "./productsConsolidated";

export interface ICepResponse {
  cep: string,
  logradouro: string,
  complemento: string,
  unidade: string,
  bairro: string,
  localidade: string,
  uf: string,
  estado: string,
  regiao: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string,
}

export default class CepService extends ClientService<any> {
  constructor() {
    super("Cep", "api/Cep");
  }

  ConsultarCep = async (
    cep: string,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICepResponse>> => {
    return await this.fetchInstance(`${this.address}/ConsultarCEP?cep=${cep}`, {
      method: "GET",
      ...config,
    }) as ApiResponse<ICepResponse>;
  };
}
