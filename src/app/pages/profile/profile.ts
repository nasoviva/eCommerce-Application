import ElementCreator from "../../shared/element-creator";
import type StateManager from "../../services/state-manager/state-manager";
import type ApiRequestService from "../../services/api-request-service/api-request-service";
import css from "./profile.module.css";
import InputCreator from "../../shared/input-creator";
import type { ClientResponse } from "@commercetools/ts-client";
import type { AddressData } from "../../services/api-request-service/data-parser";
import DataParser from "../../services/api-request-service/data-parser";
import type { Customer } from "@commercetools/platform-sdk";
import { ELEM_PARAM } from "./constants";

export default class ProfileView {
  private readonly stateManager: StateManager;
  private readonly apiRequestService: ApiRequestService;
  private profileContainer = new ElementCreator(ELEM_PARAM.mainContainer);
  private nameInput = new InputCreator(ELEM_PARAM.nameInput);
  private lastNameInput = new InputCreator(ELEM_PARAM.lastNameInput);
  private dateOfBirthInput = new InputCreator(ELEM_PARAM.dateOfBirthInput);
  private addressArea = new ElementCreator(ELEM_PARAM.mainContainer);

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
      this.nameInput.getElement().value = data.name;
      this.lastNameInput.getElement().value = data.lastName;
      this.dateOfBirthInput.getElement().value = data.dateOfBirth;
    });
  }

  private configureView(): void {
    /* this.profileContainer.getElement().innerHTML = ""; */
    const title = new ElementCreator(ELEM_PARAM.title);
    this.profileContainer.addInnerElement(
      title,
      this.formBlocks(new ElementCreator(ELEM_PARAM.nameLabel), this.nameInput),
      this.formBlocks(
        new ElementCreator(ELEM_PARAM.lastNameLabel),
        this.lastNameInput,
      ),
      this.formBlocks(
        new ElementCreator(ELEM_PARAM.dateOfBirthLabel),
        this.dateOfBirthInput,
      ),
      this.addressArea,
    );
    this.updateProfileInfo();
  }

  private formBlocks(
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

    penBtn.setCallBack(() => {
      tempVal = inputElement.getElement().value;
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

  /* private buildAdressBlock(address: AddressData): ElementCreator {
    const blockContainer = new ElementCreator(ELEM_PARAM.mainContainer);
    const country = new ElementCreator(ELEM_PARAM.textField);
    const countryInput = new InputCreator(ELEM_PARAM.nameInput);
    const country = new ElementCreator(ELEM_PARAM.textField);
    const countryInput = new InputCreator(ELEM_PARAM.nameInput);
    const country = new ElementCreator(ELEM_PARAM.textField);
    const countryInput = new InputCreator(ELEM_PARAM.nameInput);
    const country = new ElementCreator(ELEM_PARAM.textField);
    const countryInput = new InputCreator(ELEM_PARAM.nameInput); 
  } */
}
