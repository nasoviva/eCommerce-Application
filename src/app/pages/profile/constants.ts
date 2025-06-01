import type { MyCustomerUpdateAction } from "@commercetools/platform-sdk";
import css from "./profile.module.css";

export const ELEM_PARAM = {
  mainContainer: {
    tag: "div",
    className: [...css.mainContainer.split(" ")],
  },
  title: {
    tag: "h2",
    className: [...css.title.split(" ")],
    textContent: "This is Profile",
  },
  textField: {
    tag: "p",
    className: [...css.textField.split(" ")],
  },
  textInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
  },
  emailLabel: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "E-mail:",
  },
  emailInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "e-mail",
    attributes: {
      "change-target": "email",
    },
  },
  nameLabel: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Name:",
  },
  nameInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "Name",
    attributes: {
      "change-target": "firstName",
    },
  },
  lastNameLabel: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Last name:",
  },
  lastNameInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "Last Name",
    attributes: {
      "change-target": "lastName",
    },
  },
  dateOfBirthLabel: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Date of birth:",
  },
  dateOfBirthInput: {
    type: "date",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "1999-01-01",
    attributes: {
      "change-target": "dateOfBirth",
    },
  },
  penBtn: {
    tag: "button",
    className: [css.penBtn],
  },
  penIcon: {
    tag: "img",
    className: [css.penIcon],
    attributes: { src: "./img/pen-icon.svg", alt: "Edit button" },
  },
  checkMarkIcon: {
    tag: "img",
    className: [css.penIcon],
    attributes: {
      src: "./img/check-mark.svg",
      alt: "Confirm button",
    },
  },
  crossIcon: {
    tag: "img",
    className: [css.penIcon],
    attributes: {
      src: "./img/cross-icon.svg",
      alt: "Cancel changes",
    },
  },
  blockContainer: {
    tag: "div",
    className: [...css.blockContainer.split(" ")],
    textContent: "",
  },
  addressArea: {
    tag: "div",
    className: [...css.mainContainer.split(" "), css.addressArea],
  },
  addressBlockContainer: {
    tag: "div",
    className: [...css.mainContainer.split(" "), css.addressArea],
  },
  countryField: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Country:",
  },
  stateField: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "State:",
  },
  cityField: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "City:",
  },
  streetField: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Street:",
  },
  zipCodeField: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Zipcode:",
  },
  countryInput: {
    tag: "select",
    className: [...css.textInput.split(" "), css.inActiveInput],
    attributes: {
      "change-target": "country",
    },
  },
  stateInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "State",
    attributes: {
      "change-target": "state",
    },
  },
  cityInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "City",
    attributes: {
      "change-target": "city",
    },
  },
  streetInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "Street",
    attributes: {
      "change-target": "street",
    },
  },
  zipCodeInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "postalCode",
    attributes: {
      "change-target": "postalCode",
    },
  },
  labelContainer: {
    tag: "label",
    className: [...css.labelContainer.split(" ")],
  },
  billingLabel: {
    tag: "span",
    className: [...css.textLabel.split(" ")],
    textContent: "Set this address as default for billing",
  },
  shippingLabel: {
    tag: "span",
    className: [...css.textLabel.split(" ")],
    textContent: "Set this address as default for shipping",
  },
  billingCheckMark: {
    type: "radio",
    className: [...css.checkBox.split(" ")],
    attributes: {
      name: "billingCheckMark",
    },
  },
  shippingCheckMark: {
    type: "radio",
    className: [...css.checkBox.split(" ")],
    attributes: {
      name: "shippingCheckMark",
    },
  },
  confirmBtn: {
    tag: "button",
    className: [...css.button.split(" ")],
    textContent: "Confirm changes",
  },
  addAddressBtn: {
    tag: "button",
    className: [...css.button.split(" ")],
    textContent: "Add new address",
  },
  deleteAddressBtn: {
    tag: "button",
    className: [...css.button.split(" ")],
    textContent: "Delete this address",
  },
  separator: {
    tag: "div",
    className: [css.separator],
  },
  errorTip: {
    tag: "p",
    className: [...css.errorTip.split(" ")],
  },
};

export const COUNTRY_OPTIONS = {
  RU: {
    tag: "option",
    className: [],
    textContent: "Russia",
    attributes: {
      value: "RU",
    },
  },
  US: {
    tag: "option",
    className: [],
    textContent: "USA",
    attributes: {
      value: "US",
    },
  },
};

export const CHANGE_ACTION_LIST = {
  firstName: ELEM_PARAM.nameInput.attributes["change-target"],
  lastName: ELEM_PARAM.lastNameInput.attributes["change-target"],
  email: ELEM_PARAM.emailInput.attributes["change-target"],
  dateOfBirth: ELEM_PARAM.dateOfBirthInput.attributes["change-target"],
  country: ELEM_PARAM.countryInput.attributes["change-target"],
  state: ELEM_PARAM.stateInput.attributes["change-target"],
  city: ELEM_PARAM.cityInput.attributes["change-target"],
  street: ELEM_PARAM.streetInput.attributes["change-target"],
  postalCode: ELEM_PARAM.zipCodeInput.attributes["change-target"],
};
