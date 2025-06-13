import type { ClientResponse } from "@commercetools/ts-client";
import { cssClasses, Routes, Titles } from "../../global-types/constants";
import type { Localization } from "../../global-types/types";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import css from "./basket.module.css";
import type { Cart, ProductProjection } from "@commercetools/platform-sdk";
import DataParser from "../../services/api-request-service/data-parser";
import InputCreator from "../../shared/input-creator";
import CustomElementCreator from "../../shared/custom-element-creator";

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
    tag: "h4",
    className: [css.title],
  },
  price: {
    tag: "p",
    className: [css.price, css.onePrice],
  },
  sumPrice: {
    tag: "p",
    className: [css.price, css.sumPrice],
  },
  totalPrice: {
    tag: "p",
    className: [css.price, css.totalPrice],
  },
  discountPrice: {
    tag: "p",
    className: [css.price, css.discounted],
  },
  addBtn: {
    tag: "button",
    className: [css.controlBtn, css.addBtn],
    textContent: "+",
  },
  subBtn: {
    tag: "button",
    className: [css.controlBtn, css.subBtn],
    textContent: "-",
  },
  counter: {
    tag: "p",
    className: [css.counter],
  },
  removeBtn: {
    tag: "button",
    className: [css.controlBtn, css.removeBtn],
    textContent: "\u274C",
  },
  emptyMsg: {
    tag: "h2",
    className: [css.title],
    textContent: "Not very funny yet :( go cheer yourself up!",
  },
  catalogBtn: {
    tag: "button",
    className: [css.controlBtn],
    textContent: "To the Catalog!",
  },
  sidebar: {
    tag: "div",
    className: [css.sideBar],
  },
  clearBtn: {
    tag: "button",
    className: [css.sideBarBtn],
    textContent: "Clear cart",
  },
  promoCodeInput: {
    tag: "input",
    className: [css.input],
    attributes: {
      type: "text",
      placeholder: "type MADPRICE",
    },
  },
  promoCodeBtn: {
    tag: "button",
    className: [css.sideBarBtn],
    textContent: "Use promo code",
  },
};

