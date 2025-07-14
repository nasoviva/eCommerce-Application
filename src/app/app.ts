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
}
