import { $fetch } from "ofetch";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchInstance = $fetch.create({
  baseURL,

  onRequest({ options }) {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    options.headers = headers;
  },

  onResponse({ response }) {
    return response._data;
  },

  onResponseError({ response }) {
    console.error("API Error:", response);
    throw response._data ?? response;
  },
});
