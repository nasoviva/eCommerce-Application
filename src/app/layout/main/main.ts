import { cssClasses, Routes } from "../../global-types/constants";
import HomeView from "../../pages/home/home";
import LoginView from "../../pages/login/login";
import RegistrationView from "../../pages/registration/registration";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";

export default class MainView extends View {
  private readonly contentContainer: ElementCreator;
  private readonly loginView: LoginView;
  private readonly registrationView: RegistrationView;
  private readonly homeView: HomeView;

  constructor() {
    super({
      tag: "main",
      className: [cssClasses.MAIN],
      textContent: "",
      callback: undefined,
    });
    this.loginView = new LoginView();
    this.registrationView = new RegistrationView();
    this.homeView = new HomeView();
    this.contentContainer = new ElementCreator({
      tag: "main",
      className: [cssClasses.MAIN],
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

    const sessionData = globalThis.sessionStorage.getItem("loginData");
    let isLoggedIn = false;

    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        isLoggedIn = parsedData?.isLoggedIn === true;
      } catch (error) {
        console.error("Error sessionStorage:", error);
      }
    }

    if (path === Routes.LOGIN) {
      if (isLoggedIn) {
        globalThis.location.hash = Routes.HOME;
        this.setContent(this.homeView.getElement());
      } else {
        this.setContent(this.loginView.getElement());
      }
    } else if (path === Routes.REGISTRATION) {
      this.setContent(this.registrationView.getElement());
    } else if (path === Routes.HOME) {
      if (isLoggedIn) {
        this.setContent(this.homeView.getElement());
      } else {
        globalThis.location.hash = Routes.LOGIN;
        this.setContent(this.loginView.getElement());
      }
    } else {
      globalThis.location.hash = Routes.LOGIN;
      this.setContent(this.loginView.getElement());
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
