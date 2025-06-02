import type ElementCreator from "../../shared/element-creator";
import "./modalWindow.css";
import "./modalWindowMedium.css";
import "./modalWindowIntermediate.css";
import "./modalWindowSmall.css";

// eslint-disable-next-line no-unused-vars
type handler = (e: MouseEvent) => void;

interface IParamFuncCreatElem {
  tag: string;
  text?: string;
  parent?: HTMLElement;
  classes?: string[];
}
function createElement(options: IParamFuncCreatElem): HTMLElement {
  const { tag = "div", text = "", parent, classes = [] } = options;
  const element = document.createElement(tag);
  element.textContent = text;

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  if (parent) {
    parent.append(element);
  }
  return element;
}

export default class modalWindow {
  //метод создаёт модальное окно c указанным текстом
  public static createModalWindow(
    textInWin?: string,
    elementInWin?: HTMLElement,
    parentElement?: ElementCreator,
    handlerFunction?: handler,
    updateSlider?: Function,
  ): HTMLElement {
    //создаём контейнер для модального окна
    const modalWrap = createElement({
      tag: "div",
      classes: ["modal-wrap"],
    });

    // создаём модальное окно
    const modalWindow = createElement({
      tag: "div",
      text: `${textInWin}`,
      parent: modalWrap,
      classes: ["modal-window"],
    });

    if (elementInWin && updateSlider) {
      elementInWin.style.overflowY = "auto";
      elementInWin.style.width = "95%";
      modalWindow.append(elementInWin);
    }

    //создаём кнопку закрытия модального окна
    const modalCloseButton = createElement({
      tag: "button",
      text: "Close",
      classes: ["modal-close-button"],
      parent: modalWindow,
    });

    // реализуем закрытие модального окна при нажатии на кнопку
    modalCloseButton.addEventListener("click", function () {
      modalWrap.classList.remove("open");
      if (parentElement && elementInWin && handlerFunction && updateSlider) {
        elementInWin.style.width = "40%";
        elementInWin.addEventListener("click", handlerFunction);
        parentElement.addInnerElement(elementInWin);
        updateSlider();
      }
    });
    return modalWrap;
  }
  // метод, который открывает модальное окно
  public static openModalWindow(
    modalWinElem: HTMLElement,
    updateSlider?: Function,
  ): void {
    if (updateSlider) {
      updateSlider();
    }
    modalWinElem.classList.add("open");
  }
}
