import { Buttons, cssClasses, Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";

export default class ProductView {
  private readonly productContainer: ElementCreator;

  constructor(id: string) {
    this.productContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "Product",
    });

    this.configureView(id);
  }

  public getElement(id: string): HTMLElement {
    this.configureView(id);
    return this.productContainer.getElement();
  }

  public configureView(id: string): void {
    this.productContainer.getElement().innerHTML = "";

    const welcomeElement = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: `This is Product ${id}`,
    });

    const backButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.CATALOG,
      callback: (): void => {
        globalThis.location.hash = Routes.CATALOG;
      },
    });

    this.productContainer.addInnerElement(welcomeElement.getElement());
    this.productContainer.addInnerElement(backButton.getElement());
  }
}
