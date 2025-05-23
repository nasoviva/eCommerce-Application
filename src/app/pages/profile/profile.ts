import { cssClasses } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";

export default class ProfileView {
  private readonly profileContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.profileContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    this.configureView();
    return this.profileContainer.getElement();
  }

  public configureView(): void {
    this.profileContainer.getElement().innerHTML = "";

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "This is Profile",
    });

    this.profileContainer.addInnerElement(welcomeElement.getElement());
  }
}
