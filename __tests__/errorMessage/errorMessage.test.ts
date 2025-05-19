import ErrorMsg from "../../src/app/services/error-msg/error-msg";

const elementErrorMsg = new ErrorMsg();

test("check type of result ErrorMsg class create", () => {
  expect(typeof elementErrorMsg).toBe("object");
});

test("check availability msg property in  emailInputElement", () => {
  expect("msg" in elementErrorMsg).toBeTruthy();
});