export default class BasketView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly mainContainer = new ElementCreator(ELEM_PARAM.mainContainer);
  private readonly productArea = new ElementCreator(ELEM_PARAM.productArea);
  private readonly emptyMessage = new ElementCreator(ELEM_PARAM.productArea);
  private readonly sideBar = new ElementCreator(ELEM_PARAM.sidebar);
  private readonly totalPrice = new ElementCreator(ELEM_PARAM.totalPrice);
  private readonly totalPriceBeforeDiscount = new ElementCreator(
    ELEM_PARAM.discountPrice,
  );

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
    const result = await this.apiRequestService.getCart();
    if (result) this.updateTotalPrice(result);
    const items = result?.body?.lineItems.map((x) => {
      return {
        id: x.id || "",
        count: x.quantity,
        name: x.name,
        price: x.price.discounted?.value.centAmount || x.price.value.centAmount,
        totalPrice: x.totalPrice.centAmount,
        currency: x.price.value.currencyCode,
        productId: x.productId,
      };
    });
    console.log(items);
    this.productArea.getElement().replaceChildren();
    if (!items || items.length === 0) {
      this.productArea.getElement().classList.add(css.hidden);
      this.sideBar.getElement().classList.add(css.hidden);
      this.emptyMessage.getElement().classList.remove(css.hidden);
      return;
    }
    this.productArea.getElement().classList.remove(css.hidden);
    this.sideBar.getElement().classList.remove(css.hidden);
    this.emptyMessage.getElement().classList.add(css.hidden);
    for (const item of items) {
      const container = new ElementCreator(ELEM_PARAM.itemContainer);
      const image = new ElementCreator(ELEM_PARAM.image);
      const title = new ElementCreator(ELEM_PARAM.title);
      const price = new ElementCreator(ELEM_PARAM.price);
      const totalPrice = new ElementCreator(ELEM_PARAM.sumPrice);
      const addBtn = new ElementCreator(ELEM_PARAM.addBtn);
      const subBtn = new ElementCreator(ELEM_PARAM.subBtn);
      const counter = new ElementCreator(ELEM_PARAM.counter);
      const removeBtn = new ElementCreator(ELEM_PARAM.removeBtn);
      this.productArea.addInnerElement(container);
      container.addInnerElement(
        image,
        title,
        price,
        totalPrice,
        addBtn,
        counter,
        subBtn,
        removeBtn,
      );

      counter.setTextContent(`${item.count}`);
      title.setTextContent(`${item.name[this.stateManager.locale]}`);
      totalPrice.setTextContent(`${item.totalPrice} ${item.currency}`);
      price.setTextContent(`${item.price} ${item.currency}`);

      let count = item.count;

      addBtn.setCallBack(async () => {
        count += 1;
        item.totalPrice += item.price;
        totalPrice.setTextContent(`${item.totalPrice} ${item.currency}`);
        counter.setTextContent(`${count}`);
        const result = await this.apiRequestService.changeProductQuantity(
          item.id,
          count,
        );
        if (result) this.updateTotalPrice(result);
      });

      subBtn.setCallBack(async () => {
        count -= 1;
        if (count > 0) {
          counter.setTextContent(`${count}`);
          item.totalPrice -= item.price;
          totalPrice.setTextContent(`${item.totalPrice} ${item.currency}`);
          const result = await this.apiRequestService.changeProductQuantity(
            item.id,
            count,
          );
          if (result) this.updateTotalPrice(result);
        } else {
          this.apiRequestService.removeProduct(item.id);
          container.getElement().remove();
        }
      });

      removeBtn.setCallBack(async () => {
        const result = await this.apiRequestService.removeProduct(item.id);
        if (result) this.updateTotalPrice(result);
        container.getElement().remove();
      });

      this.apiRequestService.getProductById(
        item.productId,
        (result: ClientResponse<ProductProjection>) => {
          const src = result.body?.masterVariant.images?.map((x) => x.url) || [
            "",
          ];
          image.setAttributes({ src: src[0] });
        },
      );
    }
  }

  private updateTotalPrice(response: ClientResponse<Cart>): void {
    const totalPrice = response.body?.totalPrice.centAmount || 0;
    const discountedValue =
      response.body?.discountOnTotalPrice?.discountedAmount.centAmount;
    this.totalPrice.setTextContent(
      `${totalPrice} ${this.stateManager.currency}`,
    );
    if (discountedValue) {
      this.totalPriceBeforeDiscount.setTextContent(
        `${totalPrice + discountedValue} ${this.stateManager.currency}`,
      );
      this.totalPriceBeforeDiscount.getElement().classList.remove(css.hidden);
    } else this.totalPriceBeforeDiscount.getElement().classList.add(css.hidden);
  }

  private configureView(): void {
    this.configureBasket();
    this.configureEmptyMessage();
    this.configureSideBar();
    this.mainContainer.addInnerElement(
      this.sideBar,
      this.productArea,
      this.emptyMessage,
    );
  }

  private async configureBasket(): Promise<void> {
    if (!this.stateManager.activeCart) {
      await this.apiRequestService.createCart(
        this.stateManager.currency,
        this.stateManager.locale,
      );
      this.stateManager.activeCart = true;
    } else await this.apiRequestService.getCart();
  }

  private configureEmptyMessage(): void {
    const message = new ElementCreator(ELEM_PARAM.emptyMsg);
    const btn = new ElementCreator(ELEM_PARAM.catalogBtn);

    btn.setCallBack(() => (globalThis.location.hash = Routes.CATALOG));
    this.emptyMessage.addInnerElement(message, btn);
  }

  private configureSideBar(): void {
    const clearBtn = new ElementCreator(ELEM_PARAM.clearBtn);
    const promoInput = new CustomElementCreator<HTMLInputElement>(
      ELEM_PARAM.promoCodeInput,
    );
    const promoBtn = new ElementCreator(ELEM_PARAM.promoCodeBtn);

    this.sideBar.addInnerElement(
      clearBtn,
      promoInput,
      promoBtn,
      this.totalPriceBeforeDiscount,
      this.totalPrice,
    );

    clearBtn.setCallBack(async () => {
      await this.apiRequestService.clearCart();
      this.updateBasket();
    });

    promoBtn.setCallBack(async () => {
      const code = promoInput.getElement().value;
      const result = await this.apiRequestService.useDiscountCode(code);
      if (result) this.updateTotalPrice(result);
    });
  }
}
