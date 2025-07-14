import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "": "Street name must contain at least one character!",
  "  ": "Street name must contain at least one character!",
  "Baiker street 51": "",
  D81: "",
  K: "",
  Raduzhnaya: "",
  "5": "",
};

for (const key in attempts) {
  test(`check input street ${key}`, () => {
    expect(Validator.checkStreet(key)).toBe(attempts[key]);
  });
}
