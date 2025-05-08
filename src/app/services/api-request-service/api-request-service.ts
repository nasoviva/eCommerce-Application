import ApiClientBuilder from "./build-client";
import type {
  ByProjectKeyRequestBuilder,
  MyCustomerDraft,
  MyCustomerSignin,
} from "@commercetools/platform-sdk";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { projectKey } from "./constants";
import type StateManager from "../state-manager/state-manager";
import type { Client } from "@commercetools/ts-client";

type RequestBuilder = "anon" | "password";

export default class ApiRequestService {
  private apiRoot!: ByProjectKeyRequestBuilder;
  private stateManager: StateManager;
  private currentClientType!: RequestBuilder;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
    this.configureService();
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
        this.stateManager.userId = result.body.customer.id;
        this.stateManager.setState();
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (this.currentClientType !== "anon")
          this.switchRequestBuilder("anon");
        if (onReject) onReject(reason);
      });
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
        loginData.email,
        loginData.password,
      );
      this.currentClientType = "password";
    } else {
      client = ApiClientBuilder.getAnonClient();
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
