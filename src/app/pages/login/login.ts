import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import ApiRequestService from "../../services/api-request-service/api-request-service";
import StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";

export default class LoginView {
  private readonly loginContainer: ElementCreator;
  private readonly loginInput: InputCreator;
  private readonly passwordInput: InputCreator;
  private readonly eyeIcon: HTMLElement;
  private readonly messageBox: HTMLElement;

  constructor() {
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
      className: [],
      placeholder: "Enter login",
    });

    this.passwordInput = new InputCreator({
      type: "password",
      className: [],
      placeholder: "Enter password",
    });

    this.eyeIcon = new ElementCreator({
      tag: "span",
      className: [],
      textContent: "👁️",
      callback: this.togglePasswordVisibility.bind(this),
    }).getElement();
    this.eyeIcon.style.cursor = "pointer";

    const loginButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        void this.handleLogin();
      },
    });

    const registerButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        globalThis.location.hash = Routes.REGISTRATION;
      },
    });

    this.messageBox = document.createElement("div");

    this.loginContainer.addInnerElement(title.getElement());
    this.loginContainer.addInnerElement(this.loginInput.getElement());
    this.loginContainer.addInnerElement(this.passwordInput.getElement());
    this.loginContainer.addInnerElement(this.eyeIcon);
    this.loginContainer.addInnerElement(loginButton.getElement());
    this.loginContainer.addInnerElement(registerButton.getElement());
    this.loginContainer.addInnerElement(this.messageBox);
  }

  public getElement(): HTMLElement {
    return this.loginContainer.getElement();
  }

  private togglePasswordVisibility(): void {
    this.passwordInput.getElement().type =
      this.passwordInput.getElement().type === "password" ? "text" : "password";
  }

  private async handleLogin(): Promise<void> {
    const login = this.loginInput.getElement().value.trim();
    const password = this.passwordInput.getElement().value.trim();

    if (!login || !password) {
      this.showMessage("Please enter both login and password.", true);
      return;
    }

    const apiService = new ApiRequestService(new StateManager());

    await new Promise<void>((resolve) => {
      apiService.authUser(
        { email: login, password },
        () => {
          this.showMessage("Login successful!", false);
          globalThis.location.hash = Routes.HOME;
          resolve();
        },
        (error: Error) => {
          this.showMessage(
            "Login failed. Please check your credentials.",
            true,
          );
          console.error("Login error:", error);
          resolve();
        },
      );
    });
  }

  private showMessage(message: string, isError: boolean): void {
    this.messageBox.textContent = message;
    this.messageBox.style.color = isError ? "red" : "green";
  }
}
