export default class InputParameters {
  public type: string;
  public className: string[];
  public placeholder: string;
  public value?: string;
  public name?: string;
  public callback?: () => void | null;
  public eventType?: string;
  public attributes?: Record<string, string>;

  constructor(
    type: string,
    className: string[],
    placeholder: string,
    callback: () => void | null,
    eventType: string = "input",
    value?: string,
    name?: string,
    attributes?: Record<string, string>,
  ) {
    this.type = type;
    this.className = className;
    this.placeholder = placeholder;
    this.value = value;
    this.name = name;
    this.callback = callback;
    this.eventType = eventType;
    this.attributes = attributes;
  }
}
