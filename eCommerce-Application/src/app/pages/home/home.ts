import { cssClasses } from "../../constants/constants";
import ElementCreator from "../../shared/element-creator";

export default class HomeView {
  private readonly mainElement: ElementCreator;

  constructor() {
    this.mainElement = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "Home",
    });
  }

  public getElement(): HTMLElement {
    return this.mainElement.getElement();
  }
}
