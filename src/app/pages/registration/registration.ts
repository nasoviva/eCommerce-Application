import {
  cssClasses,
  Buttons,
  Routes,
  Titles,
} from "../../global-types/constants";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import Validator from "../../services/validator/validator";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";

export default class RegistrationView {
  private readonly registrationContainer: ElementCreator;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly emailInput: InputCreator;
  private readonly passwordInput: InputCreator;
  private readonly repeatPasswordInput: InputCreator;
  private readonly emailMessageBox: ElementCreator;
  private readonly passwordMessageBox: ElementCreator;
  private readonly repeatPasswordMessageBox: ElementCreator;
  private readonly eyeIcon1: HTMLImageElement;
  private readonly eyeIcon2: HTMLImageElement;
  private readonly firstNameInput: InputCreator;
  private readonly firstNameMessageBox: ElementCreator;
  private readonly lastNameInput: InputCreator;
  private readonly lastNameMessageBox: ElementCreator;
  private readonly dateOfBirthInput: InputCreator;
  private readonly dateOfBirthMessageBox: ElementCreator;
  private readonly streetInput: InputCreator;
  private readonly streetMessageBox: ElementCreator;
  private readonly cityInput: InputCreator;
  private readonly cityMessageBox: ElementCreator;
  private readonly zipInput: InputCreator;
  private readonly zipMessageBox: ElementCreator;
  private readonly countryInput: HTMLSelectElement;
  private readonly countryMessageBox: ElementCreator;
  private readonly messageBox: ElementCreator;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.registrationContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    this.emailInput = new InputCreator({
      type: "email",
      className: [cssClasses.INPUT],
      placeholder: "Enter Email",
    });

    this.passwordInput = new InputCreator({
      type: "password",
      className: [cssClasses.INPUT],
      placeholder: "Enter Password",
    });

    this.repeatPasswordInput = new InputCreator({
      type: "password",
      className: [cssClasses.INPUT],
      placeholder: "Repeat Password",
    });

