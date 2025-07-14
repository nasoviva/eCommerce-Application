import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "1956-08-23": "",
  "2023-05-12": "The user is under 16 years of age!",
  "2018-11-16": "The user is under 16 years of age!",
  "20010-11-16": "The user is under 16 years of age!",
  "2009-10-12": "",
};

for (const key in attempts) {
  test(`check input birth date ${key}`, () => {
    expect(Validator.checkBirthDate(key)).toBe(attempts[key]);
  });
}
