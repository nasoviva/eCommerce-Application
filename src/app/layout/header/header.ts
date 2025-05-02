import { cssClasses } from "../../global-types/constants";
import View from "../../shared/view";

export default class HeaderView extends View {
  constructor() {
    super({
      tag: "header",
      className: [cssClasses.HEADER],
      textContent: "Header",
      callback: undefined,
    });
  }
}