    this.firstNameInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter First Name",
    });

    this.lastNameInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Last Name",
    });

    this.dateOfBirthInput = new InputCreator({
      type: "date",
      className: [cssClasses.INPUT],
      placeholder: "Enter Date of Birth",
    });

    this.streetInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Street",
    });

    this.cityInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter City",
    });

    this.zipInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Zip Code",
    });

    this.countryInput = document.createElement("select");

    this.countryInput.classList.add(cssClasses.INPUT);

    const options = [
      { value: "", text: "Select Country" },
      { value: "RU", text: "Russia" },
      { value: "US", text: "USA" },
    ];

    options.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      this.countryInput.appendChild(option);
    });

    this.emailMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.passwordMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.repeatPasswordMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.firstNameMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.lastNameMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.dateOfBirthMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.streetMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.cityMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.zipMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.countryMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.messageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.eyeIcon1 = this.createEyeIcon1();
    this.eyeIcon2 = this.createEyeIcon2();

    [
      this.emailInput,
      this.passwordInput,
      this.repeatPasswordInput,
      this.firstNameInput,
      this.lastNameInput,
      this.dateOfBirthInput,
      this.streetInput,
      this.cityInput,
      this.zipInput,
    ].forEach((input) => {
      input
        ?.getElement()
        .addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            void this.handleRegistration();
          }
        });
    });
    this.countryInput.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        void this.handleRegistration();
      }
    });

    if (this.stateManager.isLoggedIn) {
      globalThis.location.hash = Routes.HOME;
      return;
    }

    this.buildRegistrationForm();
    this.attachInputValidationHandlers();
    this.attachKeyboardHandlers();
  }

  public getElement(): HTMLElement {
    this.clearInputs();
    return this.registrationContainer.getElement();
  }

  private buildRegistrationForm(): void {
    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: Titles.REGISTRATION,
    });

    const emailLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Email:",
    });
    const emailContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    emailContainer.addInnerElement(emailLabel.getElement());
    emailContainer.addInnerElement(this.emailInput.getElement());

    const passwordLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Password:",
    });
    const passwordInputWrapper = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_INPUTS],
      textContent: "",
    });
    passwordInputWrapper.addInnerElement(this.passwordInput.getElement());
    passwordInputWrapper.addInnerElement(this.eyeIcon1);
    const passwordContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    passwordContainer.addInnerElement(passwordLabel.getElement());
    passwordContainer.addInnerElement(passwordInputWrapper.getElement());
    const repeatPasswordLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Repeat Password:",
    });
    const repeatPasswordInputWrapper = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_INPUTS],
      textContent: "",
    });
    repeatPasswordInputWrapper.addInnerElement(
      this.repeatPasswordInput.getElement(),
    );
    repeatPasswordInputWrapper.addInnerElement(this.eyeIcon2);
    const repeatPasswordContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    repeatPasswordContainer.addInnerElement(repeatPasswordLabel.getElement());
    repeatPasswordContainer.addInnerElement(
      repeatPasswordInputWrapper.getElement(),
    );

    const firstNameLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "First Name:",
    });
    const firstNameContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    firstNameContainer.addInnerElement(firstNameLabel.getElement());
    firstNameContainer.addInnerElement(this.firstNameInput.getElement());

    const lastNameLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Last Name:",
    });
    const lastNameContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    lastNameContainer.addInnerElement(lastNameLabel.getElement());
    lastNameContainer.addInnerElement(this.lastNameInput.getElement());

    const dateOfBirthLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Date of Birth:",
    });
    const dateOfBirthContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    dateOfBirthContainer.addInnerElement(dateOfBirthLabel.getElement());
    dateOfBirthContainer.addInnerElement(this.dateOfBirthInput.getElement());

    const streetLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Street:",
    });
    const streetContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    streetContainer.addInnerElement(streetLabel.getElement());
    streetContainer.addInnerElement(this.streetInput.getElement());

    const cityLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "City:",
    });
    const cityContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    cityContainer.addInnerElement(cityLabel.getElement());
    cityContainer.addInnerElement(this.cityInput.getElement());

    const zipLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Zip:",
    });
    const zipContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    zipContainer.addInnerElement(zipLabel.getElement());
    zipContainer.addInnerElement(this.zipInput.getElement());

    const countryLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Country:",
    });
    const countryContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    countryContainer.addInnerElement(countryLabel.getElement());
    countryContainer.addInnerElement(this.countryInput);

    const formContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_FORM],
      textContent: "",
    });

    formContainer.addInnerElement(emailContainer.getElement());
    formContainer.addInnerElement(this.emailMessageBox.getElement());
    formContainer.addInnerElement(passwordContainer.getElement());
    formContainer.addInnerElement(this.passwordMessageBox.getElement());
    formContainer.addInnerElement(repeatPasswordContainer.getElement());
    formContainer.addInnerElement(this.repeatPasswordMessageBox.getElement());
    formContainer.addInnerElement(firstNameContainer.getElement());
    formContainer.addInnerElement(this.firstNameMessageBox.getElement());
    formContainer.addInnerElement(lastNameContainer.getElement());
    formContainer.addInnerElement(this.lastNameMessageBox.getElement());
    formContainer.addInnerElement(dateOfBirthContainer.getElement());
    formContainer.addInnerElement(this.dateOfBirthMessageBox.getElement());
    formContainer.addInnerElement(streetContainer.getElement());
    formContainer.addInnerElement(this.streetMessageBox.getElement());
    formContainer.addInnerElement(cityContainer.getElement());
    formContainer.addInnerElement(this.cityMessageBox.getElement());
    formContainer.addInnerElement(zipContainer.getElement());
    formContainer.addInnerElement(this.zipMessageBox.getElement());
    formContainer.addInnerElement(countryContainer.getElement());
    formContainer.addInnerElement(this.countryMessageBox.getElement());

    const registerButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => void this.handleRegistration(),
    });

    const loginButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.LOGIN,
      callback: (): void => {
        this.clearInputs();
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    this.registrationContainer.addInnerElement(title.getElement());
    this.registrationContainer.addInnerElement(formContainer);
    this.registrationContainer.addInnerElement(registerButton.getElement());
    this.registrationContainer.addInnerElement(loginButton.getElement());
    this.registrationContainer.addInnerElement(this.messageBox.getElement());
  }

  private attachInputValidationHandlers(): void {
    this.emailInput.getElement().addEventListener("input", () => {
      const email = this.emailInput.getElement().value;
      const error = Validator.checkEmail(email);
      this.emailMessageBox.getElement().textContent = error || "";
    });

    this.passwordInput.getElement().addEventListener("input", () => {
      const password = this.passwordInput.getElement().value;
      const error = Validator.checkPassword(password);
      this.passwordMessageBox.getElement().textContent = error || "";
    });

    this.repeatPasswordInput.getElement().addEventListener("input", () => {
      const repeatPassword = this.repeatPasswordInput.getElement().value;
      const error =
        this.passwordInput.getElement().value !== repeatPassword
          ? "Passwords do not match"
          : "";
      this.repeatPasswordMessageBox.getElement().textContent = error || "";
    });

    this.firstNameInput.getElement().addEventListener("input", () => {
      const firstName = this.firstNameInput.getElement().value;
      const error = Validator.checkNameOrLastName(firstName);
      this.firstNameMessageBox.getElement().textContent = error || "";
    });

    this.lastNameInput.getElement().addEventListener("input", () => {
      const lastName = this.lastNameInput.getElement().value;
      const error = Validator.checkNameOrLastName(lastName);
      this.lastNameMessageBox.getElement().textContent = error || "";
    });

    this.dateOfBirthInput.getElement().addEventListener("input", () => {
      const dateOfBirth = this.dateOfBirthInput.getElement().value;
      const error = Validator.checkBirthDate(dateOfBirth);
      this.dateOfBirthMessageBox.getElement().textContent = error || "";
    });

    this.streetInput.getElement().addEventListener("input", () => {
      const street = this.streetInput.getElement().value;
      const error = Validator.checkStreet(street);
      this.streetMessageBox.getElement().textContent = error || "";
    });

    this.cityInput.getElement().addEventListener("input", () => {
      const city = this.cityInput.getElement().value;
      const error = Validator.checkCity(city);
      this.cityMessageBox.getElement().textContent = error || "";
    });

    this.zipInput.getElement().addEventListener("input", () => {
      const zip = this.zipInput.getElement().value;
      let error = "";
      const selectedCountry = this.countryInput.value;
      if (selectedCountry === "RU") {
        error = Validator.checkIndexRussia(zip);
      } else if (selectedCountry === "US") {
        error = Validator.checkIndexUSA(zip);
      } else if (selectedCountry === "") {
        const errorRU = Validator.checkIndexRussia(zip);
        const errorUS = Validator.checkIndexUSA(zip);
        if (errorRU && errorUS) {
          error = `${errorRU} / ${errorUS}`;
        }
      }
      this.zipMessageBox.getElement().textContent = error;
    });

    this.countryInput.addEventListener("change", () => {
      const country = this.countryInput.value;
      const error = Validator.checkCountry(country);
      this.countryMessageBox.getElement().textContent = error || "";
    });
  }

  private attachKeyboardHandlers(): void {
    [
      this.emailInput,
      this.passwordInput,
      this.repeatPasswordInput,
      this.firstNameInput,
      this.lastNameInput,
      this.dateOfBirthInput,
      this.streetInput,
      this.cityInput,
      this.zipInput,
    ].forEach((input) => {
      input
        ?.getElement()
        .addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            void this.handleRegistration();
          }
        });
    });
    this.countryInput.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        void this.handleRegistration();
      }
    });
  }

  private handleError(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    street: string,
    city: string,
    zip: string,
    country: string,
  ): Boolean {
    let hasError = false;
    const emailError = Validator.checkEmail(email);
    if (emailError) {
      this.emailMessageBox.getElement().textContent = emailError;
      hasError = true;
    }
    const passwordError = Validator.checkPassword(password);
    if (passwordError) {
      this.passwordMessageBox.getElement().textContent = passwordError;
      hasError = true;
    }
    const firstNameError = Validator.checkNameOrLastName(firstName);
    if (passwordError) {
      this.firstNameMessageBox.getElement().textContent = firstNameError;
      hasError = true;
    }
    const lastNameError = Validator.checkNameOrLastName(lastName);
    if (lastNameError) {
      this.lastNameMessageBox.getElement().textContent = lastNameError;
      hasError = true;
    }
    const birthDateError = Validator.checkBirthDate(dateOfBirth);
    if (birthDateError) {
      this.dateOfBirthMessageBox.getElement().textContent = birthDateError;
      hasError = true;
    }
    const streetError = Validator.checkStreet(street);
    if (streetError) {
      this.streetMessageBox.getElement().textContent = streetError;
      hasError = true;
    }
    const cityError = Validator.checkCity(city);
    if (cityError) {
      this.cityMessageBox.getElement().textContent = cityError;
      hasError = true;
    }
    const countryError = Validator.checkCountry(country);
    if (countryError) {
      this.countryMessageBox.getElement().textContent = countryError;
      hasError = true;
    }
    let zipError = "";
    if (country === "Russia") {
      zipError = Validator.checkIndexRussia(zip);
    } else if (country === "USA") {
      zipError = Validator.checkIndexUSA(zip);
    } else if (country === "") {
      const errorRU = Validator.checkIndexRussia(zip);
      const errorUS = Validator.checkIndexUSA(zip);
      if (errorRU && errorUS) {
        zipError = `${errorRU} / ${errorUS}`;
      }
    }
    if (zipError) {
      this.zipMessageBox.getElement().textContent = zipError;
      hasError = true;
    }
    return hasError;
  }

  private async handleRegistration(): Promise<void> {
    const email = this.emailInput?.getElement().value;
    const password = this.passwordInput?.getElement().value;
    const firstName = this.firstNameInput?.getElement().value;
    const lastName = this.lastNameInput?.getElement().value;
    const dateOfBirth = this.dateOfBirthInput?.getElement().value;
    const street = this.streetInput?.getElement().value;
    const city = this.cityInput?.getElement().value;
    const zip = this.zipInput?.getElement().value;
    const country = this.countryInput?.value;
    this.clearErrorMessages();
    let hasError = this.handleError(
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      street,
      city,
      zip,
      country,
    );

    if (hasError) return;

    const userData = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: [{ country: country, postalCode: zip, city: city }],
      defaultShippingAddress: 0,
      defaultBillingAddress: 0,
    };

    this.apiRequestService.registerUser(
      userData,
      () => {
        this.displayMessage("Registration successful!", false);
        this.stateManager.login = email;
        this.stateManager.setState(true);
        this.clearInputs();
        globalThis.location.hash = Routes.HOME;
      },
      (error: Error) => {
        const message = error instanceof Error ? error.message : String(error);
        this.displayMessage(message, true);
      },
    );
  }

  private createEyeIcon1(): HTMLImageElement {
    const icon = document.createElement("img");
    icon.src = "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
    icon.alt = "eye icon";
    icon.classList.add(cssClasses.EYE);
    icon.style.cursor = "pointer";
    icon.addEventListener("click", this.togglePasswordVisibility.bind(this));
    return icon;
  }

  private createEyeIcon2(): HTMLImageElement {
    const icon = document.createElement("img");
    icon.src = "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
    icon.alt = "eye icon";
    icon.classList.add(cssClasses.EYE);
    icon.style.cursor = "pointer";
    icon.addEventListener(
      "click",
      this.toggleRepeatPasswordVisibility.bind(this),
    );
    return icon;
  }

  private togglePasswordVisibility(): void {
    const inputEl = this.passwordInput.getElement();
    const isPasswordVisible = inputEl.type === "text";
    inputEl.type = isPasswordVisible ? "password" : "text";
    this.eyeIcon1.src = !isPasswordVisible
      ? "https://img.icons8.com/?size=100&id=e6GkJcP46Dip&format=png&color=000000"
      : "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
  }

  private toggleRepeatPasswordVisibility(): void {
    const inputEl = this.repeatPasswordInput.getElement();
    const isPasswordVisible = inputEl.type === "text";
    inputEl.type = isPasswordVisible ? "password" : "text";
    this.eyeIcon2.src = !isPasswordVisible
      ? "https://img.icons8.com/?size=100&id=e6GkJcP46Dip&format=png&color=000000"
      : "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
  }
  private displayMessage(message: string, isError: boolean): void {
    if (this.messageBox) {
      this.messageBox.getElement().textContent = message;
      this.messageBox.getElement().style.color = isError
        ? "#e7291f"
        : "#004177";
    }
  }

  private clearInputs(): void {
    if (
      this.emailInput &&
      this.passwordInput &&
      this.repeatPasswordInput &&
      this.firstNameInput &&
      this.lastNameInput &&
      this.dateOfBirthInput &&
      this.streetInput &&
      this.cityInput &&
      this.zipInput &&
      this.countryInput &&
      this.messageBox
    ) {
      this.emailInput.getElement().value = "";
      this.passwordInput.getElement().value = "";
      this.passwordInput.getElement().type = "password";
      this.eyeIcon1.src =
        "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
      this.repeatPasswordInput.getElement().value = "";
      this.repeatPasswordInput.getElement().type = "password";
      this.eyeIcon2.src =
        "https://img.icons8.com/ios-filled/24/0074be/closed-eye.png";
      this.firstNameInput.getElement().value = "";
      this.lastNameInput.getElement().value = "";
      this.dateOfBirthInput.getElement().value = "";
      this.streetInput.getElement().value = "";
      this.cityInput.getElement().value = "";
      this.zipInput.getElement().value = "";
      this.countryInput.value = "";
      this.messageBox.getElement().textContent = "";
      this.clearErrorMessages();
    }
  }
  private clearErrorMessages(): void {
    this.emailMessageBox.getElement().textContent = "";
    this.passwordMessageBox.getElement().textContent = "";
    this.firstNameMessageBox.getElement().textContent = "";
    this.lastNameMessageBox.getElement().textContent = "";
    this.dateOfBirthMessageBox.getElement().textContent = "";
    this.streetMessageBox.getElement().textContent = "";
    this.cityMessageBox.getElement().textContent = "";
    this.zipMessageBox.getElement().textContent = "";
    this.countryMessageBox.getElement().textContent = "";
  }
}
