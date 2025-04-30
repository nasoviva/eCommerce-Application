import { Buttons, cssClasses, Routes } from "../../constants/constants";
import ElementCreator from "../../shared/element-creator";

export default class LoginView {
  private readonly loginContainer: ElementCreator;

  constructor() {
    this.loginContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "Login Container",
    });

    const homeButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.GO_HOME,
      callback: (): void => {
        globalThis.location.hash = Routes.HOME;
      },
    });
    this.loginContainer.addInnerElement(homeButton.getElement());
  }

  public getElement(): HTMLElement {
    return this.loginContainer.getElement();
  }
}
