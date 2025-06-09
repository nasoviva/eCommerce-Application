import View from "../../src/app/shared/view";
import ElementParameters from "../../src/app/shared/element-parameters";
const parameters = new ElementParameters("div", ["test"], "test", () => {});
const viewObject = new View(parameters);
const viewElement = viewObject.getHtmlElement();

test("check type viewObject of View class", () => {
  expect(typeof viewObject).toBe("object");
});

test("check availability elementCreator property in View object", () => {
  expect("elementCreator" in viewObject).toBeTruthy();
});

test("check tagName of viewElement", () => {
  expect(viewElement.tagName === "DIV").toBeTruthy();
});

test("check className of viewElement", () => {
  expect(viewElement.className === "test").toBeTruthy();
});
