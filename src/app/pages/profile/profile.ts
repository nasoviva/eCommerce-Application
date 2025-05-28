import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import css from "./profile.module.css";
import InputCreator from "../../shared/input-creator";
import type { ClientResponse } from "@commercetools/ts-client";
import type { AddressData } from "../../services/api-request-service/data-parser";
import DataParser from "../../services/api-request-service/data-parser";
import type {
  Customer,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";
import { CHANGE_ACTION_LIST, ELEM_PARAM } from "./constants";

export default class ProfileView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private profileContainer = new ElementCreator(ELEM_PARAM.mainContainer);
  private emailInput = new InputCreator(ELEM_PARAM.emailInput);
  private nameInput = new InputCreator(ELEM_PARAM.nameInput);
  private lastNameInput = new InputCreator(ELEM_PARAM.lastNameInput);
  private dateOfBirthInput = new InputCreator(ELEM_PARAM.dateOfBirthInput);
  private addressArea = new ElementCreator(ELEM_PARAM.addressArea);
  private version: number = 0;

  constructor(
    stateManager: StateManager,
    apiRequestService: ApiRequestService,
  ) {
    this.stateManager = stateManager;
    this.apiRequestService = apiRequestService;

    this.configureView();
  }

  public getElement(): HTMLElement {
    this.updateProfileInfo();
    return this.profileContainer.getElement();
  }

  public updateProfileInfo(): void {
    this.apiRequestService.getUserInfo((result: ClientResponse<Customer>) => {
      const data = DataParser.parseUserData(result);
      this.version = data.version;
      this.emailInput.getElement().value = data.email;
      this.nameInput.getElement().value = data.name;
      this.lastNameInput.getElement().value = data.lastName;
      this.dateOfBirthInput.getElement().value = data.dateOfBirth;
      this.addressArea.getElement().replaceChildren();
      for (const item of data.addresses) {
        this.addressArea.addInnerElement(this.buildAddressBlock(item));
      }
    });
  }

  private configureView(): void {
    /* this.profileContainer.getElement().innerHTML = ""; */
    const title = new ElementCreator(ELEM_PARAM.title);
    this.profileContainer.addInnerElement(
      title,
      this.formBlock(
        new ElementCreator(ELEM_PARAM.lastNameLabel),
        this.emailInput,
      ),
      this.formBlock(new ElementCreator(ELEM_PARAM.nameLabel), this.nameInput),
      this.formBlock(
        new ElementCreator(ELEM_PARAM.lastNameLabel),
        this.lastNameInput,
      ),
      this.formBlock(
        new ElementCreator(ELEM_PARAM.dateOfBirthLabel),
        this.dateOfBirthInput,
      ),
      this.addressArea,
    );
    this.updateProfileInfo();
  }

  private formBlock(
    fieldName: ElementCreator,
    inputElement: InputCreator,
  ): ElementCreator {
    const blockContainer = new ElementCreator(ELEM_PARAM.blockContainer);
    const penBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const penIcon = new ElementCreator(ELEM_PARAM.penIcon);
    const crossBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const crossIcon = new ElementCreator(ELEM_PARAM.crossIcon);
    const confirmBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const confirmIcon = new ElementCreator(ELEM_PARAM.checkMarkIcon);
    penBtn.addInnerElement(penIcon);
    crossBtn.addInnerElement(crossIcon);
    confirmBtn.addInnerElement(confirmIcon);
    confirmBtn.getElement().classList.add(css.disabled);
    crossBtn.getElement().classList.add(css.hiddenBtn);

    let tempVal: string;

    for (const button of [penBtn, crossBtn, confirmBtn]) {
      button.setCallBack(() => {
        inputElement.getElement().classList.toggle(css.inActiveInput);
        penBtn.getElement().classList.toggle(css.disabled);
        confirmBtn.getElement().classList.toggle(css.disabled);
        crossBtn.getElement().classList.toggle(css.showBtn);
      });
    }

    confirmBtn.setCallBack(() => {
      const changeTarget = inputElement
        .getElement()
        .getAttribute("change-target");
      if (changeTarget) {
        const value = inputElement.getElement().value;
        switch (changeTarget) {
          case CHANGE_ACTION_LIST.firstName: {
            this.apiRequestService.updateUserInfo(this.version, [
              {
                action: "setFirstName",
                firstName: value,
              },
            ]);
            break;
          }
          case CHANGE_ACTION_LIST.lastName: {
            this.apiRequestService.updateUserInfo(this.version, [
              {
                action: "setLastName",
                lastName: value,
              },
            ]);
            break;
          }
          case CHANGE_ACTION_LIST.email: {
            this.apiRequestService.updateUserInfo(this.version, [
              {
                action: "changeEmail",
                email: value,
              },
            ]);
            break;
          }
          case CHANGE_ACTION_LIST.dateOfBirth: {
            this.apiRequestService.updateUserInfo(this.version, [
              {
                action: "setDateOfBirth",
                dateOfBirth: value,
              },
            ]);
            break;
          }
        }
      }
    });

    penBtn.setCallBack(() => {
      tempVal = inputElement.getElement().value;
      inputElement.getElement().focus();
    });

    crossBtn.setCallBack(() => {
      inputElement.getElement().value = tempVal;
    });

    blockContainer.addInnerElement(
      fieldName,
      inputElement,
      penBtn,
      confirmBtn,
      crossBtn,
    );

    return blockContainer;
  }

  private buildAddressBlock(address: AddressData): ElementCreator {
    const blockContainer = new ElementCreator(ELEM_PARAM.addressBlockContainer);
    const country = new ElementCreator(ELEM_PARAM.countryField);
    const countryInput = new InputCreator(ELEM_PARAM.countryInput);
    const city = new ElementCreator(ELEM_PARAM.cityField);
    const cityInput = new InputCreator(ELEM_PARAM.cityInput);
    const state = new ElementCreator(ELEM_PARAM.stateField);
    const stateInput = new InputCreator(ELEM_PARAM.stateInput);
    const street = new ElementCreator(ELEM_PARAM.streetField);
    const streetInput = new InputCreator(ELEM_PARAM.streetInput);
    const zipCode = new ElementCreator(ELEM_PARAM.zipCodeField);
    const zipCodeInput = new InputCreator(ELEM_PARAM.zipCodeInput);
    const billingLabel = new ElementCreator(ELEM_PARAM.billingLabel);
    const billingCheckMark = new InputCreator(ELEM_PARAM.billingCheckMark);
    const shippingLabel = new ElementCreator(ELEM_PARAM.billingLabel);
    const shippingCheckMark = new InputCreator(ELEM_PARAM.shippingCheckMark);
    const billing = new ElementCreator(ELEM_PARAM.labelContainer);
    billing.addInnerElement(billingLabel, billingCheckMark);
    const shipping = new ElementCreator(ELEM_PARAM.labelContainer);
    shipping.addInnerElement(shippingLabel, shippingCheckMark);

    countryInput.getElement().value = address.country;
    cityInput.getElement().value = address.city;
    stateInput.getElement().value = address.state;
    streetInput.getElement().value = address.city;
    zipCodeInput.getElement().value = address.zipcode;
    shippingCheckMark.getElement().checked = address.defaultShipping;
    billingCheckMark.getElement().checked = address.defaultBilling;

    console.log(address.country);

    blockContainer.addInnerElement(
      this.formBlock(country, countryInput),
      this.formBlock(city, cityInput),
      this.formBlock(state, stateInput),
      this.formBlock(street, streetInput),
      this.formBlock(zipCode, zipCodeInput),
      billing,
      shipping,
    );

    return blockContainer;
  }
}
