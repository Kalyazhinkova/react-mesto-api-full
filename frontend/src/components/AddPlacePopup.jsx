import PopupWithForm from "./PopupWithForm";
import {useState, useEffect} from "react";

function AddPlacePopup({isOpen, onClose, onAddPlace}) {

  const [values, setValues] = useState({name:"", link: ""});

  useEffect(() => {
    setValues({name:"", link: ""});
  }, [isOpen]);

  function handleChange(evt) {
    const {value, name} = evt.target;
    setValues({...values, [name]:value});
  }

  return (
    <PopupWithForm name="add" title="Новое место" isOpen={isOpen} onClose={onClose} buttonText={"Создать"} 
    onSubmit={(e) => {
      e.preventDefault();
      onAddPlace(values);}}>
      <input type="text" className="form__item" id="image-name" name="name" placeholder="Название" minLength="2" maxLength="30" value={values.name} onChange={handleChange} required />
      <span className="image-name-error form__item-error"></span>
      <input type="url" className="form__item" id="image-link" name="link" placeholder="Ссылка на картинку" value={values.link} onChange={handleChange} required />
      <span className="image-link-error form__item-error"></span>
  </PopupWithForm>
  );
}

export default AddPlacePopup;