import InputCreator from "../../src/app/shared/input-creator";
import { cssClasses } from "../../src/app/global-types/constants";

const emailInputElement = new InputCreator({
  type: "email",
  className: [cssClasses.INPUT],
  placeholder: "Enter Email",
});

const emailInputElementHtml = emailInputElement.getElement();

test("check type of result InputCreator class create", () => {
  expect(typeof emailInputElement).toBe("object");
});

test("check availability inputElement property in  emailInputElement", () => {
  expect("inputElement" in emailInputElement).toBeTruthy();
});

test("check tagName of emailInputElementHtml", () => {
  expect(emailInputElementHtml.tagName === "INPUT").toBeTruthy();
});

test("check className of emailInputElementHtml", () => {
  expect(emailInputElementHtml.className === "input").toBeTruthy();
});

test("check type of emailInputElementHtml", () => {
  expect(emailInputElementHtml.type === "email").toBeTruthy();
});
