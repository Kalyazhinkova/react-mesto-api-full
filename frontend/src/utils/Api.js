import { apiConfig } from "./constants";

class Api {
  constructor(config) {
    this._config = config;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  setToken(token) {
    this._config.headers.Authorization = token;
  }

  register(data) {
    return fetch(
      `${this._config.baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(this._handleResponse)
  }

  login(data) {
    return fetch(
      `${this._config.baseUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(this._handleResponse)
  }

  getUserInfo() {
    return fetch(
      `${this._config.baseUrl}/users/me`, {
      headers: this._config.headers
    })
      .then(this._handleResponse)
  }

  setNewUserInfo(name, about) {
    return fetch(
      `${this._config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._config.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this._handleResponse)
  }

  setNewAvatar(userInfo) {
    return fetch(
      `${this._config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._config.headers,
      body: JSON.stringify({
        avatar: userInfo.avatar,
      })
    })
      .then(this._handleResponse)
  }

  getInitialCards() {
    return fetch(
      `${this._config.baseUrl}/cards`, {
      headers: this._config.headers
    }
    )
      .then(this._handleResponse)
  }

  createCard(card) {
    return fetch(
      `${this._config.baseUrl}/cards`, {
      method: 'POST',
      headers: this._config.headers,
      body: JSON.stringify({name: card.name, link: card.link})
    })
      .then(this._handleResponse)
  }

  deleteCardById(id) {
    return fetch(
      `${this._config.baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._config.headers
    })
      .then(this._handleResponse)
  }

  likeCard( id, haveNotLiked ) {
    if (haveNotLiked) 
    {
      return fetch(
        `${this._config.baseUrl}/cards/${id}/likes`, {
        method: 'PUT',
        headers: this._config.headers
      })
        .then(this._handleResponse)
    }
     else {
      return fetch(
        `${this._config.baseUrl}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._config.headers
      })
        .then(this._handleResponse)
    }
  }
}

const api = new Api(apiConfig);

export default api;