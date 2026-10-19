const getErrorElement = (formElement, inputElement) =>
  formElement.querySelector(`#${inputElement.id}-error`);

const showInputError = (formElement, inputElement, message, settings) => {
  inputElement.classList.add(settings.inputErrorClass);
  inputElement.setAttribute("aria-invalid", "true");
  const errorElement = getErrorElement(formElement, inputElement);
  errorElement.textContent = message;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  inputElement.classList.remove(settings.inputErrorClass);
  inputElement.removeAttribute("aria-invalid");
  inputElement.setCustomValidity("");
  const errorElement = getErrorElement(formElement, inputElement);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  inputElement.setCustomValidity("");
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  }
  if (inputElement.validity.valid) {
    hideInputError(formElement, inputElement, settings);
  } else {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings,
    );
  }
};

const hasInvalidInput = (inputElements) =>
  inputElements.some((inputElement) => !inputElement.validity.valid);

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
};

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
};

const toggleButtonState = (inputElements, buttonElement, settings) => {
  if (hasInvalidInput(inputElements))
    disableSubmitButton(buttonElement, settings);
  else enableSubmitButton(buttonElement, settings);
};

const setEventListeners = (formElement, settings) => {
  const inputElements = Array.from(
    formElement.querySelectorAll(settings.inputSelector),
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector,
  );
  disableSubmitButton(buttonElement, settings);
  inputElements.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputElements, buttonElement, settings);
    });
  });
};

export const clearValidation = (formElement, settings) => {
  formElement
    .querySelectorAll(settings.inputSelector)
    .forEach((inputElement) => {
      hideInputError(formElement, inputElement, settings);
    });
  disableSubmitButton(
    formElement.querySelector(settings.submitButtonSelector),
    settings,
  );
};

export const enableValidation = (settings) => {
  document.querySelectorAll(settings.formSelector).forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};
