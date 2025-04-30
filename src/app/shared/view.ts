import ElementCreator from "./element-creator";
import type ElementParameters from "./element-parameters";

export default class View {
  public elementCreator: ElementCreator;
  constructor(parameters: ElementParameters) {
    this.elementCreator = this.createView(parameters);
  }

  public getHtmlElement(): HTMLElement {
    return this.elementCreator.getElement();
  }

  public createView(parameters: ElementParameters): ElementCreator {
    const elementParameters: ElementParameters = {
      tag: parameters.tag,
      className: parameters.className,
      textContent: parameters.textContent,
      callback: parameters.callback,
    };
    this.elementCreator = new ElementCreator(elementParameters);
    return this.elementCreator;
  }
}
