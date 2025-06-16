import modalWindow from "../../src/app/services/modal-window/modalWindow";

const modal = modalWindow.createModalWindow("Test");

test("check type of element modal-window", () => {
  expect(typeof modal).toBe("object");
});

test("check tag of element modal-window", () => {
  expect(modal.tagName).toBe("DIV");
});

test("check tag of element modal-window", () => {
  expect(modal.className).toBe("modal-wrap");
});

modal.remove();
