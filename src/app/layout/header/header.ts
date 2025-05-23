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
      textContent: "Joke Store",
    });

    logoContainer.getElement().addEventListener("click", () => {
      globalThis.location.hash = Routes.HOME;
    });

    this.headerContainer.addInnerElement(logoContainer.getElement());

    this.renderButtons();
  }

  private renderButtons(): void {
    let currentRoute = globalThis.location.hash;
    const isLoggedIn = this.stateManager.isLoggedIn;
    const buttonsContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_BUTTONS],
      textContent: "",
    });

    const homeButton = new ElementCreator({
      tag: "button",
      className: [
        cssClasses.HEADER_BUTTON,
        currentRoute === Routes.HOME
          ? cssClasses.HEADER_BUTTON_ACTIVE
          : cssClasses.HEADER_BUTTON,
      ],
      textContent: Buttons.HOME,
      callback: (): void => {
        globalThis.location.hash = Routes.HOME;
      },
    });

    const catalogButton = new ElementCreator({
      tag: "button",
      className: [
        cssClasses.HEADER_BUTTON,
        currentRoute === Routes.CATALOG
          ? cssClasses.HEADER_BUTTON_ACTIVE
          : cssClasses.HEADER_BUTTON,
      ],
      textContent: Buttons.CATALOG,
      callback: (): void => {
        globalThis.location.hash = Routes.CATALOG;
      },
    });

    const profileButton = new ElementCreator({
      tag: "button",
      className: [
        cssClasses.HEADER_BUTTON,
        ...(!isLoggedIn ? [cssClasses.DISABLE] : []),
        currentRoute === Routes.PROFILE
          ? cssClasses.HEADER_BUTTON_ACTIVE
          : cssClasses.HEADER_BUTTON,
      ],
      textContent: Buttons.PROFILE,
      callback: (): void => {
        globalThis.location.hash = Routes.PROFILE;
      },
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: [
        cssClasses.HEADER_BUTTON,
        ...(isLoggedIn ? [cssClasses.DISABLE] : []),
        currentRoute === Routes.LOGIN
          ? cssClasses.HEADER_BUTTON_ACTIVE
          : cssClasses.HEADER_BUTTON,
      ],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    const registerButton = new ElementCreator({
      tag: "button",
      className: [
        cssClasses.HEADER_BUTTON,
        currentRoute === Routes.REGISTRATION
          ? cssClasses.HEADER_BUTTON_ACTIVE
          : cssClasses.HEADER_BUTTON,
      ],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        globalThis.location.hash = Routes.REGISTRATION;
      },
    });

    const logoutButton = new ElementCreator({
      tag: "button",
      className: isLoggedIn
        ? [cssClasses.HEADER_BUTTON]
        : [cssClasses.DISABLE, cssClasses.HEADER_BUTTON],
      textContent: Buttons.LOGOUT,
      callback: (): void => {
        this.apiRequestService.logOutUser();
        this.renderHeader();
        globalThis.location.hash = Routes.LOGIN;
      },
    });
    this.headerContainer.addInnerElement(buttonsContainer.getElement());
    buttonsContainer.addInnerElement(homeButton.getElement());
    buttonsContainer.addInnerElement(catalogButton.getElement());
    buttonsContainer.addInnerElement(registerButton.getElement());
    buttonsContainer.addInnerElement(loginButton.getElement());
    buttonsContainer.addInnerElement(profileButton.getElement());
    buttonsContainer.addInnerElement(logoutButton.getElement());
  }
}
