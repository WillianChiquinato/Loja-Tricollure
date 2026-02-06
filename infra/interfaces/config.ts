import type AuthService from "./services/auth";
import type CartService from "./services/cart";
import type CartItemService from "./services/cartItem";
import type CepService from "./services/cep";
import type NewsLetterService from "./services/newsLetter";
import type ProductsConsolidatedService from "./services/productsConsolidated";
import type PromotionService from "./services/promotion";
import type RetailService from "./services/retail";
import type UserService from "./services/user";


export interface IClientHttp {
	retail: RetailService;
	user: UserService;
	newsLetter: NewsLetterService;
	promotion: PromotionService;
	product: ProductsConsolidatedService;
	cart: CartService;
	cartItem: CartItemService;
	cep: CepService;
	auth: AuthService;
}

// export interface IClientHttpCustom {
// 	auth: AuthService;
// }
