import type ElementParameters from "./element-parameters";
import InputCreator from "./input-creator";
import type View from "./view";

export default class ElementCreator {
  public element: HTMLElement;
  constructor(parameter: ElementParameters) {
    this.element = this.createElement(parameter);
    this.configureElement(parameter);
  }

  public configureElement(parameter: ElementParameters): void {
    this.setCssClasses(parameter.className);
    if (parameter.textContent) this.setTextContent(parameter.textContent);
    if (parameter.callback) {
      this.setCallBack(parameter.callback);
    }
    if (parameter.attributes) {
      this.setAttributes(parameter.attributes);
    }
  }

  public setContent(view: View): void {
    const element = view.getHtmlElement();
    const currentElement = this.getElement();
    while (currentElement.firstElementChild) {
      currentElement.firstElementChild.remove();
    }
    this.addInnerElement(element);
  }

  public createElement(parameter: ElementParameters): HTMLElement {
    this.element = document.createElement(parameter.tag);
    return this.element;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement(
    ...elements: (HTMLElement | ElementCreator | InputCreator)[]
  ): void {
    for (const item of elements) {
      if (item instanceof ElementCreator || item instanceof InputCreator) {
        this.element.append(item.getElement());
      } else {
        this.element.append(item);
      }
    }
  }

  public setCssClasses(cssClasses: string[]): void {
    if (this.element) {
      for (const className of cssClasses) {
        this.element.classList.add(className);
      }
    }
  }

  public setTextContent(text: string): void {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  public setCallBack(callback: () => void): void {
    if (this.element && typeof callback === "function") {
      this.element.addEventListener("click", () => callback());
    }
  }

  public setAttributes(attributes?: Record<string, string>): void {
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        this.element.setAttribute(key, value);
      });
    }
  }
}
