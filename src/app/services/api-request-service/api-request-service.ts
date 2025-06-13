import ApiClientBuilder from "./build-client";
import type {
  ByProjectKeyRequestBuilder,
  Cart,
  MyCustomerDraft,
  MyCustomerSignin,
  MyCustomerUpdateAction,
  ProductProjection,
} from "@commercetools/platform-sdk";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { projectKey } from "./constants";
import type StateManager from "../state-manager/state-manager";
import type {
  Client,
  ClientResponse,
  QueryParam,
  TokenStore,
} from "@commercetools/ts-client";
import VSATokenCache from "./token-cache";
import ToastMsg from "../error-msg/toast-msg";
import type {
  Localization,
  UseProductQuery,
  UseSearchQuery,
} from "../../global-types/types";

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
  private toastMsg: ToastMsg;
  private cartVersion: number = 0;
  private cartId: string = "";

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    this.tokenCache = new VSATokenCache();
    this.toastMsg = new ToastMsg();
    this.configureService();
  }

  public static errorParser(reason: Error): string[] {
    if ("error" in reason) {
      const errors = reason.message;
      return [errors];
    } else return [];
  }

  private static buildSearchQuery(userQuery: UseSearchQuery): ProductQuery {
    const result: ProductQuery = {};
    result.localeProjection = userQuery.locale;
    result[`text.${userQuery.locale}`] = userQuery.text;
    result.fuzzy = true;
    if (userQuery.limit) result.limit = userQuery.limit;
    if (userQuery.offset) result.offset = userQuery.offset;
    result.fuzzyLevel = 1;
    return result;
  }

  private static buildProductQuery(userQuery: UseProductQuery): ProductQuery {
    const result: ProductQuery = {};
    result.localeProjection = userQuery.locale;
    result["filter.query"] = [];
    result.sort = [];
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

    if (userQuery.categories) {
      const idList = userQuery.categories
        .map((x) => `subtree("${x}")`)
        .join(", ");
      result["filter.query"].push(`categories.id: ${idList}`);
    }

    if (userQuery.sort?.price)
      result.sort.push(`price ${userQuery.sort.price}`);
    if (userQuery.sort?.name)
      result.sort.push(`name.${userQuery.locale} ${userQuery.sort.name}`);

    if (userQuery.limit) result.limit = userQuery.limit;
    if (userQuery.offset) result.offset = userQuery.offset;

    return result;
  }

  public getToken(): TokenStore {
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
        this.getCart();
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
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public getCategories(
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .categories()
      .get()
      .execute()
      .then((result) => {
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public updateUserInfo(
    version: number,
    actions: MyCustomerUpdateAction[],
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .post({
        body: {
          version: version,
          actions: actions,
        },
      })
      .execute()
      .then((result) => {
        this.toastMsg.displaySuccessMsg(["Your data was successfully updated"]);
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        this.toastMsg.displayErrorMsg(ApiRequestService.errorParser(reason));
        if (onReject) onReject(reason);
      });
  }

  public searchProducts(
    searchQuery: UseSearchQuery,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    const formatQuery = ApiRequestService.buildSearchQuery(searchQuery);
    this.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: formatQuery,
      })
      .execute()
      .then((result) => {
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public async getProductById(
    id: string,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): Promise<ClientResponse<ProductProjection> | void> {
    try {
      const result = await this.apiRoot
        .productProjections()
        .withId({ ID: id })
        .get()
        .execute();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (reason) {
      if (onReject) onReject(reason);
    }
  }

  public getUserInfo(
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .get()
      .execute()
      .then((result) => {
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public changePassword(
    version: number,
    oldPassword: string,
    newPassword: string,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .password()
      .post({
        body: {
          version: version,
          currentPassword: oldPassword,
          newPassword: newPassword,
        },
      })
      .execute()
      .then((result) => {
        this.switchRequestBuilder("anon");
        this.toastMsg.displaySuccessMsg([
          "Your password was successfully updated",
        ]);
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        this.toastMsg.displayErrorMsg(ApiRequestService.errorParser(reason));
        if (onReject) onReject(reason);
      });
  }

  public async getCart(
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): Promise<ClientResponse<Cart> | void> {
    try {
      const result = await this.apiRoot
        .me()
        .activeCart()
        /* .carts()
      .withId({ ID: this.stateManager.cartId }) */
        .get()
        .execute();
      this.cartVersion = result.body.version;
      this.cartId = result.body.id;
      if (onSuccess) onSuccess(result);
      return result;
    } catch (reason) {
      if (onReject) onReject(reason);
    }
  }

  public async createCart(
    currency: string,
    country: Localization,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): Promise<void> {
    await this.apiRoot
      .me()
      .carts()
      .post({
        body: {
          currency: currency,
          country: country.slice(-2),
        },
      })
      .execute()
      .then((result) => {
        this.cartVersion = result.body.version;
        this.cartId = result.body.id;
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public removeProduct(
    lineItemId: string,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cartId })
      .post({
        body: {
          version: this.cartVersion,
          actions: [
            {
              action: "removeLineItem",
              lineItemId: lineItemId,
            },
          ],
        },
      })
      .execute()
      .then((result) => {
        this.cartVersion = result.body.version;
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  public async addProduct(
    lineItemId: string,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): Promise<string> {
    try {
      const result = await this.apiRoot
        .me()
        .carts()
        .withId({ ID: this.cartId })
        .post({
          body: {
            version: this.cartVersion,
            actions: [
              {
                action: "addLineItem",
                productId: lineItemId,
                key: lineItemId,
              },
            ],
          },
        })
        .execute();
      this.cartVersion = result.body.version;
      if (onSuccess) onSuccess(result);
      return result.body.lineItems[0].id;
    } catch (reason) {
      if (onReject) onReject(reason);
      return "";
    }
    /* await this.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cartId })
      .post({
        body: {
          version: this.cartVersion,
          actions: [
            {
              action: "addLineItem",
              productId: lineItemId,
              key: lineItemId,
            },
          ],
        },
      })
      .execute()
      .then((result) => {
        this.cartVersion = result.body.version;
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      }); */
  }

  public async changeProductQuantity(
    lineItemId: string,
    amount: number = 1,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): Promise<void> {
    await this.apiRoot
      .me()
      .carts()
      .withId({ ID: this.cartId })
      .post({
        body: {
          version: this.cartVersion,
          actions: [
            {
              action: "changeLineItemQuantity",
              lineItemId: lineItemId,
              quantity: amount,
            },
          ],
        },
      })
      .execute()
      .then((result) => {
        this.cartVersion = result.body.version;
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
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
