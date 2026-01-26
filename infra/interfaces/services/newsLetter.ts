import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface INewsLetter {
  id: number;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  confirmedAt: Date;
  unsubscribedAt: Date;
  source: string;
  createdAt: Date;
}

export enum NewsLetterSource {
  Website = "Website",
  MobileApp = "MobileApp",
  InStore = "InStore",
}

export default class NewsLetterService extends ClientService<any> {
  constructor() {
    super("NewsletterSubscriber", "api/NewsletterSubscriber");
  }

  SubscriberNewLetter = async (
    email: string,
    phoneNumber: string,
    source: NewsLetterSource,
    config: FetchOptions = {},
  ): Promise<ApiResponse<INewsLetter[]>> => {
    return (await this.fetchInstance(`${this.address}/SubscriberNewLetter`, {
      method: "POST",
      body: {
        email,
        phoneNumber,
        source,
      },
      ...config,
    })) as ApiResponse<INewsLetter[]>;
  };
}
