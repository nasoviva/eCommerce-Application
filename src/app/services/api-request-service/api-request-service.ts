import ApiClientBuilder from "./build-client";
import type {
  ByProjectKeyRequestBuilder,
  MyCustomerDraft,
  MyCustomerSignin,
} from "@commercetools/platform-sdk";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { projectKey } from "./constants";
import type StateManager from "../state-manager/state-manager";
import type { Client, QueryParam, TokenStore } from "@commercetools/ts-client";
import VSATokenCache from "./token-cache";
import ErrorMsg from "../error-msg/error-msg";
import type { UseProductQuery } from "../../global-types/types";
import DataParaser from "./data-parser";
import DataParser from "./data-parser";

type RequestBuilder = "anon" | "password";

interface ProductQuery {
  [key: string]: QueryParam;
  markMatchingVariants?: boolean;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  "filter.query"?: string | string[];
  filter?: string | string[];
  facet?: string | string[];
  "filter.facets"?: string | string[];
  expand?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceCustomerGroupAssignments?: string | string[];
  priceChannel?: string;
  localeProjection?: string | string[];
  storeProjection?: string;
}

export default class ApiRequestService {
  private apiRoot!: ByProjectKeyRequestBuilder;
  private stateManager: StateManager;
  private currentClientType!: RequestBuilder;
  private tokenCache: VSATokenCache;
  private errorMsg: ErrorMsg;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    this.tokenCache = new VSATokenCache();
    this.errorMsg = new ErrorMsg();
    this.configureService();
  }

  public static errorParser(reason: Response): string[] {
    if ("error" in reason && Array.isArray(reason.error)) {
      return reason.error.map((x) => x.message);
    } else return [];
  }

  private static buildProductQuery(userQuery: UseProductQuery): ProductQuery {
    const result: ProductQuery = {};
    result.localeProjection = userQuery.locale;
    result["filter.query"] = [];
    if (userQuery.attributes) {
      for (const item of Object.entries(userQuery.attributes.byKey)) {
        result["filter.query"].push(
          `variants.attributes.${item[0]}.key:"${item[1]}"`,
        );
      }
      for (const item of Object.entries(userQuery.attributes.byName)) {
        result["filter.query"].push(
          `variants.attributes.${item[0]}:"${item[1]}"`,
        );
      }
    }
    if (userQuery.price) {
      result["filter.query"].push(
        `variants.price.centAmount:range (${userQuery.price.from || "*"} to ${userQuery.price.to || "*"})`,
      );
    }

    return result;
  }

  public getToken(): TokenStore {
    console.log(this.tokenCache.get());
    return this.tokenCache.get();
  }

  public authUser(
    loginData: MyCustomerSignin,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    if (this.currentClientType !== "password")
      this.switchRequestBuilder("password", loginData);
    this.apiRoot
      .me()
      .login()
      .post({
        body: loginData,
      })
      .execute()
      .then((result) => {
        /* TODO: сделать сохранение токена здесь */
        this.stateManager.setState();
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (this.currentClientType !== "anon")
          this.switchRequestBuilder("anon");
        if (onReject) onReject(reason);
      });
  }

  public logOutUser(): void {
    this.switchRequestBuilder("anon");
    this.stateManager.isLoggedIn = false;
  }

  public registerUser(
    registrationData: MyCustomerDraft,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .signup()
      .post({
        body: registrationData,
      })
      .execute()
      .then((result) => {
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) {
          onReject(reason);
        }
      });
  }

  public getProducts(
    productQuery: UseProductQuery,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    const formatQuery = ApiRequestService.buildProductQuery(productQuery);
    this.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: formatQuery,
      })
      .execute()
      .then((result) => {
        console.log(result);
        console.log(DataParser.parseForCatalog(result, "US"));
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) {
          onReject(reason);
        }
      });
  }

  private switchRequestBuilder(
    type: RequestBuilder,
    loginData?: MyCustomerSignin,
  ): void {
    let client: Client;
    if (type === "password" && loginData) {
      client = ApiClientBuilder.getPasswordClient(
        this.tokenCache,
        loginData.email,
        loginData.password,
      );
      this.currentClientType = "password";
    } else {
      client = ApiClientBuilder.getAnonClient(this.tokenCache);
      this.currentClientType = "anon";
    }

    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: projectKey,
    });
  }

  private configureService(): void {
    if (!this.stateManager.isLoggedIn) this.switchRequestBuilder("anon");
    else if (this.stateManager.login && this.stateManager.password)
      this.switchRequestBuilder("password", {
        email: this.stateManager.login,
        password: this.stateManager.password,
      });
    else console.error("Fail to build apiRoot");
  }
}
