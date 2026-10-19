const getTemplate = () =>
  document
    .querySelector("#card-template")
    .content.querySelector(".card")
    .cloneNode(true);

export const createCardElement = (
  data,
  currentUserId,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick },
) => {
  const card = getTemplate();
  const likeButton = card.querySelector(".card__like-button");
  const deleteButton = card.querySelector(".card__control-button_type_delete");
  const infoButton = card.querySelector(".card__control-button_type_info");
  const image = card.querySelector(".card__image");
  image.src = data.link;
  image.alt = data.name;
  card.querySelector(".card__title").textContent = data.name;
  card.querySelector(".card__like-count").textContent = data.likes.length;
  likeButton.classList.toggle(
    "card__like-button_is-active",
    data.likes.some((user) => user._id === currentUserId),
  );
  likeButton.setAttribute("aria-label", "Нравится");
  likeButton.addEventListener("click", () =>
    onLikeIcon(data._id, card, likeButton),
  );
  if (data.owner._id === currentUserId) {
    deleteButton.setAttribute("aria-label", "Удалить карточку");
    deleteButton.addEventListener("click", () =>
      onDeleteCard(data._id, card, deleteButton),
    );
  } else deleteButton.remove();
  infoButton.setAttribute("aria-label", "Информация о карточке");
  infoButton.addEventListener("click", () => onInfoClick(data._id, infoButton));
  image.addEventListener("click", () =>
    onPreviewPicture({ name: data.name, link: data.link }),
  );
  return card;
};
