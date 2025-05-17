import Validator from "../../src/app/services/validator/validator";

type typeAttempts = {
  [key: string]: string;
};

const attempts: typeAttempts = {
  " test123FFtt!": "The password must not contain leading or trailing spaces!",
  "test123FFtt! ": "The password must not contain leading or trailing spaces!",
  "tet3Ft!": "The password must be at least 8 characters long!",
  "TEST123AAADDD!":
    "The password must contain at least one lowercase letter (a–z)!",
  "testffggDDFFtt!": "The password must contain at least one digit (0-9)!",
  test123FFttGG:
    "The password must contain at least one special character (e.g. !@#$%^&*)!",
  "Good123Password!!!": "",
};

for (const key in attempts) {
  test(`check input password ${key}`, () => {
    expect(Validator.checkPassword(key)).toBe(attempts[key]);
  });
}
