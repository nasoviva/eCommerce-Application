import { cssClasses, Buttons, Routes } from "../../global-types/constants";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import type StateManager from "../../services/state-manager/state-manager";
import Validator from "../../services/validator";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";

export default class RegistrationView {
  private readonly registrationContainer: ElementCreator | undefined;
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private readonly emailInput: InputCreator | undefined;
  private readonly passwordInput: InputCreator | undefined;
  private readonly firstNameInput: InputCreator | undefined;
  private readonly lastNameInput: InputCreator | undefined;
  private readonly dateOfBirthInput: InputCreator | undefined;
  private readonly streetInput: InputCreator | undefined;
  private readonly cityInput: InputCreator | undefined;
  private readonly zipInput: InputCreator | undefined;
  private readonly countryInput: InputCreator | undefined;
  private readonly messageBox: ElementCreator | undefined;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    if (this.stateManager.isLoggedIn) {
      globalThis.location.hash = Routes.HOME;
      return;
    }

    this.registrationContainer = new ElementCreator({
      tag: "div",
      className: [cssClasses.CONTAINER_COLUMN],
      textContent: "",
    });

    const title = new ElementCreator({
      tag: "h2",
      className: [cssClasses.TITLE],
      textContent: "Registration",
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

    this.countryInput = new InputCreator({
      type: "text",
      className: [cssClasses.INPUT],
      placeholder: "Enter Country",
    });

    const registrationButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.REGISTRATION,
      callback: (): void => {
        void this.handleRegistration();
      },
    });

    const goBackButton = new ElementCreator({
      tag: "button",
      className: [cssClasses.BUTTON],
      textContent: Buttons.GO_LOGIN,
      callback: (): void => {
        this.clearInputs();
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    this.messageBox = new ElementCreator({
      tag: "div",
      className: [cssClasses.ERROR],
      textContent: "",
    });

    this.registrationContainer.addInnerElement(title.getElement());
    this.registrationContainer.addInnerElement(this.emailInput.getElement());
    this.registrationContainer.addInnerElement(this.passwordInput.getElement());
    this.registrationContainer.addInnerElement(
      this.firstNameInput.getElement(),
    );
    this.registrationContainer.addInnerElement(this.lastNameInput.getElement());
    this.registrationContainer.addInnerElement(
      this.dateOfBirthInput.getElement(),
    );
    this.registrationContainer.addInnerElement(this.streetInput.getElement());
    this.registrationContainer.addInnerElement(this.cityInput.getElement());
    this.registrationContainer.addInnerElement(this.zipInput.getElement());
    this.registrationContainer.addInnerElement(this.countryInput.getElement());
    this.registrationContainer.addInnerElement(registrationButton.getElement());
    this.registrationContainer.addInnerElement(goBackButton.getElement());
    this.registrationContainer.addInnerElement(this.messageBox.getElement());

    [
      this.emailInput,
      this.passwordInput,
      this.firstNameInput,
      this.lastNameInput,
      this.dateOfBirthInput,
      this.streetInput,
      this.cityInput,
      this.zipInput,
      this.countryInput,
    ].forEach((input) => {
      input?.getElement().addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          void this.handleRegistration();
        }
      });
    });
  }

  public getElement(): HTMLElement | undefined {
    if (this.registrationContainer) {
      return this.registrationContainer.getElement();
    }
  }

  private async handleRegistration(): Promise<void> {
    const errors: string[] = [];

    const email = this.emailInput?.getElement().value.trim() ?? "";
    const password = this.passwordInput?.getElement().value.trim() ?? "";
    const firstName = this.firstNameInput?.getElement().value.trim() ?? "";
    const lastName = this.lastNameInput?.getElement().value.trim() ?? "";
    const dateOfBirth = this.dateOfBirthInput?.getElement().value ?? "";
    const street = this.streetInput?.getElement().value.trim() ?? "";
    const city = this.cityInput?.getElement().value.trim() ?? "";
    const zip = this.zipInput?.getElement().value.trim() ?? "";
    const country = this.countryInput?.getElement().value.trim() ?? "";

    const emailError = Validator.checkEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = Validator.checkPassword(password);
    if (passwordError) errors.push(passwordError);

    const firstNameError = Validator.checkNameOrLastName(firstName);
    if (firstNameError) errors.push(`First Name: ${firstNameError}`);

    const lastNameError = Validator.checkNameOrLastName(lastName);
    if (lastNameError) errors.push(`Last Name: ${lastNameError}`);

    const birthDateError = Validator.checkBirthDate(dateOfBirth);
    if (birthDateError) errors.push(birthDateError);

    const streetError = Validator.checkStreet(street);
    if (streetError) errors.push(streetError);

    const cityError = Validator.checkCity(city);
    if (cityError) errors.push(cityError);

    const countryError = Validator.checkCountry(country);
    if (countryError) errors.push(countryError);

    const zipError =
      country === "Russia"
        ? Validator.checkIndexRussia(zip)
        : country === "USA"
          ? Validator.checkIndexUSA(zip)
          : "";

    if (zipError) errors.push(zipError);

    if (errors.length > 0) {
      this.showMessage(errors.join("\n"), true);
      return;
    }

    const userData = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      street,
      city,
      zip,
      country,
    };

    this.apiRequestService.registerUser(
      userData,
      () => {
        this.showMessage("Registration successful!", false);
        this.clearInputs();
        globalThis.location.hash = Routes.LOGIN;
      },
      (error: Error) => {
        const message = error instanceof Error ? error.message : String(error);
        this.showMessage(message, true);
      },
    );
  }

  private showMessage(message: string, isError: boolean): void {
    if (this.messageBox) {
      this.messageBox.getElement().textContent = message;
      this.messageBox.getElement().style.color = isError ? "#e7291f" : "#004177";
    }
  }

  private clearInputs(): void {
    if (
      this.emailInput &&
      this.passwordInput &&
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
      this.firstNameInput.getElement().value = "";
      this.lastNameInput.getElement().value = "";
      this.dateOfBirthInput.getElement().value = "";
      this.streetInput.getElement().value = "";
      this.cityInput.getElement().value = "";
      this.zipInput.getElement().value = "";
      this.countryInput.getElement().value = "";
      this.messageBox.getElement().textContent = "";
    }
  }
}
