export default class ElementParameters {
  public tag: string;
  public className: string[];
  public textContent: string;
  public callback?: (() => void) | null;
  public attributes?: Record<string, string>;
  constructor(
    tag: string,
    className: Array<string>,
    textContent: string,
    callback: () => void | null,
    attributes?: Record<string, string>,
  ) {
    this.tag = tag;
    this.className = className;
    this.textContent = textContent;
    this.callback = callback;
    this.attributes = attributes;
  }
}
