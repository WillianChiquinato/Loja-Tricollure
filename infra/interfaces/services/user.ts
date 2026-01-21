import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IUser {
  id: number;
  is_active: boolean;
  cpf_cnpj: string;
  document_type: number;
  user_name: string;
  name: string;
  email: string;
  phoneDDD: number;
  primary_phone: number;
  password: string;
  sex: string;
  date_of_birth: Date;
  first_access: Date;
  last_access: Date;
  created_at: Date;
  updated_at: Date;
}

export default class UserService extends ClientService<any> {
  constructor() {
    super("User", "api/User");
  }

  GetUser = async (
    email: string,
    password: string,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUser[]>> => {
    let urlParams = `/GetUsers?email=${email}&password=${password}`;
    
    return await this.fetchInstance(
      `${this.address}${urlParams}`,
      {
        method: "GET",
        ...config,
      },
    ) as ApiResponse<IUser[]>;
  };
}
