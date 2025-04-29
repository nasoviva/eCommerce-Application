import { cssClasses, Routes } from "../../constants/constants";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";
import HomeView from "../home/home";
import LoginView from "../login/login";

export default class MainView extends View {
  private readonly contentContainer: ElementCreator;
  private readonly loginView: LoginView;
  private readonly homeView: HomeView;

  constructor() {
    super({
      tag: "main",
      className: [cssClasses.MAIN],
      textContent: "",
      callback: undefined,
    });
    this.loginView = new LoginView();
    this.homeView = new HomeView();
    this.contentContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
      callback: undefined,
    });
    this.elementCreator.addInnerElement(this.contentContainer.getElement());
    this.setupRouting();
  }

  private setContent(view: HTMLElement): void {
    this.clearContent();
    this.contentContainer.addInnerElement(view);
  }

  private clearContent(): void {
    const currentElement = this.contentContainer.getElement();
    while (currentElement.firstElementChild) {
      currentElement.firstElementChild.remove();
    }
  }

  private async handleRouting(): Promise<void> {
    const path = globalThis.location.hash;

    if (path === Routes.LOGIN) {
      this.setContent(this.loginView.getElement());
    } else if (path === Routes.HOME) {
      this.setContent(this.homeView.getElement());
    } else {
      globalThis.location.hash = Routes.HOME;
    }
  }

  private setupRouting(): void {
    let previousHash = globalThis.location.hash;

    globalThis.addEventListener("hashchange", () => {
      sessionStorage.setItem("previousRoute", previousHash);
      previousHash = globalThis.location.hash;
      this.handleRouting();
    });
    sessionStorage.setItem("previousRoute", previousHash);
    this.handleRouting();
  }
}
