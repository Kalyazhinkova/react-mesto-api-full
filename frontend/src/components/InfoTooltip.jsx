import tooltipOk from '../images/tooltip-ok.png';
import tooltipError from '../images/tooltip-error.png';

function InfoTooltip (props) {
  const {isSignIn, isOpen, onClose} = props;
  const image = isSignIn ? tooltipOk : tooltipError;
  const message = isSignIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';

  return (
    <div className={`popup popup__tooltip ${isOpen ? 'popup_open' : ''}`}>
      <div className="popup__content popup__content-tooltip">
        <button type="button" className="popup__close-button" onClick={onClose}></button>
        <img className="popup__tooltip-image" src={image} />
        <h2 className="popup__title">{message}</h2>
      </div>
    </div>
  )
}

export  default InfoTooltip;