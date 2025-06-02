import type { Localization } from "../../global-types/types";

export interface ValidJSON {
  login: string;
  password: string;
  isLoggedIn: boolean;
  userId: string;
}

const STORAGE_KEYS = {
  loginData: "loginData",
};

function isValidJSON(incomingJSON: unknown): incomingJSON is ValidJSON {
  return (
    typeof incomingJSON === "object" &&
    incomingJSON !== null &&
    "login" in incomingJSON &&
    typeof incomingJSON.login === "string" &&
    "password" in incomingJSON &&
    typeof incomingJSON.password === "string" &&
    "isLoggedIn" in incomingJSON &&
    typeof incomingJSON.isLoggedIn === "boolean" &&
    "userId" in incomingJSON &&
    typeof incomingJSON.userId === "string"
  );
}

export default class StateManager {
  public isLoggedIn: boolean;
  public login: string | undefined;
  public password: string | undefined;
  public userId: string | undefined;
  public locale: Localization = "en-US";
  private state: ValidJSON | undefined;

  constructor() {
    this.isLoggedIn = false;
    this.state = undefined;
    this.configureStateStorage();
  }

  public setState(loginStatus?: boolean): void {
    if (loginStatus) this.isLoggedIn = loginStatus;
    if (this.isLoggedIn) {
      const loginData = {
        login: this.login,
        password: this.password,
        isLoggedIn: this.isLoggedIn,
        userId: this.userId,
      };
      globalThis.sessionStorage.setItem(
        STORAGE_KEYS.loginData,
        JSON.stringify(loginData),
      );
    } else globalThis.sessionStorage.clear();
  }

  protected stateInit(): void {
    const sessionData: string | null = globalThis.sessionStorage.getItem(
      STORAGE_KEYS.loginData,
    );
    if (!sessionData) return;
    let loginData: unknown = JSON.parse(sessionData);
    if (isValidJSON(loginData)) {
      this.login = loginData.login;
      this.password = loginData.password;
      this.isLoggedIn = loginData.isLoggedIn;
      this.userId = loginData.userId;
    }
  }

  protected configureStateStorage(): void {
    this.stateInit();
    window.addEventListener("beforeunload", () => {
      this.setState();
    });
  }
}
