import InputCreator from "../../src/app/shared/input-creator";
import { cssClasses } from "../../src/app/global-types/constants";

const passwordInput = new InputCreator({
  type: "password",
  className: [cssClasses.INPUT],
  placeholder: "Enter Password",
});

const passwordInputElementHtml = passwordInput.getElement();

test("check type of result InputCreator class create", () => {
  expect(typeof passwordInput).toBe("object");
});

test("check availability inputElement property in passwordInput", () => {
  expect("inputElement" in passwordInput).toBeTruthy();
});

test("check tagName of passwordInputElementHtml", () => {
  expect(passwordInputElementHtml.tagName === "INPUT").toBeTruthy();
});

test("check className of passwordInputElementHtml", () => {
  expect(passwordInputElementHtml.className === "input").toBeTruthy();
});

test("check type of passwordInputElementHtml", () => {
  expect(passwordInputElementHtml.type === "password").toBeTruthy();
});
