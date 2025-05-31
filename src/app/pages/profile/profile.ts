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
      this.addressArea,
      this.addAddressBtn,
      this.confirmBtn,
    );
    this.updateProfileInfo();
  }

  private formBlock(
    fieldName: ElementCreator,
    inputElement: InputCreator,
    addressId?: string,
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

  private buildAddressBlock(address?: AddressData): ElementCreator {
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
      zipCodeInput.getElement().value = address.postalCode;
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

    blockContainer.addInnerElement(
      this.formBlock(country, countryInput, id),
      this.formBlock(city, cityInput, id),
      this.formBlock(state, stateInput, id),
      this.formBlock(street, streetInput, id),
      this.formBlock(zipCode, zipCodeInput, id),
      billing,
      shipping,
      deleteBtn,
      new ElementCreator(ELEM_PARAM.separator),
    );

    return blockContainer;
  }
}
