import { enableValidation, clearValidation } from "./components/validation.js";
import { createCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import {
  configureApi,
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  removeCard,
  changeLikeCardStatus,
} from "./components/api.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};
const placesWrap = document.querySelector(".places__list");
const profileModal = document.querySelector(".popup_type_edit");
const profileForm = profileModal.querySelector("form");
const profileName = profileForm.querySelector("#user-name");
const profileAbout = profileForm.querySelector("#user-description");
const cardModal = document.querySelector(".popup_type_new-card");
const cardForm = cardModal.querySelector("form");
const cardName = cardForm.querySelector("#place-name");
const cardLink = cardForm.querySelector("#place-link");
const avatarModal = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarModal.querySelector("form");
const avatarLink = avatarForm.querySelector("#user-avatar");
const imageModal = document.querySelector(".popup_type_image");
const imageElement = imageModal.querySelector(".popup__image");
const imageCaption = imageModal.querySelector(".popup__caption");
const infoModal = document.querySelector(".popup_type_info");
const infoList = infoModal.querySelector(".popup__info");
const infoUsers = infoModal.querySelector(".popup__list");
const infoHeading = infoModal.querySelector(".popup__text");
const infoTemplate = document.querySelector("#popup-info-definition-template");
const userTemplate = document.querySelector(
  "#popup-info-user-preview-template",
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const status = document.querySelector(".request-status");
const connectionDialog = document.querySelector(".connection-dialog");
const connectionForm = connectionDialog.querySelector("form");
const cohortInput = connectionForm.querySelector("[name=cohort]");
const tokenInput = connectionForm.querySelector("[name=token]");
const connectionError = connectionForm.querySelector(".connection-error");
const connectionButton = document.querySelector(".connection-button");
let currentUserId = "";
let currentCredentials;

const showError = (target) => {
  target.textContent =
    "Не удалось подтвердить операцию. Проверьте подключение и обновите страницу перед повтором.";
};
const updateProfile = (user) => {
  currentUserId = user._id;
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileAvatar.style.backgroundImage = `url("${user.avatar.replaceAll('"', "%22")}")`;
};
const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModal);
};
const createInfoString = (term, value) => {
  const row = infoTemplate.content.firstElementChild.cloneNode(true);
  row.querySelector("dt").textContent = term;
  row.querySelector("dd").textContent = value;
  return row;
};
const formatDate = (date) =>
  new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const handleInfoClick = async (cardId, button) => {
  if (button.disabled) return;
  button.disabled = true;
  status.textContent = "";
  try {
    const cards = await getCardList();
    const card = cards.find((item) => item._id === cardId);
    if (!card) throw new Error("Карточка больше не существует.");
    infoList.replaceChildren(
      createInfoString("Описание:", card.name),
      createInfoString("Дата создания:", formatDate(card.createdAt)),
      createInfoString("Владелец:", card.owner.name),
      createInfoString("Количество лайков:", String(card.likes.length)),
    );
    infoUsers.replaceChildren(
      ...card.likes.map((user) => {
        const item = userTemplate.content.firstElementChild.cloneNode(true);
        item.textContent = user.name;
        item.title = user.name;
        return item;
      }),
    );
    infoHeading.textContent = card.likes.length
      ? "Лайкнули:"
      : "Пока никто не поставил лайк";
    openModalWindow(infoModal);
  } catch {
    showError(status);
  } finally {
    button.disabled = false;
  }
};
const handleDeleteCard = async (cardId, element, button) => {
  if (button.disabled) return;
  button.disabled = true;
  status.textContent = "";
  try {
    await removeCard(cardId);
    element.remove();
  } catch {
    showError(status);
  } finally {
    button.disabled = false;
  }
};
const handleLikeCard = async (cardId, element, button) => {
  if (button.disabled) return;
  button.disabled = true;
  status.textContent = "";
  try {
    const updated = await changeLikeCardStatus(
      cardId,
      button.classList.contains("card__like-button_is-active"),
    );
    button.classList.toggle(
      "card__like-button_is-active",
      updated.likes.some((user) => user._id === currentUserId),
    );
    element.querySelector(".card__like-count").textContent =
      updated.likes.length;
  } catch {
    showError(status);
  } finally {
    button.disabled = false;
  }
};
const buildCard = (data) =>
  createCardElement(data, currentUserId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeIcon: handleLikeCard,
    onDeleteCard: handleDeleteCard,
    onInfoClick: handleInfoClick,
  });

