import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";
import type { IProductsInCart } from "./productsConsolidated";

export interface ICartItem {
  userId: number;
  sessionId: string;
  products: ICartProducts[];
}

export interface ICartProducts {
  productId: number;
  color: string;
  size: string;
  quantity: number;
}

export default class CartService extends ClientService<any> {
  constructor() {
    super("ShoppingCart", "api/ShoppingCart");
  }

  addToCart = async (
    cartItem: ICartItem,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ICartItem>> => {
    return (await this.fetchInstance(`${this.address}/addToCart`, {
      method: "POST",
      body: cartItem,
      ...config,
    })) as ApiResponse<ICartItem>;
  };

  getItemsInCart = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IProductsInCart[]>> => {
    return (await this.fetchInstance(
      `${this.address}/getItemsInCart?userId=${userId}`,
      {
        method: "GET",
        ...config,
      },
    )) as ApiResponse<IProductsInCart[]>;
  }
}
