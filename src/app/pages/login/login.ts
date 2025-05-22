import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import {
  cssClasses,
  Routes,
  Buttons,
  Titles,
} from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";
import type { MyCustomerSignin } from "@commercetools/platform-sdk";
import Validator from "../../services/validator/validator";

interface AuthResponse {
  userId?: string;
}

export default class LoginView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly loginContainer: ElementCreator;
  private readonly emailInput: InputCreator;
  private readonly passwordInput: InputCreator;
  private readonly emailMessageBox: ElementCreator;
  private readonly passwordMessageBox: ElementCreator;
  private readonly messageBox: ElementCreator;
  private readonly eyeIcon: HTMLImageElement;

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

    this.emailInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Email",
    });

    this.passwordInput = new InputCreator({
      type: "password",
      className: [cssClasses.INPUT],
      placeholder: "Enter Password",
    });

    this.emailMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.passwordMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.messageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.eyeIcon = this.createEyeIcon();
    this.buildLoginForm();
    this.attachInputValidationHandlers();
    this.attachKeyboardHandlers();
  }

  public getElement(): HTMLElement {
    this.clearInputs();
    return this.loginContainer.getElement();
  }

  private buildLoginForm(): void {
    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: Titles.LOGIN,
    });

    const emailLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Email:",
    });
    const emailContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    emailContainer.addInnerElement(emailLabel.getElement());
    emailContainer.addInnerElement(this.emailInput.getElement());

    const passwordLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Password:",
    });
    const passwordInputWrapper = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_INPUTS],
      textContent: "",
    });
    passwordInputWrapper.addInnerElement(this.passwordInput.getElement());
    passwordInputWrapper.addInnerElement(this.eyeIcon);
    const passwordContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    passwordContainer.addInnerElement(passwordLabel.getElement());
    passwordContainer.addInnerElement(passwordInputWrapper.getElement());

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

    const formLoginContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_FORM],
      textContent: "",
    });
    formLoginContainer.addInnerElement(emailContainer.getElement());
    formLoginContainer.addInnerElement(this.emailMessageBox.getElement());
    formLoginContainer.addInnerElement(passwordContainer.getElement());
    formLoginContainer.addInnerElement(this.passwordMessageBox.getElement());

    this.loginContainer.addInnerElement(title.getElement());
    this.loginContainer.addInnerElement(formLoginContainer);
    this.loginContainer.addInnerElement(loginButton.getElement());
    this.loginContainer.addInnerElement(registerButton.getElement());
    this.loginContainer.addInnerElement(this.messageBox.getElement());
  }

  private attachInputValidationHandlers(): void {
    this.emailInput.getElement().addEventListener("input", () => {
      const email = this.emailInput.getElement().value;
      const emailError = Validator.checkEmail(email);
      this.emailMessageBox.getElement().textContent = emailError || "";
    });

    this.passwordInput.getElement().addEventListener("input", () => {
      const password = this.passwordInput.getElement().value;
      const passwordError = Validator.checkPassword(password);
      this.passwordMessageBox.getElement().textContent = passwordError || "";
    });
  }

  private attachKeyboardHandlers(): void {
    [this.emailInput.getElement(), this.passwordInput.getElement()].forEach(
      (input) => {
        input.addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") this.handleLogin();
        });
      },
    );
  }

  private createEyeIcon(): HTMLImageElement {
    const icon = document.createElement("img");
    icon.src = "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
    icon.alt = "eye icon";
    icon.classList.add(cssClasses.EYE);
    icon.style.cursor = "pointer";
    icon.addEventListener("click", this.togglePasswordVisibility.bind(this));
    return icon;
  }

  private togglePasswordVisibility(): void {
    const inputEl = this.passwordInput.getElement();
    const isPasswordVisible = inputEl.type === "text";

    inputEl.type = isPasswordVisible ? "password" : "text";

    this.eyeIcon.src = !isPasswordVisible
      ? "https://img.icons8.com/?size=100&id=e6GkJcP46Dip&format=png&color=000000"
      : "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
  }

  private handleLogin(): void {
    const email = this.emailInput.getElement().value;
    const password = this.passwordInput.getElement().value;

    this.clearErrorMessages();

    let hasError = false;

    const emailError = Validator.checkEmail(email);
    if (emailError) {
      this.emailMessageBox.getElement().textContent = emailError;

      hasError = true;
    }

    const passwordError = Validator.checkPassword(password);
    if (passwordError) {
      this.passwordMessageBox.getElement().textContent = passwordError;

      hasError = true;
    }

    if (hasError) return;
    const loginData: MyCustomerSignin = { email, password };

    this.apiRequestService.authUser(
      loginData,
      (result: AuthResponse) => {
        const userId = result?.userId || "";
        this.updateSessionStorage(email, password, userId);

        this.clearInputs();
        globalThis.location.hash = Routes.HOME;
      },
      (error: Error) => {
        const message = error instanceof Error ? error.message : String(error);
        this.displayMessage(message, true);
        // },
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
    this.messageBox.getElement().style.color = isError ? "#e7291f" : "#004177";
  }

  private clearInputs(): void {
    this.emailInput.getElement().value = "";
    this.passwordInput.getElement().value = "";
    this.passwordInput.getElement().type = "password";
    this.eyeIcon.src =
      "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";

    this.messageBox.getElement().textContent = "";
    this.clearErrorMessages();
  }
  private clearErrorMessages(): void {
    this.emailMessageBox.getElement().textContent = "";
    this.passwordMessageBox.getElement().textContent = "";
  }
}
