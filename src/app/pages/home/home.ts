import { cssClasses } from "../../global-types/constants";
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
    const userName = this.getUserName();

    const welcomeMessage =
      isLoggedIn && userName
        ? `Welcome, ${userName}!`
        : "Welcome to our application. Please log in to access more features.";

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: welcomeMessage,
    });

    this.homeContainer.addInnerElement(welcomeElement.getElement());
  }

  private getAuthStatus(): boolean {
    return this.stateManager.isLoggedIn;
  }

  private getUserName(): string {
    return this.stateManager.login || "";
  }
}
