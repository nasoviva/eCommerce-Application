import ElementCreator from "../../shared/element-creator";
import { ELEM_PARAMS } from "./constants";
import css from "./error-msg.module.css";

export default class ToastMsg {
  private readonly msg: ElementCreator;

  constructor() {
    this.msg = new ElementCreator(ELEM_PARAMS.mainContainer);
  }

  public displayErrorMsg(error: string[]): void {
    const msg = error.join("\n");
    this.switchStyle("error");
    this.msg.setTextContent(msg);
    document.body.append(this.msg.getElement());
    this.msg.getElement().addEventListener("animationend", () => {
      this.msg.getElement().remove();
    });
  }

  public displaySuccessMsg(text: string[]): void {
    const msg = text.join("\n");
    this.switchStyle("success");
    this.msg.setTextContent(msg);
    document.body.append(this.msg.getElement());
    this.msg.getElement().addEventListener("animationend", () => {
      this.msg.getElement().remove();
    });
  }

  private switchStyle(string: "success" | "error"): void {
    if (string === "success") {
      this.msg.getElement().classList.add(css.goodMsg);
      this.msg.getElement().classList.remove(css.badMsg);
    } else {
      {
        this.msg.getElement().classList.add(css.badMsg);
        this.msg.getElement().classList.remove(css.goodMsg);
      }
    }
  }
}
