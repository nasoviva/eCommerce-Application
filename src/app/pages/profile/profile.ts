import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import css from "./profile.module.css";
import InputCreator from "../../shared/input-creator";
import type { ClientResponse, executeRequest } from "@commercetools/ts-client";
import type { AddressData } from "../../services/api-request-service/data-parser";
import DataParser from "../../services/api-request-service/data-parser";
import type {
  Customer,
  MyCustomerUpdateAction,
} from "@commercetools/platform-sdk";
import {
  CHANGE_ACTION_LIST,
  COUNTRY_OPTIONS,
  ELEM_PARAM,
  PASSWORD_BLOCK,
} from "./constants";
import CustomElementCreator from "../../shared/custom-element-creator";
import Validator from "../../services/validator/validator";

function isCorrectUpdateData(
  incoming: object[],
): incoming is MyCustomerUpdateAction[] {
  return incoming.every((x) => x !== null && "action" in x);
}

export default class ProfileView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private profileContainer = new ElementCreator(ELEM_PARAM.mainContainer);
  private emailInput = new InputCreator(ELEM_PARAM.emailInput);
  private nameInput = new InputCreator(ELEM_PARAM.nameInput);
  private lastNameInput = new InputCreator(ELEM_PARAM.lastNameInput);
  private dateOfBirthInput = new InputCreator(ELEM_PARAM.dateOfBirthInput);
  private addressArea = new ElementCreator(ELEM_PARAM.addressArea);
  private addAddressBtn = new ElementCreator(ELEM_PARAM.addAddressBtn);
  private confirmBtn = new ElementCreator(ELEM_PARAM.confirmBtn);
  private updateInfo = new Map();
  private defaultAddresses = new Map();
  private addressCount: number = 0;
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

  public updateProfileInfo(): Promise<void> {
    return new Promise((resolve) => {
      this.apiRequestService.getUserInfo((result: ClientResponse<Customer>) => {
        const data = DataParser.parseUserData(result);
        this.version = data.version;
        this.emailInput.getElement().value = data.email;
        this.nameInput.getElement().value = data.name;
        this.lastNameInput.getElement().value = data.lastName;
        this.dateOfBirthInput.getElement().value = data.dateOfBirth;
        this.addressArea.getElement().replaceChildren();
        this.addressCount = 0;
        for (const item of data.addresses) {
          this.addressArea.addInnerElement(this.buildAddressBlock(item));
        }
        resolve();
      });
    });
  }

  private configureView(): void {
    this.confirmBtn.setCallBack(() => {
      const updateData = Array.from(this.updateInfo.values());
      if (!isCorrectUpdateData(updateData)) return;
      this.apiRequestService.updateUserInfo(this.version, updateData, () => {
        this.updateProfileInfo().finally(() => {
          const defaultAddressesData = Array.from(
            this.defaultAddresses.values(),
          );
          if (!isCorrectUpdateData(defaultAddressesData)) return;
          this.apiRequestService.updateUserInfo(
            this.version,
            defaultAddressesData,
            () => this.updateProfileInfo(),
          );
        });
      });
      this.addAddressBtn.getElement().classList.remove(css.disabled);
    });

    this.addAddressBtn.setCallBack(() => {
      this.addressArea.addInnerElement(this.buildAddressBlock());
      this.addAddressBtn.getElement().classList.add(css.disabled);
    });

    const changePasswordBtn = new ElementCreator(ELEM_PARAM.changePasswordBtn);
    const passwordChangeModal = this.buildPasswordChangeBlock();
    changePasswordBtn.setCallBack(() => {
      this.profileContainer.addInnerElement(passwordChangeModal);
      passwordChangeModal.getElement().showModal();
    });

    this.profileContainer.addInnerElement(
      new ElementCreator(ELEM_PARAM.title),
      this.formBlock(
        new ElementCreator(ELEM_PARAM.emailLabel),
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
      changePasswordBtn,
      this.addressArea,
      this.addAddressBtn,
      this.confirmBtn,
    );
    this.updateProfileInfo();
  }

  private formBlock(
    fieldName: ElementCreator,
    inputElement: InputCreator | CustomElementCreator<HTMLSelectElement>,
    addressId?: string,
    countryInput?: CustomElementCreator<HTMLSelectElement>,
  ): ElementCreator {
    const blockContainer = new ElementCreator(ELEM_PARAM.blockContainer);
    const penBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const penIcon = new ElementCreator(ELEM_PARAM.penIcon);
    const crossBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const crossIcon = new ElementCreator(ELEM_PARAM.crossIcon);
    const confirmBtn = new ElementCreator(ELEM_PARAM.penBtn);
    const confirmIcon = new ElementCreator(ELEM_PARAM.checkMarkIcon);
    const errorTip = new ElementCreator(ELEM_PARAM.errorTip);
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

    const changeTarget = inputElement
      .getElement()
      .getAttribute("change-target");

    if (changeTarget) {
      confirmBtn.setCallBack(() => {
        const value = inputElement.getElement().value;
        if (!addressId) {
          const actionType = changeTarget === "email" ? "change" : "set";
          this.updateInfo.set(changeTarget, {
            action: `${actionType}${changeTarget.replace(/^./, (match) => match.toUpperCase())}`,
            [changeTarget]: value,
          });
        } else {
          const data = this.updateInfo.get(addressId);
          this.updateInfo.get(addressId).address[changeTarget] = value;
          console.log(data, data[changeTarget], this.updateInfo);
        }
      });
    }

    penBtn.setCallBack(() => {
      tempVal = inputElement.getElement().value;
      inputElement.getElement().focus();
    });

    crossBtn.setCallBack(() => {
      inputElement.getElement().value = tempVal;
      confirmBtn.getElement().classList.remove(css.inActiveButton);
      errorTip.getElement().textContent = "";
    });
    if (changeTarget)
      this.setUpValidationCheck(
        confirmBtn,
        inputElement,
        errorTip,
        changeTarget,
        countryInput,
      );

    blockContainer.addInnerElement(
      fieldName,
      inputElement,
      penBtn,
      confirmBtn,
      crossBtn,
      errorTip,
    );
    console.log(blockContainer.getElement(), errorTip.getElement());

    return blockContainer;
  }

  private setUpValidationCheck(
    confirmBtn: ElementCreator,
    inputElement: InputCreator | CustomElementCreator<HTMLSelectElement>,
    errorTip: ElementCreator,
    type: string,
    countryInput?: CustomElementCreator<HTMLSelectElement>,
  ): void {
    const element = inputElement.getElement();
    const country = countryInput?.getElement();
    /* const type = element.getAttribute("change-action"); */
    let validator: CallableFunction;
    switch (type) {
      case CHANGE_ACTION_LIST.email: {
        validator = Validator.checkEmail;
        break;
      }
      case CHANGE_ACTION_LIST.firstName || CHANGE_ACTION_LIST.lastName: {
        validator = Validator.checkNameOrLastName;
        break;
      }
      case CHANGE_ACTION_LIST.lastName: {
        validator = Validator.checkNameOrLastName;
        break;
      }
      case CHANGE_ACTION_LIST.dateOfBirth: {
        validator = Validator.checkBirthDate;
        break;
      }
      case CHANGE_ACTION_LIST.country: {
        validator = Validator.checkCountry;
        break;
      }
      case CHANGE_ACTION_LIST.state: {
        validator = Validator.checkCity;
        break;
      }
      case CHANGE_ACTION_LIST.city: {
        validator = Validator.checkCity;
        break;
      }
      case CHANGE_ACTION_LIST.street: {
        validator = Validator.checkStreet;
        break;
      }
      case CHANGE_ACTION_LIST.postalCode: {
        validator =
          country?.value === "RU"
            ? Validator.checkIndexRussia
            : Validator.checkIndexUSA;
        break;
      }
    }
    element.addEventListener(
      "input",
      () => this.inputValidation(inputElement, errorTip, validator, confirmBtn),
      /* {
      const value = inputElement.getElement().value;
      const msg = validator(value);
      errorTip.getElement().textContent = msg;
      if (msg !== "") confirmBtn.getElement().classList.add(css.inActiveButton);
      else confirmBtn.getElement().classList.remove(css.inActiveButton);
    } */
    );
    if (!country) return;
    country.addEventListener("change", () => {
      element.removeEventListener("select", () => this.inputValidation);
      validator =
        element.value === "RU"
          ? Validator.checkIndexRussia
          : Validator.checkIndexUSA;
      element.addEventListener("input", () =>
        this.inputValidation(inputElement, errorTip, validator, confirmBtn),
      );
    });
  }

  private inputValidation(
    input: CustomElementCreator<HTMLSelectElement> | InputCreator,
    error: ElementCreator,
    validator: CallableFunction,
    confirmBtn: ElementCreator,
  ): void {
    const value = input.getElement().value;
    const msg = validator(value);
    error.getElement().textContent = msg;
    if (msg !== "") confirmBtn.getElement().classList.add(css.inActiveButton);
    else confirmBtn.getElement().classList.remove(css.inActiveButton);
  }

  private buildPasswordChangeBlock(): CustomElementCreator<HTMLDialogElement> {
    const container = new CustomElementCreator<HTMLDialogElement>(
      PASSWORD_BLOCK.mainContainer,
    );
    const oldPasswordInput = new InputCreator(PASSWORD_BLOCK.oldPasswordInput);
    /* const oldErrorTip = new ElementCreator(ELEM_PARAM.errorTip); */
    const newPasswordInput = new InputCreator(PASSWORD_BLOCK.newPasswordInput);
    /* const newErrorTip = new ElementCreator(ELEM_PARAM.errorTip); */
    const confirmBtn = new ElementCreator(PASSWORD_BLOCK.confirmBtn);
    const cancelBtn = new ElementCreator(PASSWORD_BLOCK.cancelBtn);
    const errors = [
      new ElementCreator(PASSWORD_BLOCK.errorTip),
      new ElementCreator(PASSWORD_BLOCK.errorTip),
    ];

    [oldPasswordInput, newPasswordInput].forEach((x, i) =>
      x.getElement().addEventListener("input", () => {
        const error = Validator.checkPassword(x.getElement().value);
        errors[i].getElement().textContent = error;
      }),
    );

    cancelBtn.setCallBack(() => {
      container.getElement().close();
      container.getElement().remove();
    });

    confirmBtn.setCallBack(async () => {
      const newPassword = newPasswordInput.getElement().value;
      this.apiRequestService.changePassword(
        this.version,
        oldPasswordInput.getElement().value,
        newPassword,
        () => {
          this.stateManager.password = newPassword;
          container;
          this.apiRequestService.authUser({
            email: this.stateManager.login || "",
            password: newPassword,
          });
          newPasswordInput.getElement().value = "";
          oldPasswordInput.getElement().value = "";
          container.getElement().close();
          container.getElement().remove();
        },
      );
    });

    container.addInnerElement(
      new ElementCreator(PASSWORD_BLOCK.oldPasswordLabel),
      oldPasswordInput,
      errors[0],
      new ElementCreator(PASSWORD_BLOCK.newPasswordLabel),
      newPasswordInput,
      errors[1],
      confirmBtn,
      cancelBtn,
    );
    return container;
  }

  private buildAddressBlock(address?: AddressData): ElementCreator {
    const blockContainer = new ElementCreator(ELEM_PARAM.addressBlockContainer);
    const country = new ElementCreator(ELEM_PARAM.countryField);
    const countryInput = new CustomElementCreator<HTMLSelectElement>(
      ELEM_PARAM.countryInput,
    );
    countryInput.addInnerElement(
      new ElementCreator(COUNTRY_OPTIONS.RU),
      new ElementCreator(COUNTRY_OPTIONS.US),
    );
    const city = new ElementCreator(ELEM_PARAM.cityField);
    const cityInput = new InputCreator(ELEM_PARAM.cityInput);
    const state = new ElementCreator(ELEM_PARAM.stateField);
    const stateInput = new InputCreator(ELEM_PARAM.stateInput);
    const street = new ElementCreator(ELEM_PARAM.streetField);
    const streetInput = new InputCreator(ELEM_PARAM.streetInput);
    const postalCode = new ElementCreator(ELEM_PARAM.zipCodeField);
    const postalCodeInput = new InputCreator(ELEM_PARAM.zipCodeInput);
    const billingLabel = new ElementCreator(ELEM_PARAM.billingLabel);
    const billingCheckMark = new InputCreator(ELEM_PARAM.billingCheckMark);
    const shippingLabel = new ElementCreator(ELEM_PARAM.shippingLabel);
    const shippingCheckMark = new InputCreator(ELEM_PARAM.shippingCheckMark);
    const billing = new ElementCreator(ELEM_PARAM.labelContainer);
    billing.addInnerElement(billingLabel, billingCheckMark);
    const shipping = new ElementCreator(ELEM_PARAM.labelContainer);
    shipping.addInnerElement(shippingLabel, shippingCheckMark);

    const deleteBtn = new ElementCreator(ELEM_PARAM.deleteAddressBtn);

    let id: string | undefined;
    let addressKey = `address${this.addressCount++}`;

    if (address) {
      countryInput.getElement().value = address.country;
      cityInput.getElement().value = address.city;
      stateInput.getElement().value = address.state;
      streetInput.getElement().value = address.city;
      postalCodeInput.getElement().value = address.postalCode;
      shippingCheckMark.getElement().checked = address.defaultShipping;
      billingCheckMark.getElement().checked = address.defaultBilling;
      shippingCheckMark.getElement().id = address.id;
      billingCheckMark.getElement().id = address.id;
      id = address.id;
      this.updateInfo.set(id, {
        action: "changeAddress",
        addressId: `${address.id}`,
        address: {
          key: addressKey,
          country: address.country,
          state: address.state,
          city: address.city,
          street: address.street,
          postalCode: address.postalCode,
        },
      });
    } else {
      id = "newAddress";
      this.updateInfo.set(id, {
        action: "addAddress",
        address: {
          key: addressKey,
          country: "",
          state: "",
          city: "",
          street: "",
          postalCode: "",
        },
      });
    }

    deleteBtn.setCallBack(() => {
      if (id !== "newAddress") {
        this.updateInfo.set(id, {
          action: "removeAddress",
          addressId: id,
        });
      } else this.updateInfo.delete(id);
      blockContainer.getElement().remove();
    });

    billingCheckMark.getElement().addEventListener("click", () => {
      if (!billingCheckMark.getElement().checked) return;
      this.defaultAddresses.set("defaultBilling", {
        action: "setDefaultBillingAddress",
        addressKey: addressKey,
      });
    });

    shippingCheckMark.getElement().addEventListener("click", () => {
      if (!billingCheckMark.getElement().checked) return;
      this.defaultAddresses.set("defaultShipping", {
        action: "setDefaultShippingAddress",
        addressKey: addressKey,
      });
    });

    /*  countryInput.getElement().addEventListener("select", () => {
      const value = countryInput.getElement().value;
      if (value === "ru");
    }); */

    blockContainer.addInnerElement(
      this.formBlock(country, countryInput, id),
      this.formBlock(city, cityInput, id),
      this.formBlock(state, stateInput, id),
      this.formBlock(street, streetInput, id),
      this.formBlock(postalCode, postalCodeInput, id, countryInput),
      billing,
      shipping,
      deleteBtn,
      new ElementCreator(ELEM_PARAM.separator),
    );

    return blockContainer;
  }
}
