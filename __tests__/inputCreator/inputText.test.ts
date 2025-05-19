import InputCreator from "../../src/app/shared/input-creator";
import { cssClasses } from "../../src/app/global-types/constants";

const textInputElement = new InputCreator({
  type: "text",
  className: [cssClasses.INPUT],
  placeholder: "Enter text",
});

const textInputElementHtml = textInputElement.getElement();

test("check type of result InputCreator class create", () => {
  expect(typeof textInputElement).toBe("object");
});

test("check availability inputElement property in  textInputElement", () => {
  expect("inputElement" in textInputElement).toBeTruthy();
});

test("check tagName of textInputElementHtml", () => {
  expect(textInputElementHtml.tagName === "INPUT").toBeTruthy();
});

test("check className of  textInputElementHtml", () => {
  expect(textInputElementHtml.className === "input").toBeTruthy();
});

test("check type of  textInputElementHtml", () => {
  expect(textInputElementHtml.type === "text").toBeTruthy();
});
