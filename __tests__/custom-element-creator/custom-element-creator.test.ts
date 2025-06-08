import CustomElementCreator from "../../src/app/shared/custom-element-creator";
import ElementParameters from "../../src/app/shared/element-parameters";

const parameters = new ElementParameters("div", ["test"], "test", () => {});
const creator = new CustomElementCreator(parameters);

test("check type of creator of CustomElementCreator class", () => {
  expect(typeof creator).toBe("object");
});

test("check availability element property in CustomElementCreator object", () => {
  expect("element" in creator).toBeTruthy();
});

test("check tagName of element property in CustomElementCreator object", () => {
  expect(creator.element.tagName === "DIV").toBeTruthy();
});

test("check className of element property in CustomElementCreator object", () => {
  expect(creator.element.className === "test").toBeTruthy();
});
