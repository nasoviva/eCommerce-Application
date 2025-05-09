import type {
  TokenCache,
  TokenCacheOptions,
  TokenStore,
} from "@commercetools/ts-client";

export default class VSATokenCache implements TokenCache {
  private token: string = "";
  private expirationTime: number = 0;
  private refreshToken?: string;
  private tokenCacheKey?: TokenCacheOptions;

  public get(): TokenStore {
    return {
      token: this.token,
      expirationTime: this.expirationTime,
      refreshToken: this.refreshToken,
      tokenCacheKey: this.tokenCacheKey,
    };
  }
  public set(newTokenData: TokenStore): void {
    this.token = newTokenData.token;
    this.expirationTime = newTokenData.expirationTime;
    if (newTokenData.refreshToken)
      this.refreshToken = newTokenData.refreshToken;
    if (newTokenData.tokenCacheKey)
      this.tokenCacheKey = newTokenData.tokenCacheKey;
  }
}
