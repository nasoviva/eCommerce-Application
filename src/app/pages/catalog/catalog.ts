import {
  Buttons,
  cssClasses,
  Routes,
  Titles,
} from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type { Localization } from "../../global-types/types";
import DataParser from "../../services/api-request-service/data-parser";
import type { ClientResponse } from "@commercetools/ts-client";
import "./style/style.css";

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
    return this.catalogContainer.getElement();
  }

  private configureView(): void {
    this.catalogContainer.getElement().innerHTML = "";
    const catalog = new ElementCreator({
      tag: "div",
      className: [cssClasses.CARDS],
      textContent: "",
    });
    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: Titles.CATALOG,
    });

    this.catalogContainer.addInnerElement(welcomeElement.getElement());
    this.catalogContainer.addInnerElement(catalog.getElement());
    const locale: Localization = "en-US";

    this.apiRequestService.getProducts(
      {
        locale,
        attributes: {
          byKey: {},
          byName: {},
        },
      },
      (response: ClientResponse) => {
        const products = DataParser.parseForCatalog(response, locale);

        if (products.length === 0) {
          const emptyMsg = new ElementCreator({
            tag: "p",
            className: [],
            textContent: "No available products",
          });
          catalog.addInnerElement(emptyMsg.getElement());
        } else {
          products.forEach((product) => {
            const cardLink = new ElementCreator({
              tag: "a",
              className: [cssClasses.CARD],
              textContent: "",
            });
            cardLink
              .getElement()
              .setAttribute("href", `${Routes.PRODUCT}=${product.id}`);

            const imageContainer = new ElementCreator({
              tag: "div",
              className: [cssClasses.CARD_IMAGE_CONTAINER],
              textContent: "",
            });

            const image = new ElementCreator({
              tag: "img",
              className: [cssClasses.CARD_IMAGE],
              textContent: "",
            });
            image.getElement().setAttribute("src", product.image);
            image.getElement().setAttribute("alt", product.name);

            imageContainer.addInnerElement(image.getElement());

            const descriptionContainer = new ElementCreator({
              tag: "div",
              className: [cssClasses.CARD_DESCRIPTION],
              textContent: "",
            });

            const title = new ElementCreator({
              tag: "h4",
              className: [cssClasses.CARD_TITLE],
              textContent: product.name,
            });

            const subtitle = new ElementCreator({
              tag: "div",
              className: [],
              textContent: product.description || "No description",
            });

            let priceText = "";

            if (product.discount) {
              priceText = `Price: ${(product.discount / 100).toFixed(2)} <s>${(product.price / 100).toFixed(2)}</s>`;
            } else {
              priceText = `Price: ${(product.price / 100).toFixed(2)}`;
            }

            const price = new ElementCreator({
              tag: "div",
              className: [cssClasses.CARD_PRICE],
              textContent: "",
            });

            price.getElement().innerHTML = priceText;

            const button = new ElementCreator({
              tag: "button",
              className: [cssClasses.BUTTON],
              textContent: Buttons.PRODUCT,
              callback: (): void => {
                globalThis.location.hash = `${Routes.PRODUCT}=${product.id}`;
              },
            });

            descriptionContainer.addInnerElement(subtitle.getElement());

            cardLink.addInnerElement(imageContainer.getElement());
            cardLink.addInnerElement(title.getElement());
            cardLink.addInnerElement(descriptionContainer.getElement());
            cardLink.addInnerElement(price.getElement());
            cardLink.addInnerElement(button.getElement());

            catalog.addInnerElement(cardLink.getElement());
          });
        }
      },
      (error: Error) => {
        console.error(error);
      },
    );
  }
}
