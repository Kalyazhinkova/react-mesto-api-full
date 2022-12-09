import { useState } from "react";
import { Link } from "react-router-dom";

function PageWithForm(props) {
  const { title, buttonText, onSubmit, isRegister } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="form" name="sign-up">
      <h2 className="form__title">{title}</h2>
      <fieldset className="form__fieldset">
        <label className="email">
          <input
            id="email__input"
            name="email"
            type="email"
            placeholder="Email"
            className="form__input form__text"
            onChange={handleChangeEmail}
            required=""
          />
          <span className="popup__input-error email__input-error" />
        </label>
        <label className="password">
          <input
            id="password__input"
            name="password"
            type="password"
            placeholder="Пароль"
            className="form__input form__text"
            onChange={handleChangePassword}
            minLength={8}
            maxLength={50}
          />
          <span className="popup__input-error password__input-error" />
        </label>
      </fieldset>
      <div className="form__submit">
        <button type="submit" className="form__submit-button">
          {buttonText}
        </button>
        {isRegister && (
          <span className="form__subtitle">
            Уже зарегистрированы?
            <Link to="/sign-in" className="form__link">
              Войти
            </Link>
          </span>
        )}
        {!isRegister && (
          <span className="form__subtitle">
            Еще нет аккаунта?
            <Link to="/sign-up" className="form__link">
              Зарегистрироваться
            </Link>
          </span>
        )}
      </div>
    </form>
  );
}

export default PageWithForm;