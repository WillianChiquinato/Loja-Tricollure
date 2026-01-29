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
}

// export interface IClientHttpCustom {
// 	auth: AuthService;
// }
