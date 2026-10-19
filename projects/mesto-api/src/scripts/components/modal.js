const handleEscUp = (event) => {
  if (event.key === "Escape")
    closeModalWindow(document.querySelector(".popup_is-opened"));
};

export const openModalWindow = (modal) => {
  document.querySelectorAll(".popup_is-opened").forEach((other) => {
    if (other !== modal) closeModalWindow(other);
  });
  modal.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscUp);
};

export const closeModalWindow = (modal) => {
  modal?.classList.remove("popup_is-opened");
  if (!document.querySelector(".popup_is-opened"))
    document.removeEventListener("keyup", handleEscUp);
};

export const setCloseModalWindowEventListeners = (modal) => {
  modal
    .querySelector(".popup__close")
    .addEventListener("click", () => closeModalWindow(modal));
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) closeModalWindow(modal);
  });
};
