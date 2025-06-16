import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";
import "./style/style.css";

export default class HeaderView extends View {
  private readonly stateManager: StateManager;
  private readonly headerContainer: ElementCreator;
  private readonly apiRequestService: ApiRequestService;
  private readonly mobileMenu: ElementCreator;
  private readonly burger: ElementCreator;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    super({
      tag: "header",
      className: [cssClasses.HEADER],
      textContent: "",
    });
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.headerContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_ROW],
      textContent: "",
    });

    this.mobileMenu = new ElementCreator({
      tag: "ul",
      className: [cssClasses.MOBILE_MENU],
      textContent: "",
    });

    this.burger = new ElementCreator({
      tag: "div",
      className: [cssClasses.BURGER],
      textContent: "",
    });

    this.elementCreator.addInnerElement(this.headerContainer.getElement());
    this.renderHeader();
    this.setupBurgerToggle();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  public updateHeader(): void {
    this.renderHeader();
  }

  private renderHeader(): void {
    this.headerContainer.getElement().innerHTML = "";
    this.burger.getElement().innerHTML = "";
    this.mobileMenu.getElement().innerHTML = "";

    const logoContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.LOGO],
      textContent: "",
    });

    const logoImage = new ElementCreator({
      tag: "img",
      className: [cssClasses.LOGO_IMG],
      textContent: "",
      attributes: {
        src: "./img/image-welcome.webp",
        alt: "Joke Store",
      },
    });

    logoContainer.addInnerElement(logoImage.getElement());

    logoContainer.getElement().addEventListener("click", () => {
      globalThis.location.hash = Routes.HOME;
    });

    this.headerContainer.addInnerElement(logoContainer.getElement());

    this.renderButtons();
    this.renderBurger();
    this.renderMobileMenu();
  }

  private renderBurger(): void {
    const line1 = new ElementCreator({
      tag: "div",
      className: ["burger-img"],
      textContent: "",
    });
    const line2 = new ElementCreator({
      tag: "div",
      className: [cssClasses.BURGER_IMG],
      textContent: "",
    });
    this.burger.addInnerElement(line1.getElement());
    this.burger.addInnerElement(line2.getElement());
    this.headerContainer.addInnerElement(this.burger.getElement());
  }

  private renderMobileMenu(): void {
    const isLoggedIn = this.stateManager.isLoggedIn;

    const links = [
      { text: Buttons.HOME, route: Routes.HOME },
      { text: Buttons.CATALOG, route: Routes.CATALOG },
      { text: Buttons.ABOUT, route: Routes.ABOUT },
      { text: Buttons.REGISTRATION, route: Routes.REGISTRATION },
      { text: Buttons.LOGIN, route: Routes.LOGIN, disable: isLoggedIn },
      { text: Buttons.PROFILE, route: Routes.PROFILE, disable: !isLoggedIn },
      {
        text: Buttons.LOGOUT,
        route: null,
        isLogout: true,
        disable: !isLoggedIn,
      },
      { text: Buttons.BASKET, route: Routes.BASKET },
    ];

    links.forEach(({ text, route, disable, isLogout }) => {
      const li = new ElementCreator({
        tag: "li",
        className: [cssClasses.MOBILE_MENU_ITEM],
        textContent: "",
      });

      const btn = this.createButton({
        text,
        route,
        disable,
        isLogout,
        isMobile: true,
      });

      li.addInnerElement(btn.getElement());
      this.mobileMenu.addInnerElement(li.getElement());
    });

    this.headerContainer.addInnerElement(this.mobileMenu.getElement());
  }

  private setupBurgerToggle(): void {
    this.burger.setCallBack(() => {
      const isOpen = this.mobileMenu.getElement().classList.contains("open");
      this.toggleMobileMenu(!isOpen);
    });
  }

  private toggleMobileMenu(open: boolean): void {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    this.burger.getElement().classList.toggle("rotate", open);
    this.mobileMenu.getElement().classList.toggle("open", open);
  }

  private renderButtons(): void {
    const isLoggedIn = this.stateManager.isLoggedIn;

    const buttonsContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_BUTTONS],
      textContent: "",
    });

    const buttonsData = [
      { text: Buttons.HOME, route: Routes.HOME },
      { text: Buttons.CATALOG, route: Routes.CATALOG },
      { text: Buttons.ABOUT, route: Routes.ABOUT },
      { text: Buttons.REGISTRATION, route: Routes.REGISTRATION },
      { text: Buttons.LOGIN, route: Routes.LOGIN, disable: isLoggedIn },
      { text: Buttons.PROFILE, route: Routes.PROFILE, disable: !isLoggedIn },

      {
        text: Buttons.LOGOUT,
        route: null,
        isLogout: true,
        disable: !isLoggedIn,
      },
      { text: Buttons.BASKET, route: Routes.BASKET },
    ];

    buttonsData.forEach(({ text, route, disable, isLogout }) => {
      const btn = this.createButton({
        text,
        route,
        disable,
        isLogout,
        isMobile: false,
      });
      buttonsContainer.addInnerElement(btn.getElement());
    });

    this.headerContainer.addInnerElement(buttonsContainer.getElement());
  }

  private createButton({
    text,
    route,
    disable,
    isLogout,
    isMobile,
  }: {
    text: string;
    route: string | null | undefined;
    disable?: boolean;
    isLogout?: boolean;
    isMobile: boolean;
  }): ElementCreator {
    const currentRoute = globalThis.location.hash;

    const classList = [
      cssClasses.HEADER_BUTTON,
      ...(disable ? [cssClasses.DISABLE] : []),
      ...(!isMobile && route && currentRoute === route
        ? [cssClasses.HEADER_BUTTON_ACTIVE]
        : []),
    ];

    const btn = new ElementCreator({
      tag: "button",
      className: classList,
      textContent: text,
      callback: (): void => {
        if (isLogout) {
          this.apiRequestService.logOutUser();
          this.renderHeader();
          globalThis.location.hash = Routes.LOGIN;
          if (isMobile) this.toggleMobileMenu(false);
          return;
        }

        if (!disable && route) {
          globalThis.location.hash = route;
          if (isMobile) this.toggleMobileMenu(false);
        }
      },
    });
    if (text === Buttons.BASKET) {
      this.apiRequestService.getCart().then((result) => {
        if (result?.body?.lineItems) {
          const total = result.body.lineItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          if (total > 0) {
            const counter = document.createElement("span");
            counter.className = "cart-counter";
            counter.textContent = String(total);
            btn.getElement().appendChild(counter);
          }
        }
      });
    }
    return btn;
  }

  private handleResize(): void {
    const isMenuOpen = this.mobileMenu.getElement().classList.contains("open");
    const isWide = window.innerWidth > 768;

    if (isMenuOpen && isWide) {
      this.toggleMobileMenu(false);
    }
  }
}
