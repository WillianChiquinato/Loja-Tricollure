import type RetailService from "./services/retail";
import type UserService from "./services/user";


export interface IClientHttp {
	retail: RetailService;
	user: UserService;
}

// export interface IClientHttpCustom {
// 	auth: AuthService;
// }
