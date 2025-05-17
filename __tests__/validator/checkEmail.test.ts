import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "test@mail.ru": "",
  " test@mail.ru": "The address contains leading or trailing spaces.",
  "test@mail.ru ": "The address contains leading or trailing spaces.",
  "test@gmail.com": "",
  "test&gmail.com": "The email address is in an invalid format!",
  testmailaddress: "The email address is in an invalid format!",
  "test@gmail": "The email address is in an invalid format!",
};

for (const key in attempts) {
  test(`check input email ${key}`, () => {
    expect(Validator.checkEmail(key)).toBe(attempts[key]);
  });
}
