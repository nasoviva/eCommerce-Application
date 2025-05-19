import FooterView from "../../src/app/layout/footer/footer";

const footerElement = new FooterView();
const footerHtmlElement = footerElement.getHtmlElement();

test("check type of result getHtmlElement of FooterView class", () => {
  expect(typeof footerElement).toBe("object");
});

test("check availability elementCreator property in footerElement", () => {
  expect("elementCreator" in footerElement).toBeTruthy();
});

test("check tagName of footerHtmlElement", () => {
  expect(footerHtmlElement.tagName === "FOOTER").toBeTruthy();
});

test("check className of footerHtmlElement", () => {
  expect(footerHtmlElement.className === "footer").toBeTruthy();
});
