import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";

export default class HeaderView extends View {
  private readonly stateManager: StateManager;
  private readonly headerContainer: ElementCreator;
  private readonly apiRequestService: ApiRequestService;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    super({
      tag: "header",
      className: [cssClasses.HEADER],
      textContent: "",
    });
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.headerContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_ROW],
      textContent: "",
    });

    this.elementCreator.addInnerElement(this.headerContainer.getElement());
    this.renderHeader();
  }

  public updateHeader(): void {
    this.renderHeader();
  }

  private renderHeader(): void {
    this.headerContainer.getElement().innerHTML = "";

    const logoContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.LOGO],
      textContent: "Logo",
    });

    logoContainer.getElement().addEventListener("click", () => {
      globalThis.location.hash = Routes.HOME;
    });

    this.headerContainer.addInnerElement(logoContainer.getElement());

    this.renderButtons();
  }

  private renderButtons(): void {
    const isLoggedIn = this.stateManager.isLoggedIn;
    const buttonsContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_BUTTONS],
      textContent: "",
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: isLoggedIn
        ? [cssClasses.BUTTON, cssClasses.DISABLE]
        : [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
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

    const logoutButton = new ElementCreator({
      tag: "button",
      className: isLoggedIn
        ? [cssClasses.BUTTON]
        : [cssClasses.BUTTON, cssClasses.DISABLE],
      textContent: Buttons.LOGOUT,
      callback: (): void => {
        this.stateManager.isLoggedIn = false;
        this.renderHeader();
        globalThis.location.hash = Routes.LOGIN;
      },
    });
    this.headerContainer.addInnerElement(buttonsContainer.getElement());
    buttonsContainer.addInnerElement(registerButton.getElement());
    buttonsContainer.addInnerElement(loginButton.getElement());
    buttonsContainer.addInnerElement(logoutButton.getElement());
  }
}