const submitForm = async (form, popup, loadingText, action) => {
  if (form.dataset.saving === "true" || !form.checkValidity()) return;
  const button = form.querySelector("button[type=submit]");
  const fields = Array.from(form.querySelectorAll("input"));
  const error = form.querySelector(".popup__request-error");
  const label = button.textContent;
  form.dataset.saving = "true";
  error.textContent = "";
  button.textContent = loadingText;
  button.disabled = true;
  fields.forEach((field) => {
    field.disabled = true;
  });
  try {
    await action();
    closeModalWindow(popup);
  } catch {
    showError(error);
  } finally {
    fields.forEach((field) => {
      field.disabled = false;
    });
    delete form.dataset.saving;
    button.textContent = label;
    button.disabled = !form.checkValidity();
  }
};
profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = { name: profileName.value, about: profileAbout.value };
  void submitForm(profileForm, profileModal, "Сохранение…", async () =>
    updateProfile(await setUserInfo(data)),
  );
});
cardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = { name: cardName.value, link: cardLink.value };
  void submitForm(cardForm, cardModal, "Создание…", async () => {
    placesWrap.prepend(buildCard(await addCard(data)));
    cardForm.reset();
  });
});
avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const avatar = avatarLink.value;
  void submitForm(avatarForm, avatarModal, "Сохранение…", async () => {
    updateProfile(await setUserAvatar(avatar));
    avatarForm.reset();
  });
});
editButton.addEventListener("click", () => {
  if (profileForm.dataset.saving === "true") return;
  profileName.value = profileTitle.textContent;
  profileAbout.value = profileDescription.textContent;
  profileForm.querySelector(".popup__request-error").textContent = "";
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileModal);
});
const openEmptyForm = (form, popup) => {
  if (form.dataset.saving === "true" || !currentUserId) return;
  form.reset();
  form.querySelector(".popup__request-error").textContent = "";
  clearValidation(form, validationSettings);
  openModalWindow(popup);
};
addButton.addEventListener("click", () => openEmptyForm(cardForm, cardModal));
profileAvatar.addEventListener("click", () =>
  openEmptyForm(avatarForm, avatarModal),
);
document.querySelectorAll(".popup").forEach(setCloseModalWindowEventListeners);
enableValidation(validationSettings);

const loadData = async (credentials) => {
  configureApi(credentials);
  let cards, user;
  try {
    [cards, user] = await Promise.all([getCardList(), getUserInfo()]);
  } catch (error) {
    if (currentCredentials) configureApi(currentCredentials);
    throw error;
  }
  currentCredentials = credentials;
  updateProfile(user);
  placesWrap.replaceChildren(...cards.map(buildCard));
  editButton.disabled = false;
  addButton.disabled = false;
  status.textContent = "";
};
connectionButton.addEventListener("click", () => {
  if (document.querySelector('form[data-saving="true"]')) {
    status.textContent = "Дождитесь завершения сохранения.";
    return;
  }
  connectionError.textContent = "";
  connectionDialog.showModal();
});
connectionDialog.addEventListener("cancel", (event) => {
  if (
    !currentUserId ||
    connectionForm.querySelector('button[type="submit"]').disabled
  )
    event.preventDefault();
});
connectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = connectionForm.querySelector("button[type=submit]");
  if (button.disabled) return;
  const credentials = {
    cohort: cohortInput.value.trim(),
    token: tokenInput.value.trim(),
  };
  button.disabled = true;
  connectionError.textContent = "";
  try {
    await loadData(credentials);
    try {
      sessionStorage.setItem("mesto-connection", JSON.stringify(credentials));
    } catch {
      /* Connection remains usable in memory. */
    }
    tokenInput.value = "";
    connectionDialog.close();
  } catch {
    connectionError.textContent =
      "Не удалось подключиться. Проверьте токен, идентификатор группы и сеть.";
  } finally {
    button.disabled = false;
  }
});
const start = async () => {
  let credentials;
  try {
    credentials = JSON.parse(sessionStorage.getItem("mesto-connection"));
  } catch {
    /* Ask for credentials without exposing them. */
  }
  if (credentials) {
    try {
      await loadData(credentials);
      return;
    } catch {
      connectionError.textContent =
        "Подключение не подтверждено. Проверьте данные и сеть.";
    }
  }
  connectionDialog.showModal();
};
void start();
