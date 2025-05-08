import { ctpClient } from "./build-client";
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { projectKey } from "./constants";
import type { LoginData } from "./types";

export default class ApiRequestService {
  private apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: projectKey,
  });

  constructor() {
    this.configureService();
  }

  public authUser(
    loginData: LoginData,
    onSuccess?: CallableFunction,
    onReject?: CallableFunction,
  ): void {
    this.apiRoot
      .me()
      .login()
      .post({
        body: { email: loginData.email, password: loginData.password },
      })
      .execute()
      .then((result) => {
        if (onSuccess) onSuccess(result);
      })
      .catch((reason) => {
        if (onReject) onReject(reason);
      });
  }

  private configureService(): void {}
}
