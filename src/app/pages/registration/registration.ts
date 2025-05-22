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
  private readonly shippingStreetInput: InputCreator;
  private readonly shippingStreetMessageBox: ElementCreator;
  private readonly shippingCityInput: InputCreator;
  private readonly shippingCityMessageBox: ElementCreator;
  private readonly shippingZipInput: InputCreator;
  private readonly shippingZipMessageBox: ElementCreator;
  private readonly shippingCountryInput: HTMLSelectElement;
  private readonly shippingCountryMessageBox: ElementCreator;
  private readonly billingStreetInput: InputCreator;
  private readonly billingStreetMessageBox: ElementCreator;
  private readonly billingCityInput: InputCreator;
  private readonly billingCityMessageBox: ElementCreator;
  private readonly billingZipInput: InputCreator;
  private readonly billingZipMessageBox: ElementCreator;
  private readonly billingCountryInput: HTMLSelectElement;
  private readonly billingCountryMessageBox: ElementCreator;
  private readonly fillFromShippingInput: InputCreator;
  private readonly shippingDefaultInput: InputCreator;
  private readonly billingDefaultInput: InputCreator;
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

    this.shippingStreetInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Street",
    });

    this.shippingCityInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter City",
    });

    this.shippingZipInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Zip Code",
    });

    this.shippingCountryInput = document.createElement("select");

    this.shippingCountryInput.classList.add(cssClasses.INPUT);

    const shippingOptions = [
      { value: "", text: "Select Country" },
      { value: "RU", text: "Russia" },
      { value: "US", text: "USA" },
    ];

    shippingOptions.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      this.shippingCountryInput.appendChild(option);
    });

    this.billingStreetInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Street",
    });

    this.billingCityInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter City",
    });

    this.billingZipInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Zip Code",
    });

    this.billingCountryInput = document.createElement("select");

    this.billingCountryInput.classList.add(cssClasses.INPUT);

    const billingOptions = [
      { value: "", text: "Select Country" },
      { value: "RU", text: "Russia" },
      { value: "US", text: "USA" },
    ];

    billingOptions.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      this.billingCountryInput.appendChild(option);
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
    this.shippingStreetMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.shippingCityMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.shippingZipMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.shippingCountryMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.billingStreetMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.billingCityMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.billingZipMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });
    this.billingCountryMessageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.messageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.billingDefaultInput = new InputCreator({
      type: "checkbox",
      className: [cssClasses.CHECKBOX_WRAPPER],
      placeholder: "",
    });

    this.shippingDefaultInput = new InputCreator({
      type: "checkbox",
      className: [cssClasses.CHECKBOX_WRAPPER],
      placeholder: "",
    });

    this.fillFromShippingInput = new InputCreator({
      type: "checkbox",
      className: [cssClasses.CHECKBOX_WRAPPER],
      placeholder: "",
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
      this.shippingStreetInput,
      this.shippingCityInput,
      this.shippingZipInput,
      this.billingStreetInput,
      this.billingCityInput,
      this.billingZipInput,
    ].forEach((input) => {
      input
        ?.getElement()
        .addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            void this.handleRegistration();
          }
        });
    });
    this.shippingCountryInput.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          void this.handleRegistration();
        }
      },
    );
    this.billingCountryInput.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          void this.handleRegistration();
        }
      },
    );

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
    const shippingAddressLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.TITLE],
      textContent: "Shipping Address:",
    });
    const shippingStreetLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Street:",
    });
    const shippingStreetContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    shippingStreetContainer.addInnerElement(shippingStreetLabel.getElement());
    shippingStreetContainer.addInnerElement(
      this.shippingStreetInput.getElement(),
    );

    const shippingCityLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "City:",
    });
    const shippingCityContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    shippingCityContainer.addInnerElement(shippingCityLabel.getElement());
    shippingCityContainer.addInnerElement(this.shippingCityInput.getElement());

    const shippingZipLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Zip:",
    });
    const shippingZipContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    shippingZipContainer.addInnerElement(shippingZipLabel.getElement());
    shippingZipContainer.addInnerElement(this.shippingZipInput.getElement());

    const shippingCountryLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Country:",
    });
    const shippingCountryContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    shippingCountryContainer.addInnerElement(shippingCountryLabel.getElement());
    shippingCountryContainer.addInnerElement(this.shippingCountryInput);

    const billingAddressLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.TITLE],
      textContent: "Billing Address:",
    });
    const billingStreetLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Street:",
    });
    const billingStreetContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    billingStreetContainer.addInnerElement(billingStreetLabel.getElement());
    billingStreetContainer.addInnerElement(
      this.billingStreetInput.getElement(),
    );

    const billingCityLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "City:",
    });
    const billingCityContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    billingCityContainer.addInnerElement(billingCityLabel.getElement());
    billingCityContainer.addInnerElement(this.billingCityInput.getElement());

    const billingZipLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Zip:",
    });
    const billingZipContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    billingZipContainer.addInnerElement(billingZipLabel.getElement());
    billingZipContainer.addInnerElement(this.billingZipInput.getElement());

    const billingCountryLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.LABEL],
      textContent: "Country:",
    });
    const billingCountryContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_CENTER],
      textContent: "",
    });
    billingCountryContainer.addInnerElement(billingCountryLabel.getElement());
    billingCountryContainer.addInnerElement(this.billingCountryInput);

    const formContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_FORM],
      textContent: "",
    });

    const shippingDefaultLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.CHECKBOX_GROUP],
      textContent: "",
    });

    const shippingDefaultText = new ElementCreator({
      tag: "span",
      className: [cssClasses.CHECKBOX_LABEL],
      textContent: "Set as default Shipping address",
    });

    shippingDefaultLabel
      .getElement()
      .append(
        shippingDefaultText.getElement(),
        this.shippingDefaultInput.getElement(),
      );

    const fillFromShippingLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.CHECKBOX_GROUP],
      textContent: "",
    });

    const fillFromShippingText = new ElementCreator({
      tag: "span",
      className: [cssClasses.CHECKBOX_LABEL],
      textContent: "Fill in data from Shipping to Billing Address",
    });

    this.fillFromShippingInput.getElement().addEventListener("change", () => {
      const isChecked = this.fillFromShippingInput.getElement().checked;
      if (isChecked) {
        this.billingStreetInput.getElement().value =
          this.shippingStreetInput.getElement().value;
        this.billingCityInput.getElement().value =
          this.shippingCityInput.getElement().value;
        this.billingZipInput.getElement().value =
          this.shippingZipInput.getElement().value;
        this.billingCountryInput.value = this.shippingCountryInput.value;
      }
    });

    fillFromShippingLabel
      .getElement()
      .append(
        fillFromShippingText.getElement(),
        this.fillFromShippingInput.getElement(),
      );

    const billingDefaultLabel = new ElementCreator({
      tag: "label",
      className: [cssClasses.CHECKBOX_GROUP],
      textContent: "",
    });

    const billingDefaultText = new ElementCreator({
      tag: "span",
      className: [cssClasses.CHECKBOX_LABEL],
      textContent: "Set as default Billing address",
    });

    billingDefaultLabel
      .getElement()
      .append(
        billingDefaultText.getElement(),
        this.billingDefaultInput.getElement(),
      );

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
    formContainer.addInnerElement(shippingAddressLabel.getElement());
    formContainer.addInnerElement(shippingStreetContainer.getElement());
    formContainer.addInnerElement(this.shippingStreetMessageBox.getElement());
    formContainer.addInnerElement(shippingCityContainer.getElement());
    formContainer.addInnerElement(this.shippingCityMessageBox.getElement());
    formContainer.addInnerElement(shippingZipContainer.getElement());
    formContainer.addInnerElement(this.shippingZipMessageBox.getElement());
    formContainer.addInnerElement(shippingCountryContainer.getElement());
    formContainer.addInnerElement(this.shippingCountryMessageBox.getElement());
    formContainer.addInnerElement(shippingDefaultLabel.getElement());
    formContainer.addInnerElement(fillFromShippingLabel.getElement());
    formContainer.addInnerElement(billingAddressLabel.getElement());
    formContainer.addInnerElement(billingStreetContainer.getElement());
    formContainer.addInnerElement(this.billingStreetMessageBox.getElement());
    formContainer.addInnerElement(billingCityContainer.getElement());
    formContainer.addInnerElement(this.billingCityMessageBox.getElement());
    formContainer.addInnerElement(billingZipContainer.getElement());
    formContainer.addInnerElement(this.billingZipMessageBox.getElement());
    formContainer.addInnerElement(billingCountryContainer.getElement());
    formContainer.addInnerElement(this.billingCountryMessageBox.getElement());
    formContainer.addInnerElement(billingDefaultLabel.getElement());

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

    this.shippingStreetInput.getElement().addEventListener("input", () => {
      const street = this.shippingStreetInput.getElement().value;
      const error = Validator.checkStreet(street);
      this.shippingStreetMessageBox.getElement().textContent = error || "";
    });

    this.shippingCityInput.getElement().addEventListener("input", () => {
      const city = this.shippingCityInput.getElement().value;
      const error = Validator.checkCity(city);
      this.shippingCityMessageBox.getElement().textContent = error || "";
    });

    this.shippingZipInput.getElement().addEventListener("input", () => {
      const zip = this.shippingZipInput.getElement().value;
      let error = "";
      const selectedCountry = this.shippingCountryInput.value;
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
      this.shippingZipMessageBox.getElement().textContent = error;
    });

    this.shippingCountryInput.addEventListener("change", () => {
      const country = this.shippingCountryInput.value;
      const error = Validator.checkCountry(country);
      this.shippingCountryMessageBox.getElement().textContent = error || "";
    });

    this.billingStreetInput.getElement().addEventListener("input", () => {
      const street = this.billingStreetInput.getElement().value;
      const error = Validator.checkStreet(street);
      this.billingStreetMessageBox.getElement().textContent = error || "";
    });

    this.billingCityInput.getElement().addEventListener("input", () => {
      const city = this.billingCityInput.getElement().value;
      const error = Validator.checkCity(city);
      this.billingCityMessageBox.getElement().textContent = error || "";
    });

    this.billingZipInput.getElement().addEventListener("input", () => {
      const zip = this.billingZipInput.getElement().value;
      let error = "";
      const selectedCountry = this.billingCountryInput.value;
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
      this.billingZipMessageBox.getElement().textContent = error;
    });

    this.billingCountryInput.addEventListener("change", () => {
      const country = this.billingCountryInput.value;
      const error = Validator.checkCountry(country);
      this.billingCountryMessageBox.getElement().textContent = error || "";
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
      this.shippingStreetInput,
      this.shippingCityInput,
      this.shippingZipInput,
      this.billingStreetInput,
      this.billingCityInput,
      this.billingZipInput,
    ].forEach((input) => {
      input
        ?.getElement()
        .addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter") {
            void this.handleRegistration();
          }
        });
    });
    this.shippingCountryInput.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          void this.handleRegistration();
        }
      },
    );
    this.billingCountryInput.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          void this.handleRegistration();
        }
      },
    );
  }

  private handleError(
    email: string,
    password: string,
    repeatPassword: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    shippingStreet: string,
    shippingCity: string,
    shippingZip: string,
    shippingCountry: string,
    billingStreet: string,
    billingCity: string,
    billingZip: string,
    billingCountry: string,
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
    const repeatPasswordError = password !== repeatPassword;
    if (repeatPasswordError) {
      this.repeatPasswordMessageBox.getElement().textContent =
        "Passwords do not match";
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
    const shippingStreetError = Validator.checkStreet(shippingStreet);
    if (shippingStreetError) {
      this.shippingStreetMessageBox.getElement().textContent =
        shippingStreetError;
      hasError = true;
    }
    const shippingCityError = Validator.checkCity(shippingCity);
    if (shippingCityError) {
      this.shippingCityMessageBox.getElement().textContent = shippingCityError;
      hasError = true;
    }
    const shippingCountryError = Validator.checkCountry(shippingCountry);
    if (shippingCountryError) {
      this.shippingCountryMessageBox.getElement().textContent =
        shippingCountryError;
      hasError = true;
    }
    let shippingZipError = "";
    if (shippingCountry === "Russia") {
      shippingZipError = Validator.checkIndexRussia(shippingZip);
    } else if (shippingCountry === "USA") {
      shippingZipError = Validator.checkIndexUSA(shippingZip);
    } else if (shippingCountry === "") {
      const errorRU = Validator.checkIndexRussia(shippingZip);
      const errorUS = Validator.checkIndexUSA(shippingZip);
      if (errorRU && errorUS) {
        shippingZipError = `${errorRU} / ${errorUS}`;
      }
    }
    if (shippingZipError) {
      this.shippingZipMessageBox.getElement().textContent = shippingZipError;
      hasError = true;
    }
    const billingStreetError = Validator.checkStreet(billingStreet);
    if (billingStreetError) {
      this.billingStreetMessageBox.getElement().textContent =
        billingStreetError;
      hasError = true;
    }
    const billingCityError = Validator.checkCity(billingCity);
    if (billingCityError) {
      this.billingCityMessageBox.getElement().textContent = billingCityError;
      hasError = true;
    }
    const billingCountryError = Validator.checkCountry(billingCountry);
    if (billingCountryError) {
      this.billingCountryMessageBox.getElement().textContent =
        billingCountryError;
      hasError = true;
    }
    let billingZipError = "";
    if (billingCountry === "Russia") {
      billingZipError = Validator.checkIndexRussia(billingZip);
    } else if (billingCountry === "USA") {
      billingZipError = Validator.checkIndexUSA(billingZip);
    } else if (billingCountry === "") {
      const errorRU = Validator.checkIndexRussia(billingZip);
      const errorUS = Validator.checkIndexUSA(billingZip);
      if (errorRU && errorUS) {
        billingZipError = `${errorRU} / ${errorUS}`;
      }
    }
    if (billingZipError) {
      this.billingZipMessageBox.getElement().textContent = billingZipError;
      hasError = true;
    }
    return hasError;
  }

  private async handleRegistration(): Promise<void> {
    const email = this.emailInput?.getElement().value;
    const password = this.passwordInput?.getElement().value;
    const repeatPassword = this.repeatPasswordInput?.getElement().value;
    const firstName = this.firstNameInput?.getElement().value;
    const lastName = this.lastNameInput?.getElement().value;
    const dateOfBirth = this.dateOfBirthInput?.getElement().value;
    const billingStreet = this.billingStreetInput?.getElement().value;
    const billingCity = this.billingCityInput?.getElement().value;
    const billingZip = this.billingZipInput?.getElement().value;
    const billingCountry = this.billingCountryInput?.value;
    const shippingStreet = this.shippingStreetInput?.getElement().value;
    const shippingCity = this.shippingCityInput?.getElement().value;
    const shippingZip = this.shippingZipInput?.getElement().value;
    const shippingCountry = this.shippingCountryInput?.value;
    const defaultShippingAddress = this.shippingDefaultInput.getElement()
      .checked
      ? 0
      : 0;
    const defaultBillingAddress = this.billingDefaultInput.getElement().checked
      ? 1
      : 0;
    this.clearErrorMessages();
    let hasError = this.handleError(
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
      dateOfBirth,
      shippingStreet,
      shippingCity,
      shippingZip,
      shippingCountry,
      billingStreet,
      billingCity,
      billingZip,
      billingCountry,
    );

    if (hasError) return;

    const userData = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: [
        {
          country: shippingCountry,
          postalCode: shippingZip,
          city: shippingCity,
          street: shippingStreet,
        },
        {
          country: billingCountry,
          postalCode: billingZip,
          city: billingCity,
          street: billingStreet,
        },
      ],
      defaultShippingAddress,
      defaultBillingAddress,
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
      this.shippingStreetInput &&
      this.shippingCityInput &&
      this.shippingZipInput &&
      this.shippingCountryInput &&
      this.billingStreetInput &&
      this.billingCityInput &&
      this.billingZipInput &&
      this.billingCountryInput &&
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
      this.shippingStreetInput.getElement().value = "";
      this.shippingCityInput.getElement().value = "";
      this.shippingZipInput.getElement().value = "";
      this.shippingCountryInput.value = "";
      this.billingStreetInput.getElement().value = "";
      this.billingCityInput.getElement().value = "";
      this.billingZipInput.getElement().value = "";
      this.billingCountryInput.value = "";
      this.messageBox.getElement().textContent = "";
      this.fillFromShippingInput.getElement().checked = false;
      this.shippingDefaultInput.getElement().checked = false;
      this.billingDefaultInput.getElement().checked = false;
      this.clearErrorMessages();
    }
  }
  private clearErrorMessages(): void {
    this.emailMessageBox.getElement().textContent = "";
    this.passwordMessageBox.getElement().textContent = "";
    this.firstNameMessageBox.getElement().textContent = "";
    this.lastNameMessageBox.getElement().textContent = "";
    this.dateOfBirthMessageBox.getElement().textContent = "";
    this.shippingStreetMessageBox.getElement().textContent = "";
    this.shippingCityMessageBox.getElement().textContent = "";
    this.shippingZipMessageBox.getElement().textContent = "";
    this.shippingCountryMessageBox.getElement().textContent = "";
    this.billingStreetMessageBox.getElement().textContent = "";
    this.billingCityMessageBox.getElement().textContent = "";
    this.billingZipMessageBox.getElement().textContent = "";
    this.billingCountryMessageBox.getElement().textContent = "";
  }
}
