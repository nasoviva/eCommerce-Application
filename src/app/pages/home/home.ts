import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";

export default class HomeView {
  private readonly homeContainer: ElementCreator;

  constructor() {
    this.homeContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "Welcome Home",
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.LOGOUT,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    this.homeContainer.addInnerElement(title.getElement());
    this.homeContainer.addInnerElement(loginButton.getElement());
  }

  public getElement(): HTMLElement {
    return this.homeContainer.getElement();
  }
}
