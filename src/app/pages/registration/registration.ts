import { cssClasses, Buttons, Routes } from "../../global-types/constants";
import ApiRequestService from "../../services/api-request-service/api-request-service";
import StateManager from "../../services/state-manager/state-manager";
import ElementCreator from "../../shared/element-creator";
import InputCreator from "../../shared/input-creator";

export default class RegistrationView {
  private readonly registrationContainer: ElementCreator;
  private readonly emailInput: InputCreator;
  private readonly passwordInput: InputCreator;
  private readonly firstNameInput: InputCreator;
  private readonly lastNameInput: InputCreator;
  private readonly dateOfBirthInput: InputCreator;
  private readonly streetInput: InputCreator;
  private readonly cityInput: InputCreator;
  private readonly zipInput: InputCreator;
  private readonly countryInput: InputCreator;
  private readonly messageBox: HTMLElement;

  constructor() {
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
      className: [],
      placeholder: "Enter Email",
    });

    this.passwordInput = new InputCreator({
      type: "password",
      className: [],
      placeholder: "Enter Password",
    });

    this.firstNameInput = new InputCreator({
      type: "text",
      className: [],
      placeholder: "Enter First Name",
    });

    this.lastNameInput = new InputCreator({
      type: "text",
      className: [],
      placeholder: "Enter Last Name",
    });

    this.dateOfBirthInput = new InputCreator({
      type: "date",
      className: [],
      placeholder: "Enter Date of Birth",
    });

    this.streetInput = new InputCreator({
      type: "text",
      className: [],
      placeholder: "Enter Street",
    });

    this.cityInput = new InputCreator({
      type: "text",
      className: [],
      placeholder: "Enter City",
    });

    this.zipInput = new InputCreator({
      type: "text",
      className: [],
      placeholder: "Enter Zip Code",
    });

    this.countryInput = new InputCreator({
      type: "text",
      className: [],
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
        globalThis.location.hash = Routes.LOGIN;
      },
    });

    this.messageBox = document.createElement("div");

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
    this.registrationContainer.addInnerElement(this.messageBox);
  }

  public getElement(): HTMLElement {
    return this.registrationContainer.getElement();
  }

  private async handleRegistration(): Promise<void> {
    const email = this.emailInput.getElement().value.trim();
    const password = this.passwordInput.getElement().value.trim();
    const firstName = this.firstNameInput.getElement().value.trim();
    const lastName = this.lastNameInput.getElement().value.trim();
    const dateOfBirth = this.dateOfBirthInput.getElement().value.trim();
    const street = this.streetInput.getElement().value.trim();
    const city = this.cityInput.getElement().value.trim();
    const zip = this.zipInput.getElement().value.trim();
    const country = this.countryInput.getElement().value.trim();

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !street ||
      !city ||
      !zip ||
      !country
    ) {
      this.showMessage("Please fill in all fields.", true);
      return;
    }

    const userData = {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: [
        {
          streetName: street,
          city: city,
          postalCode: zip,
          country: country.toUpperCase(),
        },
      ],
      defaultShippingAddress: 0,
    };

    const apiService = new ApiRequestService(new StateManager());

    await new Promise<void>((resolve) => {
      apiService.registerUser(
        userData,
        () => {
          this.showMessage("Registration successful!", false);
          globalThis.location.hash = Routes.LOGIN;
          resolve();
        },
        (error: Error) => {
          this.showMessage("Registration failed. Try again.", true);
          console.error("Registration error:", error);
          resolve();
        },
      );
    });
  }

  private showMessage(message: string, isError: boolean): void {
    this.messageBox.textContent = message;
    this.messageBox.style.color = isError ? "red" : "green";
  }
}
