import VSATokenCache from "../../src/app/services/api-request-service/token-cache";

const elementVSATokenCache = new VSATokenCache();

test("check type of result VSATokenCache class create", () => {
  expect(typeof elementVSATokenCache).toBe("object");
});

test("check token property in  elementVSATokenCache", () => {
  expect("token" in elementVSATokenCache).toBeTruthy();
});

test("check availability expirationTime property in tokenCache", () => {
  expect("expirationTime" in elementVSATokenCache).toBeTruthy();
});
