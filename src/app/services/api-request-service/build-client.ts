import type {
  Client,
  PasswordAuthMiddlewareOptions,
  TokenCache,
} from "@commercetools/ts-client";
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/ts-client";
import {
  clientId,
  clientSecret,
  projectKey,
  region,
  scopes,
} from "./constants";

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `https://api.${region}.commercetools.com`,
  httpClient: fetch,
};

export default class ApiClientBuilder {
  public static getAnonClient(tokenCache: TokenCache): Client {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: `https://auth.${region}.commercetools.com`,
      projectKey: projectKey,
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      scopes,
      httpClient: fetch,
      tokenCache,
    };

    return new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withAnonymousSessionFlow(authMiddlewareOptions)
      .build();
  }

  public static getPasswordClient(
    tokenCache: TokenCache,
    login: string,
    password: string,
  ): Client {
    const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
      host: `https://auth.${region}.commercetools.com`,
      projectKey: projectKey,
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
        user: {
          username: login,
          password: password,
        },
      },
      scopes,
      httpClient: fetch,
      tokenCache: tokenCache,
    };

    return new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withPasswordFlow(passwordAuthMiddlewareOptions)
      .build();
  }
}
