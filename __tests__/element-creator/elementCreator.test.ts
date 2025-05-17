import { cssClasses } from "../../src/app/global-types/constants";
import ElementCreator from "../../src/app/shared/element-creator";

const elementDiv = new ElementCreator({
  tag: "div",
  className: [cssClasses.CONTAINER_COLUMN],
  textContent: "text",
});

test("check type of result ElementCreator", () => {
  expect(typeof elementDiv).toBe("object");
});

test("check availability element property in elementDiv", () => {
  expect("element" in elementDiv).toBeTruthy();
});

test("check node of elementDiv", () => {
  expect(elementDiv["element"].nodeName === "DIV").toBeTruthy();
});

const elementButton = new ElementCreator({
  tag: "button",
  className: [cssClasses.CONTAINER_COLUMN],
  textContent: "button",
});

test("check type of result ElementCreator", () => {
  expect(typeof elementButton).toBe("object");
});

test("check availability element property in elementButton", () => {
  expect("element" in elementButton).toBeTruthy();
});

test("check node of elementButton", () => {
  expect(elementButton["element"].nodeName === "BUTTON").toBeTruthy();
});
