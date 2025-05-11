import { cssClasses, Buttons, Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";

export default class RegistrationView {
  private readonly registrationContainer: ElementCreator;

  constructor() {
    this.registrationContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "Registration",
    });

    const registrationButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        globalThis.location.hash = Routes.HOME;
      },
    });
    const goBackButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.GO_LOGIN,
      callback: (): void => {
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    this.registrationContainer.addInnerElement(title.getElement());
    this.registrationContainer.addInnerElement(registrationButton.getElement());
    this.registrationContainer.addInnerElement(goBackButton.getElement());
  }

  public getElement(): HTMLElement {
    return this.registrationContainer.getElement();
  }
}
