import type InputParameters from "./input-parameters";

export default class InputCreator {
  private readonly inputElement: HTMLInputElement;

  constructor(parameters: InputParameters) {
    this.inputElement = document.createElement("input");
    this.inputElement.type = parameters.type;
    if (parameters.placeholder)
      this.inputElement.placeholder = parameters.placeholder;
    this.inputElement.classList.add(...parameters.className);

    if (parameters.attributes) {
      Object.entries(parameters.attributes).forEach(([key, value]) => {
        this.inputElement.setAttribute(key, value);
      });
    }

    if (parameters.callback) {
      this.inputElement.addEventListener("input", parameters.callback);
    }
  }

  public getElement(): HTMLInputElement {
    return this.inputElement;
  }
}
