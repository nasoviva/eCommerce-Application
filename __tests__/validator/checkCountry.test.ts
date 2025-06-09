import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  RU: "",
  US: "",
  Argentina: "Please enter a valid country!",
  Brazil: "Please enter a valid country!",
  "185$-57$!": "Please enter a valid country!",
  "": "Please enter a valid country!",
  " ": "Please enter a valid country!",
};

for (const key in attempts) {
  test(`check input country ${key}`, () => {
    expect(Validator.checkCountry(key)).toBe(attempts[key]);
  });
}
