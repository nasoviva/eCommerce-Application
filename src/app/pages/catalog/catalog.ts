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
import type { ClientResponse } from "@commercetools/ts-client";
import "./style/style.css";
import DataParser, { CatalogData } from "../../services/api-request-service/data-parser";

export default class CatalogView {
  private readonly catalogContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly cardsContainer: ElementCreator;
  private readonly paginationContainer: ElementCreator;
  private readonly locale: Localization = "en-US";

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
    this.cardsContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CARDS],
      textContent: "",
    });

    this.paginationContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.PAGINATION],
      textContent: "",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.catalogContainer.getElement();
  }

  private configureView(): void {
    this.cardsContainer.getElement().innerHTML = "";
    this.paginationContainer.getElement().innerHTML = "";

    const categoriesContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CATEGORY_FILTER],
      textContent: "",
    });


    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: Titles.CATALOG,
    });
    this.catalogContainer.addInnerElement(welcomeElement.getElement());
    this.catalogContainer.addInnerElement(categoriesContainer.getElement());
    this.catalogContainer.addInnerElement(this.cardsContainer.getElement());

    this.catalogContainer.addInnerElement(this.paginationContainer.getElement());

    this.apiRequestService.getCategories(
      (response: ClientResponse) => {
        const categories = DataParser.parseCategories(response, this.locale);
        this.renderCategories(categories, categoriesContainer, this.cardsContainer, this.locale);
      }
    );

    this.loadProducts(this.locale);
  }

private renderCategories(
  categories: Array<{ id: string; name: string }>,
  container: ElementCreator,
  catalog: ElementCreator,
  locale: Localization,
): void {
  const categoryButtons: HTMLElement[] = [];

  const allBtnElement = new ElementCreator({
    tag: "button",
    className: [cssClasses.CATEGORY_LINK, cssClasses.CATEGORY_ACTIVE_LINK],
    textContent: "All",
    callback: () => {
      this.loadProducts(locale);

      categoryButtons.forEach(btn => {
        btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK);
      });
      allBtnElement.getElement().classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
    },
  });

  categoryButtons[0] = allBtnElement.getElement();
  container.addInnerElement(allBtnElement.getElement());

  categories.forEach((category, index) => {
    const btnElement = new ElementCreator({
      tag: "button",
      className: [cssClasses.CATEGORY_LINK],
      textContent: category.name,
      callback: () => {
        this.loadProducts(locale, category.id);

        categoryButtons.forEach(btn => {
          btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK);
        });
        btnElement.getElement().classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
      },
    });

    categoryButtons[index + 1] = btnElement.getElement();
    container.addInnerElement(btnElement.getElement());
  });
}

  private loadProducts(
    locale: Localization,
    categoryId?: string,
    page: number = 1,
    pageSize: number = 20
  ): void {

    const offset = (page - 1) * pageSize;

    const query = {
      locale,
      categories: categoryId ? [categoryId] : undefined,
      offset,
      limit: pageSize,
      attributes: {
        byKey: {},
        byName: {},
      },
    };

    this.apiRequestService.getProducts(
      query,
      (response: ClientResponse) => {
        const products = DataParser.parseForCatalog(response, locale);

        this.cardsContainer.getElement().innerHTML = "";
        this.paginationContainer.getElement().innerHTML = "";

        this.renderProducts(products);
        this.renderPagination(response.body.total, page, pageSize, locale, categoryId);
      },
      (error: Error) => {
        console.error(error);
      },
    );

  }

  private renderProducts(products: CatalogData[]): void {
    if (products.length === 0) {
      const emptyMsg = new ElementCreator({
        tag: "p",
        className: [],
        textContent: "No available products",
      });
      this.cardsContainer.addInnerElement(emptyMsg.getElement());
      return;
    }

    products.forEach((product) => {

      const cardLink = new ElementCreator({
        tag: "a",
        className: [cssClasses.CARD],
        textContent: "",
      });
      cardLink.getElement().setAttribute("href", `${Routes.PRODUCT}=${product.id}`);

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

      this.cardsContainer.addInnerElement(cardLink.getElement());
    });
  }

  private renderPagination(
    total: number,
    currentPage: number,
    pageSize: number,
    locale: Localization,
    categoryId?: string
  ): void {
    const totalPages = Math.ceil(total / pageSize);
    this.paginationContainer.getElement().innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = new ElementCreator({
        tag: "button",
        className: [cssClasses.PAGINATION_BUTTON],
        textContent: `${i}`,
        callback: () => {
          this.loadProducts(locale, categoryId, i, pageSize);
        },
      });
      if (i === currentPage) {
        pageBtn.getElement().classList.add(cssClasses.PAGINATION_ACTIVE_BUTTON);
      }
      this.paginationContainer.addInnerElement(pageBtn.getElement());
    }
  }
}
