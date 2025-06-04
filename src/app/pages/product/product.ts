import { cssClasses, Buttons, Routes } from "../../global-types/constants";
import ElementCreator from "../../shared/element-creator";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type { ClientResponse } from "@commercetools/ts-client";
import "./style/style.css";
import "../catalog/style/style.css";
import modalWindow from "../../services/modal-window/modalWindow";

export default class ProductView {
  private readonly productContainer: ElementCreator;
  private readonly id: string;
  private readonly api: ApiRequestService;
  private currentIndex = 0;

  constructor(id: string, apiRequestService: ApiRequestService) {
    this.id = id;
    this.api = apiRequestService;

    this.productContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_PRODUCT],
      textContent: "",
    });
  }

  public getElement(): HTMLElement {
    this.configureView();
    return this.productContainer.getElement();
  }

  public async configureView(): Promise<void> {
    this.productContainer.getElement().innerHTML = "";

    const productTitle = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const container = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_DESCRIPTION],
      textContent: "",
    });

    const backButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.GO_CATALOG,
      callback: (): void => {
        globalThis.location.hash = Routes.CATALOG;
      },
    });

    try {
      this.api.getProductById(
        this.id,
        (result: ClientResponse) => {
          const product = result.body;
          const name = product.name?.["en-US"] || "No name";
          const description =
            product.description?.["en-US"] || "No description";
          const images = product.masterVariant?.images || [];
          const prices = product.masterVariant?.prices || [];

          const nameEl = new ElementCreator({
            tag: "h3",
            className: [cssClasses.CARD_TITLE],
            textContent: name,
          });

          const descriptionEl = new ElementCreator({
            tag: "p",
            className: [cssClasses.CARD_DESCRIPTION],
            textContent: description,
          });

          const price = prices?.[0]?.value?.centAmount || 0;
          const discounted = prices?.[0]?.discounted?.value?.centAmount;

          const priceEl = new ElementCreator({
            tag: "div",
            className: [cssClasses.CARD_PRICE],
            textContent: "",
          });

          if (discounted !== undefined) {
            priceEl.getElement().innerHTML = `Price: $${(discounted / 100).toFixed(2)} <s>$${(price / 100).toFixed(2)}</s>`;
          } else {
            priceEl.getElement().innerHTML = `Price: $${(price / 100).toFixed(2)}`;
          }

          const basket = new ElementCreator({
                  tag: "button",
                  className: [cssClasses.BASKET],
                  textContent: Buttons.BASKET,
                  callback: (): void => {
                    console.log(`add to basket ${product.id}`);
                  },
                });

          const sliderWrapper = new ElementCreator({
            tag: "div",
            className: [cssClasses.SLIDER],
            textContent: "",
          });

          const sliderList = new ElementCreator({
            tag: "div",
            className: [cssClasses.SLIDER_LIST],
            textContent: "",
          });

          const prevBtn = new ElementCreator({
            tag: "button",
            className: [cssClasses.SLIDER_BTN, cssClasses.SLIDER_PREV],
            textContent: "◀",
          });

          const nextBtn = new ElementCreator({
            tag: "button",
            className: [cssClasses.SLIDER_BTN, cssClasses.SLIDER_NEXT],
            textContent: "▶",
          });

          const updateSliderPosition = (): void => {
            const sliderWidth = sliderWrapper.getElement().clientWidth;
            const offset = -this.currentIndex * sliderWidth;
            sliderList.getElement().style.transform = `translateX(${offset}px)`;

            if (this.currentIndex === 0) {
              prevBtn.getElement().setAttribute("disabled", "true");
            } else {
              prevBtn.getElement().removeAttribute("disabled");
            }

            if (this.currentIndex === images.length - 1) {
              nextBtn.getElement().setAttribute("disabled", "true");
            } else {
              nextBtn.getElement().removeAttribute("disabled");
            }
          };

          prevBtn.getElement().addEventListener("click", () => {
            if (this.currentIndex > 0) {
              this.currentIndex--;
              updateSliderPosition();
            }
          });

          nextBtn.getElement().addEventListener("click", () => {
            if (this.currentIndex < images.length - 1) {
              this.currentIndex++;
              updateSliderPosition();
            }
          });

          this.currentIndex = 0;

          images.forEach((image: { url: string }) => {
            const imgEl = new ElementCreator({
              tag: "img",
              className: [cssClasses.SLIDER_IMG],
              textContent: "",
            });
            imgEl.getElement().setAttribute("src", image.url);
            imgEl.getElement().setAttribute("alt", name);
            sliderList.addInnerElement(imgEl.getElement());
          });

          updateSliderPosition();

          if (images.length > 1) {
            sliderWrapper.addInnerElement(prevBtn.getElement());
            sliderWrapper.addInnerElement(sliderList.getElement());
            sliderWrapper.addInnerElement(nextBtn.getElement());
          } else if (images.length === 1) {
            sliderWrapper.addInnerElement(sliderList.getElement());
          }

          ////////////////////////////////////////////////////////////
          const handlerClickOnImage = (e: Event): void => {
            if (e.target && e.target instanceof HTMLElement) {
              if (e.target.tagName === "IMG") {
                const modal = modalWindow.createModalWindow(
                  "",
                  sliderWrapper.getElement(),
                  this.productContainer,
                  handlerClickOnImage,
                  updateSliderPosition,
                );
                this.productContainer.addInnerElement(modal);

                modalWindow.openModalWindow(modal, updateSliderPosition);

                sliderWrapper
                  .getElement()
                  .removeEventListener("click", handlerClickOnImage);
              }
            }
          };

          sliderWrapper
            .getElement()
            .addEventListener("click", handlerClickOnImage);
          /////////////////////////////////////////////////////////////

          container.addInnerElement(nameEl.getElement());
          container.addInnerElement(descriptionEl.getElement());
          container.addInnerElement(priceEl.getElement());
          container.addInnerElement(basket.getElement());
          productTitle.addInnerElement(backButton.getElement());
          this.productContainer.addInnerElement(productTitle.getElement());
          this.productContainer.addInnerElement(container.getElement());
          this.productContainer.addInnerElement(sliderWrapper.getElement());
        },
        (error: Error) => {
          console.error(error);
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
}
