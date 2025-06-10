import { cssClasses, Titles } from "../../global-types/constants";
import type { Localization } from "../../global-types/types";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";

export default class BasketView {
  private readonly mainContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly locale: Localization = "en-US";

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.mainContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    this.locale = this.stateManager.locale;

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.mainContainer.getElement();
  }

  private configureView(): void {
    const basketContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: Titles.BASKET,
    });

    basketContainer.addInnerElement(welcomeElement.getElement());
    this.mainContainer.addInnerElement(basketContainer.getElement());
  }
}
