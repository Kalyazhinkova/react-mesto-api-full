import Header from "./Header";
import Main from "./Main";
import api from "../utils/Api";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const history = useHistory();
  //Переменные состояния попапов
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  //Переменная состояния карточек
  const [selectedCard, setSelectedCard] = useState({});
  const [openPopupName, setOpenPopupName] = useState(false);

  //Состояние пользователя
  const [currentUser, setCurrentUser] = useState({});

  //Состояние зарегистрированного пользователя
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const [cards, setCards] = useState([null]);

  const openInfoTooltip = (isSignIn) => {
    setIsInfoTooltipPopupOpen(true);
    setIsSignIn(isSignIn);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    console.log(jwt, 'useEffect');
    if (jwt) {
      api.setToken(jwt);
      Promise.all([
        api.getUserInfo(),
        api.getInitialCards(),
      ])
        .then(([data, initialCards]) => {
          setCurrentUser(data);
          setCards(initialCards.slice().reverse());
          console.log('then');
          setLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
          openInfoTooltip(false);
          logOut();
        });
    } else {
      logOut();
    }
  }, [loggedIn]);

  function onCardClick(card) {
    setSelectedCard(card);
    setOpenPopupName(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);
    api
      .likeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );

      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCardById(card._id)
      .then(() => {
        setCards((state) => state.filter(item => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleUpdateUser(name, about) {
    api
      .setNewUserInfo(name, about)
      .then((userData) => {
        setCurrentUser({...currentUser, ...userData});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .setNewAvatar(avatar)
      .then((userData) => {
        setCurrentUser({...currentUser, ...userData});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .createCard(newCard)
      .then((res) => {
        setCards([res.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setOpenPopupName(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleRegistration(info) {
    api.register(info)
      .then((result) => {
        if (result && result.data) {
          openInfoTooltip(true);
          history.push('/sign-in');
        } else {
          openInfoTooltip(false);
        }
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function handleLogin(info) {
    api.login(info)
      .then((result) => {
        if (result && result.token) {
          setLoggedIn(true);
          localStorage.setItem("jwt", result.token);
        } else {
          openInfoTooltip(false);
        }
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(false);
      });
  }

  function logOut() {
    setLoggedIn(false);
    setCurrentUser({});
    setCards([null]);
    localStorage.removeItem("jwt");
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={currentUser.email} loggedIn={loggedIn} logOut={logOut} />

      <Switch>
        <Route path="/sign-up">
          <Register onRegister={handleRegistration} />
        </Route>
        <Route path="/sign-in">
          <Login onLogin={handleLogin} />
        </Route>
        <ProtectedRoute
          path="/"
          cards={cards}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={onCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          component={Main}
          exact
          loggedIn={loggedIn}
        />
      </Switch>

      <Footer />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <ImagePopup
        card={selectedCard}
        isOpen={openPopupName}
        onClose={() => {
          closeAllPopups();
          setSelectedCard({});
        }}
      />

      <InfoTooltip
        isOpen={isInfoTooltipPopupOpen}
        onClose={closeAllPopups}
        isSignIn={isSignIn}
      />

      <div className="popup popup_delete">
        <section className="popup__content">
          <button className="popup__close-button" type="button"></button>
          <h2 className="popup__title">Вы уверены?</h2>
          <button type="submit" className="popup__button">
            Да
          </button>
        </section>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
