import { cssClasses, Routes } from "../../global-types/constants";
import CatalogView from "../../pages/catalog/catalog";
import HomeView from "../../pages/home/home";
import LoginView from "../../pages/login/login";
import NotFoundView from "../../pages/not-found/not-found";
import ProfileView from "../../pages/profile/profile";
import RegistrationView from "../../pages/registration/registration";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";
import type HeaderView from "../header/header";

export default class MainView extends View {
  private readonly contentContainer: ElementCreator;
  private readonly loginView: LoginView;
  private readonly catalogView: CatalogView;
  private readonly profileView: ProfileView;
  private readonly homeView: HomeView;
  private readonly registrationView: RegistrationView;
  private readonly notFoundView: NotFoundView;
  private readonly headerView: HeaderView;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;

  constructor(
    headerView: HeaderView,
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    super({
      tag: "main",
      className: [cssClasses.MAIN],
      textContent: "",
    });

    this.headerView = headerView;
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;
    this.loginView = new LoginView(this.stateManager, this.apiRequestService);
    this.catalogView = new CatalogView(
      this.stateManager,
      this.apiRequestService,
    );
    this.profileView = new ProfileView(
      this.stateManager,
      this.apiRequestService,
    );
    this.registrationView = new RegistrationView(
      this.stateManager,
      this.apiRequestService,
    );
    this.homeView = new HomeView(this.stateManager, this.apiRequestService);
    this.notFoundView = new NotFoundView();

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

    const isLoggedIn = this.stateManager.isLoggedIn;
    this.headerView.updateHeader();
    if (path === Routes.LOGIN) {
      if (isLoggedIn) {
        globalThis.location.hash = Routes.HOME;
        return;
      }
      this.setContent(this.loginView.getElement());
    } else if (path === Routes.CATALOG) {
      if (isLoggedIn) {
        globalThis.location.hash = Routes.CATALOG;
        this.setContent(this.catalogView.getElement());
      } else {
        globalThis.location.hash = Routes.HOME;
        return;
      }
    } else if (path === Routes.PROFILE) {
      if (isLoggedIn) {
        globalThis.location.hash = Routes.PROFILE;
        this.setContent(this.profileView.getElement());
      } else {
        globalThis.location.hash = Routes.HOME;
        return;
      }
    } else if (path === Routes.REGISTRATION) {
      const registrationElement = this.registrationView.getElement();
      this.setContent(registrationElement);
    } else if (path === Routes.HOME || path === "") {
      this.setContent(this.homeView.getElement());
    } else {
      globalThis.location.hash = Routes.NOT_FOUND;
      this.setContent(this.notFoundView.getElement());
    }
  }

  private setupRouting(): void {
    let previousHash = globalThis.location.hash;

    globalThis.addEventListener("hashchange", () => {
      localStorage.setItem("previousRoute", previousHash);
      previousHash = globalThis.location.hash;
      this.handleRouting();
    });
    localStorage.setItem("previousRoute", previousHash);
    this.handleRouting();
  }
}
