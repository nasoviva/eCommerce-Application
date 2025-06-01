import ElementCreator from "./element-creator";
import type ElementParameters from "./element-parameters";

export default class CustomElementCreator<
  SelectedHTMLType extends HTMLElement,
> extends ElementCreator {
  public element: SelectedHTMLType;

  constructor(parameter: ElementParameters) {
    super(parameter);
    const element = document.createElement(parameter.tag);
    if (CustomElementCreator.isHTMLType<SelectedHTMLType>(element))
      this.element = element;
    else
      throw new Error(
        "Wrong type parameter on ElementBuilder instance declaration",
      );
    super.configureElement(parameter);
  }

  public static isHTMLType<Type extends HTMLElement>(
    element: HTMLElement,
  ): element is Type {
    return !!element;
  }

  public getElement(): SelectedHTMLType {
    return this.element;
  }
}
