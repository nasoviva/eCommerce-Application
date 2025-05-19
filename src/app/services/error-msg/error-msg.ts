import ElementCreator from "../../shared/element-creator";
import { ELEM_PARAMS } from "./constants";

export default class ErrorMsg {
  private readonly msg: ElementCreator;

  constructor() {
    this.msg = new ElementCreator(ELEM_PARAMS.mainContainer);
  }

  public displayErrorMsg(error: string[]): void {
    const msg = error.join("\n");
    this.msg.setTextContent(msg);
    document.body.append(this.msg.getElement());
    this.msg.getElement().addEventListener("animationend", () => {
      this.msg.getElement().remove();
    });
    /* setTimeout(() => {
      this.msg.getElement().classList.toggle(css.activeMsg);
      this.msg.getElement().remove();
    }, 4000); */
  }
}
