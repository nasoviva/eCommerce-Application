import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  "15353-6752": "",
  rfd354: "The postal code does not match the format for USA!",
  "15326": "",
  "1538-54783": "The postal code does not match the format for USA!",
  "1585$-57$!": "The postal code does not match the format for USA!",
  "": "The postal code does not match the format for USA!",
  "17259-9586": "",
  "17259-958": "The postal code does not match the format for USA!",
};

for (const key in attempts) {
  test(`check input post index of USA ${key}`, () => {
    expect(Validator.checkIndexUSA(key)).toBe(attempts[key]);
  });
}
