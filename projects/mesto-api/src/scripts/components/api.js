const config = {
  baseUrl: "",
  headers: { "Content-Type": "application/json" },
};

export const configureApi = ({ cohort, token }) => {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(cohort) || !token.trim()) {
    throw new Error("Укажите идентификатор группы и личный токен.");
  }
  config.baseUrl = `https://mesto.nomoreparties.co/v1/${cohort}`;
  config.headers.authorization = token.trim();
};

const getResponseData = (response) => {
  if (!response.ok) throw new Error(`Сервер вернул ошибку ${response.status}.`);
  return response.json();
};

const request = (path, options = {}) => {
  if (!config.baseUrl)
    return Promise.reject(new Error("Подключите учебный сервер."));
  return fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: config.headers,
    signal: AbortSignal.timeout(20000),
  }).then(getResponseData);
};

export const getUserInfo = () => request("/users/me");
export const getCardList = () => request("/cards");
export const setUserInfo = ({ name, about }) =>
  request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
export const setUserAvatar = (avatar) =>
  request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
export const addCard = ({ name, link }) =>
  request("/cards", { method: "POST", body: JSON.stringify({ name, link }) });
export const removeCard = (cardId) =>
  request(`/cards/${encodeURIComponent(cardId)}`, { method: "DELETE" });
export const changeLikeCardStatus = (cardId, isLiked) =>
  request(`/cards/likes/${encodeURIComponent(cardId)}`, {
    method: isLiked ? "DELETE" : "PUT",
  });
