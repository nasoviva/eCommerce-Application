import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "153532": "",
  rfd354: "The postal code does not match the format for Russia!",
  "15326": "The postal code does not match the format for Russia!",
  "153-543": "The postal code does not match the format for Russia!",
  "158$$!": "The postal code does not match the format for Russia!",
  "": "The postal code does not match the format for Russia!",
  "172596": "",
};

for (const key in attempts) {
  test(`check input post index of Russia ${key}`, () => {
    expect(Validator.checkIndexRussia(key)).toBe(attempts[key]);
  });
}
