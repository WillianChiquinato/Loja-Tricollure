import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IProductsConsolidated {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
  soldOutCount: number;
  createdAt: Date;
  updatedAt: Date;
  productImages: IProductImage[];
}

export interface IProductImage {
  id: number;
  productId: number;
  imageURL: string;
  isPrimary: boolean;
}

export interface IVerifyStockResult {
  productId: number
  size: string
  color: string
  availableStock: number
  isStockSufficient: boolean
}

export default class ProductsConsolidatedService extends ClientService<any> {
  constructor() {
    super("ProductsConsolidateds", "api/ProductConsolidateds");
  }

  GetProductsConsolidateds = async (
    page: number,
    pageSize: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IProductsConsolidated[]>> => {
    return (await this.fetchInstance(
      `${this.address}/GetProductsConsolidateds?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        ...config,
      },
    )) as ApiResponse<IProductsConsolidated[]>;
  };

    verifyStock = async (
      productId: number,
      color: string,
      size: string,
      config: FetchOptions = {},
    ): Promise<ApiResponse<IVerifyStockResult>> => {
      return (await this.fetchInstance(
        `${this.address}/VerifyStock?productId=${productId}&color=${color}&size=${size}`,
        {
          method: "GET",
          ...config,
        },
      )) as ApiResponse<IVerifyStockResult>;
    }
}
