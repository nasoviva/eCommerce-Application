import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "": "Username must contain at least one character!",
  " ": "Username must contain at least one character!",
  "Kama123!! ": "The username must not contain numbers or special characters!",
  "1234567": "The username must not contain numbers or special characters!",
  "$$$%%%###@@@":
    "The username must not contain numbers or special characters!",
  "test@testoiv":
    "The username must not contain numbers or special characters!",
  David: "",
  Kate: "",
  Kupriyanov: "",
  Frolova: "",
  "Bob!": "The username must not contain numbers or special characters!",
};

for (const key in attempts) {
  test(`check input name or last name ${key}`, () => {
    expect(Validator.checkNameOrLastName(key)).toBe(attempts[key]);
  });
}
