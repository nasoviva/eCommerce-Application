import { Buttons, cssClasses, Routes } from "../../constants/constants";
import ElementCreator from "../../shared/element-creator";

export default class HomeView {
  private readonly homeContainer: ElementCreator;

  constructor() {
    this.homeContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "Home Container",
    });
    const loginButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });
    this.homeContainer.addInnerElement(loginButton.getElement());
  }

  public getElement(): HTMLElement {
    return this.homeContainer.getElement();
  }
}
