import { Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import { ELEM_PARAMS } from "./constants";

export default class NotFoundView {
  private readonly mainContainer: ElementCreator;
  private readonly msg: ElementCreator;
  private readonly backBtn: ElementCreator;

  constructor() {
    this.mainContainer = new ElementCreator(ELEM_PARAMS.mainContainer);
    this.msg = new ElementCreator(ELEM_PARAMS.msg);
    this.backBtn = new ElementCreator(ELEM_PARAMS.backBtn);

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.mainContainer.getElement();
  }

  private configureView(): void {
    this.mainContainer.addInnerElement(this.msg, this.backBtn);
    this.backBtn.getElement().addEventListener("click", () => {
      globalThis.location.hash = Routes.HOME;
    });
  }
}
