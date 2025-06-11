import type { ClientResponse } from "@commercetools/ts-client";
import { cssClasses, Titles } from "../../global-types/constants";
import type { Localization } from "../../global-types/types";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import css from "./basket.module.css";
import type { Cart } from "@commercetools/platform-sdk";
import DataParser from "../../services/api-request-service/data-parser";

const ELEM_PARAM = {
  mainContainer: {
    tag: "div",
    className: [css.mainContainer],
  },
  productArea: {
    tag: "div",
    className: [css.productArea],
  },
  itemContainer: {
    tag: "div",
    className: [css.itemContainer],
  },
  image: {
    tag: "img",
    className: [css.img],
  },
  title: {
    tag: "p",
    className: [css.title],
  },
  price: {
    tag: "p",
    className: [css.price],
  },
  discountPrice: {
    tag: "p",
    className: [css.title, css.discounted],
  },
  addBtn: {
    tag: "button",
    className: [css.controlBtn],
    textContent: "+",
  },
  subBtn: {
    tag: "button",
    className: [css.controlBtn],
    textContent: "-",
  },
  counter: {
    tag: "p",
    className: [css.counter],
  },
};

export default class BasketView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly mainContainer = new ElementCreator(ELEM_PARAM.mainContainer);
  private readonly productArea = new ElementCreator(ELEM_PARAM.productArea);

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.configureView();
  }

  public getElement(): HTMLElement {
    return this.mainContainer.getElement();
  }

  public async updateBasket(): Promise<void> {
    const result: ClientResponse<Cart> | void =
      await this.apiRequestService.getCart();
    const items = result?.body?.lineItems.map((x) => {
      return {
        id: x.key || "",
        count: x.quantity,
        name: x.name,
        price: x.price,
      };
    });
    console.log(items);
    if (!items) return;
    for (const item of items) {
      const container = new ElementCreator(ELEM_PARAM.itemContainer);
      const title = new ElementCreator(ELEM_PARAM.title);
      const price = new ElementCreator(ELEM_PARAM.price);
      const addBtn = new ElementCreator(ELEM_PARAM.addBtn);
      const subBtn = new ElementCreator(ELEM_PARAM.subBtn);
      const counter = new ElementCreator(ELEM_PARAM.counter);
      this.productArea.addInnerElement(container);
      container.addInnerElement(title, price, addBtn, counter, subBtn);

      counter.setTextContent(`${item.count}`);
      title.setTextContent(`${item.name[this.stateManager.locale]}`);
      price.setTextContent(
        `${item.price.discounted?.value.centAmount || item.price.value.centAmount} ${item.price.value.currencyCode}`,
      );
      let count = item.count;
      addBtn.setCallBack(() => {
        count += 1;
        this.apiRequestService.changeProductQuantity(item.id, count);
        counter.setTextContent(`${count}`);
      });
      subBtn.setCallBack(() => {
        count -= 1;
        if (count > 0) {
          counter.setTextContent(`${count}`);
          this.apiRequestService.changeProductQuantity(item.id, count);
        } else {
          this.apiRequestService.removeProduct(item.id);
          container.getElement().remove();
        }
      });
    }
  }

  private configureView(): void {
    this.mainContainer.addInnerElement(this.productArea);
  }

  private configureProductArea(): void {}
}
