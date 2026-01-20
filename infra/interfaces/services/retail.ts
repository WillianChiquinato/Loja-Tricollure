import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IRetail {
  id: number;
  imageURL: string;
  discount: number;
  isEmphasis: boolean;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export default class RetailService extends ClientService<any> {
  constructor() {
    super("Retail", "api/Retail");
  }

  GetRetails = async (config: FetchOptions = {}): Promise<ApiResponse<IRetail[]>> => {
    return await this.fetchInstance(`${this.address}/GetRetails`, {
      method: "GET",
      ...config,
    }) as ApiResponse<IRetail[]>;
  };
}
