import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";

export default class CatalogView {
  private readonly catalogContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.catalogContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    this.configureView();
    return this.catalogContainer.getElement();
  }

  public configureView(): void {
    this.catalogContainer.getElement().innerHTML = "";

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "Каталог товаров Joke Store",
    });

    this.catalogContainer.addInnerElement(welcomeElement.getElement());

    const productList = [
      { id: "1", name: "Стикер с шуткой", description: "description" },
      { id: "2", name: "Кружка с приколом", description: "description" },
      { id: "3", name: "Футболка с мемом", description: "description" },
    ];

    productList.forEach((product) => {
      const card = new ElementCreator({
        tag: "div",
        className: [cssClasses.CONTAINER_COLUMN],
        textContent: "",
      });

      const title = new ElementCreator({
        tag: "div",
        className: [cssClasses.TITLE],
        textContent: product.name,
      });

      const description = new ElementCreator({
        tag: "div",
        className: [],
        textContent: product.description,
      });

      const productButton = new ElementCreator({
        tag: "button",
        className: [cssClasses.BUTTON],
        textContent: Buttons.PRODUCT,
        callback: (): void => {
          globalThis.location.hash = `${Routes.PRODUCT}=${product.id}`;
        },
      });

      card.addInnerElement(title.getElement());
      card.addInnerElement(description.getElement());
      card.addInnerElement(productButton.getElement());

      this.catalogContainer.addInnerElement(card.getElement());
    });
  }
}
