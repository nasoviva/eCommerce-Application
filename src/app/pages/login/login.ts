import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import { cssClasses, Routes, Buttons } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";
import type { MyCustomerSignin } from "@commercetools/platform-sdk";

interface AuthResponse {
  userId?: string;
}

export default class LoginView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly loginContainer: ElementCreator;
  private readonly passwordContainer: ElementCreator;
  private readonly loginInput: InputCreator;
  private readonly passwordInput: InputCreator;
  private readonly eyeIcon: HTMLElement;
  private readonly messageBox: ElementCreator;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.loginContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "Login",
    });

    this.loginInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Email",
    });

    this.passwordContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_INPUTS],
      textContent: "",
    });

    this.passwordInput = new InputCreator({
      type: "password",
      className: [cssClasses.INPUT],
      placeholder: "Enter Password",
    });

    this.eyeIcon = new ElementCreator({
      tag: "span",
      className: [cssClasses.EYE],
      textContent: "👁️",
      callback: this.togglePasswordVisibility.bind(this),
    }).getElement();
    this.eyeIcon.style.cursor = "pointer";

    const loginButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => this.handleLogin(),
    });

    const registerButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        this.clearInputs();
        globalThis.location.hash = Routes.REGISTRATION;
      },
    });

    this.messageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.loginContainer.addInnerElement(title.getElement());
    this.loginContainer.addInnerElement(this.loginInput.getElement());
    this.loginContainer.addInnerElement(this.passwordContainer.getElement());
    this.passwordContainer.addInnerElement(this.passwordInput.getElement());
    this.passwordContainer.addInnerElement(this.eyeIcon);
    this.loginContainer.addInnerElement(loginButton.getElement());
    this.loginContainer.addInnerElement(registerButton.getElement());
    this.loginContainer.addInnerElement(this.messageBox.getElement());

    [this.loginInput.getElement(), this.passwordInput.getElement()].forEach(
      (input) => {
        input.addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") this.handleLogin();
        });
      },
    );
  }

  public getElement(): HTMLElement {
    return this.loginContainer.getElement();
  }

  private togglePasswordVisibility(): void {
    const inputType = this.passwordInput.getElement().type;
    this.passwordInput.getElement().type =
      inputType === "password" ? "text" : "password";
  }

  private handleLogin(): void {
    const email = this.loginInput.getElement().value.trim();
    const password = this.passwordInput.getElement().value.trim();

    if (!email || !password) {
      this.displayMessage("Please enter both email and password.", true);
      return;
    }

    const loginData: MyCustomerSignin = { email, password };

    this.apiRequestService.authUser(
      loginData,
      (result: AuthResponse) => {
        this.displayMessage("Login successful!", false);

        const userId = result?.userId || "";
        this.updateSessionStorage(email, password, userId);

        this.clearInputs();
        globalThis.location.hash = Routes.HOME;
      },
      () => {
        this.displayMessage("Login failed. Check your credentials.", true);
      },
    );
  }

  private updateSessionStorage(
    email: string,
    password: string,
    userId: string,
  ): void {
    this.stateManager.login = email;
    this.stateManager.password = password;
    this.stateManager.userId = userId;
    this.stateManager.setState(true);
  }

  private displayMessage(message: string, isError: boolean): void {
    this.messageBox.getElement().textContent = message;
    this.messageBox.getElement().style.color = isError ? "red" : "green";
  }

  private clearInputs(): void {
    this.loginInput.getElement().value = "";
    this.passwordInput.getElement().value = "";
    this.passwordInput.getElement().type = "password";
    this.messageBox.getElement().textContent = "";
  }
}
