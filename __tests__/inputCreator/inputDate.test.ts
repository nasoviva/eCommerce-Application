import InputCreator from "../../src/app/shared/input-creator";
import { cssClasses } from "../../src/app/global-types/constants";

const dateInputElement = new InputCreator({
  type: "date",
  className: [cssClasses.INPUT],
  placeholder: "Enter Date",
});

const dateInputElementHtml = dateInputElement.getElement();

test("check type of result InputCreator class create", () => {
  expect(typeof dateInputElement).toBe("object");
});

test("check availability inputElement property in dateInputElement", () => {
  expect("inputElement" in dateInputElement).toBeTruthy();
});

test("check tagName of dateInputElementHtml", () => {
  expect(dateInputElementHtml.tagName === "INPUT").toBeTruthy();
});

test("check className of dateInputElementHtml", () => {
  expect(dateInputElementHtml.className === "input").toBeTruthy();
});

test("check type of  dateInputElementHtml", () => {
  expect(dateInputElementHtml.type === "date").toBeTruthy();
});
