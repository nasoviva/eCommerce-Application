import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";

export default class HomeView {
  private readonly homeContainer: ElementCreator;
  private readonly stateManager = new StateManager();

  constructor() {
    this.homeContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });
    this.configureView();
  }

  public getElement(): HTMLElement {
    this.configureView();
    return this.homeContainer.getElement();
  }

  public configureView(): void {
    this.homeContainer.getElement().innerHTML = "";

    // const loginData = JSON.parse(sessionStorage.getItem("loginData") || "{}");
    // const isLoggedIn = loginData?.isLoggedIn;
    // const firstName = loginData?.login;

    const loginDataRaw = sessionStorage.getItem("loginData");
    const loginData = loginDataRaw ? JSON.parse(loginDataRaw) : null;
    const isLoggedIn = loginData?.isLoggedIn === true;
    const firstName = loginData?.login || "";
    console.log(isLoggedIn, firstName);

    if (isLoggedIn) {
      const welcomeText = `Welcome, ${firstName}`;
      const title = new ElementCreator({
        tag: "h2",
        className: [cssClasses.TITLE],
        textContent: welcomeText,
      });
      this.homeContainer.addInnerElement(title.getElement());
    }

    const logoutButton = new ElementCreator({
      tag: "button",
      className: isLoggedIn
        ? [cssClasses.BUTTON]
        : [cssClasses.BUTTON, cssClasses.DISABLE],
      textContent: Buttons.LOGOUT,
      callback: (): void => {
        if (!isLoggedIn) return;
        this.stateManager.login = "";
        this.stateManager.setState(false);
        this.configureView();
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: isLoggedIn
        ? [cssClasses.BUTTON, cssClasses.DISABLE]
        : [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    const registerButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        globalThis.location.hash = Routes.REGISTRATION;
      },
    });

    this.homeContainer.addInnerElement(registerButton.getElement());
    this.homeContainer.addInnerElement(loginButton.getElement());
    this.homeContainer.addInnerElement(logoutButton.getElement());
  }
}
