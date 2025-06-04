import {
  Buttons,
  cssClasses,
  Routes,
  Titles,
} from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type { Localization, UseSearchQuery } from "../../global-types/types";
import type { ClientResponse } from "@commercetools/ts-client";
import "./style/style.css";
import type { CatalogData } from "../../services/api-request-service/data-parser";
import DataParser from "../../services/api-request-service/data-parser";
import InputCreator from "../../shared/input-creator";

export default class CatalogView {
  private readonly catalogContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly cardsContainer: ElementCreator;
  private readonly paginationContainer: ElementCreator;
  private readonly breadcrumbsContainer: ElementCreator;
  private readonly locale: Localization = "en-US";

  private currentCategoryPath: Array<{ id: string; name: string }> = [];
  private readonly search: InputCreator;

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

    this.breadcrumbsContainer = new ElementCreator({
      tag: "div",
      className: ["breadcrumbs"],
      textContent: "",
    });

    this.search = new InputCreator({
      type: "input",
      className: [cssClasses.INPUT],
      placeholder: "Search...",
    });

    this.locale = this.stateManager.locale;

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.catalogContainer.getElement();
  }

  private configureView(): void {
    this.clearInputs();
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

    const searchContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
    });

    const searchButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON, cssClasses.SEARCH_BUTTON],
      textContent: this.locale === "RU" ? "Поиск" : "Search",
      callback: (): void => {
        this.handleSearch(this.search.getElement().value);
      },
    });

    this.search
      .getElement()
      .addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter")
          this.handleSearch(this.search.getElement().value);
      });

    searchContainer.addInnerElement(this.search.getElement());
    searchContainer.addInnerElement(searchButton.getElement());
    const wrapper = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_NAV],
      textContent: "",
    });

    const wrapperNavigation = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_LEFT],
      textContent: "",
    });
    const wrapperCatalog = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_RIGHT],
      textContent: "",
    });
    this.catalogContainer.addInnerElement(welcomeElement.getElement());
    this.catalogContainer.addInnerElement(
      this.breadcrumbsContainer.getElement(),
    );
    wrapperNavigation.addInnerElement(searchContainer.getElement());
    wrapperNavigation.addInnerElement(categoriesContainer.getElement());

    wrapperCatalog.addInnerElement(this.cardsContainer.getElement());
    wrapper.addInnerElement(wrapperNavigation.getElement());
    wrapper.addInnerElement(wrapperCatalog.getElement());
    this.catalogContainer.addInnerElement(wrapper.getElement());
    this.catalogContainer.addInnerElement(
      this.paginationContainer.getElement(),
    );

    this.apiRequestService.getCategories((response: ClientResponse) => {
      const categories = DataParser.parseCategories(response, this.locale);

      this.currentCategoryPath = [];
      this.loadProducts(this.locale);
      this.renderCategories(categories, categoriesContainer, this.locale);
      this.renderBreadcrumbs();
    });
  }
  private renderBreadcrumbs(): void {
    this.breadcrumbsContainer.getElement().innerHTML = "";

    const homeCrumb = new ElementCreator({
      tag: "span",
      className: [
        cssClasses.BREADCRUMB,
        this.currentCategoryPath.length === 0
          ? cssClasses.BREADCRUMB_ACTIVE
          : "",
      ].filter(Boolean),
      textContent: this.locale === "RU" ? "Каталог" : "Catalog",
      callback: (): void => {
        this.currentCategoryPath = [];
        this.loadProducts(this.locale);
        this.renderBreadcrumbs();
        const buttons = document.querySelectorAll(
          `.${cssClasses.CATEGORY_ACTIVE_LINK}`,
        );
        buttons.forEach((btn) =>
          btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK),
        );

        const allBtn = document.querySelector(`.${cssClasses.CATEGORY_LINK}`);
        if (allBtn) {
          allBtn.classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
        }
      },
    });

    this.breadcrumbsContainer.addInnerElement(homeCrumb.getElement());

    this.currentCategoryPath.forEach((category, index) => {
      const separator = new ElementCreator({
        tag: "span",
        className: [],
        textContent: " / ",
      });
      this.breadcrumbsContainer.addInnerElement(separator.getElement());

      const isActive = index === this.currentCategoryPath.length - 1;

      const crumb = new ElementCreator({
        tag: "span",
        className: [
          cssClasses.BREADCRUMB,
          isActive ? cssClasses.BREADCRUMB_ACTIVE : "",
        ].filter(Boolean),
        textContent: category.name,
        callback: (): void => {
          this.currentCategoryPath = this.currentCategoryPath.slice(
            0,
            index + 1,
          );
          this.loadProducts(this.locale, category.id);
          this.renderBreadcrumbs();
          this.setActiveCategoryButton();
        },
      });
      this.breadcrumbsContainer.addInnerElement(crumb.getElement());
    });
    const allBtn = document.querySelector(`.${cssClasses.CATEGORY_LINK}`);
    const allBtns = document.querySelectorAll(`.${cssClasses.CATEGORY_LINK}`);

    allBtns.forEach((btn) =>
      btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK),
    );
    if (this.currentCategoryPath.length === 0 && allBtn) {
      allBtn.classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
    }
  }
  private setActiveCategoryButton(): void {
    const buttons = document.querySelectorAll(`.${cssClasses.CATEGORY_LINK}`);
    buttons.forEach((btn) => {
      if (btn.textContent === this.currentCategoryPath.at(-1)?.name) {
        btn.classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
      }
    });
  }

  private renderCategories(
    categories: Array<{ id: string; name: string; children?: Array<any> }>,
    container: ElementCreator,
    locale: Localization,
    categoryButtons: HTMLElement[] = [],
  ): void {
    container.getElement().innerHTML = "";

    const allBtnElement = new ElementCreator({
      tag: "button",
      className: [cssClasses.CATEGORY_LINK],
      textContent: this.locale === "RU" ? "Все" : "All",
      callback: (): void => {
        this.currentCategoryPath = [];
        this.loadProducts(locale);
        this.renderBreadcrumbs();
        categoryButtons.forEach((btn) =>
          btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK),
        );
        allBtnElement
          .getElement()
          .classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
      },
    });

    if (this.currentCategoryPath.length === 0) {
      allBtnElement.getElement().classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
    }

    container.addInnerElement(allBtnElement.getElement());

    const renderCategoryList = (
      categoriesList: Array<{
        id: string;
        name: string;
        children?: Array<any>;
      }>,
      parentContainer: ElementCreator,
      level: number = 0,
    ): void => {
      categoriesList.forEach((category, index) => {
        const btnElement = new ElementCreator({
          tag: "button",
          className: [
            cssClasses.CATEGORY_LINK,
            cssClasses.CATEGORY_SUB_CONTAINER,
          ],
          textContent: category.name,
          callback: (): void => {
            this.currentCategoryPath = this.findCategoryPath(
              category.id,
              categories,
            );
            this.loadProducts(locale, category.id);
            this.renderBreadcrumbs();
            categoryButtons.forEach((btn) =>
              btn.classList.remove(cssClasses.CATEGORY_ACTIVE_LINK),
            );
            btnElement
              .getElement()
              .classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
          },
        });

        if (
          index === 0 &&
          this.currentCategoryPath.length > 0 &&
          this.currentCategoryPath[0].id === category.id
        ) {
          btnElement
            .getElement()
            .classList.add(cssClasses.CATEGORY_ACTIVE_LINK);
        }

        categoryButtons.push(btnElement.getElement());
        parentContainer.addInnerElement(btnElement.getElement());

        if (category.children && category.children.length > 0) {
          const subContainer = new ElementCreator({
            tag: "div",
            className: [cssClasses.CATEGORY_SUB_CONTAINER],
            textContent: "",
          });
          parentContainer.addInnerElement(subContainer.getElement());

          renderCategoryList(category.children, subContainer, level + 1);
        }
      });
    };

    renderCategoryList(categories, container);
  }

  private findCategoryPath(
    categoryId: string,
    categories: Array<{ id: string; name: string; children?: Array<any> }>,
    path: Array<{ id: string; name: string }> = [],
  ): Array<{ id: string; name: string }> {
    for (const category of categories) {
      const newPath = [...path, { id: category.id, name: category.name }];
      if (category.id === categoryId) {
        return newPath;
      }
      if (category.children) {
        const result = this.findCategoryPath(
          categoryId,
          category.children,
          newPath,
        );
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }

  private loadProducts(
    locale: Localization,
    categoryId?: string,
    page: number = 1,
    pageSize: number = 20,
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
        this.renderPagination(
          response.body.total,
          page,
          pageSize,
          locale,
          categoryId,
        );
      },
      (error: Error) => {
        console.error(error);
      },
    );
  }

  private renderProducts(products: CatalogData[]): void {
    this.clearInputs();
    if (products.length === 0) {
      const emptyMsg = new ElementCreator({
        tag: "p",
        className: [cssClasses.TEXT],
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
      cardLink
        .getElement()

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

      const basket = new ElementCreator({
        tag: "button",
        className: [cssClasses.BASKET],
        textContent: Buttons.BASKET,
        callback: (): void => {
          console.log(`add to basket ${product.id}`);
        },
      });

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
      cardLink.addInnerElement(basket.getElement());
      cardLink.addInnerElement(button.getElement());

      this.cardsContainer.addInnerElement(cardLink.getElement());
    });
  }

  private renderPagination(
    total: number,
    currentPage: number,
    pageSize: number,
    locale: Localization,
    categoryId?: string,
  ): void {
    const totalPages = Math.ceil(total / pageSize);
    this.paginationContainer.getElement().innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = new ElementCreator({
        tag: "button",
        className: [cssClasses.PAGINATION_BUTTON],
        textContent: `${i}`,
        callback: (): void => {
          this.loadProducts(locale, categoryId, i, pageSize);
        },
      });
      if (i === currentPage) {
        pageBtn.getElement().classList.add(cssClasses.PAGINATION_ACTIVE_BUTTON);
      }
      this.paginationContainer.addInnerElement(pageBtn.getElement());
    }
  }
  private handleSearch(queryText: string): void {
    const trimmedQuery = queryText.trim();
    if (trimmedQuery.length <= 2) {
      return;
    }

    const fuzzyLevel = trimmedQuery.length <= 5 ? 1 : 2;

    const searchQuery: UseSearchQuery = {
      locale: this.locale,
      text: trimmedQuery,
      limit: 20,
      offset: 0,
      fuzzy: true,
      fuzzyLevel: fuzzyLevel,
    };

    this.apiRequestService.searchProducts(
      searchQuery,
      (response: ClientResponse) => {
        const products: CatalogData[] = DataParser.parseForCatalog(
          response,
          this.locale,
        );
        this.cardsContainer.getElement().innerHTML = "";
        this.renderProducts(products);
        this.paginationContainer.getElement().innerHTML = "";
      },
      (error: Error) => {
        console.error("Search failed:", error);
      },
    );
  }

  private clearInputs(): void {
    this.search.getElement().value = "";
  }
}
