import "../style.css";
import FooterView from "./layout/footer/footer";
import HeaderView from "./layout/header/header";
import MainView from "./layout/main/main";
import ApiRequestService from "./services/api-request-service/api-request-service";
import StateManager from "./services/state-manager/state-manager";

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
  private async testMethod(): Promise<void> {
    const myButton = document.createElement("button");
    myButton.textContent = "ADD ITEM";
    const myButton2 = document.createElement("button");
    myButton2.textContent = "REMOVE ITEM";
    /* КНОПКА ЗДЕСЬ */
    document.body.append(myButton, myButton2);
    // Cчётчик товара
    let count = 0;
    let id: string = "";
    myButton.addEventListener("click", async () => {
      count += 1;
      if (count > 1) this.apiRequestService.changeProductQuantity(id, count);
      else
        id = await this.apiRequestService.addProduct(
          "0f599752-d8cb-4918-8c82-a937c4cf4c73",
        );
    });
    myButton2.addEventListener("click", () => {
      /* count2 += 1;
      if (count2 > 1)
        this.apiRequestService.changeProductQuantity(
          "794ecccd-1deb-4425-8922-576f38f10f8e",
          count2,
        );
      else
        this.apiRequestService.addProduct(
          "794ecccd-1deb-4425-8922-576f38f10f8e",
        ); */
      count -= 1;
      if (count > 0) this.apiRequestService.changeProductQuantity(id, count);
      else this.apiRequestService.removeProduct(id);
    });
  }
}
