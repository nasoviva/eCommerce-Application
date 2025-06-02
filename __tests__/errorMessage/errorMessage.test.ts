import ToastMsg from "../../src/app/services/error-msg/toast-msg";

const elementErrorMsg = new ToastMsg();

test("check type of result ErrorMsg class create", () => {
  expect(typeof elementErrorMsg).toBe("object");
});

test("check availability msg property in  emailInputElement", () => {
  expect("msg" in elementErrorMsg).toBeTruthy();
});
