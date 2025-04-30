import { cssClasses } from "../../constants/constants";
import View from "../../shared/view";

export default class FooterView extends View {
  constructor() {
    super({
      tag: "footer",
      className: [cssClasses.FOOTER],
      textContent: "Footer",
      callback: undefined,
    });
  }
}
