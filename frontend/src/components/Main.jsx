import {useContext } from 'react';
import Card from './Card';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Main(props) {

  const currentUser = useContext(CurrentUserContext);
 
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-group">
          <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
          <button className="profile__avatar-edit" type="button" onClick={props.onEditAvatar}></button>
        </div>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={props.onEditProfile}></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
      </section>
      <section className="elements">
        {props.cards.map((card) => {
          return <Card
            key={card._id}
            card={card}
            onClick={props.onCardClick}
            onLike={props.onCardLike}
            onDelete={props.onCardDelete}
          />
        })}
      </section>
    </main>
  );
}

export default Main;