import { cssClasses, Titles } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import View from "../../shared/view";

export default class FooterView extends View {
  constructor() {
    super({
      tag: "footer",
      className: [cssClasses.FOOTER],
      textContent: "",
      callback: undefined,
    });

    const appName = new ElementCreator({
      tag: "div",
      className: [cssClasses.TITLE],
      textContent: Titles.APP_NAME,
    });

    const year = new ElementCreator({
      tag: "div",
      className: [cssClasses.TITLE],
      textContent: Titles.YEAR,
    });

    const school = new ElementCreator({
      tag: "a",
      className: [cssClasses.LINK],
      textContent: Titles.RSSCHOOL,
      attributes: {
        href: "https://rs.school/courses/javascript",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    });


    this.getHtmlElement().append(appName.getElement());
    this.getHtmlElement().append(year.getElement());
    this.getHtmlElement().append(school.getElement());

  }
}
