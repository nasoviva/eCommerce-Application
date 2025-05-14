import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "": "City name must contain at least one character!",
  " ": "City name must contain at least one character!",
  Dallas28: "The city name must not contain numbers or special characters!",
  "New York!": "The city name must not contain numbers or special characters!",
  Butovo$$$: "The city name must not contain numbers or special characters!",
  London: "",
  Yaroslavl: "",
};

for (const key in attempts) {
  test(`check input city name ${key}`, () => {
    expect(Validator.checkCity(key)).toBe(attempts[key]);
  });
}
