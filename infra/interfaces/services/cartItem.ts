import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";
import type { IProductsInCart } from "./productsConsolidated";

export default class CartItemService extends ClientService<any> {
  constructor() {
    super("ShoppingCartItem", "api/ShoppingCartItem");
  }

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

  RemoveItemFromCart = async (
    itemId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<Boolean>> => {
    return (await this.fetchInstance(
      `${this.address}/removeItemFromCart?itemId=${itemId}`,
      {
        method: "DELETE",
        ...config,
      },
    )) as ApiResponse<Boolean>;
  }
}
