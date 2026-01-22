import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";
import type { LoginResponse } from "../loginReponse";

export interface IUser {
  id: number;
  isActive: boolean;
  cpfCnpj: string | null;
  documentType: number;
  userName: string;
  name: string;
  email: string;
  phoneDDD: number;
  primaryPhone: string | null;
  password: string;
  sex: string;
  dateOfBirth: Date;
  firstAcess: Date;
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default class UserService extends ClientService<any> {
  constructor() {
    super("User", "api/User");
  }

  Login = async (
    email: string,
    password: string,
    config: FetchOptions = {},
  ): Promise<LoginResponse> => {
    return (await this.fetchInstance(`${this.address}/login`, {
      method: "POST",
      body: { email, password },
      ...config,
    })) as LoginResponse;
  };

  GetUsers = async (
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUser[]>> => {
    let urlParams = `/GetUsers`;

    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: "GET",
      ...config,
    })) as ApiResponse<IUser[]>;
  };

  CreateUser = async (
    userData: IUser,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUser>> => {
    return (await this.fetchInstance(`${this.address}/CreateUser`, {
      method: "POST",
      body: userData,
      ...config,
    })) as ApiResponse<IUser>;
  };

  FirstAccess = async (
    userId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IUser>> => {
    let urlParams = `/FirstAcessUser?userId=${userId}`;
    return (await this.fetchInstance(`${this.address}${urlParams}`, {
      method: "PUT",
      ...config,
    })) as ApiResponse<IUser>;
  };
}
