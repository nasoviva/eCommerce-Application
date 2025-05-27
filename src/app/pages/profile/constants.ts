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
  nameLabel: {
    tag: "p",
    className: [...css.textField.split(" ")],
    textContent: "Name:",
  },
  nameInput: {
    type: "text",
    className: [...css.textInput.split(" "), css.inActiveInput],
    placeholder: "Name",
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
};
