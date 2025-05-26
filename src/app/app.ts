import type {
  CategoryPagedQueryResponse,
  ClientResponse,
  ProductProjectionPagedSearchResponse,
} from "@commercetools/platform-sdk";
import "../style.css";
import FooterView from "./layout/footer/footer";
import HeaderView from "./layout/header/header";
import MainView from "./layout/main/main";
import ApiRequestService from "./services/api-request-service/api-request-service";
import StateManager from "./services/state-manager/state-manager";
import DataParser from "./services/api-request-service/data-parser";

export default class App {
  private readonly mainView: MainView;
  private readonly headerView: HeaderView;
  private readonly footerView: FooterView;
  private readonly apiRequestService: ApiRequestService;
  private readonly stateManager: StateManager;

  constructor() {
    this.stateManager = new StateManager();
    this.apiRequestService = new ApiRequestService(this.stateManager);

    this.headerView = new HeaderView(this.stateManager, this.apiRequestService);
    this.footerView = new FooterView();

    this.mainView = new MainView(
      this.headerView,
      this.stateManager,
      this.apiRequestService,
    );

    App.setFavicon("./favicon.ico");
    this.createView();

    this.testMethod();
  }

  private static setFavicon(url: string): void {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = url;

    document.head.appendChild(link);
  }

  public createView(): void {
    const { search, pathname, hash } = globalThis.location;

    if (search.startsWith("?/")) {
      const decoded = search
        .slice(2)
        .split("&")
        .map((s) => s.replace("~and~", "&"))
        .join("?");

      globalThis.history.replaceState(
        undefined,
        "",
        pathname.slice(0, -1) + decoded + hash,
      );
    }
    document.body.append(
      this.headerView.getHtmlElement(),
      this.mainView.getHtmlElement(),
      this.footerView.getHtmlElement(),
    );
  }

  /* метод для тестирования функций позже можно будет удалить */
  public testMethod(): void {
    const myButton = document.createElement("button");
    myButton.textContent = "TEST BUTTON";
    /* КНОПКА ЗДЕСЬ */
    document.body.append(myButton);
    myButton.addEventListener("click", () => {
      /* Тест регистрации юзера */
      /* this.apiRequestService.registerUser({
        email: "newCustomer2@testemail.com",
        password: "Test123!",
        firstName: "Newton2",
        lastName: "Newson2",
        middleName: "Nooby2",
        title: "New guy",
        salutation: "Hey!",
        dateOfBirth: "1993-01-01",
        companyName: "New company",
        vatId: "2",
        addresses: [{ country: "RU" }],
        defaultShippingAddress: 0,
        defaultBillingAddress: 0,
      }); */
      /* Тест логина юзера */
      /* this.apiRequestService.authUser({
        email: "testemail@testemail.com",
        password: "Test123!",
      }); */

      /* Пример получения категорий */
      this.apiRequestService.getCategories(
        (result: ClientResponse<CategoryPagedQueryResponse>) => {
          console.log(DataParser.parseCategories(result, "en-US"));
        },
      );
      /*Пример получения товаров */
      this.apiRequestService.getProducts(
        {
          locale: "en-US",
          attributes: {
            byKey: {},
            byName: {
              material: "paper",
            },
          },
          price: {
            from: 500,
            to: 1020,
          },
          sort: {
            price: "desc",
            name: "asc",
          },
          categories: [
            "5494ada2-4552-4264-9d9f-59b836591845",
            "58d82ca1-34de-417b-b9ec-90a28bd0a043",
          ],
        },
        (result: ClientResponse<ProductProjectionPagedSearchResponse>) => {
          console.log(DataParser.parseForCatalog(result, "en-US"));
        },
      );
      /* Пример получения товаров по поиску */
      this.apiRequestService.searchProducts(
        {
          locale: "en-US",
          text: "coffee",
        },
        (result: ClientResponse<ProductProjectionPagedSearchResponse>) => {
          console.log(DataParser.parseForCatalog(result, "en-US"));
        },
      );
    });
  }
}
