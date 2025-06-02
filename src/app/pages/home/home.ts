import {
  Buttons,
  cssClasses,
  Routes,
  Titles,
} from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
export default class HomeView {
  private readonly homeContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.homeContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    this.configureView();
    return this.homeContainer.getElement();
  }

  public configureView(): void {
    this.homeContainer.getElement().innerHTML = "";
    const isLoggedIn = this.getAuthStatus();
    const welcomeMessage = isLoggedIn ? Titles.HOME : Titles.MAIN;

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: welcomeMessage,
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: [isLoggedIn ? cssClasses.DISABLE : cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    const catalogButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.GO_CATALOG,
      callback: (): void => {
        globalThis.location.hash = Routes.CATALOG;
      },
    });

    const imageContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.IMAGE_CONTAINER],
      textContent: "",
    });

    const imageElement = new ElementCreator({
      tag: "img",
      className: [cssClasses.IMAGE],
      textContent: "",
      attributes: {
        src: "./img/image-home.png",
        alt: "Funny illustration",
      },
    });

    this.homeContainer.addInnerElement(welcomeElement.getElement());
    this.homeContainer.addInnerElement(loginButton.getElement());
    imageContainer.addInnerElement(imageElement.getElement());
    isLoggedIn
      ? this.homeContainer.addInnerElement(
          imageContainer.getElement(),
          catalogButton.getElement(),
        )
      : this.homeContainer.addInnerElement(
          loginButton.getElement(),
          catalogButton.getElement(),
        );
  }

  private getAuthStatus(): boolean {
    return this.stateManager.isLoggedIn;
  }
}
