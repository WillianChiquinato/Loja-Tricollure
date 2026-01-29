import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IPromotion {
  id: number;
  imageURL: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default class PromotionService extends ClientService<any> {
  constructor() {
    super("Promotion", "api/Promotion");
  }

  GetPromotions = async (config: FetchOptions = {}): Promise<ApiResponse<IPromotion[]>> => {
    return await this.fetchInstance(`${this.address}/GetPromotions`, {
      method: "GET",
      ...config,
    }) as ApiResponse<IPromotion[]>;
  };
}