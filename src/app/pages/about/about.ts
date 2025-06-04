import { cssClasses } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";

export default class AboutView {
  private readonly aboutContainer: ElementCreator;

  constructor() {
    this.aboutContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "About us",
    });

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.aboutContainer.getElement();
  }

  private configureView(): void {
    const text = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "Text",
    });
    this.aboutContainer.addInnerElement(text.getElement());
  }
}
