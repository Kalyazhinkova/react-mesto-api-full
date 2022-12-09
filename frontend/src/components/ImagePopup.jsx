function ImagePopup (props) {
  const openClassName = (props.isOpen? 'popup_open' : '' );

  return(
    <div className={`popup popup_big ${openClassName}`}>
    <div className="popup__container">
      <button className="popup__close-button popup__close-button_big" type="button" onClick={props.onClose}></button>
      <img className="popup__image" alt ={`Фотография. ${props.card.name}`} src={props.card.link} />
      <p className="popup__image-name">{props.card.name}</p>
    </div>
  </div>
  );
}

export default ImagePopup;