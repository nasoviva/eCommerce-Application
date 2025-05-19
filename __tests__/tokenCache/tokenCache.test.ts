import VSATokenCache from "../../src/app/services/api-request-service/token-cache";

const elementVSATokenCache = new VSATokenCache();

test("check type of result VSATokenCache class create", () => {
  expect(typeof elementVSATokenCache).toBe("object");
});

test("check availability inputElement property in  emailInputElement", () => {
  expect("token" in elementVSATokenCache).toBeTruthy();
});
