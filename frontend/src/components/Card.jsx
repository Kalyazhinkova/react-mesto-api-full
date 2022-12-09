import {useContext} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card (props) {
  const {card, onClick, onLike, onDelete}= props;
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(id => id === currentUser._id);
 
  return (
    <article className="element">
      <img className="element__image" alt={`${card.name}`} src={card.link} onClick={() => {onClick(card);}}/>
      {isOwn && <button className="element__trash" type="button" onClick={() => {onDelete(card);}}></button>}
      <div className="element__print">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-group">
          <button className={isLiked?" element__like element__like_active":"element__like"} type="button" onClick={() => {onLike(card);}}></button>
          <p className="element__counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;